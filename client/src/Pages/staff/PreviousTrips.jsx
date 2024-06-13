import React, { useEffect, useState } from 'react';
import StaffSideBar from '../../Components/staff/StaffSideBar';
import instance from '../../api'; // Adjust the path as needed

const PreviousTrips = () => {
    const [previousTrips, setPreviousTrips] = useState([]);

    useEffect(() => {
        fetchPreviousTrips();
    }, []);

    const fetchPreviousTrips = async () => {
        try {
            const response = await instance.get('/trip/get/getPreviousTripsAll');
            setPreviousTrips(response.data);
        } catch (error) {
            console.error('Error fetching previous trips:', error);
        }
    };

    return (
        <div className="flex flex-row">
            <div className="w-[25%]">
                <StaffSideBar activeItem="previousTrip" />
            </div>
            <div className="w-[2px] bg-[#F69412]"></div>
            <div className='bg-[#EFEFEF] w-full overflow-auto h-screen'>
                <div className='bg-[#D9D9D9] flex items-center h-[8%]  pl-5'>
                    <h1 className="text-2xl font-semibold">Previous Trips</h1>
                </div>
                <div className='mb-5 p-4'>
                    <div className='flex-col mt-10 px-5'>
                        {previousTrips.length === 0 ? (
                            <p>No previous trips found.</p>
                        ) : (
                            <table className="min-w-full bg-white border">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border">Trip ID</th>
                                        <th className="py-2 px-4 border">Customer ID</th>
                                        <th className="py-2 px-4 border">Guide ID</th>
                                        <th className="py-2 px-4 border">Start Date</th>
                                        <th className="py-2 px-4 border">End Date</th>
                                        <th className="py-2 px-4 border">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {previousTrips.map(trip => (
                                        <tr key={trip.TripID}>
                                            <td className="py-2 px-4 border">{trip.TripID}</td>
                                            <td className="py-2 px-4 border">{trip.CustomerID}</td>
                                            <td className="py-2 px-4 border">{trip.GuideID}</td>
                                            <td className="py-2 px-4 border">{trip.StartDate}</td>
                                            <td className="py-2 px-4 border">{trip.EndDate}</td>
                                            <td className="py-2 px-4 border">{trip.Status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviousTrips;
