import React, { useCallback, useEffect, useState } from "react";
import { FaLocationDot, FaDeleteLeft } from "react-icons/fa6";
import { BiWater } from "react-icons/bi";
import { FiWind } from "react-icons/fi";
import { FaEye, FaTemperatureLow } from "react-icons/fa";

import { debounce } from "../utils/debounce";
import { getWeatherIcon } from "../utils/weatherIcon";
import Forecast from "./Forecast";
import NotFound from "./NotFound";

import "./WeatherApp.css";

type WeatherDataType = {
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  visibility: number;
  location: string;
  temperature: number;
  description: string;
  icon: string;
  weatherMain: string;
  name: string;
};

type DataResponseType = {
  coord: {
    lon: number;
    lat: number;
  };
  weather: [
    {
      id: number;
      main: string;
      description: string;
      icon: string;
    }
  ];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
};

interface CityWithCoodinateType {
  name: string;
  lat: number;
  lon: number;
  country?: string;
  state?: string;
}

export interface ForecastType {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: [
    {
      id: number;
      main: string;
      description: string;
      icon: string;
    }
  ];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

export type ForecastDataResponse = {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastType[];
};

const WeatherApp = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [citiesCoordinate, setCitiesCoordinate] = useState<
    CityWithCoodinateType[]
  >([]);
  const [selectedCoordinate, setSelectedCoordinate] = useState({
    lat: 0,
    lon: 0,
  });
  const [forecastInfo, setForecastInfo] = useState<ForecastDataResponse>({
    cod: "",
    message: 0,
    cnt: 0,
    list: [],
  });

  const [isNotFound, setIsNotFound] = useState<boolean>(false);
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [isChangeCity, setIsChangeCity] = useState<boolean>(false);
  const [isCitySelected, setIsCitySelected] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [weatherData, setWeatherData] = useState<WeatherDataType>({
    humidity: 0,
    windSpeed: 0,
    feelsLike: 0,
    visibility: 0,
    location: "",
    temperature: 0,
    description: "",
    icon: "",
    weatherMain: "",
    name: "",
  });
  const API_KEY = "f9327b0d53f73ccc3a6f94d0d8a2def2";

  const debouncedFetchCities = useCallback(
    debounce(async (searchTerm: string) => {
      try {
        if (searchTerm.length < 3) {
          return;
        }
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}&appid=${API_KEY}&limit=5`
        );
        if (!response.ok) {
          if (response.status === 400) {
            setError("Bad Request: The request was invalid.");
            setIsNotFound(true);
          } else {
            setError(`Error: ${response.status} ${response.statusText}`);
            setIsNotFound(true);
          }
          return;
        }

        const data: CityWithCoodinateType[] = await response.json();
        if (data.length === 0) {
          setIsNotFound(true);
        } else {
          setCitiesCoordinate(data);
          setIsCitySelected(false);
        }
      } catch (error) {
        setError("Network error or other issues.");
      }
    }, 300),
    []
  );

  const handleChangeCityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchTerm(value);
    if (value) {
      setIsCitySelected(false);
      debouncedFetchCities(value);
    }
  };

  const handleResetInput = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setSearchTerm("");
  };

  const handleClickCity = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    city: CityWithCoodinateType
  ) => {
    setIsChangeCity(false);
    setSelectedCoordinate({
      lat: city.lat,
      lon: city.lon,
    });
    setWeatherData({ ...weatherData, name: city.name });
  };

  const handleSearchCity = async () => {
    if (selectedCoordinate.lat === 0) {
      setIsSearch(false);
    } else {
      setIsChangeCity(true);
      setIsSearch(true);
    }
    if (searchTerm.length === 0) {
      return [];
    }
    try {
      const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${selectedCoordinate.lat}&lon=${selectedCoordinate.lon}&appid=${API_KEY}&units=metric`;
      const response = await fetch(URL, {
        method: "GET",
      });
      const data = await response.json();
      const dataResponse = data as DataResponseType;
      setIsNotFound(false);
      setWeatherData({
        ...weatherData,
        humidity: dataResponse.main.humidity,
        windSpeed: dataResponse.wind.speed,
        feelsLike: dataResponse.main.feels_like,
        visibility: dataResponse.visibility,
        location: dataResponse.name,
        temperature: dataResponse.main.temp,
        description: dataResponse.weather[0].description,
        weatherMain: dataResponse.weather[0].main,
        icon: dataResponse.weather[0].icon,
      });
      setIsCitySelected(true);
    } catch (error) {
      if (error instanceof Error) {
        setIsNotFound(true);
      }
    }
  };

  const handleSearchForecastbyCoordinate = async () => {
    try {
      const URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${selectedCoordinate.lat}&lon=${selectedCoordinate.lon}&appid=${API_KEY}&units=metric`;
      const response = await fetch(URL, {
        method: "GET",
      });
      const data = await response.json();
      const dataResponse = data as ForecastDataResponse;
      setForecastInfo(dataResponse);
    } catch (error) {
      setIsNotFound(true);
    }
  };

  useEffect(() => {
    handleSearchCity();
    handleSearchForecastbyCoordinate();
  }, [selectedCoordinate]);

  return (
    <div
      className={`container ${isNotFound && "notfound"} ${
        !isSearch && "default"
      }`}
    >
      <div className="search-box">
        <FaLocationDot className="location-icon" />
        <input
          type="text"
          className="cityInput"
          placeholder="Enter Your Location"
          onChange={handleChangeCityInput}
          value={searchTerm}
        />
        {searchTerm !== "" && (
          <button onClick={handleResetInput}>
            <FaDeleteLeft />
          </button>
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          zIndex: "200",
          padding: "4px",
        }}
      >
        {searchTerm !== "" &&
          !isCitySelected &&
          citiesCoordinate.length !== 0 &&
          citiesCoordinate.map((city: CityWithCoodinateType, index: number) => (
            <button
              key={`suggestedCity-${index.toString()}`}
              value={city.name}
              style={{
                textAlign: "left",
                padding: "4px 8px",
              }}
              onClick={(e) => handleClickCity(e, city)}
            >
              {`${city.name} ${city.state ? city.state : city.country}`}
            </button>
          ))}
      </div>
      {isSearch && (
        <>
          <div
            className={`weather-box ${!isNotFound && isChangeCity && "active"}`}
          >
            <div className="box">
              <div className="info-weather">
                <div className="weather">
                  <p className="cityname">{weatherData.name}</p>
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
          <Forecast
            isNotFound={isNotFound}
            isChangeCity={isChangeCity}
            forecastInfo={forecastInfo}
          />
          <div
            className={`weather-details ${
              !isNotFound && isChangeCity && "active"
            }`}
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
          <NotFound isNotFound={isNotFound} />
        </>
      )}
    </div>
  );
};

export default WeatherApp;
