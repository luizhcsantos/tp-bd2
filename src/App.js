import React, { useState, useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveLine } from '@nivo/line';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './styles.css';
import WeatherCard from './components/WeatherCard';
import PressureCard from './components/PressureCard';
import WindCard from './components/WindCard';

const apiKey = '05d807c36ff641aeef4758056e5f1def';

const ChartCardBar = ({ data, keys, indexBy }) => (
  <div className="card chart-card">
    <h2>Temperatura </h2>
    <div style={{ height: '300px' }}>
      <ResponsiveBar
        data={data}
        keys={keys}
        indexBy={indexBy}
        colors={{ scheme: 'paired' }}
        borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
        margin={{ top: 10, right: 10, bottom: 50, left: 60 }}
        padding={0.3}
        axisBottom={{ tickRotation: -45 }}
        axisLeft={{ tickSize: 5, tickPadding: 5, tickRotation: 0 }}
      />
    </div>
  </div>
);

const ChartCardPie = ({ data }) => (
  <div className="card chart-card">
    <h2>Concentração de poluentes no ar</h2>
    <div style={{ height: '400px' }}>
      <ResponsivePie
        data={data}
        margin={{ top: 20, right: 40, bottom: 40, left: 0 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        colors={{ scheme: 'paired' }}
        borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
      />
    </div>
  </div>
);

const ChartCardLine = ({ data }) => (
  <div className="card chart-card">
    <h2>Umidade do Ar</h2>
    <div style={{ height: '200px' }}>
      <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          min: 'auto',
          max: 'auto',
          stacked: true,
          reverse: false
        }}
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'dias',
          legendOffset: 36,
          legendPosition: 'middle'
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'umidade',
          legendOffset: -40,
          legendPosition: 'middle'
        }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
            effects: [
              {
                on: 'hover',
                style: {
                  itemBackground: 'rgba(0, 0, 0, .03)',
                  itemOpacity: 1
                }
              }
            ]
          }
        ]}
      />
    </div>
  </div>
);

const formatarDadosBarra = (dados) => {
  return dados.map((item, index) => ({
    day: item.updated_at.toLowerCase(),
    temperature: item.temperature,
    // Adiciona o índice ao final da chave
    id: `barra-${item.updated_at.toLowerCase()}-${index}`,
  }));
};

const formatarDadosPizza = (dados) => {
  // Verifica se há dados
  if (!dados || !dados[0] || dados.length === 0) {
    return [];
  } 

  // Extrair os dados relevantes
  const poluentes = dados[0];

  // Campos desejados
  const camposDesejados = ['co_conc', 'no_conc', 'no2_conc', 'o3_conc', 'so2_conc', 'pm2_5_conc', 'pm10_conc', 'nh3_conc'];

  // Formate os dados para o gráfico de pizza
  const dadosFormatados = camposDesejados
  .filter((poluente) => poluentes[poluente] !== undefined)  // Filtra os poluentes undefined
  .map((poluente) => ({
    id: poluente.replace('_conc', ''),
    label: poluente.replace('_conc', ' '),
    value: poluentes[poluente],
    color: `hsl(${Math.random() * 360}, 70%, 50%)`, // Gere cores aleatórias
  }));
 
  return dadosFormatados;
};

const formatarDadosLinha = (dados) => {
  return [
    {
      id: 'umidade',
      color: 'hsl(116, 70%, 50%)',
      data: dados.map((item, index) => ({
        x: `${item.updated_at.toLowerCase()}-${index}`,  // Adiciona o índice ao final da chave
        y: item.humidity,
      })),
    },
  ];
};

const consolidarDadosPizza = (dados) => {
  const mapaDeContagem = new Map();

  // Conta a ocorrência de cada temperatura
  dados.forEach((item) => {
    const temperatura = item.temperatura;
    mapaDeContagem.set(temperatura, (mapaDeContagem.get(temperatura) || 0) + 1);
  });

  // Cria entradas consolidadas
  const dadosConsolidados = Array.from(mapaDeContagem.entries()).map(([temperatura, count], index) => ({
    id: `pizza-${temperatura}`,
    label: `${temperatura}°C`,
    value: count,
    color: `hsl(${index * 30}, 70%, 50%)`,
  }));

  return dadosConsolidados;

};

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [chartData, setChartDataBar] = useState([]);
  const [chartDataPie, setChartDataPie] = useState([]);
  const [chartDataLine, setChartDataLine] = useState([]);

  useEffect(() => {

    // Chamada para obter dados do banco e formatá-los
    fetch('http://localhost:5000/api/dados_climaticos')
      .then(response => response.json())
      .then(dadosBanco => {
        const dadosFormatadosBarra = formatarDadosBarra(dadosBanco);
        const dadosFormatadosPizza = formatarDadosPizza(dadosBanco);
        const dadosFormatadosLinha = formatarDadosLinha(dadosBanco);

        // colocar dadosFormatados nos gráficos
        setChartDataBar(dadosFormatadosBarra);
        setChartDataPie(dadosFormatadosPizza);
        setChartDataLine(dadosFormatadosLinha);
        console.log(dadosBanco)
        setWeatherData(dadosBanco[dadosBanco.length - 1]); 
      })
      .catch(error => console.error('Erro ao obter dados do banco de dados:', error));


  }, []);


  return (
    <div className="weather-dashboard">
      {weatherData && (
        <WeatherCard
            city={weatherData.city}
            temperature={Math.round(weatherData.temperature)}
            description={weatherData.description}
            aqi={weatherData.aqi}
            pressure={weatherData.pressure}
            wind_direction={weatherData.wind_direction}
            wind_speed={weatherData.wind_speed}
        >
        <PressureCard pressure={weatherData.pressure} />
        <WindCard windDirection={weatherData.wind_direction} windSpeed={weatherData.wind_speed} />
        </WeatherCard>
      )}
      <div className='map-container-wrapper'>
        <MapContainer
          center={[-22.1276, -51.3856]}
          zoom={13}
          style={{ height: '400px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={18}
            attribution='© OpenWeatherMap contributors'
          />

          {weatherData && (
            <Marker position={[weatherData.lat, weatherData.lng]}>
              <Popup>
                {`${weatherData.city}: ${Math.round(weatherData.temperature)}°C`}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
      <div className="chart-container">
        <ChartCardBar data={chartData} keys={['temperature']} indexBy="day" />
        <ChartCardPie data={chartDataPie} />
        <ChartCardLine data={chartDataLine} />
      </div>
    </div>
  );
};

export default WeatherDashboard;
