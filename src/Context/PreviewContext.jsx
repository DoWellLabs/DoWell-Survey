import React, { useContext } from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const PreviewContext = React.createContext();

// eslint-disable-next-line react/prop-types
const PreviewProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [surveys, setSurveys] = useState([]);

  //Please provide your Datacube API Key here
  const [api_key, setAPIKey] = useState(import.meta.env.VITE_DATACUBE_API_KEY);

  //API key for place details
  const [placeAPIKey, setPlaceAPIKey] = useState(
    import.meta.env.VITE_PLACES_API_KEY
  );

  //Google maps API Key
  const [mapAPIKey, setMapAPIKey] = useState(import.meta.env.VITE_GOOGLE_API);

  const [centerCoords, setCenterCoords] = useState({
    lat: 48.856614,
    lng: 2.3522219,
  });
  const [inputData, setInputData] = useState({
    country: "",
    city: "",
    query_string: "",
    // radius1: "",
    radius2: 0,
  });
  const [zoom, setZoom] = useState(12);
  const [sliderValue, setSliderValue] = useState(0);
  const [circleSize, setCircleSize] = useState({ width: '0px', height: '0px' });
  // Calculate circle size based on slider value, latitude, and zoom
  useEffect(() => {
    const maxMeters = 15000;
    const metersPerPixel =
      (156543.03392 * Math.cos((centerCoords.lat * Math.PI) / 180)) /
      Math.pow(2, zoom);
    const metersCovered = (sliderValue / 100) * maxMeters;
    const pixelWidth = metersCovered / metersPerPixel;

    setCircleSize({
      width: `${Math.floor(pixelWidth)}px`,
      height: `${Math.floor(pixelWidth)}px`,
    });

    // Update inputData.radius2
    setInputData((prevData) => ({
      ...prevData,
      radius2: Math.floor(metersCovered),
    }));
  }, [centerCoords.lat, zoom, sliderValue]);

  // Handle radius change from slider
  const handleRadiusChange = (newValue) => {
    setSliderValue(Number(newValue));
  };

  // Handle map center or zoom change
  const handleMapChange = (newCenter, newZoom) => {
    setCenterCoords(newCenter);
    setZoom(newZoom);
  };

  return (
    <PreviewContext.Provider
      value={{
        surveys,
        loading,
        inputData,
        setInputData,
        setAPIKey,
        api_key,
        setCenterCoords,
        centerCoords,
        mapAPIKey,
        placeAPIKey,
        zoom,
        sliderValue,
        circleSize,
        handleRadiusChange,
        handleMapChange,
      }}
    >
      {children}
    </PreviewContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(PreviewContext);
};

export { PreviewContext, PreviewProvider };
