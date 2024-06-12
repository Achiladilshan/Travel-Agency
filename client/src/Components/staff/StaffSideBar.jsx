import React, { useState, useEffect } from 'react';
import Logout from '../../Assets/icons/logout.png';
import Profile from '../../Assets/icons/profile.png';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ChatIcon from '@mui/icons-material/Chat';
import AddBoxIcon from '@mui/icons-material/AddBox';
import TripOriginIcon from '@mui/icons-material/TripOrigin';
import HotelIcon from '@mui/icons-material/Hotel';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import HistoryIcon from '@mui/icons-material/History';
import { jwtDecode } from 'jwt-decode';

const StaffSideBar = ({ activeItem }) => {
  const [activeLink, setActiveLink] = useState(localStorage.getItem('activeLink') || activeItem);
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);

  const handleLinkClick = (link) => (event) => {
    event.preventDefault(); // Prevent default navigation behavior
    setActiveLink(link); // Update active link
    localStorage.setItem('activeLink', link);
    if (link === 'logout') {
      localStorage.removeItem("token");
      localStorage.removeItem("activeLink");
    }
    const targetLink = link === 'logout' ? 'login' : link === 'dashboard' ? 'staff-dashboard' : `staff/${link}`;
    navigate(targetLink === 'login' ? '/login' : `/${targetLink}`);
  };

  const checkUsername = async () => {
    const storedData = localStorage.getItem('access_token');
    if (storedData) {
      try {
        const decodedToken = jwtDecode(storedData);
        if (decodedToken) {
          setUserName(decodedToken.name);
        }
      } catch (error) {
        setUserName(null);
      }
    } else {
      setUserName(null);
    }
  };

  useEffect(() => {
    checkUsername();
  }, []);

  return (
    <nav className="h-screen bg-white text-black w-50 flex flex-col justify-between items-center">
      <div>
        <div className='mt-8 mb-[55px] flex'>
          <img src={Profile} alt="Profile" className={`w-[72px] h-[72px]`} />
          <div className='pl-5 flex items-center'>
            <div>
              <h1 className='font-semibold'>Hi,</h1>
              <h1 className=" font-bold text-xl">{userName}</h1>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          

          <div className={`mt-6 border border-[#DADADA] w-[240px] h-[60px] flex items-center ${activeLink === "chat" ? 'bg-[#FFEEEF] border-transparent' : 'hover:bg-[#FFEEEF]'} rounded-lg`}>
            <button onClick={handleLinkClick('chat')} className='flex items-center w-full'>
              <div className='p-3'><ChatIcon /></div>
              <h1 className='flex-1 text-center overflow-hidden whitespace-nowrap -ml-4 text-[18px]'>Chat</h1>
            </button>
          </div>

          <div className={`mt-6 border border-[#DADADA] w-[240px] h-[60px] flex items-center ${activeLink === "addtour" ? 'bg-[#FFEEEF] border-transparent' : 'hover:bg-[#FFEEEF]'} rounded-lg`}>
            <button onClick={handleLinkClick('addtour')} className='flex items-center w-full'>
              <div className='p-3'><AddBoxIcon /></div>
              <h1 className='flex-1 text-center overflow-hidden whitespace-nowrap -ml-4 text-[18px]'>Add Tour</h1>
            </button>
          </div>

          <div className={`mt-6 border border-[#DADADA] w-[240px] h-[60px] flex items-center ${activeLink === "ongoingtrip" ? 'bg-[#FFEEEF] border-transparent' : 'hover:bg-[#FFEEEF]'} rounded-lg`}>
            <button onClick={handleLinkClick('ongoingtrip')} className='flex items-center w-full'>
              <div className='p-3'><TripOriginIcon /></div>
              <h1 className='flex-1 text-center overflow-hidden whitespace-nowrap -ml-4 text-[18px]'>Ongoing Trip</h1>
            </button>
          </div>

          <div className={`mt-6 border border-[#DADADA] w-[240px] h-[60px] flex items-center ${activeLink === "previousTrip" ? 'bg-[#FFEEEF] border-transparent' : 'hover:bg-[#FFEEEF]'} rounded-lg`}>
            <button onClick={handleLinkClick('previousTrip')} className='flex items-center w-full'>
              <div className='p-3'><HistoryIcon /></div>
              <h1 className='flex-1 text-center overflow-hidden whitespace-nowrap -ml-4 text-[18px]'>Previous Trips</h1>
            </button>
          </div>

          <div className={`mt-6 border border-[#DADADA] w-[240px] h-[60px] flex items-center ${activeLink === "hotels" ? 'bg-[#FFEEEF] border-transparent' : 'hover:bg-[#FFEEEF]'} rounded-lg`}>
            <button onClick={handleLinkClick('hotels')} className='flex items-center w-full'>
              <div className='p-3'><HotelIcon /></div>
              <h1 className='flex-1 text-center overflow-hidden whitespace-nowrap -ml-4 text-[18px]'>Hotels</h1>
            </button>
          </div>
          <div className={`mt-6 border border-[#DADADA] w-[240px] h-[60px] flex items-center ${activeLink === "guides" ? 'bg-[#FFEEEF] border-transparent' : 'hover:bg-[#FFEEEF]'} rounded-lg`}>
            <button onClick={handleLinkClick('guides')} className='flex items-center w-full'>
              <div className='p-3'><PersonPinIcon /></div>
              <h1 className='flex-1 text-center overflow-hidden whitespace-nowrap -ml-4 text-[18px]'>Guides</h1>
            </button>
          </div>
          <div className={`mt-6 border border-[#DADADA] w-[240px] h-[60px] flex items-center ${activeLink === "Payment" ? 'bg-[#FFEEEF] border-transparent' : 'hover:bg-[#FFEEEF]'} rounded-lg`}>
            <button onClick={handleLinkClick('Payment')} className='flex items-center w-full'>
              <div className='p-3'><DashboardIcon /></div>
              <h1 className='flex-1 text-center overflow-hidden whitespace-nowrap -ml-4 text-[18px]'>Payment</h1>
            </button>
          </div>
        </div>
      </div>
      <div className={`mt-6 mb-10 bg-[#820008] w-[240px] h-[60px] flex items-center ${activeLink === "logout" ? 'bg-[#FFEEEF] border-transparent' : 'hover:bg-[#820009e6]'} rounded-lg`}>
        <button onClick={handleLinkClick('logout')} className='flex items-center w-full'>
          <img src={Logout} alt="Logout" className="block p-3 w-14 h-14" />
          <h1 className='flex-1 text-center overflow-hidden whitespace-nowrap -ml-4 text-[18px] text-white'>Logout</h1>
        </button>
      </div>
      
    </nav>
  );
};

export default StaffSideBar;