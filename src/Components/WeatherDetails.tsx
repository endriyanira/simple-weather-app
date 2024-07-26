import React from "react";
import { FaEye, FaTemperatureLow } from "react-icons/fa";
import { FiWind } from "react-icons/fi";
import { BiWater } from "react-icons/bi";

import { WeatherDataType } from "./WeatherApp";

interface WeatherDetailsType {
  isNotFound: boolean;
  isChangeCity: boolean;
  weatherData: WeatherDataType;
}

const WeatherDetails: React.FC<WeatherDetailsType> = ({
  isNotFound,
  isChangeCity,
  weatherData,
}) => {
  return (
    <div
      className={`weather-details ${!isNotFound && isChangeCity && "active"}`}
    >
      <div className="feels-like">
        <div className="feelslike-title">
          <FaTemperatureLow className="icon" />
          <h1>FEELS LIKE</h1>
        </div>
        <div className="text">
          <div className="info-wind">
            <p>{Math.floor(weatherData.feelsLike)}°</p>
          </div>
        </div>
      </div>
      <div className="wind">
        <div className="wind-title">
          <FiWind className="icon" />
          <h1>WIND SPEED</h1>
        </div>
        <div className="text">
          <div className="info-wind">
            <p>
              {weatherData.windSpeed}
              <span>&nbsp;km/h</span>
            </p>
          </div>
        </div>
      </div>
      <div className="humidity">
        <div className="humidity-title">
          <BiWater className="icon" />
          <h1>HUMIDITY</h1>
        </div>
        <div className="text">
          <div className="info-humidity">
            <p>
              {weatherData.humidity}
              <span>&nbsp;%</span>
            </p>
          </div>
        </div>
      </div>
      <div className="visibility">
        <div className="visibility-title">
          <FaEye className="icon" />
          <h1>VISIBILITY</h1>
        </div>
        <div className="text">
          <div className="info-visibility">
            <p>
              {Math.floor(weatherData.visibility / 1000)}
              <span>&nbsp;km</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails;
