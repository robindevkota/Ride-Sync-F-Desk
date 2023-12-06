import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1Ijoicm9iaW4tZGV2a290YSIsImEiOiJjbHBmNDVvd3YxaTJ3MmpwZGxndzNudGE3In0.OSon9cSO6JX4io1wDqcZIQ';

const Map = ({ locationData, sharedLocation }) => {
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 12,
  });

  useEffect(() => {
    // Use the shared location if available, otherwise use the tracked location
    const targetLocation = sharedLocation || locationData;

    // Ensure that both latitude and longitude are defined before updating the viewport
    if (targetLocation && targetLocation.latitude && targetLocation.longitude) {
      setViewport({
        latitude: targetLocation.latitude,
        longitude: targetLocation.longitude,
        zoom: 12,
      });
    }
  }, [locationData, sharedLocation]);

  console.log('Tracked Location by Robin:', locationData);
  console.log('Shared Location:', sharedLocation);

  return (
    <div>
      <div style={{ height: '100vh', width: '100vw' }}>
        <ReactMapGL
          {...viewport}
          width="100%"
          height="100%"
          mapStyle="mapbox://styles/mapbox/streets-v11"
          onViewportChange={(newViewport) => setViewport(newViewport)}
        >
          {locationData && (
            <Marker latitude={locationData.latitude} longitude={locationData.longitude} offsetLeft={-20} offsetTop={-10}>
              <div style={{ color: 'blue', fontWeight: 'bold' }}>Robin</div>
            </Marker>
          )}

          {sharedLocation && (
            <Marker latitude={sharedLocation.latitude} longitude={sharedLocation.longitude} offsetLeft={-20} offsetTop={-10}>
              <div style={{ color: 'red', fontWeight: 'bold' }}>Friend</div>
            </Marker>
          )}
        </ReactMapGL>
      </div>
    </div>
  );
};

export default Map;