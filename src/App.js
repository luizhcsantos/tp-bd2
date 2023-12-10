import React, { useState, useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveLine } from '@nivo/line';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from './climatologia.png'

const apiKey = '05d807c36ff641aeef4758056e5f1def';

const WeatherCard = ({ city, temperature, description, icon }) => (
  <div className="weather-card">
    <h2>{city}</h2>
    <p>{temperature}°C</p>
    <p>{description}</p>
    <img src={`http://openweathermap.org/img/w/${icon}.png`} alt="Weather Icon" />
  </div>
);

const ChartCardBar = ({ data, keys, indexBy }) => (
  <div className="chart-card">
    <h2>Temperature Chart - Bar</h2>
    <div style={{ height: '300px' }}>
      <ResponsiveBar
        data={data}
        keys={keys}
        indexBy={indexBy}
        colors={{ 'scheme': 'paired'}}
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
  <div className="chart-card">
    <h2>Temperature Chart - Pie</h2>
    <div style={{height : '400px'}}>
      <ResponsivePie
        data={data}
        margin={{ top: 20, right: 40, bottom: 40, left: 0 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        colors={{ 'scheme': 'paired'}}
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
  <div className="chart-card">
    <h2>Humidity Chart - Line</h2>
    <div style={{height : '200px'}}>
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

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [pollutionData, setPollutionData] = useState(null);
  //const [customIcon, setCustomIcon] = useState(null); 

  const fetchData = async () => {
    try {
      const initialLatLng = [-22.1276, -51.3856];
      const city = "Presidente Prudente"; 
      const responseWeather = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
      if (!responseWeather.ok) {
        throw new Error(`Erro na requisição do tempo: ${responseWeather.statusText}`);
      }
      const dataWeather = await responseWeather.json();
      
      // Verifica se dataWeather é nulo ou indefinido antes de acessar suas propriedades
      if (!dataWeather || !dataWeather.main) {
        console.error('Dados meteorológicos inválidos1:', dataWeather);
        return;
      }
      setWeatherData(dataWeather);

      const responsePollution = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${initialLatLng[0]}&lon=${initialLatLng[1]}&appid=${apiKey}`);
      if (!responsePollution.ok) {
        throw new Error(`Erro na requisição da poluição: ${responsePollution.statusText}`);
      }
      const dataPollution = await responsePollution.json();
      setPollutionData(dataPollution);

      // Defina o ícone personalizado aqui
      const customIcon = new L.Icon({
        iconUrl: icon,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });
      //setCustomIcon(newCustomIcon);
      
    } catch (error) {
      console.error('Erro ao obter dados:', error);
    }
  };

  
  useEffect(() => {
    fetchData();

  }, []);

  const chartData = [
    { day: 'Monday', temperature: 25 },
    { day: 'Tuesday', temperature: 28 },
    { day: 'Wednesday', temperature: 22 },
    { day: 'Thursday', temperature: 24 },
    { day: 'Friday', temperature: 26 },
    { day: 'Saturday', temperature: 30 },
    { day: 'Sunday', temperature: 28 }
  ];

  const chartDataPie = [
    {
      id: "Segunda",
      label: "segunda",
      value: 25,
      color: "hsl(90, 70%, 50%)"
    },
    {
      id: "Terça",
      label: "terça",
      value: 28,
      color: "hsl(56, 70%, 50%)"
    },
    {
      id: "Quarta",
      label: "quarta",
      value: 22,
      color: "hsl(103, 70%, 50%)"
    },
    {
      id: "Quinta",
      label: "quinta",
      value: 20,
      color: "hsl(186, 70%, 50%)"
    },
    {
      id: "Sexta",
      label: "sexta",
      value: 25,
      color: "hsl(104, 70%, 50%)"
    }
  ];

  const chartDataLine = [
    {
      "id": "umidade",
      "color": "hsl(116, 70%, 50%)",
      "data": [
        { "x": "segunda", "y": 50 },
        { "x": "terça", "y": 40 },
        { "x": "quarta", "y": 41 },
        { "x": "quinta", "y": 62 },
        { "x": "sexta", "y": 51 },
        { "x": "sábado", "y": 40 },
        { "x": "domingo", "y": 38 }
      ]
    }
  ];

  const chartKeys = ['temperature'];

  return (
    <div className="weather-dashboard">
      {weatherData && (
        <WeatherCard
          city={weatherData.name}
          temperature={Math.round(weatherData.main.temp)}
          description={weatherData.weather[0].description}
          icon={weatherData.weather[0].icon}
        />
      )}
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
          <Marker position={[weatherData.coord.lat, weatherData.coord.lon]}>
            
            <Popup>
              {`${weatherData.name}: ${Math.round(weatherData.main.temp)}°C`}
            </Popup>
            
          </Marker>
      )}

        {/* Adicione mais marcadores conforme necessário */}
      </MapContainer>

      <div className="chart-container">
        <ChartCardBar data={chartData} keys={chartKeys} indexBy="day" />
        <ChartCardPie data={chartDataPie} />
        <ChartCardLine data={chartDataLine} />
      </div>
    </div>

  );
};

export default WeatherDashboard;
