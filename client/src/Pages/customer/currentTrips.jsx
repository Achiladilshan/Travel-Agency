import React, { useState, useEffect } from 'react';
import CurrentTripsSection from '../../Components/customer/CurrentTripsSection'; // Adjust the path as needed
import Navbar from '../../Components/customer/Navbar';
import instance from "../../api"; // Import the Axios instance for API requests

function CurrentTrips() {
  const [trips, setTrips] = useState([]);

  // Fetch trips when the component mounts
  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      // Fetch current user's ID
      const response = await instance.get("/auth/current-user");
      const userID = response.data.user.id;

      // Fetch trips for the current user
      const tripResponse = await instance.get(`/trip/customer/${userID}`);
      setTrips(tripResponse?.data);
    } catch (error) {
      console.error("Failed to fetch trips:", error);
    }
  };

  return (
    <div className='flex'>
      <div className="w-[25%]">
        <Navbar activeItem={"current-trip"} />
      </div>
      <div className="w-[2px] bg-[#F69412]">
      </div>
      <div className="bg-[#EFEFEF] pl-5 w-lvw">
        <h1 className="text-2xl font-semibold mb-4">Current Trip</h1>
        {trips.length === 0 ? (
          <p>No Data To Display</p>
        ) : (
          <CurrentTripsSection trips={trips} />
        )}
      </div>
    </div>
  );
}

export default CurrentTrips;
