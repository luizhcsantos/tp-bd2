import requests
import mysql.connector
from datetime import datetime, timezone
from time import sleep
import pytz

# Configurações da API OpenWeather
API_KEY = '05d807c36ff641aeef4758056e5f1def'
CITY = 'Presidente Prudente'
COUNTRY = 'br'
LAT = -22.1276
LNG = -51.3856
WEATHER_API_URL_ = f'http://api.openweathermap.org/data/2.5/weather?q={CITY},{COUNTRY}&appid={API_KEY}&units=metric'
AP_API_URL_ = f'http://api.openweathermap.org/data/2.5/air_pollution?lat={LAT}&lon={LNG}&appid={API_KEY}'

# Configurações do banco de dados MySQL
DB_HOST = '127.0.0.1'
DB_USER = 'root'
DB_PASSWORD = '273107'
DB_NAME = 'openweather_db'


def get_weather_data():
    try:
        response_weather = requests.get(WEATHER_API_URL_)
        response_weather.raise_for_status()

        data_weather = response_weather.json()

        response_ap = requests.get(AP_API_URL_)
        response_ap.raise_for_status()

        data_ap = response_ap.json()

        # Inserir dados na tabela
        try:
            cidade = data_weather['name']
            pais = data_weather['sys']['country']
            temperatura = data_weather['main']['temp']
            umidade = data_weather['main']['humidity']
            pressao = data_weather['main']['pressure']
            vel_vento = data_weather['wind']['speed']
            dir_vento = data_weather['wind']['deg']
            data_hora = datetime.fromtimestamp(data_weather['dt'], pytz.timezone('America/Sao_Paulo')).strftime(
                '%Y-%m-%d %H:%M:%S')
            descricao = data_weather['weather'][0]['description']

            lat = data_ap['coord']['lat']
            lng = data_ap['coord']['lon']
            aqi = data_ap['main']['aqi']
            co_conc = data_ap['components']['co']
            no_conc = data_ap['components']['no']
            no2_conc = data_ap['components']['no2']
            o3_conc = data_ap['components']['o3']
            so2_conc = data_ap['components']['so2']
            pm2_5_conc = data_ap['components']['pm2_5']
            pm10_conc = data_ap['components']['pm10']
            nh3_conc = data_ap['components']['nh3']

            """ if 'main' in data_weather and all(key in data_weather['main'] for key in ['temp', 'humidity', 'pressure']):
                temperatura = data_weather['main']['temp']
                umidade = data_weather['main']['humidity']
                pressao = data_weather['main']['pressure']
            else:
                print("Alguma(s) chave(s) 'temp', 'humidity' ou 'pressure' não encontrada(s) nos dados da condição meteorológica.") """


            print(f"Data e hora formatada: {data_hora}")

            return cidade, pais, lat, lng, aqi, co_conc, no_conc, no2_conc, o3_conc, so2_conc, pm2_5_conc, pm10_conc, nh3_conc, temperatura, umidade, pressao, vel_vento, dir_vento, data_hora, descricao
            
        except KeyError as e:
            print(f"Erro ao acessar chave: {e}")

            if 'data_ap' in locals() and e.args and e.args[0] in data_ap:
                print(f"A chave {e.args[0]} pertence à API de poluição do ar.")
            elif 'data_weather' in locals() and e.args and e.args[0] in data_weather:
                print(f"A chave {e.args[0]} pertence à API de condições meteorológicas.")
            else:
                print("Não foi possível determinar a origem do erro.")
        
        return 

    except Exception as e:
        print(f"Erro ao obter dados da API: {e}")
        return None


def save_to_database(d):
    try:
        # Conectar ao banco de dados MySQL
        connection = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        cursor = connection.cursor()

        query = """INSERT INTO weather (city, country, lat, lng, 
        aqi, co_conc, no_conc, no2_conc, o3_conc, so2_conc, pm2_5_conc, pm10_conc, nh3_conc, 
        temperature, humidity, pressure, 
        wind_speed, wind_direction, updated_at, description) 
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""

        cursor.execute(query, d)
        connection.commit()

    except Exception as e:
        print(f"Erro ao salvar dados no banco de dados: {e}")

    # Fechar a conexão
    cursor.close()
    connection.close()


if __name__ == "__main__":

    while True:
        weather_data = get_weather_data()

        if weather_data:
            save_to_database(weather_data)

        print("Dados salvos no banco de dados.")
        sleep(1800)  # Espera 5 minutos antes de obter os dados novamente
