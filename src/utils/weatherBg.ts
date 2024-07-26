import clearDay from "../Assets/background/clear-day.jpg";
import clearNight from "../Assets/background/clear-night.jpg";

import fewCloudDay from "../Assets/background/few-clouds-day.jpg";
import fewCloudNight from "../Assets/background/few-clouds-night.jpg";

import scatteredCloudNight from "../Assets/background/cloudy-night.jpg";
import rain from "../Assets/background/rain.jpg";
import thunderstorm from "../Assets/background/thunderstorm.jpg";
import mist from "../Assets/background/mist.jpg";

export const weatherBg = (icon: string) => {
  switch (icon) {
    //clear sky
    case "01d":
      document.body.style.backgroundImage = `url(${clearDay})`;
      break;
    case "01n":
      document.body.style.backgroundImage = `url(${clearNight})`;
      break;

    //few clouds
    case "02d":
      document.body.style.backgroundImage = `url(${clearDay})`;
      break;
    case "02n":
      document.body.style.backgroundImage = `url(${clearNight})`;
      break;

    //scattered clouds
    case "03d":
      document.body.style.backgroundImage = `url(${fewCloudDay})`;
      break;
    case "03n":
      document.body.style.backgroundImage = `url(${fewCloudNight})`;
      break;

    //broken clouds
    case "04d":
      document.body.style.backgroundImage = `url(${scatteredCloudNight})`;
      break;
    case "04n":
      document.body.style.backgroundImage = `url(${scatteredCloudNight})`;
      break;

    //shower rain
    case "09d":
      document.body.style.backgroundImage = `url(${rain})`;
      break;
    case "09n":
      document.body.style.backgroundImage = `url(${rain})`;
      break;

    //rain
    case "10d":
      document.body.style.backgroundImage = `url(${rain})`;
      break;
    case "10n":
      document.body.style.backgroundImage = `url(${rain})`;
      break;

    //thunderstorm
    case "11d":
      document.body.style.backgroundImage = `url(${thunderstorm})`;
      break;
    case "11n":
      document.body.style.backgroundImage = `url(${thunderstorm})`;
      break;

    //mist
    case "50d":
      document.body.style.backgroundImage = `url(${mist})`;
      break;
    case "50n":
      document.body.style.backgroundImage = `url(${mist})`;
      break;

    default:
      document.body.style.backgroundImage = `url(${clearDay})`;
      break;
  }
};
