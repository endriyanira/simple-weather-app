import React from "react";
import { CityWithCoodinateType } from "./WeatherApp";

interface SuggestedCityType {
  city: CityWithCoodinateType;
  handleClickCity: (city: CityWithCoodinateType) => void;
}

const SuggestedCity: React.FC<SuggestedCityType> = ({
  city,
  handleClickCity,
}) => {
  return (
    <li className="suggested-city" value={city.name}>
      <button onClick={() => handleClickCity(city)}>
        <p>{`${city.name} ${city.state ? city.state : city.country}`}</p>
      </button>
    </li>
  );
};

export default SuggestedCity;
