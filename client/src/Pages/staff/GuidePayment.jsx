import React, { useEffect, useState } from 'react';
import StaffSideBar from '../../Components/staff/StaffSideBar';
import instance from '../../api'; // Import the Axios instance for API requests
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Divider from '@mui/material/Divider';
import Swal from 'sweetalert2';
import AutocompleteInput from '../../Components/guide/AutocompleteInput';

// Component for individual tab button
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

const GuidePayment = () => {
    const [allocatedTrips, setAllocatedTrips] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState([]);
    const [showNestedModal, setShowNestedModal] = useState(false);
    const [currentTab, setCurrentTab] = useState('dailyDistance');
    const [tripDays, setTripDays] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);
    const [trackPoints, setTrackPoints] = useState([]);
    const [totalDistance, setTotalDistance] = useState(null);
    const [showPopup, setshowPopup] = useState(false);
    const [amount, setAmount] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState([]);

    // Fetch total distance whenever selectedTrip changes
    useEffect(() => {
        fetchTotalDistance();
    }, [selectedTrip]);

    // Function to fetch total distance for the selected trip
    const fetchTotalDistance = async () => {
        try {
            const response = await fetch(`http://localhost:3001/guide/total-distance?tripId=${selectedTrip.TripID}`);
            if (!response.ok) {
                throw new Error('Failed to fetch total distance');
            }
            const data = await response.json();
            setTotalDistance(data.totalDistance);
        } catch (error) {
            console.error('Error fetching total distance:', error);
        }
    };

    // Fetch track points data whenever selectedDay changes
    useEffect(() => {
        if (!selectedDay) return; // Ensure selectedDay is not null or undefined

        // Perform fetch request to get track points data based on selectedDay
        fetchTrackPoints(selectedDay)
            .then((data) => {
                // Map the received data to generate trackpoint objects
                const trackpoints = data.map((item, index) => {
                    const id = index;
                    const location1 = JSON.parse(item.StartPlace);
                    const location2 = JSON.parse(item.EndPlace);
                    const distance = item.Distance;
                    const submitted = true;

                    return { id, location1, location2, distance, submitted };
                });

                // Set the trackpoints state
                setTrackPoints(trackpoints);
            })
            .catch((error) => {
                console.error('Error fetching track points:', error);
            });
    }, [selectedDay]);

    // Function to fetch track points data from the server
    const fetchTrackPoints = async (selectedDay) => {
        try {
            const response = await fetch(`http://localhost:3001/guide/track-points?selectedDay=${selectedDay}&TripID=${selectedTrip.TripID}`);
            if (!response.ok) {
                throw new Error('Failed to fetch track points data');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    };

    // Fetch allocated trips on component mount
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                try {
                    const res = await instance.get(`/trip/`);
                    const pendingTrips = res.data.filter(trip =>
                        trip.Status === 'End'
                    );
                    setAllocatedTrips(pendingTrips);

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

    // Format date to 'YYYY-MM-DD' format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-CA');
    };

    // Handle tab click event
    const handleTabClick = (tab) => {
        setCurrentTab(tab);
        setSelectedDay(null);
    };

    // Toggle modal visibility
    const handleModalToggle = (trip) => {
        setSelectedTrip(trip);
        setShowModal(!showModal);
    };

    const hanldepopupclose = (trip) => {
        setSelectedTrip(trip);
        setshowPopup(false);
    };

    // Toggle nested modal visibility and set trip days
    const handleNestedModalToggle = (trip) => {
        setSelectedTrip(trip);
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
        setShowNestedModal(!showNestedModal);
    };

    const handlepopup = (trip) => {
        setSelectedTrip(trip);
        setshowPopup(true);
    };

    const handleclose = () => {
        setShowNestedModal(!showNestedModal);
        setTrackPoints([]);
        setSelectedDay(null);
        setUploadedFiles([]);
        setSelectedTrip([]);
    }

    // Clear track points when selectedDay changes
    useEffect(() => {
        setTrackPoints([]);
    }, [selectedDay]);

    // Content to render for each day
    const renderDayContent = () => {
        const totalDistance = trackPoints.reduce((total, point) => total + point.distance, 0);

        return (
            <div>
                <p className='mb-5'>Total Daily Distance: {totalDistance.toFixed(2)} km</p>
                {trackPoints.map((point, index) => (
                    <div key={index} className="flex justify-between mb-4">
                        <div className="flex justify-around w-[77%]">
                            <AutocompleteInput
                                id={`autocomplete1-${point.id}`}
                                placeholder="Enter Start location"
                                disabled={point.submitted}
                                value={point.location1.name || ''}
                            />
                            <AutocompleteInput
                                id={`autocomplete2-${point.id}`}
                                placeholder="Enter End location"
                                disabled={point.submitted}
                                value={point.location2.name || ''}
                            />
                        </div>
                        <div className='flex-col'>
                            <div><p>Distance:</p></div>
                            <div><p>{point.distance.toFixed(2)} km</p></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // Fetch uploaded files for the selected trip
    const fetchUploadedFiles = async () => {
        try {
            const response = await fetch(`http://localhost:3001/guide/files/${selectedTrip.TripID}`);
            if (!response.ok) {
                throw new Error('Failed to fetch files');
            }

            const files = await response.json();
            setUploadedFiles(files);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Fetch uploaded files whenever selectedTrip changes
    useEffect(() => {
        if (Object.keys(selectedTrip).length > 0) {
            fetchUploadedFiles();
        }
    }, [selectedTrip]);

    // Handle guide payment submission
    const handlePay = async () => {
        try {
            const response = await instance.put('/trip/updateTripdistancepayment', {
                TripID: selectedTrip.TripID,
                Distance: totalDistance,
                Payment: amount,
                Status: 'Close'
            });
            Swal.fire({
                icon: 'success',
                title: 'Payment Successful!',
                text: response.data.message
            }).then(() => {
                setshowPopup(false);
                window.location.reload();
            });
        } catch (error) {
            console.error('Error making payment:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to process payment.'
            });
        }
    };

    return (
        <div className='flex flex-row'>
            <div className="w-[25%]">
                <StaffSideBar activeItem="guidepayment" />
            </div>
            <div className="w-[2px] bg-[#F69412]"></div>
            <div className='bg-[#EFEFEF] w-full overflow-auto h-screen'>
                <div className='bg-[#D9D9D9] flex items-center h-[8%]  pl-5'>
                    <h1 className="text-2xl font-semibold">Guide Payment</h1>
                </div>
                <div className='mb-5 p-4'>
                    <div className='flex-col mt-10 px-5'>
                        {allocatedTrips.length === 0 ? (
                            <div className="text-gray-500 text-lg">No Ended Tours found</div>
                        ) : (
                            allocatedTrips.map(trip => (
                                <div key={trip.TripID} className={`flex flex-col w-full mb-4 p-4 bg-white rounded-lg shadow-md`}>
                                    <div className="flex items-center">
                                        <div className="ml-8 mr-[60px] space-y-3 w-[50%]">
                                            <div>Trip ID: {trip.TripID}</div>
                                            <div>Customer Name: <b>{trip.FirstName} {trip.LastName}</b></div>
                                            <div>Customer Email: <b>{trip.Email}</b> </div>
                                            <div>Customer Phone: <b>{trip.PhoneNumber}</b></div>
                                            <div>Customer Country: <b>{trip.Country}</b></div>
                                            <div>Start Date: <b>{formatDate(trip.StartDate)}</b></div>
                                            <div>End Date: <b>{formatDate(trip.EndDate)}</b></div>
                                            <div>Adults Count: <b>{trip.AdultsCount}</b></div>
                                            <div>Children Count: <b>{trip.ChildrenCount}</b></div>
                                            <div>Price: <b>$ {trip.Price}</b></div>
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
                                                    <button className="bg-[#6d1980] text-white px-4 py-2 rounded-xl" onClick={() => handlepopup(trip)}>Add Guide Payment</button>
                                                </div>
                                            </div>
                                        </div>
                                        <Divider orientation="vertical" flexItem />
                                        <div className="mx-9 flex justify-center">
                                            <div className="flex items-center justify-center">
                                                <button className={`px-4 py-2 rounded-2xl bg-yellow-600 text-white`} disabled>
                                                    <b>Pending Payment Approval</b>
                                                </button>

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

            {showPopup && selectedTrip && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-3xl">
                        <h2 className="font-bold text-lg mb-2">Guide Payment</h2>

                        <div className="mb-4">
                            <input
                                type="number"
                                className="w-full px-3 py-2 placeholder-gray-400 border rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-white"
                                placeholder="Enter the Payment Amount (LKR)"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                max={9999999999} // Setting max attribute for 10 digits
                                min={0} // Setting min attribute for non-negative numbers
                                required
                            />
                        </div>

                        <div className="modal-action">
                            <button className="btn btn-primary mr-2" onClick={handlePay}>
                                Submit
                            </button>
                            <button className="btn btn-secondary text-white" onClick={hanldepopupclose}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showNestedModal && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-3xl overflow-hidden flex flex-col">
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
                        <div className="px-4 overflow-auto max-h-[80vh]">
                            {currentTab === 'dailyDistance' && (
                                <div>
                                    <div className='mb-5'>
                                        <p>Total Distance: {totalDistance !== null ? totalDistance.toFixed(2) + ' km' : 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label htmlFor="date-dropdown" className="block font-semibold mb-2">Select a Date</label>
                                        <select
                                            id="date-dropdown"
                                            className="input input-bordered w-full"
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setSelectedDay(value ? new Date(value) : null);
                                            }}
                                            value={selectedDay ? selectedDay.toISOString().split('T')[0] : ''}
                                        >
                                            <option value="">Select</option>
                                            {/* Map through tripDays to create options for each date */}
                                            {tripDays.map((dateObj, index) => (
                                                <option key={index} value={dateObj.date.toISOString().split('T')[0]}>
                                                    {dateObj.date.getFullYear()}/{dateObj.date.getMonth() + 1}/{dateObj.date.getDate()}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className='mt-8'>
                                        {selectedDay && renderDayContent()}
                                    </div>
                                </div>
                            )}
                            {currentTab === 'addBills' && (
                                <>
                                    <div>
                                        <h3 className='font-bold mt-8'>Uploaded Files</h3>
                                        <ul>
                                            <div className='mt-5'>
                                                {uploadedFiles.map((file, index) => (
                                                    <div className="card" key={index}>
                                                        <div className="card-body">
                                                            <h5 className="card-title">{file.name}</h5>
                                                            {file.name.toLowerCase().endsWith('.pdf') ? (
                                                                <iframe src={file.url} width="100%" height="250px"></iframe>
                                                            ) : (file.name.toLowerCase().endsWith('.png') || file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg')) ? (
                                                                <img src={file.url} alt="Image Preview" style={{ width: '60%', height: '200px' }} />
                                                            ) : (
                                                                <p>Unsupported file type</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}

                                            </div>

                                        </ul>
                                    </div>
                                </>
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

export default GuidePayment;

