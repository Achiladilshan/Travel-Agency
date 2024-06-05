import React, { useState } from 'react';
import Logout from '../../Assets/icons/logout.png';
import Feedback from '../../Assets/icons/feedback.png';
import Previous from '../../Assets/icons/previous.png';
import Current from '../../Assets/icons/current.png';
import Chat from '../../Assets/icons/chat.png';
import Profile from '../../Assets/icons/profile.png';

const Navbar = ({activeItem}) => {
  const [activeLink, setActiveLink] = useState(activeItem); // State to keep track of active link

  return (
    <nav className="h-screen bg-white text-black w-50 flex flex-col justify-between items-center">
      <div>
        <div className='mt-8 mb-[55px] flex'> 
          <img src={Profile} alt="Profile" className={`w-[72px] h-[72px]`} />
          <div className='pl-5 flex items-center'>
            <div>
              <h1 className='font-semibold'>Hi,</h1>
              <h1 className=" font-bold text-xl">David</h1>
            </div>
            
          </div>
          
        </div>
        <div className="flex flex-col  items-center">

            <div className={`border border-[#DADADA] w-[240px] h-[60px] flex items-center ${activeLink === "chat" ? 'bg-[#FFEEEF] border-transparent' : 'hover:bg-[#FFEEEF]'} rounded-lg`}>
                <a href="/customer-dashboard" onClick={() => setActiveLink("chat")} className='flex items-center w-full'>
                    <img src={Chat} alt="Chat" className="block p-3 w-14 h-14" />
                    <h1 className='flex-1 text-center overflow-hidden whitespace-nowrap -ml-4 text-[18px]'>Chat Box</h1>
                </a>
            </div>

            <div className={`mt-6 border border-[#DADADA] w-[240px] h-[60px] flex items-center ${activeLink === "currenttrip" ? 'bg-[#FFEEEF] border-transparent' : 'hover:bg-[#FFEEEF]'} rounded-lg`}>
                <a href="/customer-dashboard/current-trip" onClick={() => setActiveLink("currenttrip")} className='flex items-center w-full'>
                    <img src={Current} alt="Current" className="block p-3 w-14 h-14" />
                    <h1 className='flex-1 text-center overflow-hidden whitespace-nowrap -ml-4 text-[18px]'>Current Trip</h1>
                </a>
            </div>

            <div className={`mt-6 border border-[#DADADA] w-[240px] h-[60px] flex items-center ${activeLink === "previoustrip" ? 'bg-[#FFEEEF] border-transparent' : 'hover:bg-[#FFEEEF]'} rounded-lg`}>
                <a href="/customer-dashboard/previous-trips" onClick={() => setActiveLink("previoustrip")} className='flex items-center w-full'>
                    <img src={Previous} alt="Previous" className="block p-3 w-14 h-14" />
                    <h1 className='flex-1 text-center overflow-hidden whitespace-nowrap -ml-4 text-[18px]'>Previous Trip</h1>
                </a>
            </div>

            <div className={`mt-6 border border-[#DADADA] w-[240px] h-[60px] flex items-center ${activeLink === "feedback" ? 'bg-[#FFEEEF] border-transparent' : 'hover:bg-[#FFEEEF]'} rounded-lg`}>
                <a href="/customer-dashboard/feedback" onClick={() => setActiveLink("feedback")} className='flex items-center w-full'>
                    <img src={Feedback} alt="Feedback" className="block p-3 w-14 h-14" />
                    <h1 className='flex-1 text-center overflow-hidden whitespace-nowrap -ml-4 text-[18px]'>Feedback</h1>
                </a>
            </div>
        </div>
      </div>
      <div className={`mt-6 mb-10 bg-[#820008] w-[240px] h-[60px] flex items-center ${activeLink === "logout" ? 'bg-[#FFEEEF] border-transparent' : 'hover:bg-[#820009e6]'} rounded-lg`}>
                <a href="/login" onClick={() => setActiveLink("logout")} className='flex items-center w-full'>
                    <img src={Logout} alt="Logout" className="block p-3 w-14 h-14" />
                    <h1 className='flex-1 text-center overflow-hidden whitespace-nowrap -ml-4 text-[18px] text-white'>Logout</h1>
                </a>
            </div>
    </nav>
  );
};

export default Navbar;