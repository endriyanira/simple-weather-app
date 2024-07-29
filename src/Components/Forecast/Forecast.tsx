import React from "react";
import { ForecastDataResponse, ForecastType } from "../WeatherApp";
import ForecastItemCard from "./ForecastItemCard";

interface ForecastCompType {
  isNotFound: boolean;
  isChangeCity: boolean;
  forecastInfo: ForecastDataResponse;
}

const Forecast: React.FC<ForecastCompType> = ({
  isNotFound,
  isChangeCity,
  forecastInfo,
}) => {
  const today = new Date();

  const isNotToday = (today: Date, date: Date): boolean => {
    return (
      today.getFullYear() !== date.getFullYear() ||
      today.getMonth() !== date.getMonth() ||
      today.getDate() !== date.getDate()
    );
  };
  return (
    <div
      className={`weather-forecast ${!isNotFound && isChangeCity && "active"}`}
    >
      <div className="forecast-box">
        <div className="forecast">
          <h2>TODAY'S FORECAST</h2>
          <div className="hourly-forecast">
            {forecastInfo.list.length !== 0 &&
              forecastInfo.list.map(
                (forecast: ForecastType, id: number) =>
                  !isNotToday(today, new Date(forecast.dt_txt)) && (
                    <ForecastItemCard
                      key={`forecastKey-${forecast.dt}-${id.toString()}`}
                      date={forecast.dt_txt}
                      temp={forecast.main.temp}
                      icon={forecast.weather[0].icon}
                      main={forecast.weather[0].main}
                    />
                  )
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forecast;
