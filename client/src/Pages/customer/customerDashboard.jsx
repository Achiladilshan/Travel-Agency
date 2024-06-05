import React from 'react'
import Navbar from '../../Components/customer/Navbar';

const customerDashboard = () => {
  return (
    <div className='flex'>
      <div className= "w-[25%]">
      <Navbar activeItem={"chat"}/>
      </div>
      <div className= "w-[2px] bg-[#F69412]">
      </div>
      <div className="bg-[#EFEFEF] w-lvw">
        <div className='bg-[#D9D9D9] flex items-center h-[8%]  pl-5'>
            <h1 className="text-2xl font-semibold">Customer Agent</h1>
        </div>

        <div className='h-[92%]'>

        </div>
      </div>
      
    </div>
  )
}

export default customerDashboard