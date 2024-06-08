import React, { useEffect, useState, useRef } from 'react';
import AdminNavBar from '../../Components/guide/Navbar';
import instance from '../../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Divider from '@mui/material/Divider';
import { GoogleMap, LoadScript, Autocomplete, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

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

const libraries = ['places'];

const CurrentTrips = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [allocatedTrips, setAllocatedTrips] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [showNestedModal, setShowNestedModal] = useState(false);
    const [currentTab, setCurrentTab] = useState('dailyDistance');
    const [startLocation, setStartLocation] = useState('');
    const [endLocation, setEndLocation] = useState('');
    const [tripDays, setTripDays] = useState([]);
    const [tripPrice, setTripPrice] = useState(null);
    const [map, setMap] = useState(null);
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);

    const startAutocomplete = useRef(null);
    const endAutocomplete = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [trackPoints, setTrackPoints] = useState([{ start: '', end: '' }]);

    const handleAddTrackPoint = () => {
        const newTrackPoint = { start: '', end: '' };
        const updatedTrackPoints = [...trackPoints, newTrackPoint];
        setTrackPoints(updatedTrackPoints);
    };

    const handleDeleteTrackPoint = (index) => {
        const updatedTrackPoints = [...trackPoints];
        updatedTrackPoints.splice(index, 1);
        setTrackPoints(updatedTrackPoints);
    };

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const onStartPlaceChanged = () => {
        if (startAutocomplete.current) {
            const place = startAutocomplete.current.getPlace();
            if (place && place.formatted_address) {
                setStartLocation(place.formatted_address);
            } else {
                toast.error('Invalid starting point');
            }
        }
    };

    const onEndPlaceChanged = () => {
        if (endAutocomplete.current) {
            const place = endAutocomplete.current.getPlace();
            if (place && place.formatted_address) {
                setEndLocation(place.formatted_address);
            } else {
                toast.error('Invalid destination');
            }
        }
    };

    const calculateRoute = () => {
        if (!startLocation || !endLocation) {
            toast.error('Please select both starting point and destination');
            return;
        }

        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
            {
                origin: startLocation,
                destination: endLocation,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    setDirectionsResponse(result);
                    const distance = result.routes[0].legs[0].distance.value / 1000; // distance in km
                    //const price = calculatePrice(distance);
                    setTripPrice(distance);
                } else {
                    toast.error('Could not calculate route');
                }
            }
        );
    };

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

    const handleNestedModalToggle = (trip) => {
        const startDate = new Date(trip.StartDate);
        const endDate = new Date(trip.EndDate);
        const dateArray = [];

        let currentDate = startDate;
        while (currentDate <= endDate) {
            const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}`;
            dateArray.push({ date: new Date(currentDate), formattedDate });
            currentDate.setDate(currentDate.getDate() + 1);
        }
        setTripDays(dateArray);
        console.log(dateArray);
        setShowNestedModal(!showNestedModal);
    };

    const handleclose = () => {
        setShowNestedModal(!showNestedModal);
        window.location.reload();
    }

    // Content to render for each day
    const renderDayContent = (date) => {
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
        return (
            <div>
                {/* <LoadScript googleMapsApiKey="AIzaSyAVBI86obkebwHt55zzGlgU8rC6V9h8C4A" libraries={libraries} onLoad={handleLoad}>
                    {isLoaded && (
                        // Your Autocomplete component and other code here
                        <Autocomplete
                            onLoad={(autocomplete) => (startAutocomplete.current = autocomplete)}
                            onPlaceChanged={onStartPlaceChanged}
                            options={{
                                types: ['(regions)'],
                                componentRestrictions: { country: 'LK' }
                            }}
                        >
                            <input
                                type="text"
                                placeholder="Enter starting point"
                                className="input input-bordered w-full mb-4"
                            />
                        </Autocomplete>
                    )}
                </LoadScript> */}
                {trackPoints.map((point, index) => (
                    <div key={index} className="mb-4 flex items-center">
                        <LoadScript googleMapsApiKey="AIzaSyAVBI86obkebwHt55zzGlgU8rC6V9h8C4A" libraries={libraries} onLoad={handleLoad}>
                            {isLoaded && (
                                <React.Fragment>
                                    {/* Autocomplete for starting point */}
                                    <Autocomplete
                                        onLoad={(autocomplete) => (startAutocomplete[index] = autocomplete)}
                                        onPlaceChanged={() => onStartPlaceChanged(index)}
                                    >
                                        <input
                                            type="text"
                                            placeholder="Enter starting point"
                                            className="input input-bordered w-full mr-4"
                                        />
                                    </Autocomplete>
                                    {/* Autocomplete for ending point */}
                                    <Autocomplete
                                        onLoad={(autocomplete) => (endAutocomplete[index] = autocomplete)}
                                        onPlaceChanged={() => onEndPlaceChanged(index)}
                                    >
                                        <input
                                            type="text"
                                            placeholder="Enter ending point"
                                            className="input input-bordered w-full mr-4"
                                        />
                                    </Autocomplete>
                                </React.Fragment>
                            )}
                        </LoadScript>
                        {/* Delete button for removing track point */}
                        {index !== 0 &&
                            <button onClick={() => handleDeleteTrackPoint(index)} className="btn btn-error">
                                Delete
                            </button>
                        }
                    </div>
                ))}
                <button onClick={handleAddTrackPoint} className="btn btn-primary">
                    Add Track Point
                </button>
            </div>
        )
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
                                            <div>Trip ID: {trip.TripID}</div>
                                            <div>Customer Name: {trip.name}</div>
                                            <div>Start Date: {formatDate(trip.StartDate)}</div>
                                            <div>End Date: {formatDate(trip.EndDate)}</div>
                                            <div>Adults Count: {trip.AdultsCount}</div>
                                            <div>Children Count: {trip.ChildrenCount}</div>
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
                                                    <button className="bg-[#198061] text-white px-4 py-2 rounded-xl" onClick={() => handleNestedModalToggle(trip)}>View Trip</button>
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
                                    <div>
                                        <label htmlFor="date-dropdown" className="block font-semibold mb-2">Select a Date</label>
                                        <select id="date-dropdown" className="input input-bordered w-full" onChange={(e) => setSelectedDay(new Date(e.target.value))}>
                                            <option value="">Select</option>
                                            {/* Map through tripDays to create options for each date */}
                                            {tripDays.map((dateObj, index) => (
                                                <option key={index} value={dateObj.date.toISOString().split('T')[0]}>
                                                    {/* Include year in the formatted date */}
                                                    {dateObj.date.getFullYear()}/{dateObj.date.getMonth() + 1}/{dateObj.date.getDate()}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className='mt-8'>
                                        {selectedDay && renderDayContent(selectedDay)}
                                    </div>
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
                            <button className="btn btn-secondary text-white" onClick={handleclose}>Close</button>
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    )
}

export default CurrentTrips;
