import React, { useEffect, useState } from 'react';
import AdminNavBar from '../../Components/guide/Navbar';

const Chat = () => {
    return (
        <div className='flex flex-row'>
            <div className="w-[25%]">
                <AdminNavBar activeItem={"currenttrips"} />
            </div>
            <div className="w-[2px] bg-[#F69412]"></div>
            <div className='bg-[#EFEFEF] w-full'>
                <div className='bg-[#D9D9D9] flex items-center h-[8%]  pl-5'>
                    <h1 className="text-2xl font-semibold">Chat</h1>
                </div>
                <div className='h-[92%] p-8 ml-10'>
            
                </div>
            </div>
        </div>
    )
}

export default Chat
