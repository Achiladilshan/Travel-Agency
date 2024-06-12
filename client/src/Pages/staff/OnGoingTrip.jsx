import React, { useEffect, useState } from 'react';
import StaffSideBar from '../../Components/staff/StaffSideBar';
import instance from '../../api'; 
import { useNavigate } from 'react-router-dom';

const OnGoingTrip = () => {
    const [ongoingTrips, setOngoingTrips] = useState([]);
    const [selectedTripId, setSelectedTripId] = useState(null);
    const [status, setStatus] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchOngoingTrips();
    }, []);

    const fetchOngoingTrips = async () => {
        try {
            const response = await instance.get('/trip/getOngoingTrips');
            setOngoingTrips(response.data);
        } catch (error) {
            console.error('Error fetching ongoing trips:', error);
        }
    };

    const handleStatusChange = async (tripId) => {
        try {
            await instance.post('/trip/updateTripStatus', { TripID: tripId, Status: status });
            fetchOngoingTrips(); // Refresh the trips list
        } catch (error) {
            console.error('Error updating trip status:', error);
        }
    };

    const handleNavigateToPayment = (tripId) => {
        navigate(`/payment/${tripId}`);
    };

    return (
        <div className='flex flex-row'>
            <StaffSideBar activeItem="ongoingtrip" />
            <div className='flex-grow p-4'>
                <h1 className="text-2xl font-semibold mb-4">Ongoing Trips</h1>
                {ongoingTrips.length === 0 ? (
                    <p>No ongoing trips found.</p>
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
                                <th className="py-2 px-4 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ongoingTrips.map(trip => (
                                <tr key={trip.TripID}>
                                    <td className="py-2 px-4 border">{trip.TripID}</td>
                                    <td className="py-2 px-4 border">{trip.CustomerID}</td>
                                    <td className="py-2 px-4 border">{trip.GuideID}</td>
                                    <td className="py-2 px-4 border">{trip.StartDate}</td>
                                    <td className="py-2 px-4 border">{trip.EndDate}</td>
                                    <td className="py-2 px-4 border">{trip.Status}</td>
                                    <td className="py-2 px-4 border">
                                        <select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            className="mr-2 border rounded p-1"
                                        >
                                            <option value="">Select Status</option>
                                            <option value="Cancelled">Cancelled</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                        <button
                                            onClick={() => handleStatusChange(trip.TripID)}
                                            className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                        >
                                            Update Status
                                        </button>
                                        <button
                                            onClick={() => handleNavigateToPayment(trip.TripID)}
                                            className="bg-green-500 text-white px-2 py-1 rounded"
                                        >
                                            Payment
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default OnGoingTrip;