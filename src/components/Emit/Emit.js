import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

function Emit() {
  const [locationData, setLocationData] = useState(null);

  useEffect(() => {
    const socket = io.connect('https://rideback.onrender.com');

    socket.on('connect', () => {
      console.log('Connected to server');
      socket.emit('Realtime', 'Robinnnn'); // Emit "Realtime" event after connecting
    });

    socket.on('Data', (data) => {
      console.log('Received Data:', data);
    });

    // Listen for tracked location updates from the server
    socket.on('TrackedLocation', (trackedLocationData) => {
      console.log('Received tracked location data:', trackedLocationData);

      // Update the tracked location data in the component state
      setLocationData(trackedLocationData);
    });

    return () => {
      socket.disconnect(); // Disconnect when the component unmounts
    };
  }, []);

  return (
    <div>
      <h2>Emit</h2>
      {locationData && (
        <div>
          <h3>Tracked Location</h3>
          <p>User ID: {locationData.userId}</p>
          <p>Latitude: {locationData.latitude}</p>
          <p>Longitude: {locationData.longitude}</p>
        </div>
      )}
    </div>
  );
}

export default Emit;