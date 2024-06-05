import React from 'react';

function CurrentTripsSection({ trips }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Current Trips</h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {trips.map((trip, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <p className="text-lg font-semibold mb-2">{trip.destination}</p>
            <p><span className="font-semibold">Start Date:</span> {trip.StartDate.split('T')[0]}</p>
            <p><span className="font-semibold">End Date:</span> {trip.EndDate.split('T')[0]}</p>
            <p><span className="font-semibold">Description:</span> {trip.Description}</p>
            <p><span className="font-semibold">Ttal Distance:</span> {trip.TotalDistance}Km</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CurrentTripsSection;
