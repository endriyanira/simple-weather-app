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
          <p>FEELS LIKE</p>
        </div>
        <div className="text">
          <div className="info-wind">
            <span>{Math.floor(weatherData.feelsLike)}°</span>
          </div>
        </div>
      </div>
      <div className="wind">
        <div className="wind-title">
          <FiWind className="icon" />
          <p>WIND SPEED</p>
        </div>
        <div className="text">
          <div className="info-wind">
            <span>{weatherData.windSpeed}&nbsp;km/h</span>
          </div>
        </div>
      </div>
      <div className="humidity">
        <div className="humidity-title">
          <BiWater className="icon" />
          <p>HUMIDITY</p>
        </div>
        <div className="text">
          <div className="info-humidity">
            <span>{weatherData.humidity}%</span>
          </div>
        </div>
      </div>
      <div className="visibility">
        <div className="visibility-title">
          <FaEye className="icon" />
          <p>VISIBILITY</p>
        </div>
        <div className="text">
          <div className="info-visibility">
            <span>{weatherData.visibility}&nbsp;m</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails;
