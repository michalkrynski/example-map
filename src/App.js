import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  MarkerClusterer,
} from "@react-google-maps/api";
import React, { useCallback, useState } from "react";
import locations from "./points/points";
import "./App.css";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const options = {
  imagePath: process.env.PUBLIC_URL + "/icon-cluster",
};

console.log(options);

function App() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_KEY,
  });

  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(10);
  const [showInfo, setShowInfo] = useState(false);
  const [currentMarker, setCurrentMarker] = useState(undefined);

  const onLoad = useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds();

    locations.forEach((point) => {
      bounds.extend(new window.google.maps.LatLng(point.latitude, point.longitude));
    });

    map.fitBounds(bounds);
    setMap(map);
    setZoom(zoom);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const onMarkerClick = (e, location) => {
    setShowInfo(true);
    setCurrentMarker(location);
    map.setCenter(e.latLng);
  };

  const onInfoCloseClick = () => {
    setShowInfo(false);
  };

  return (
    <div className='App' style={{ width: "100vw", height: "100vh" }}>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={map?.center}
          zoom={zoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          <MarkerClusterer options={options}>
            {(clusterer) =>
              locations.map((location) => (
                <Marker
                  key={location.id}
                  position={{ lat: location.latitude, lng: location.longitude }}
                  clusterer={clusterer}
                  icon={process.env.PUBLIC_URL + "/icon-marker.png"}
                  onClick={(e) => onMarkerClick(e, location)}
                />
              ))
            }
          </MarkerClusterer>
          {showInfo && map?.center && (
            <InfoWindow position={map?.center} onCloseClick={onInfoCloseClick}>
              <h1 style={{ backgroundColor: "tomato" }}>{currentMarker.id}</h1>
            </InfoWindow>
          )}
        </GoogleMap>
      )}
    </div>
  );
}

export default App;
