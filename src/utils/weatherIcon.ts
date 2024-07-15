import clearSkyD from "../Assets/icon/day/clearSkyD.svg";
import clearSkyN from "../Assets/icon/night/clearSkyN.svg";

import fewCloudSkyD from "../Assets/icon/day/cloudD.png";
import fewCloudSkyN from "../Assets/icon/night/cloudN.png";

import scatteredClouds from "../Assets/icon/scatteredclouds.svg";
import brokenClouds from "../Assets/icon/brokenClouds.svg";
import showerRain from "../Assets/icon/showerrain.svg";

import rainD from "../Assets/icon/day/rainD.svg";
import rainN from "../Assets/icon/night/rainN.svg";

import thunderstorm from "../Assets/icon/thunderstorm.svg";
import snow from "../Assets/icon/snow.svg";
import mist from "../Assets/icon/mist.png";

export const getWeatherIcon = (icon: string) => {
  switch (icon) {
    //clear sky
    case "01d":
      return clearSkyD;
    case "01n":
      return clearSkyN;

    //few clouds
    case "02d":
      return fewCloudSkyD;
    case "02n":
      return fewCloudSkyN;

    //scattered clouds
    case "03d":
      return scatteredClouds;
    case "03n":
      return scatteredClouds;

    //broken clouds
    case "04d":
      return brokenClouds;
    case "04n":
      return brokenClouds;

    //shower rain
    case "09d":
      return showerRain;
    case "09n":
      return showerRain;

    //rain
    case "10d":
      return rainD;
    case "10n":
      return rainN;

    //thunderstorm
    case "11d":
      return thunderstorm;
    case "11n":
      return thunderstorm;

    //snow
    case "13d":
      return snow;
    case "13n":
      return snow;

    //mist
    case "50d":
      return mist;
    case "50n":
      return mist;
  }
};
