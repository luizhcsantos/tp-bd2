import React from 'react'
import PressureCard from './PressureCard'
import WindCard from './WindCard';

const WeatherCard = ({ city, temperature, description, aqi, pressure, wind_direction, wind_speed }) => (
    <div className="weather-card">
        <div className='grid-container'>
            <div className='header'>
                <h3>{city}</h3>
                <p>Temperatura: {temperature}°C</p>
                <p>{description}</p>
                <p>Qualidade do Ar: {aqi}</p>
            </div>
            <div className='children'>
                <PressureCard pressure={pressure} />
            </div>
            <div className='children'>
                <WindCard wind_direction={wind_direction} wind_speed={wind_speed} />
            </div>
        </div>
    </div>
  );

  export default WeatherCard; 