import React, { useState, useEffect } from 'react';
import instance from '../../api';

function PreviousTripsSection({ trips, handleFeedbackClick }) {
  const [tripFeedback, setTripFeedback] = useState({});

  // Function to fetch feedback details for a trip ID
  const fetchFeedback = async (tripID) => {
    try {
      // Replace with actual API endpoint and fetch logic
      const response = await  instance.get(`/feedback/getFeedback/${tripID}`);
      if (response.ok) {
        throw new Error('Failed to fetch feedback');
      }
      const feedbackData = await response.data;
      setTripFeedback(prevFeedback => ({
        ...prevFeedback,
        [tripID]: feedbackData
      }));
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  // Effect to fetch feedback when component mounts
  useEffect(() => {
    // Assuming trips are loaded and we fetch feedback for each trip
    trips.forEach(trip => {
      fetchFeedback(trip.TripID);
    });
  }, [trips]);

  return (
    <div className="mt-8">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {trips.map((trip, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <p className="text-lg font-semibold mb-2">Trip ID: {trip.TripID}</p>
            <p><span className="font-semibold">Start Date:</span> {trip.StartDate.split('T')[0]}</p>
            <p><span className="font-semibold">End Date:</span> {trip.EndDate.split('T')[0]}</p>
            <p><span className="font-semibold">Adults Count:</span> {trip.AdultsCount}</p>
            <p><span className="font-semibold">Children Count:</span> {trip.ChildrenCount}</p>
            <div className="mt-2">
              <p><span className="font-semibold">Description:</span></p>
              <textarea
                className="border-black bg-white border w-full p-2 rounded-md"
                value={trip.Description}
                rows={10}
                readOnly
              />
            </div>
            <div className="mt-2">
              <p><span className="font-semibold">Special Notes:</span></p>
              <textarea
                className="border-black bg-white border w-full p-2 rounded-md"
                value={trip.SpecialNotes}
                rows={3}
                readOnly
              />
            </div>
            <p className='mt-2'><span className="font-semibold">Price:</span> ${trip.Price}</p>
            <p className='mt-2'><span className="font-semibold">Total Distance:</span> {trip.TotalDistance}Km</p>

            {/* Conditional rendering based on feedback existence */}
            {tripFeedback[trip.TripID] ? (
              <div className='mt-2'>
                <p><span className="font-semibold">Your Rating:</span> {tripFeedback[trip.TripID].Rating}/5</p>
                <p><span className="font-semibold">Remarks:</span> {tripFeedback[trip.TripID].Remarks}</p>
                <p><span className="font-semibold">Highlights:</span> {tripFeedback[trip.TripID].Highlights}</p>
                <p><span className="font-semibold">LowPoints:</span> {tripFeedback[trip.TripID].LowPoints}</p>
              </div>
            ) : (
              <button className="btn btn-primary mt-4" onClick={() => handleFeedbackClick(trip.TripID)}>Rate Your Trip</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PreviousTripsSection;
