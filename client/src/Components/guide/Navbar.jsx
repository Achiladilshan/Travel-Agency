import React, { useState, useEffect } from 'react';
import Logout from '../../Assets/icons/logout.png';
import Profile from '../../Assets/icons/profile.png';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PaidIcon from '@mui/icons-material/Paid';
import { jwtDecode } from 'jwt-decode';
import LoopIcon from '@mui/icons-material/Loop';
import HistoryIcon from '@mui/icons-material/History';
import ChatIcon from '@mui/icons-material/Chat';

const Navbar = ({ activeItem }) => {
  const [activeLink, setActiveLink] = useState(localStorage.getItem('activeLink') || activeItem);
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);

  const handleLinkClick = (link) => (event) => {
    event.preventDefault(); // Prevent default navigation behavior
    setActiveLink(link); // Update active link
    localStorage.setItem('activeLink', link);
    if (link === 'logout') {
      localStorage.removeItem("access_token");
      localStorage.removeItem("activeLink");
    }
    const targetLink = link === 'logout' ? 'login' : link === 'dashboard' ? 'guide-dashboard' : `guide/${link}`;
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
      <div className='w-full'>
        <div className='px-[10%] mt-8 mb-[55px] flex'>
          <img src={Profile} alt="Profile" className={`w-[72px] h-[72px]`} />
          <div className='pl-5 flex items-center'>
            <div>
              <h1 className='font-semibold'>Hi,</h1>
              <h1 className=" font-bold text-xl">{userName}</h1>
            </div>

          </div>

        </div>
        <div className="flex flex-col  items-center">

          <div className={`border border-[#DADADA] w-[85%] h-[60px] flex items-center ${activeLink === "dashboard" ? 'bg-[#FFEEEF] border-transparent' : 'hover:bg-[#FFEEEF]'} rounded-lg`}>
            <button onClick={handleLinkClick('dashboard')} className='flex items-center w-full'>
              <div className='p-3'><DashboardIcon /></div>
              <h1 className='flex-1 text-center overflow-hidden whitespace-nowrap -ml-4 text-[18px]'>Dashboard</h1>
            </button>
          </div>

          <div className={`mt-6 border border-[#DADADA] w-[85%] h-[60px] flex items-center ${activeLink === "currenttrips" ? 'bg-[#FFEEEF] border-transparent' : 'hover:bg-[#FFEEEF]'} rounded-lg`}>
            <button onClick={handleLinkClick('currenttrips')} className='flex items-center w-full'>
            <div className='p-3'><LoopIcon /></div>
              <h1 className='flex-1 text-center overflow-hidden whitespace-nowrap -ml-4 text-[18px]'>Curent Trips</h1>
            </button>
          </div>

          <div className={`mt-6 border border-[#DADADA] w-[85%] h-[60px] flex items-center ${activeLink === "previoustrips" ? 'bg-[#FFEEEF] border-transparent' : 'hover:bg-[#FFEEEF]'} rounded-lg`}>
            <button onClick={handleLinkClick('previoustrips')} className='flex items-center w-full'>
            <div className='p-3'><HistoryIcon /></div>
              <h1 className='flex-1 text-center overflow-hidden whitespace-nowrap -ml-4 text-[18px]'>Previous Trips</h1>
            </button>
          </div>

          <div className={`mt-6 border border-[#DADADA] w-[85%] h-[60px] flex items-center ${activeLink === "chat" ? 'bg-[#FFEEEF] border-transparent' : 'hover:bg-[#FFEEEF]'} rounded-lg`}>
            <button onClick={handleLinkClick('chat')} className='flex items-center w-full'>
            <div className='p-3'><ChatIcon /></div>
              <h1 className='flex-1 text-center overflow-hidden whitespace-nowrap -ml-4 text-[18px]'>Chat</h1>
            </button>
          </div>

          <div className={`mt-6 border border-[#DADADA] w-[85%] h-[60px] flex items-center ${activeLink === "payment" ? 'bg-[#FFEEEF] border-transparent' : 'hover:bg-[#FFEEEF]'} rounded-lg`}>
            <button onClick={handleLinkClick('payment')} className='flex items-center w-full'>
            <div className='p-3'><PaidIcon /></div>
              <h1 className='flex-1 text-center overflow-hidden whitespace-nowrap -ml-4 text-[18px]'>Payment</h1>
            </button>
          </div>
        </div>
      </div>
      <div className={`mt-6 mb-10 bg-[#820008] w-[85%] h-[60px] flex items-center ${activeLink === "logout" ? 'bg-[#FFEEEF] border-transparent' : 'hover:bg-[#820009e6]'} rounded-lg`}>
        <button onClick={handleLinkClick('logout')} className='flex items-center w-full'>
          <img src={Logout} alt="Logout" className="block p-3 w-14 h-14" />
          <h1 className='flex-1 text-center overflow-hidden whitespace-nowrap -ml-4 text-[18px] text-white'>Logout</h1>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;