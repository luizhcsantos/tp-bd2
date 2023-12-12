// WindCard.js
import React from 'react';

const WindCard = ({ wind_direction, wind_speed }) => (
  <div className="wind-card">
    <h3>Vento</h3>
    <p>Direção: {wind_direction}°</p>
    <p>Velocidade: {wind_speed} m/s</p>
  </div>
);

export default WindCard;
