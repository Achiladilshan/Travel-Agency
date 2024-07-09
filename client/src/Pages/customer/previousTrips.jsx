import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/customer/Navbar';
import instance from '../../api'; // Import the Axios instance for API requests
import PreviousTripsSection from '../../Components/customer/PreviousTripsSection';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PreviousTrips() {
  const [previousTrips, setPreviousTrips] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTripID, setSelectedTripID] = useState(null);
  const [rating, setRating] = useState(0); // State to store the selected rating
  const [formData, setFormData] = useState({
    remarks: "",
    highlights: "",
    lowPoints: ""
  });

  useEffect(() => {
    fetchPreviousTrips();
  }, []);

  // Fetch previous trips for the user
  const fetchPreviousTrips = async () => {
    try {
      // Fetch current user's ID
      const response = await instance.get("/auth/current-user");
      const userID = response.data.user.id;

      const tripresponse = await instance.get(`/trip/getPreviousTrips/${userID}`);
      setPreviousTrips(tripresponse.data);
    } catch (error) {
      console.error('Failed to fetch previous trips:', error);
    }
  };

  // Handle clicking on the feedback button
  const handleFeedbackClick = (tripID) => {
    setSelectedTripID(tripID);
    setShowModal(true);
  };

  // Handler function to update rating state and call parent function
  const handleChange = (e) => {
    const selectedRating = e.target.value;
    setRating(selectedRating);
  };

  // Function to determine the dynamic class for each heart
  const getHeartClass = (index) => {
    if (index <= rating) {
      return `mask mask-heart bg-${getColorClass(index)}-400`; // Selected heart, color up
    } else {
      return `mask mask-heart bg-gray-200`; // Unselected heart, fade down in opacity
    }
  };

  // Function to determine the color class based on index
  const getColorClass = (index) => {
    switch (index) {
      case 1:
        return 'red';
      case 2:
        return 'orange';
      case 3:
        return 'yellow';
      case 4:
        return 'lime';
      case 5:
        return 'green';
      default:
        return 'gray'; // Default to gray if index is not matched
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle clicking on the cancel button
  const handleCancel = () => {
    setShowModal(false);
    setRating(0);
    setFormData({
      remarks: "",
      highlights: "",
      lowPoints: ""
    });
  };

  //Handle Submit button
  const submitFeedback = async () => {
    if (rating === 0) {
      toast.error('Please provide a rating and a comment');
      return;
    };

    const Data = new FormData();
    Data.append('TripID', selectedTripID);
    Data.append('Rating', rating);
    Data.append('Remarks', formData.remarks);
    Data.append('Highlights', formData.highlights);
    Data.append('LowPoints', formData.lowPoints);

    try {
      const response = await instance.post('/feedback/addFeedback', Data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      handleCancel();
      toast.success('Feedback submitted successfully');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback');
      handleCancel();
    }
  };

  return (
    <>
      <ToastContainer />
      <div className='flex'>
        <div className="w-[25%]">
          <Navbar activeItem={"previous-trip"} />
        </div>
        <div className="w-[2px] bg-[#F69412]">
        </div>
        <div className="bg-[#EFEFEF] pl-5 w-lvw">
          <h1 className="text-2xl font-semibold mb-4">Previous Trips</h1>
          {previousTrips.length === 0 ? (
            <p>No Data To Display</p>
          ) : (
            <PreviousTripsSection trips={previousTrips} handleFeedbackClick={handleFeedbackClick} />
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-md p-4 w-full max-w-lg h-auto overflow-auto">
              <h2 className="text-2xl font-semibold mb-4">Add Feedback</h2>
              <p>
                We would like to please to know your valuable comments and look
                forward to continuous improvement of our service.
              </p>
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Rate Your Experience</h2>
                <div className="rating gap-1">
                  {/* Radio inputs for each rating option */}
                  {[1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      type="radio"
                      name="rating"
                      value={index}
                      className={getHeartClass(index)}
                      onChange={handleChange}
                      checked={index.toString() === rating}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Additional Comments</h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Remarks:
                  </label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleInputChange}
                    rows="3"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Highlights of Your Tours:
                  </label>
                  <textarea
                    name="highlights"
                    value={formData.highlights}
                    onChange={handleInputChange}
                    rows="3"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Low Points of Your Trip and How They Could be Improved:
                  </label>
                  <textarea
                    name="lowPoints"
                    value={formData.lowPoints}
                    onChange={handleInputChange}
                    rows="3"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                  ></textarea>
                </div>

                <button
                  onClick={handleCancel}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={submitFeedback}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default PreviousTrips;
