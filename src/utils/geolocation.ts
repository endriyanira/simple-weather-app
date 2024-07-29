import { CityWithCoodinateType } from "../Components/WeatherApp";

interface GeolocationPosition {
  coords: GeolocationCoordinates;
  timestamp: number;
}

interface GeolocationCoordinates {
  latitude: number;
  longitude: number;
  altitude?: number | null;
  accuracy: number;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
}

export const getGeolocation = async () => {
  try {
    if (!navigator.geolocation) {
      throw new Error("Geolocation is not supported by your browser!");
    }

    const positionPromise = new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const position = (await positionPromise) as GeolocationPosition;

    const { latitude, longitude } = position.coords;
    const lat = latitude;
    const lon = longitude;

    return { lat, lon };
  } catch (error) {
    console.error("Error getting geolocation coordinates:", error);
    throw error;
  }
};
