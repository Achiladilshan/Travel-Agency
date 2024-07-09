import React from 'react';

function CurrentTripsSection({ trips }) {
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default CurrentTripsSection;
