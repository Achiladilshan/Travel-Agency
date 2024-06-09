import imageSrc from '../Assets/16days.jpg';

import React from 'react';

const CustomTourCard = ({ buttonText, buttonLink }) => {
  console.log(buttonLink);
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
      <img className="w-full h-32 sm:h-48 md:h-56 lg:h-64 object-cover" src={imageSrc} alt="lunch" />
      
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <svg className="w-16 h-16 text-white hover:bg-gray-500 pointer-events-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
      </div>
      <div className="p-4 relative z-10">
        <h2 className="text-lg font-semibold">Customized Tour</h2>
        <button className="mt-2 bg-customYellow hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded">
          <a href={buttonLink}>{buttonText}</a>
        </button>
      </div>
    </div>
  );
}

export default CustomTourCard;