import React, { useState, useEffect } from 'react';
import LogoImage from '../Assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';


const Navbar = ({ activeItem, buttonState, buttonLoc }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(buttonLoc);
  };


  return (
    <div>
      <nav className="bg-white p-4 top-0 w-full z-0">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src={LogoImage} alt="Logo" className="h-16 mr-2" />
          </div>
          <div>
            <Link to="/" className={`p-4 ${activeItem === 'HOME' ? 'border-b-2 border-black' : 'border-b border-transparent opacity-50'} cursor-pointer`} >HOME</Link>
            <Link to="/tours" className={`p-4 ${activeItem === 'TOURS' ? 'border-b-2 border-black' : 'border-b border-transparent opacity-50'} cursor-pointer`} >TOURS</Link>
            <Link to="/about-us" className={`p-4 ${activeItem === 'ABOUT US' ? 'border-b-2 border-black' : 'border-b border-transparent opacity-50'} cursor-pointer`} >ABOUT US</Link>
          </div>
          <div>
            <button onClick={handleClick} className="bg-customYellow hover:bg-customYellow text-white font-bold py-2 px-4 rounded-full">
              {buttonState}
            </button>
          </div>
        </div>
      </nav>
      <div className='bg-customYellow h-1 w-full'></div>
    </div>

  )
}

export default Navbar;