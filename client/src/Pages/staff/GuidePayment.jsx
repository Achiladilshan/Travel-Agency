import React from 'react';
import StaffSideBar from '../../Components/staff/StaffSideBar';

const GuidePayment = () => {
    return (
        <div className="flex flex-row">
            <div className="w-[25%]">
                <StaffSideBar activeItem="guidepayment" />
            </div>
            <div className="w-[2px] bg-[#F69412]"></div>
            <div className='bg-[#EFEFEF] w-full overflow-auto h-screen'>
                <div className='bg-[#D9D9D9] flex items-center h-[8%]  pl-5'>
                    <h1 className="text-2xl font-semibold">Guide Payments</h1>
                </div>
                <div className='mb-5 p-4'>
                    <div className='flex-col mt-10 px-5'>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default GuidePayment
