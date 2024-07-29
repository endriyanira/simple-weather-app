import React, { useCallback, useEffect, useState } from "react";
import { FaLocationDot, FaDeleteLeft } from "react-icons/fa6";

import { debounce } from "../utils/debounce";
import { weatherBg } from "../utils/weatherBg";

import NotFound from "./NotFound";

import "./WeatherApp.css";
import Forecast from "./Forecast/Forecast";
import WeatherMainBox from "./WeatherInfo/WeatherMainBox";
import WeatherDetails from "./WeatherInfo/WeatherDetails";
import SuggestedCity from "./SuggestedCity/SuggestedCity";
import { getGeolocation } from "../utils/geolocation";
import Spinner from "./Spinner/Spinner";

export type WeatherDataType = {
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

export interface CityWithCoodinateType {
  name?: string;
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
  const [selectedCoordinate, setSelectedCoordinate] =
    useState<CityWithCoodinateType>({
      lat: 0,
      lon: 0,
    });
  const [forecastInfo, setForecastInfo] = useState<ForecastDataResponse>({
    cod: "",
    message: 0,
    cnt: 0,
    list: [],
  });

  const [isLoadingCity, setIsLoadingCity] = useState<boolean>(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [isChangeCity, setIsChangeCity] = useState<boolean>(false);
  const [isCitySelected, setIsCitySelected] = useState<boolean>(false);
  const [showSuggestedCity, setShowSuggestedCity] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  useState<boolean>(false);

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
        setIsLoadingCity(true);
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
          setShowSuggestedCity(false);
          return;
        }

        const data: CityWithCoodinateType[] = await response.json();
        if (data.length === 0) {
          setIsNotFound(true);
          setShowSuggestedCity(false);
        } else {
          setCitiesCoordinate(data);
          setShowSuggestedCity(true);
          setIsCitySelected(false);
        }
        setIsLoadingCity(false);
      } catch (error) {
        setError("Network error or other issues.");
        setIsLoadingCity(false);
      }
    }, 200),
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
    setShowSuggestedCity(false);
  };

  const handleClickCity = (city: CityWithCoodinateType) => {
    setIsChangeCity(false);
    setSelectedCoordinate({
      lat: city.lat,
      lon: city.lon,
    });
    setWeatherData({ ...weatherData, name: city.name! });
  };

  const handleSearchCity = async () => {
    if (selectedCoordinate.lat === 0 || selectedCoordinate.lon === 0) {
      setIsSearch(false);
    } else {
      setIsChangeCity(true);
      setIsSearch(true);
    }
    if (searchTerm.length === 0 && selectedCoordinate.lat === 0) {
      return [];
    }
    try {
      const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${selectedCoordinate.lat}&lon=${selectedCoordinate.lon}&appid=${API_KEY}&units=metric`;
      const response = await fetch(URL, {
        method: "GET",
      });
      const data = await response.json();
      const dataResponse = data as DataResponseType;
      weatherBg(dataResponse.weather[0].icon);
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
      setShowSuggestedCity(false);
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

  const handleGetLocation = async () => {
    try {
      const coords = await getGeolocation();
      setSelectedCoordinate(coords);
      setError("");
    } catch (err) {
      setSelectedCoordinate({
        lat: 0,
        lon: 0,
      });
      setError("Error getting geolocation coordinates:");
    }
  };

  useEffect(() => {
    weatherBg("");
    handleGetLocation();
  }, []);

  useEffect(() => {
    handleSearchCity();
    handleSearchForecastbyCoordinate();
    if (weatherData.name === "") {
      setWeatherData({ ...weatherData, name: "Your Location" });
    }
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
        {isLoadingCity && <Spinner />}
        {searchTerm !== "" && (
          <button onClick={handleResetInput}>
            <FaDeleteLeft />
          </button>
        )}
      </div>
      {citiesCoordinate.length !== 0 && showSuggestedCity && (
        <ul className="weather-suggested-cities">
          {searchTerm !== "" &&
            !isCitySelected &&
            citiesCoordinate.length !== 0 &&
            citiesCoordinate.map(
              (city: CityWithCoodinateType, index: number) => (
                <SuggestedCity
                  key={`suggestedCity-${index.toString()}`}
                  city={city}
                  handleClickCity={handleClickCity}
                />
              )
            )}
        </ul>
      )}

      {isSearch && (
        <>
          <WeatherMainBox
            isNotFound={isNotFound}
            isChangeCity={isChangeCity}
            weatherData={weatherData}
          />
          <Forecast
            isNotFound={isNotFound}
            isChangeCity={isChangeCity}
            forecastInfo={forecastInfo}
          />
          <WeatherDetails
            isNotFound={isNotFound}
            isChangeCity={isChangeCity}
            weatherData={weatherData}
          />
          <NotFound isNotFound={isNotFound} />
        </>
      )}
    </div>
  );
};

export default WeatherApp;
