import React from 'react';
import {useNavigate } from 'react-router-dom';
import BgImage from '../Assets/bg.png';

const Homedash = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/inquire');
  };

  return (
    <div>
    <img src={BgImage} alt="Background" className="absolute inset-0 w-full h-full z-0" style={{ objectFit: 'cover', objectPosition: 'center', zIndex: '-1', position: 'fixed' }} />
        <div className="inset-0 flex  flex-col justify-center items-left z-10 pt-32 pl-32">
          <div>
            <h1 className="text-5xl text-white font-bold" style={{ textShadow: '2px 2px 4px rgba(255, 255, 255, 0.4)' }}   >TRAVEL  SRI LANKA </h1>
            <h1 className="text-5xl text-white font-bold mt-4" style={{ textShadow: '2px 2px 4px rgba(255, 255, 255, 0.4)' }}>LIKE  NEVER  BEFORE </h1>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <button onClick={handleClick} className="bg-customYellow hover:bg-customYellow text-balck font-bold  justify-center  z-10 pt-50  pl-50 py-5 px-4 mt-10 rounded-full w-33 "
          >INQUIRE NOW</button>
        </div>
    </div>
  )
}

export default Homedash