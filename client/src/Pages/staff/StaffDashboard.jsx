import React from 'react';
import StaffSideBar from '../../Components/staff/StaffSideBar';

const StaffDashboard = () => {
    return (
        <div className='flex flex-row'>
            <StaffSideBar/>
            <div className='w-full'>
                <h1 className='text-3xl text-center m-5 font-bold'>Staff Dashboard</h1>
            </div>
        </div>
    );
};

export default StaffDashboard;