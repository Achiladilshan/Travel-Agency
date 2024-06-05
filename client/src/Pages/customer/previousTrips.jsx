import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/customer/Navbar';
import instance from '../../api'; 
import CurrentTripsSection from '../../Components/customer/CurrentTripsSection';

function PreviousTrips() {
  const [previousTrips, setPreviousTrips] = useState([]);

  useEffect(() => {
    fetchPreviousTrips();
  }, []);

  const fetchPreviousTrips = async () => {
    try {
      const response = await instance.get('/trip/getPreviousTrips');
      setPreviousTrips(response.data);
    } catch (error) {
      console.error('Failed to fetch previous trips:', error);
    }
  };

  return (
    <div className='flex'>
      <div className= "w-[25%]">
        <Navbar activeItem={"previoustrip"}/>
      </div>
      <div className= "w-[2px] bg-[#F69412]">
      </div>
      <div className="bg-[#EFEFEF] pl-5 w-lvw">
        <h1 className="text-2xl font-semibold mb-4">Previous Trips</h1>
        {previousTrips.length === 0 ? <p>No Data To Display</p> :  <CurrentTripsSection trips={previousTrips} />}
       
      </div>
    </div>
  );
}

export default PreviousTrips;
