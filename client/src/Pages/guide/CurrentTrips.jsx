import React, { useEffect, useState } from 'react';
import AdminNavBar from '../../Components/guide/Navbar';
import instance from '../../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Divider from '@mui/material/Divider';

const Tab = ({ label, isActive, onClick }) => {
    return (
        <button
            className={`px-4 py-2 rounded-lg ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            onClick={onClick}
        >
            {label}
        </button>
    );
};

const CurrentTrips = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [allocatedTrips, setAllocatedTrips] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [showNestedModal, setShowNestedModal] = useState(false);
    const [currentTab, setCurrentTab] = useState('dailyDistance');

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await instance.get('/auth/current-user');
                setCurrentUser(response.data.user);
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-CA');
    };

    const handleTabClick = (tab) => {
        setCurrentTab(tab);
    };

    const handleModalToggle = (trip) => {
        setSelectedTrip(trip);
        setShowModal(!showModal);
    };

    const handleNestedModalToggle = () => {
        setShowNestedModal(!showNestedModal);
    };

    return (
        <div className='flex flex-row'>
            <div className="w-[25%]">
                <AdminNavBar activeItem={"currenttrips"} />
            </div>
            <div className="w-[2px] bg-[#F69412]"></div>
            <div className='bg-[#EFEFEF] w-full'>
                <div className='bg-[#D9D9D9] flex items-center h-[8%]  pl-5'>
                    <h1 className="text-2xl font-semibold">Current Trips</h1>
                </div>
                <div className='h-[92%] p-8'>
                    <div className='flex-col mt-10 px-5'>
                        {allocatedTrips.length === 0 ? (
                            <div className="text-gray-500 text-lg">No pending orders found</div>
                        ) : (
                            allocatedTrips.map(trip => (
                                <div key={trip.TripID} className="flex flex-col w-full mb-4 p-4 bg-white rounded-lg shadow-md">
                                    <div className="flex items-center">
                                        <div className="ml-8 mr-[60px] space-y-3 w-[50%]">
                                            <div>tripID: {trip.TripID}</div>
                                            <div>Customer Name: {trip.name}</div>
                                            <div>Start Date: {formatDate(trip.StartDate)}</div>
                                            <div>End Date: {formatDate(trip.EndDate)}</div>
                                            <div>Adults Count: {trip.AdultsCount}</div>
                                            <div>Children Count: {trip.ChildrenCount}</div>
                                            <div>Total Distance: {trip.TotalDistance} KM</div>
                                        </div>
                                        <Divider orientation="vertical" flexItem />
                                        <div className="flex mx-8 w-[40%] justify-center">
                                            <div>Special Note: {trip.SpecialNotes}</div>
                                        </div>
                                        <Divider orientation="vertical" flexItem />
                                        <div className="flex mx-8 w-[20%] justify-center">
                                            <div className="flex space-x-10 items-center">
                                                <div className='inline-flex flex-col space-y-3'>
                                                    <button className="bg-[#39069e] text-white px-4 py-2 rounded-xl" onClick={() => handleModalToggle(trip)}>More Details</button>
                                                    <button className="bg-[#198061] text-white px-4 py-2 rounded-xl" onClick={handleNestedModalToggle}>View Trip</button>
                                                </div>
                                            </div>
                                        </div>
                                        <Divider orientation="vertical" flexItem />
                                        <div className="mx-9 flex justify-center">
                                            <div className="flex items-center justify-center">
                                                <button className="bg-[green] text-white px-4 py-2 rounded-full">{trip.Status}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            {showModal && selectedTrip && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-3xl">
                        <h2 className="font-bold text-lg mb-2">Trip Details</h2>
                        <textarea
                            className="textarea textarea-bordered w-full"
                            value={selectedTrip.Description}
                            readOnly
                            rows={15}
                        />
                        <div className="modal-action">
                            <button className="btn btn-secondary text-white" onClick={handleModalToggle}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {showNestedModal && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-3xl">
                        <h2 className="font-bold text-lg mb-2">Additional Trip Details</h2>
                        <div className="flex mt-4 mb-6 space-x-3">
                            <Tab
                                label="Daily Distance"
                                isActive={currentTab === 'dailyDistance'}
                                onClick={() => handleTabClick('dailyDistance')}
                            />
                            <Tab
                                label="Add Bills"
                                isActive={currentTab === 'addBills'}
                                onClick={() => handleTabClick('addBills')}
                            />
                        </div>
                        <div className="p-4">
                            {currentTab === 'dailyDistance' && (
                                <div>
                                    {/* Add logic for rendering daily distance */}
                                    {/* Example: */}
                                    <p>Daily distance: </p>
                                </div>
                            )}
                            {currentTab === 'addBills' && (
                                <div>
                                    {/* Add logic for adding bills */}
                                    {/* Example: */}
                                    <input type="text" placeholder="Enter bill details" />
                                    <button>Add Bill</button>
                                </div>
                            )}
                        </div>
                        <div className="modal-action">
                            <button className="btn btn-secondary text-white" onClick={handleNestedModalToggle}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CurrentTrips;
