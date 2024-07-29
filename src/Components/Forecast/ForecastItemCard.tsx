import React from "react";
import { getWeatherIcon } from "../../utils/weatherIcon";

interface ForecastItemCardType {
  date: string;
  temp: number;
  icon: string;
  main: string;
}

const ForecastItemCard: React.FC<ForecastItemCardType> = ({
  date,
  temp,
  icon,
  main,
}) => {
  const dateObject = new Date(date);
  let hour = dateObject.getHours().toString();
  if (hour.length < 2) {
    hour = `0${hour.toString()}`;
  }
  return (
    <div className="forecast-item">
      <p className="hour">{hour}</p>
      <img src={getWeatherIcon(icon)} alt={main} style={{ width: "30px" }} />
      <p className="temperature">
        {Math.floor(temp)}
        <span>°C</span>
      </p>
    </div>
  );
};

export default ForecastItemCard;
