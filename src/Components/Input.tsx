import React, { useCallback, useEffect, useState } from "react";
import { debounce } from "../utils/debounce";

interface CityWithCoodinateType {
  name: string;
  lat: number;
  lon: number;
  country?: string;
  state?: string;
}

const Input = () => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<CityWithCoodinateType[]>([]);
  const [selectedCoordinate, setSelectedCoordinate] = useState({
    lat: 0,
    lon: 0,
  });

  const debouncedFetchCities = useCallback(
    debounce(async (searchTerm: string) => {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}&appid=f9327b0d53f73ccc3a6f94d0d8a2def2&limit=5`
      );
      const data = await response.json();
      setResults(data);
    }, 500),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setQuery(value);
    debouncedFetchCities(value);
  };

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    city: CityWithCoodinateType
  ) => {
    setSelectedCoordinate({
      lat: city.lat,
      lon: city.lon,
    });
    console.log(selectedCoordinate);
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", position: "relative" }}
    >
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search..."
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {query !== "" &&
          results.map((city: CityWithCoodinateType, index: number) => (
            <button
              key={index}
              value={city.name}
              style={{ textAlign: "left", padding: "4px 8px", margin: "2px" }}
              onClick={(e) => handleClick(e, city)}
            >
              {`${city.name} ${city.state && city.state}`}
            </button>
          ))}
      </div>
    </div>
  );
};

export default Input;
