import React from 'react';
import AdminNavBar from '../../Components/admin/Navbar';


const PaymentManagement = () => {


    return (
        <>
            <div className='flex flex-row'>
                <div className="w-[25%]">
                    <AdminNavBar activeItem={"payment"} />
                </div>
                <div className="w-[2px] bg-[#F69412]"></div>
                <div className='bg-[#EFEFEF] w-full'>
                    <div className='bg-[#D9D9D9] flex items-center h-[8%]  pl-5'>
                        <h1 className="text-2xl font-semibold">Payments Management</h1>
                    </div>
                    <div className='h-[92%] p-4'>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaymentManagement;
