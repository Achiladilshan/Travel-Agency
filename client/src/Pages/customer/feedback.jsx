import React, { useState, useEffect } from "react";
import Navbar from "../../Components/customer/Navbar";
import instance from "../../api"; // Adjust the path as needed
import { ToastContainer, toast } from 'react-toastify';

function Feedback() {

  const [formData, setFormData] = useState({
    tourID: "", // Added tourID field
    remarks: "",
    highlights: "",
    lowPoints: ""
  });

  const [rating, setRating] = useState(0); // State to store the selected rating
  const [userID, setUserID] = useState(null); // State to store the user ID

  useEffect(() => {
    // Fetch current user's information or user ID from authentication system or user context
    // For example:
    const currentUser = getCurrentUser(); // Implement this function to get the current user
    if (currentUser) {
      setUserID(currentUser.id); // Assuming currentUser has an id property
    }
  }, []);

  const handleRatingChange = (event) => {
    const value = parseInt(event.target.value); // Parse the value to integer
    setRating(value); 
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const submitFeedback = async () => {
    const data = {
      TripID: formData.tourID, // Use the entered tour ID
      UserID: userID, // Use the retrieved user ID
      Rating: rating,
      Comment: formData.remarks.toString(),
      Status: "Pending",
    };
    try {
      const response = await instance.post('/feedback/addFeedback', data);
      toast.success('Feedback submitted successfully');
      console.log(response);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback');
    }
  };

  // Dummy function to simulate getting current user
  const getCurrentUser = async () => {
    try{
      const response =  await instance.get('/auth/current-user');
        return response?.data?.user;
      
    }catch(err){
      console.error('Error')
    }
  };

  return (
    <div className="flex">
      <div className="w-[25%]">
        <Navbar activeItem={"feedback"} />
      </div>
      <div className= "w-[2px] bg-[#F69412]"></div>
      <div className="bg-[#EFEFEF] pl-5 w-lvw">
        <h1 className="text-2xl font-semibold my-4">Feedback</h1>
        <p>
          We would like to please to know your valuable comments and look
          forward to continuous improvement of our service.
        </p>
        <div className="mt-8">
        <div className="rating gap-1">
            <input
              type="radio"
              name="rating"
              value="1"
              className="mask mask-heart bg-red-400"
              onChange={handleRatingChange}
              checked 
            />
            <input
              type="radio"
              name="rating"
              value="2"
              className="mask mask-heart bg-orange-400"
              onChange={handleRatingChange}
            />
            <input
              type="radio"
              name="rating"
              value="3"
              className="mask mask-heart bg-yellow-400"
              onChange={handleRatingChange}
            />
            <input
              type="radio"
              name="rating"
              value="4"
              className="mask mask-heart bg-lime-400"
              onChange={handleRatingChange}
            />
            <input
              type="radio"
              name="rating"
              value="5"
              className="mask mask-heart bg-green-400"
              onChange={handleRatingChange}
            />
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Additional Comments</h2>
          <form>
            <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
                Tour ID:
              </label>
              <input
                type="text"
                name="tourID"
                value={formData.tourID}
                onChange={handleInputChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>
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
            {/* Repeat for other input fields */}
            <button
              onClick={submitFeedback}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Submit Feedback
            </button>
          </form>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Feedback;
