import React, { useEffect, useState } from 'react';
import AdminNavBar from '../../Components/guide/Navbar';
import instance from '../../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Divider from '@mui/material/Divider';
import Swal from 'sweetalert2';
import AutocompleteInput from '../../Components/guide/AutocompleteInput';

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


const PreviousTrips = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [guideID, setGuideID] = useState('');
    const [allocatedTrips, setAllocatedTrips] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState([]);
    const [showNestedModal, setShowNestedModal] = useState(false);
    const [currentTab, setCurrentTab] = useState('dailyDistance');
    const [tripDays, setTripDays] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);
    const [trackPoints, setTrackPoints] = useState([]);
    const [totalDistance, setTotalDistance] = useState(null);

    useEffect(() => {
        fetchTotalDistance();
    }, [selectedTrip]);

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


    const handleAddTrackPoint = () => {
        setTrackPoints([...trackPoints, { id: trackPoints.length, location1: {}, location2: {}, distance: 0, submitted: false }]);
    };

    const handleDeleteTrackPoint = async (index) => {
        const point = trackPoints[index];

        // Check if location1 and location2 are empty
        if (!point.location1 || !point.location1.name || !point.location2 || !point.location2.name) {
            // Directly remove from frontend state if locations are empty
            const updatedTrackPoints = trackPoints.filter((_, i) => i !== index);

            // Refresh the IDs of the remaining trackpoints
            const refreshedTrackPoints = updatedTrackPoints.map((point, i) => {
                return {
                    ...point,
                    id: i
                };
            });

            // Set the updated trackpoints in state
            setTrackPoints(refreshedTrackPoints);

            return;
        }
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to delete this?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                // Delete track point from the database
                await fetch(`http://localhost:3001/guide/daily-distances/${trackPoints[index].id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ selectedDay: selectedDay, TripID: selectedTrip.TripID })
                })
                    .then(response => {
                        if (response.ok) {
                            // Show success message using swal
                            Swal.fire({
                                icon: 'success',
                                title: 'Deleted Successfully',
                                text: 'Locations deleted successfully.',
                            }).then(() => {
                                // Update frontend state to remove the track point
                                const updatedTrackPoints = trackPoints.filter((_, i) => i !== index);

                                // Refresh the IDs of the remaining trackpoints
                                const refreshedTrackPoints = updatedTrackPoints.map((point, i) => {
                                    return {
                                        ...point,
                                        id: i
                                    };
                                });

                                // Set the updated trackpoints in state
                                setTrackPoints(refreshedTrackPoints);
                                // Switch to the dailyDistance tab
                                handleTabClick('dailyDistance');
                            });
                        } else {
                            throw new Error('Failed to delete track point');
                        }
                    });

            } catch (error) {
                console.error('Error deleting track point:', error);
            }
        }
    };


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



    const updateTrackPoint = (id, locationKey, value) => {
        const updatedTrackPoints = trackPoints.map((point) =>
            point.id === id ? { ...point, [locationKey]: value } : point
        );
        setTrackPoints(updatedTrackPoints);

        const point = updatedTrackPoints.find(point => point.id === id);
        if (point.location1.formatted_address && point.location2.formatted_address) {
            calculateDistance(point.location1.formatted_address, point.location2.formatted_address, id, updatedTrackPoints);
        }
    };

    const calculateDistance = (origin, destination, id, updatedTrackPoints) => {
        const service = new window.google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
            {
                origins: [origin],
                destinations: [destination],
                travelMode: 'DRIVING',
            },
            (response, status) => {
                if (status === 'OK' && response.rows[0].elements[0].status === 'OK') {
                    const distance = response.rows[0].elements[0].distance.value / 1000; // distance in kilometers
                    const finalTrackPoints = updatedTrackPoints.map((point) =>
                        point.id === id ? { ...point, distance } : point
                    );
                    setTrackPoints(finalTrackPoints);
                    handleSubmit(finalTrackPoints.find(point => point.id === id));
                } else {
                    console.error('Error calculating distance', response);
                }
            }
        );
    };

    const handleSubmit = async (point) => {
        // Submit the track point to the server or database here
        try {
            console.log(selectedDay);
            const response = await fetch('http://localhost:3001/guide/daily-distances', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    TripID: selectedTrip.TripID,
                    selectedDay: selectedDay,
                    StartPlace: point.location1,
                    EndPlace: point.location2,
                    Distance: point.distance,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit track point');
            }

            const responseData = await response.json();
            console.log('Submitted track point:', responseData);

            // Mark the track point as submitted
            const updatedTrackPoints = trackPoints.map((tp) => {
                if (tp.id === point.id) {
                    // Update the properties you need to modify
                    return {
                        ...tp,
                        submitted: true,
                        location1: point.location1, // Assuming updatedLocation1 is the new value for location1
                        location2: point.location2,
                        distance: point.distance,// Assuming updatedLocation2 is the new value for location2
                        /* other properties you need to update */
                    };
                } else {
                    return tp;
                }
            });
            setTrackPoints(updatedTrackPoints);
        } catch (error) {
            console.error('Error submitting track point:', error);
        }
    };


    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await instance.get('/auth/current-user');
                setCurrentUser(response.data.user);
                const res = await instance.get(`/guide/getGuideId/${response.data.user.id}`);
                setGuideID(res.data[0].GuideID);
                try {
                    const GuideID = response.data.user.id;
                    const res = await instance.get(`/trip/tripcustomer/${GuideID}`);
                    const pendingTrips = res.data.filter(trip =>
                        trip.Status === 'End' || trip.Status === 'Close'
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-CA');
    };

    const handleTabClick = (tab) => {
        setCurrentTab(tab);
        setSelectedDay(null);
    };

    const handleModalToggle = (trip) => {
        setSelectedTrip(trip);
        setShowModal(!showModal);
    };

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

    const handleclose = () => {
        setShowNestedModal(!showNestedModal);
        setTrackPoints([]);
        setSelectedDay(null);
        setUploadedFiles([]);
        setSelectedTrip([]);
        //window.location.reload();
    }

    const isValidDate = (date) => {
        return date instanceof Date && !isNaN(date);
    };

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
                                onPlaceSelected={(place) => updateTrackPoint(point.id, 'location1', place)}
                                disabled={point.submitted}
                                value={point.location1.name || ''}
                            />
                            <AutocompleteInput
                                id={`autocomplete2-${point.id}`}
                                placeholder="Enter End location"
                                onPlaceSelected={(place) => updateTrackPoint(point.id, 'location2', place)}
                                disabled={point.submitted}
                                value={point.location2.name || ''}
                            />
                        </div>
                        {selectedTrip.Status !== 'Close' &&
                            <div>
                                <button onClick={() => handleDeleteTrackPoint(index)} className="btn btn-error w-[80%] ">
                                    Delete
                                </button>
                            </div>
                        }
                        <div className='flex-col'>
                            <div><p>Distance:</p></div>
                            <div><p>{point.distance.toFixed(2)} km</p></div>
                        </div>
                    </div>
                ))}
                {selectedTrip.Status !== 'Close' &&
                    <button
                        disabled={!isValidDate(selectedDay)}
                        onClick={handleAddTrackPoint}
                        className="btn btn-primary mr-3"
                    >
                        Add Track Point
                    </button>
                }

            </div>
        );
    };

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    // Function to handle file selection
    const handleFileChange = (event) => {
        setSelectedFiles(Array.from(event.target.files));
    };

    const uploadFiles = async () => {
        if (selectedFiles && selectedFiles.length > 0) {
            try {
                const formData = new FormData();
                formData.append('GuideID', guideID);
                formData.append('TripID', selectedTrip.TripID);
                selectedFiles.forEach((file) => {
                    formData.append('files', file);
                });

                for (let pair of formData.entries()) {
                    console.log(pair[0] + ': ' + pair[1]);
                }

                const response = await fetch('http://localhost:3001/guide/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Failed to upload files');
                }

                console.log('Files uploaded successfully');

                // Display success message using Swal
                Swal.fire({
                    icon: 'success',
                    title: 'Upload Successful',
                    text: 'Files uploaded successfully.',
                }).then(() => {
                    // Reload the window after the success message is closed
                    window.location.reload();
                });

            } catch (error) {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Upload Error',
                    text: 'Failed to upload files. Please try again later.',
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'No Files Selected',
                text: 'Please select one or more files to upload.',
            });
        }
    };

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

    const deleteFile = async (filename) => {
        // Show confirmation dialog using SweetAlert
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to delete this file. This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`http://localhost:3001/guide/files/${selectedTrip.TripID}/${filename}`, {
                        method: 'DELETE',
                    });

                    if (!response.ok) {
                        throw new Error('Failed to delete file');
                    }

                    console.log('File deleted successfully');
                    fetchUploadedFiles();

                    // Display success message using Swal
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'File deleted successfully',
                    }).then(() => {
                        // Reload the window
                        window.location.reload();
                    });

                } catch (error) {
                    console.error('Error:', error);
                }
            }
        });
    };

    useEffect(() => {
        if (Object.keys(selectedTrip).length > 0) {
            fetchUploadedFiles();
        }
    }, [selectedTrip]);

    return (
        <div className='flex flex-row'>
            <div className="w-[25%]">
                <AdminNavBar activeItem={"currenttrips"} />
            </div>
            <div className="w-[2px] bg-[#F69412]"></div>
            <div className='bg-[#EFEFEF] w-full overflow-auto h-screen'>
                <div className='bg-[#D9D9D9] flex items-center h-[8%]  pl-5'>
                    <h1 className="text-2xl font-semibold">Previous Trips</h1>
                </div>
                <div className='mb-5 p-4'>
                    <div className='flex-col mt-10 px-5'>
                        {allocatedTrips.length === 0 ? (
                            <div className="text-gray-500 text-lg">No Previous orders found</div>
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
                                                <button className={`px-4 py-2 rounded-2xl ${trip.Status === 'End' ? 'bg-yellow-600' : trip.Status === 'Close' ? 'bg-[green]' : 'bg-[green]'} text-white`}>
                                                    <b>{trip.Status === 'End' ? 'Pending Payment Approval' : trip.Status === 'Close' ? 'Payment Complete' : trip.Status}</b>
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
                                    {selectedTrip.Status !== 'Close' &&
                                        <div className='flex-col'>
                                            <div className='mb-4'>
                                                <input className="bg-[#b0b0b0dc] rounded-lg" type="file" accept="image/jpeg, image/jpg, image/png, application/pdf" multiple onChange={handleFileChange} />
                                            </div>
                                            <button className="bg-[#00867d] text-white px-4 py-2 rounded-lg" onClick={uploadFiles}>Upload Bills</button>
                                        </div>
                                    }
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
                                                            {selectedTrip.Status !== 'Close' &&
                                                                <button className="btn btn-danger w-[100%] bg-[#8f0707] text-white" onClick={() => deleteFile(file.name)}>Delete</button>
                                                            }
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

export default PreviousTrips;
