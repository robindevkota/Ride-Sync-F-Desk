import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
function DisplayFriend() {
  const URL = process.env.REACT_APP_BACKEND_URL;
  const [friendDetails, setFriendDetails] = useState([]);

  useEffect(() => {
    // Fetch the user's friend list when the component mounts
    const fetchFriendList = async () => {
      try {
        const response = await axios.get(`${URL}/api/users/getFriends`); // Replace with your API endpoint
        setFriendDetails(response.data.friendDetails);
        console.log(response);
      } catch (error) {
        console.error("Failed to fetch friend list:", error);
      }
    };

    fetchFriendList();
  }, []);

  const handleButtonClick = async (friend) => {
    console.log(friend.id);
    try {
      const response = await axios.post(`${URL}/api/users/addToRoom/${friend.id}`);
      toast.success("Friend added successfully");
    } catch (error) {
      console.error("Error adding friend to room:", error.response);
  
      if (error.response && error.response.status === 400) {
        // Handle specific 400 error (replace with your specific error handling logic)
        toast.error("Friend is already a participant.");
      } else if (error.response && error.response.status === 404) {
        toast.error("User not found.");
      } else {
        // Handle other errors
        toast.error("Failed to add friend to room.");
      }
    }
  };

  return (
    <div>
      <h2>Friend List</h2>
      <ul>
        {friendDetails.map((friend, index) => (
          <li key={index}>
            {friend.name}
            <button onClick={() => handleButtonClick(friend)}>Add To Room</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DisplayFriend;
