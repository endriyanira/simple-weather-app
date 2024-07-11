import React, { useCallback, useEffect, useState } from "react";
import { FaLocationDot, FaDeleteLeft } from "react-icons/fa6";
import { BiWater } from "react-icons/bi";
import { FiWind } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";

import { debounce } from "../utils/debounce";
import clear_icon from "../Assets/clear.png";
import cloud_icon_day from "../Assets/icon/day/cloudD.png";
import mist_icon from "../Assets/mist.png";
import rain_icon from "../Assets/rain.png";
import snow_icon from "../Assets/snow.png";
import not_found from "../Assets/404.png";
import "./WeatherApp.css";
import Forecast from "./Forecast";
import ForecastItemCard from "./ForecastItemCard";

type WeatherDataType = {
  humidity: number;
  windSpeed: number;
  location: string;
  temperature: number;
  description: string;
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

interface ForecastType {
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

type ForecastDataResponse = {
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
  const [isCitySelected, setIsCitySelected] = useState<boolean>(false);

  const [weatherData, setWeatherData] = useState<WeatherDataType>({
    humidity: 0,
    windSpeed: 0,
    location: "",
    temperature: 0,
    description: "",
    weatherMain: "",
    name: "",
  });
  const API_KEY = "f9327b0d53f73ccc3a6f94d0d8a2def2";
  const today = new Date();

  const isNotToday = (today: Date, date: Date): boolean => {
    return (
      today.getFullYear() !== date.getFullYear() ||
      today.getMonth() !== date.getMonth() ||
      today.getDate() !== date.getDate()
    );
  };

  const debouncedFetchCities = useCallback(
    debounce(async (searchTerm: string) => {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}&appid=${API_KEY}&limit=5`
      );
      const data: CityWithCoodinateType[] = await response.json();
      if (data.length === 0) {
        setIsNotFound(true);
      } else {
        setCitiesCoordinate(data);
        setIsCitySelected(false);
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
        location: dataResponse.name,
        temperature: dataResponse.main.temp,
        description: dataResponse.weather[0].description,
        weatherMain: dataResponse.weather[0].main,
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
      console.log(forecastInfo);
    } catch (error) {
      setIsNotFound(true);
    }
  };

  const getWIcon = (weatherMain: string) => {
    switch (weatherMain) {
      case "Clear":
        return clear_icon;
      case "Rain":
        return rain_icon;
      case "Snow":
        return snow_icon;
      case "Clouds":
        return cloud_icon_day;
      case "Mist":
        return mist_icon;
      case "Haze":
        return mist_icon;
      default:
        return cloud_icon_day;
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
          <div className={`weather-box ${!isNotFound && "active"}`}>
            <div className="box">
              <div className="info-weather">
                <div className="weather">
                  <p className="cityname">{weatherData.name}</p>
                  <img src={getWIcon(weatherData.weatherMain)} alt="icon" />
                  <p className="temperature">
                    {Math.floor(weatherData.temperature)}
                    <span>°C</span>
                  </p>
                  <p className="description">{weatherData.description}</p>
                </div>
              </div>
            </div>
          </div>
          <div className={`weather-forecast ${!isNotFound && "active"}`}>
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
                          main={forecast.weather[0].icon}
                        />
                      )
                  )}
              </div>
            </div>
          </div>
          <div className={`weather-details ${!isNotFound && "active"}`}>
            <div className="humidity">
              <BiWater className="icon" />
              <div className="text">
                <div className="info-humidity">
                  <span>{weatherData.humidity}&nbsp;%</span>
                </div>
                <p>Humidity</p>
              </div>
            </div>
            <div className="wind">
              <FiWind className="icon" />
              <div className="text">
                <div className="info-wind">
                  <span>{weatherData.windSpeed}&nbsp;Km/h</span>
                </div>
                <p>Wind Speed</p>
              </div>
            </div>
          </div>
          <div className={`not-found ${isNotFound && "active"}`}>
            <div className="box">
              <img src={not_found} alt="notFound" />
              <p>Oops! Location not found!</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherApp;
