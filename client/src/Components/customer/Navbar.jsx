import React, { useState, useEffect } from 'react';
import Logout from '../../Assets/icons/logout.png';
import Profile from '../../Assets/icons/profile.png';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ChatIcon from '@mui/icons-material/Chat';
import LoopIcon from '@mui/icons-material/Loop';
import HistoryIcon from '@mui/icons-material/History';
import PaymentIcon from '@mui/icons-material/Payment';

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
    const targetLink = link === 'logout' ? 'login' : link === 'chat' ? 'customer-dashboard' : `customer/${link}`;
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
        <div className='mt-8 mb-[55px] flex px-[10%]'>
          <img src={Profile} alt="Profile" className={`w-[72px] h-[72px]`} />
          <div className='pl-5 flex items-center'>
            <div>
              <h1 className='font-semibold'>Hi,</h1>
              <h1 className=" font-bold text-xl">{userName}</h1>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">

          <div className={`border border-[#DADADA] w-[85%] h-[60px] flex items-center ${activeLink === "inquiry" ? 'bg-[#FFEEEF] border-transparent' : 'hover:bg-[#FFEEEF]'} rounded-lg`}>
            <button onClick={handleLinkClick('inquiry')} className='flex items-center w-full'>
              <div className='p-3'><ChatIcon /></div>
              <h1 className='flex-1 text-center overflow-hidden whitespace-nowrap -ml-4 text-[18px]'>Inquiry</h1>
            </button>
          </div>

          <div className={`mt-6 border border-[#DADADA] w-[85%] h-[60px] flex items-center ${activeLink === "current-trip" ? 'bg-[#FFEEEF] border-transparent' : 'hover:bg-[#FFEEEF]'} rounded-lg`}>
            <button onClick={handleLinkClick('current-trip')} className='flex items-center w-full'>
              <div className='p-3'><LoopIcon /></div>
              <h1 className='flex-1 text-center overflow-hidden whitespace-nowrap -ml-4 text-[18px]'>Current Trip</h1>
            </button>
          </div>

          <div className={`mt-6 border border-[#DADADA] w-[85%] h-[60px] flex items-center ${activeLink === "previous-trip" ? 'bg-[#FFEEEF] border-transparent' : 'hover:bg-[#FFEEEF]'} rounded-lg`}>
            <button onClick={handleLinkClick('previous-trip')} className='flex items-center w-full'>
              <div className='p-3'><HistoryIcon /></div>
              <h1 className='flex-1 text-center overflow-hidden whitespace-nowrap -ml-4 text-[18px]'>Previous Trip</h1>
            </button>
          </div>

          <div className={`mt-6 border border-[#DADADA] w-[85%] h-[60px] flex items-center ${activeLink === "view-payment" ? 'bg-[#FFEEEF] border-transparent' : 'hover:bg-[#FFEEEF]'} rounded-lg`}>
            <button onClick={handleLinkClick('view-payment')} className='flex items-center w-full'>
              <div className='p-3'><PaymentIcon /></div>
              <h1 className='flex-1 text-center overflow-hidden whitespace-nowrap -ml-4 text-[18px]'>View Payment</h1>
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
