import React, { useState, useEffect } from 'react';
import CurrentTripsSection from '../../Components/customer/CurrentTripsSection'; // Adjust the path as needed
import Navbar from '../../Components/customer/Navbar';
import instance from "../../api";

function CurrentTrips() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await instance.get("/auth/current-user");
      const userID = response.data.user.id;
      const tripResponse = await instance.get(`/trip/customer/${userID}`);
      // const filteredTrips = tripResponse.data.filter(trip => new Date(trip.dropTime) > new Date());
      setTrips(tripResponse?.data);
      console.log(tripResponse.data)
    } catch (error) {
      console.error("Failed to fetch trips:", error);
    }
  };

  return (
    <div className='flex'>
      <div className= "w-[25%]">
        <Navbar activeItem={"currenttrip"}/>
      </div>
      <div className= "w-[2px] bg-[#F69412]">
      </div>
      <div className="bg-[#EFEFEF] pl-5 w-lvw">
        <h1 className="text-2xl font-semibold mb-4">Current Trip</h1>
        <CurrentTripsSection trips={trips} />
      </div>
    </div>
  );
}

export default CurrentTrips;
