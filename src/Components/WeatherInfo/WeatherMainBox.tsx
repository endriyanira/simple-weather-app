import React from "react";
import { WeatherDataType } from "../WeatherApp";
import { getWeatherIcon } from "../../utils/weatherIcon";

interface WeatherMainBoxType {
  isNotFound: boolean;
  isChangeCity: boolean;
  weatherData: WeatherDataType;
}

const WeatherMainBox: React.FC<WeatherMainBoxType> = ({
  isNotFound,
  isChangeCity,
  weatherData,
}) => {
  return (
    <div className={`weather-box ${!isNotFound && isChangeCity && "active"}`}>
      <div className="box">
        <div className="info-weather">
          <div className="weather">
            {weatherData.name && <p className="cityname">{weatherData.name}</p>}
            <img
              src={getWeatherIcon(weatherData.icon)}
              alt={weatherData.icon}
            />
            <p className="temperature">
              {Math.floor(weatherData.temperature)}
              <span>°C</span>
            </p>
            <p className="description">{weatherData.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherMainBox;
