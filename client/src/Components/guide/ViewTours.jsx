import React, { useState, useEffect } from 'react';
import instance from '../../api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MapCalculator from './MapCalculator';

const ViewTours = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [guideId, setGuideId] = useState(null);
    const [allocatedTrips, setAllocatedTrips] = useState([]);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await instance.get('/auth/current-user');
                setCurrentUser(response.data.user);
                console.log(response.data.user);
                try {
                    const GuideID = response.data.user.id;
                    const res = await instance.get(`/trip/guide/${GuideID}`);
                    setAllocatedTrips(res.data);
                } catch (error) {
                    console.error('Error fetching allocated trips:', error);
                    toast.error('Failed to fetch allocated trips');
                }
            } catch (error) {
                console.error('Error fetching current user:', error);
                toast.error('Failed to fetch current user');
            }
        };

        fetchCurrentUser();
    }, []);

    // useEffect(() => {
    //     const fetchGuideId = async () => {
    //         if (currentUser) {
    //             try {
    //                 const response = await instance.get(`/user/getGuideByUserID/${currentUser.UserID}`);
    //                 setGuideId(response.data?.GuideID);
    //             } catch (error) {
    //                 console.error('Error fetching guide ID:', error);
    //                 toast.error('Failed to fetch guide ID');
    //             }
    //         }
    //     };

    //     fetchGuideId();
    // }, [currentUser]); // Add currentUser as a dependency

    // useEffect(() => {
    //     const fetchAllocatedTrips = async () => {
    //         if (guideId) {
    //             try {
    //                 const response = await instance.get(`/trip/guide/${guideId}`);
    //                 setAllocatedTrips(response.data);
    //             } catch (error) {
    //                 console.error('Error fetching allocated trips:', error);
    //                 toast.error('Failed to fetch allocated trips');
    //             }
    //         }
    //     };

    //     fetchAllocatedTrips();
    // }, [guideId]);

    return (
        <>
            <ToastContainer />
            <div>
                <h1 className='text-center font-bold text-3xl m-6'>View Tours</h1>
                <div>
                    <h2>Allocated Tours</h2>
                    <ul>
                        {allocatedTrips && allocatedTrips.map(trip => (
                            <li key={trip.TripID}>
                                <p>Customer ID: {trip.CustomerID}</p>
                                <p>Price: {trip.Price}</p>
                                <p>Start Date: {new Date(trip.StartDate).toLocaleDateString()}</p>
                                <p>End Date: {new Date(trip.EndDate).toLocaleDateString()}</p>
                                <p>Description {trip.Description}</p>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='w-96'>
                <h1 className='text-center font-bold text-xl m-6'>Calculate Destination</h1>
                <MapCalculator/>
                </div>
               
            </div>
        </>
    );
};

export default ViewTours;
