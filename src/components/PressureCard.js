// PressureCard.js
import React from 'react';

const PressureCard = ({ pressure }) => (
  <div className="pressure-card">
    <h3>Pressão Atmosférica: </h3>
    <p>{pressure} hPa</p>
  </div>
);

export default PressureCard;
