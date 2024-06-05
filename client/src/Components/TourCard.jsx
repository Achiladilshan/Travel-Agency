import React from 'react';

const TourCard = ({ days, imageSrc, buttonText, buttonLink }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img className="w-full h-32 sm:h-48 md:h-56 lg:h-64 object-cover" src={imageSrc} alt={`Tour ${days} days`} />
      <div className="p-4">
        <h2 className="text-lg font-semibold">{days} Days Tour</h2>
        <button className="mt-2 bg-customYellow hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded">
          <a href={buttonLink}>{buttonText}</a>
        </button>
      </div>
    </div>
  );
}
export default TourCard;
