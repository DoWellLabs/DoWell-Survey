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
  const { centerCoords, zoom, mapAPIKey, circleSize, handleMapChange } =
    useGlobalContext();
  // const [mapCenter, setMapCenter] = useState({ lat: centerCoords.lat, lng: centerCoords.lng });
  const [mapKey, setMapKey] = useState(0);

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

  useEffect(() => {
    if (centerCoords) {
      // setMapCenter({ lat: centerCords.lat, lng: centerCords.lng });
      // Update the key to force re-render when the center changes
      setMapKey((prevKey) => prevKey + 1);
    }
  }, [centerCoords]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {console.log("api_key", mapAPIKey)}
      <APIProvider apiKey={mapAPIKey}>
        <Map
          mapId={"d0de9d11a82d4ba1"}
          id={"mymap"}
          key={mapKey} // Add a key to force re-render
          zoom={12}
          center={centerCoords}
          onLoad={handleMapLoad}
          style={{ height: "100%", width: "100%", zIndex: "1" }}
          onCenterChanged={(map) =>
           console.log('map', map)
          }
          onZoomChanged={(map) =>
           console.log('map', map)
          }
        >
          <div className="">
            <AdvancedMarker
              position={centerCoords}
            >
              <Marker position={centerCoords}></Marker>
              <Circle
                width={circleSize.width}
                height={circleSize.height}
                center={centerCoords}
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
