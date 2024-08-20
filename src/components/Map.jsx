import {
  APIProvider,
  Map,
  Marker,
  Pin,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../Context/PreviewContext";
import Circle from "./Circle";
const MainMap = ({
  centerCords,
  pins,
  widthOfCostumeTracker,
  heightOfCostumeTracker,
}) => {
  // const circleRef = useRef(null);
  const {  zoom, mapAPIKey, circleSize, handleMapChange } =
    useGlobalContext();
  // const [mapCenter, setMapCenter] = useState({ lat: centerCoords.lat, lng: centerCoords.lng });
  const [mapKey, setMapKey] = useState(0);
  const [mapCenter, setMapCenter] = useState({ lat: 48.85661400, lng: 2.35222190 });
  const handleMapLoad = (map) => {
    // Now you can use the map instance here
    console.log("Map instance:", map);
    // if (circleRef.current) {
    //   const marker = new window.google.maps.marker.AdvancedMarkerElement({
    //     map,
    //     position: mapCenter,
    //     content: circleRef.current,
    //   });
    // }
  };
  // const mapCenter = centerCoords && centerCoords.lat && centerCoords.lng
  //   ? { lat: centerCoords.lat, lng: centerCoords.lng }
  //   : { lat: 0, lng: 0 };
  useEffect(() => {
    if (centerCords) {
      setMapCenter({ lat: centerCords.lat, lng: centerCords.lng });
      console.log('mapCenter', centerCords)
      // setMapCenter({ lat: centerCords.lat, lng: centerCords.lng });
      // Update the key to force re-render when the center changes
      setMapKey((prevKey) => prevKey + 1);
    }
  }, [centerCords]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {console.log("api_key", mapAPIKey)}
      <APIProvider apiKey={mapAPIKey}>
        <Map
          mapId={"d0de9d11a82d4ba1"}
          id={"mymap"}
          key={mapKey} // Add a key to force re-render
          zoom={12}
          center={mapCenter}
          onLoad={handleMapLoad}
          style={{ height: "100%", width: "100%", zIndex: "1" }}
          
        >
          <div className="">
            <AdvancedMarker position={mapCenter}>
              <Marker position={mapCenter}></Marker>
              <Circle
                width={circleSize.width}
                height={circleSize.height}
                center={mapCenter}
              />
            </AdvancedMarker>
          </div>
          {pins?.map((value, key) => {
            const cords = value.location_coord.split(" , ");
            return (
              <Marker
                onClick={() => setKeyAnimate(true)}
                key={key}
                position={{ lat: Number(cords[0]), lng: Number(cords[1]) }}
              />
            );
          })}
        </Map>
      </APIProvider>
    </div>
  );
};

export default MainMap;
