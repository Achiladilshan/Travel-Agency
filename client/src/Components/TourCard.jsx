import React, { useState } from 'react';

const TourCard = ({ name, description, price, itinerary, days, imageSrc, buttonText }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img className="w-full h-32 sm:h-48 md:h-56 lg:h-64 object-cover" src={imageSrc} alt={`Tour ${days} days`} />
      <div className="p-4">
        <h2 className="text-lg font-semibold">{days} Days Tour</h2>
        <button
          className="mt-2 bg-customYellow hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded"
          onClick={toggleModal}
        >
          {buttonText}
        </button>
      </div>
      {modalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex items-center justify-center z-[9999]">
          <div className="bg-white p-8 rounded-lg w-[35%] ">
            <img className="w-full h-32 sm:h-48 md:h-56 lg:h-64 object-cover mb-4" src={imageSrc} alt={`Tour ${days} days`} />
            <h2 className="text-lg font-semibold">{name}</h2>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description:</label>
              <textarea
                className="border-black bg-white border w-full p-2 rounded-md"
                value={description}
                rows={6}
                readOnly
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Itinerary:</label>
              <textarea
                className="border-black bg-white border w-full p-2 rounded-md mb-4"
                value={itinerary}
                rows={6}
                readOnly
              />
            </div>
            <p>Price: ${price}</p>
            <p>Days: {days}</p>
            <button
              className="mt-5 bg-customYellow hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded"
              onClick={toggleModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourCard;
