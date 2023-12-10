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
WEATHER_API_URL = f'http://api.openweathermap.org/data/2.5/weather?q={CITY},{COUNTRY}&appid={API_KEY}&units=metric'
AP_API_URL = f'http://api.openweathermap.org/data/2.5/air_pollution?lat={LAT}&lon={LNG}&appid={API_KEY}'

# Configurações do banco de dados MySQL
DB_HOST = '127.0.0.1'
DB_USER = 'root'
DB_PASSWORD = '273107'
DB_NAME = 'openweather_db'


def get_weather_data(api_url):
    try:
        response = requests.get(api_url)
        response.raise_for_status()

        return response.json()

    except Exception as e:
        print(f"Erro ao obter dados da API: {e}")
        return None


def extract_weather_data(weather_data):
    cidade = weather_data['name']
    pais = weather_data['sys']['country']
    temperatura = weather_data['main']["temp"]
    umidade = weather_data['main']['humidity']
    pressao = weather_data['main']['pressure']
    vel_vento = weather_data['wind']['speed']
    dir_vento = weather_data['wind']['deg']
    data_hora = datetime.utcfromtimestamp(weather_data['dt']).strftime('%Y-%m-%dT%H:%M:%SZ')
    #data_hora = datetime.fromtimestamp(weather_data['dt'], pytz.timezone('America/Sao_Paulo')).strftime('%Y-%m-%d %H:%M:%S')
    descricao = weather_data['weather'][0]['description']

    return cidade, pais, temperatura, umidade, pressao, vel_vento, dir_vento, data_hora, descricao


def extract_air_pollution_data(air_pollution_data):
    lat = air_pollution_data['coord']['lat']
    lng = air_pollution_data['coord']['lon']
    temp = air_pollution_data['list'][0]
    temp1 = temp['main']
    # print(air_pollution_data['list'][0]['main']['aqi'])
    aqi = temp1['aqi']
    components = air_pollution_data['list'][0]['components']
    print(components)
    co_conc = components['co']
    no_conc =  components['no']
    no2_conc = components['no2']
    o3_conc =  components['o3']
    so2_conc =  components['so2']
    pm2_5_conc =  components['pm2_5']
    pm10_conc =  components['pm10']
    nh3_conc =  components['nh3']

    return lat, lng, aqi, co_conc, no_conc, no2_conc, o3_conc, so2_conc, pm2_5_conc, pm10_conc, nh3_conc


def save_to_database(weather_data, air_pollution_data):
    try:
        # Conectar ao banco de dados MySQL
        connection = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        cursor = connection.cursor()

        # Extrair dados da API de condições meteorológicas
        cidade, pais, temperatura, umidade, pressao, vel_vento, dir_vento, data_hora, descricao = extract_weather_data(
            weather_data)

        # Extrair dados da API de poluição do ar
        lat, lng, aqi, co_conc, no_conc, no2_conc, o3_conc, so2_conc, pm2_5_conc, pm10_conc, nh3_conc = extract_air_pollution_data(
            air_pollution_data)
        

        # Inserir dados na tabela
        query = """INSERT INTO weather (`city`, `country`, `lat`, `lng`, 
            `aqi`, `co_conc`, `no_conc`, `no2_conc`, `o3_conc`, `so2_conc`, `pm2_5_conc`, `pm10_conc`, `nh3_conc`, 
            `temperature`, `humidity`, `pressure`, 
            `wind_speed`, `wind_direction`, `description`) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""

        data_to_insert = (cidade, pais, lat, lng, aqi, co_conc, no_conc, no2_conc, o3_conc, so2_conc, pm2_5_conc,
                          pm10_conc, nh3_conc, temperatura, umidade, pressao, vel_vento, dir_vento, descricao)

        cursor.execute(query, data_to_insert)
        connection.commit()

    except Exception as e:
        print(f"Erro ao salvar dados no banco de dados: {e}")

    """ except mysql.connector.Error as e:
        print(f"Erro ao salvar dados no banco de dados: {e}")
        print(f"Estado da conexão: {connection}")
        print(f"Dados a serem inseridos: {data_to_insert}") """

    # Fechar a conexão
    cursor.close()
    connection.close()


if __name__ == "__main__":

    while True:
        weather_data = get_weather_data(WEATHER_API_URL)
        air_pollution_data = get_weather_data(AP_API_URL)

        if weather_data and air_pollution_data:
            save_to_database(weather_data, air_pollution_data)

        print("Dados salvos no banco de dados.")
        sleep(1800)  # Espera 5 minutos antes de obter os dados novamente
