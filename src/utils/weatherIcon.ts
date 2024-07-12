import fewCloudSkyD from "../Assets/icon/day/cloudD.png";
import fewCloudSkyN from "../Assets/icon/night/cloudN.png";
import rain from "../Assets/rain.png";
export const weatherIcon = (icon: string) => {
  switch (icon) {
    case "01d":
      break;
    case "01n":
      break;
    case "02d":
      return fewCloudSkyD;
    case "02n":
      return fewCloudSkyN;

    default:
      break;
  }
};
