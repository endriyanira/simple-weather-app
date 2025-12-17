import React from "react";
import { CityWithCoodinateType } from "../WeatherApp";

interface SuggestedCityType {
  city: CityWithCoodinateType;
  handleClickCity: (city: CityWithCoodinateType) => void;
}

const SuggestedCity: React.FC<SuggestedCityType> = ({
  city,
  handleClickCity,
}) => {
  console.log("SuggestedCity rendering for:", city.name); // Debug: Confirms component renders

  const displayName = city.name || "Unknown City";
  const displayLocation = city.state || city.country || "Unknown Location";

  return (
    <li className="suggested-city">
      <button
        className="suggested-city-button"
        onClick={(event) => {
          event.stopPropagation(); // Prevents event bubbling to parent elements
          console.log("Button clicked for:", city);
          handleClickCity(city);
        }}
        aria-label={`Select ${displayName}, ${displayLocation}`}
        style={{
          pointerEvents: "auto",
          background: "transparent",
          border: "none",
        }}
      >
        <p>{`${displayName}, ${displayLocation}`}</p>
      </button>
    </li>
  );
};

export default SuggestedCity;
