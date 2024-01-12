import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './addToRoom.css';
import { toast } from 'react-toastify';
import Map from '../../components/Map/Map';
import io from 'socket.io-client';
import Emit from '../../components/Emit/Emit';
import Chat from '../Chat/Chat';
import { Link } from 'react-router-dom';
import { useChatContext } from '../../Context/ChatContext';
const socket = io.connect(process.env.REACT_APP_BACKEND_URL);
const DisplayToRoom = () => {
  const URL = process.env.REACT_APP_BACKEND_URL;
  const [rooms, setRooms] = useState([]);
  const [locationData, setLocationData] = useState(null);
  const [sharedLocation, setSharedLocation] = useState(null);
  const { setChatContext } = useChatContext();

  useEffect(() => {
    // const socket = io.connect('https://rideback.onrender.com');
    const socket = io.connect('https://rb-pfj6.onrender.com');

    socket.on('LocationUpdate', (locationUpdateData) => {
      console.log('Location of sunil:', locationUpdateData);

      setLocationData((prevLocationData) => {
        return {
          ...prevLocationData,
          ...locationUpdateData,
        };
      });
    });

    socket.on('TrackedLocation', (trackedLocationData) => {
      console.log('Received tracked location data:', trackedLocationData);

      setLocationData(trackedLocationData);
    });

    socket.on('SharedLocation', (locationData) => {
      console.log('Received shared location data:', locationData);

      if (locationData.participantId === loggedInUserId) {
        setSharedLocation(locationData);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [creatorId, setCreatorId] = useState(null);

  const handleShareLocation = async (roomId, userId, setLocationData) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`Your Latitude: ${latitude}, Longitude: ${longitude}`);

          setLocationData({ latitude, longitude });

          if (socket) {
            socket.emit('ShareLocation', {
              roomId,
              userId,
              latitude,
              longitude,
            });
          }
        },
        (error) => {
          console.error('Error getting location:', error.message);
        }
      );
    } else {
      console.error('Geolocation is not supported in this browser.');
    }
  };

  const handleTrackParticipant = async (roomId, participantId) => {
    if (socket) {
      socket.emit('TrackLocation', participantId);
      socket.on('TrackedLocation', (trackedLocationData) => {
        console.log('Received tracked location data:', trackedLocationData);
  
        // Update the sharedLocation state with the tracked location data
        setSharedLocation(trackedLocationData);
  
        // Display the tracked location data in a prompt
        // const message = `Tracked Location:\nLatitude: ${trackedLocationData.latitude}\nLongitude: ${trackedLocationData.longitude} \nUserId: ${trackedLocationData.userId}`;
        // window.prompt(message);
      });
      
    }
    
  };
  
  

  useEffect(() => {
    socket.on('SharedLocation', (locationData) => {
      console.log('Received shared location robin:', locationData);

      if (locationData.participantId === loggedInUserId) {
        setSharedLocation(locationData);
      }
    });

    return () => {
      socket.off('SharedLocation');
    };
  }, [loggedInUserId]);

  useEffect(() => {
    const fetchRoomList = async () => {
      try {
        const response = await axios.get(`${URL}/api/users/getParticipant`);
        console.log('response', response.data);
        setLoggedInUserId(response.data.userId);
        setRooms(response.data.allRooms);

        if (response.data.allRooms.length > 0) {
          const firstRoom = response.data.allRooms[0];
          setCreatorId(firstRoom.creatorId);
          console.log('Creator ID:', creatorId);
        }
      } catch (error) {
        console.error('Failed to fetch room list:', error);
      }
    };

    fetchRoomList();
  }, [URL]);
  const handleSetChatInfo = (roomId, loggedInUserId) => {
    setChatContext(roomId, loggedInUserId);
  };


  return (
    <div className='main'>
      <div>
        <h2>Room List ({rooms.length})</h2>
        {rooms.map((room, index) => (
          <div key={index}>
            <h3>Room ID: {room.roomId}</h3>
            <ul>
              {room.participants.map((participant, participantIndex) => (
                <li key={participantIndex}>
                  {participant.name} {participant.id}
                  {(loggedInUserId === participant.id) ? (
                    <button onClick={() => handleShareLocation(room.roomId, loggedInUserId, setLocationData)}>
                      Share My Location
                    </button>
                  ) : (
                    (loggedInUserId !== participant.id) && (
                      <>
                        <button onClick={() => handleTrackParticipant(room.roomId, participant.id, setLocationData)}>
                          Track
                        </button><br />
                        
                        
                        
                      </>
                    )
                  )}
                </li>
              ))}
            </ul>
            <Link to="/chat">
        <button onClick={() => handleSetChatInfo(room.roomId, loggedInUserId)}>
          Go To Chat
        </button>
      </Link>
          </div>
        ))}
        
      </div>
      <Map locationData={locationData} sharedLocation={sharedLocation} />
    </div>
  );
};

export default DisplayToRoom;