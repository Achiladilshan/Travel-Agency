import React, { useState, useEffect } from 'react';
import AdminNavBar from '../../Components/admin/Navbar';

import { Bar, Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'daisyui/dist/full.css'; // Ensure DaisyUI is properly imported
import instance from '../../api';

// Register required components with Chart.js
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
    const [userCount, setUserCount] = useState(0);
    const [customerCount, setCustomerCount] = useState(0);
    const [guideCount, setGuideCount] = useState(0);
    const [tourData, setTourData] = useState([]);
    const [revenueData, setRevenueData] = useState([]);

    useEffect(() => {
        fetchCounts();
        fetchTourData();
        fetchRevenueData();
    }, []);

    const fetchCounts = async () => {
        try {
            const userResponse = await instance.get('/user/getUserCount');
            const guideResponse = await instance.get('/user/getGuideCount');
            const customerResponse = await instance.get('/user/getCustomerCount');
            setCustomerCount(customerResponse.data.count || 0);
            setUserCount(userResponse.data.count || 0);
            setGuideCount(guideResponse.data.count || 0);
        } catch (error) {
            console.error('Failed to fetch counts', error);
            toast.error('Failed to fetch counts');
        }
    };

    const fetchTourData = async () => {
        try {
            const response = await instance.get('/tourPackages/getAll');
            setTourData(response.data || []);
        } catch (error) {
            console.error('Failed to fetch tour data', error);
            toast.error('Failed to fetch tour data');
        }
    };

    const fetchRevenueData = async () => {
        try {
            const response = await instance.get('/customerPayment/getAllPayments');
            setRevenueData(response.data || []);
        } catch (error) {
            console.error('Failed to fetch revenue data', error);
            toast.error('Failed to fetch revenue data');
        }
    };

    const tourCount = tourData.length;
    const totalRevenue = revenueData.reduce((sum, payment) => sum + payment.Amount, 0);

    const revenueChartData = {
        labels: revenueData.map(payment => payment.Date),
        datasets: [
            {
                label: 'Revenue',
                data: revenueData.map(payment => payment.Amount),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const userGuideChartData = {
        labels: ['Users', 'Guides'],
        datasets: [
            {
                data: [userCount, guideCount],
                backgroundColor: ['#36A2EB', '#FF6384'],
                hoverBackgroundColor: ['#36A2EB', '#FF6384'],
            },
        ],
    };

    return (
        <>
            <div className='flex flex-row'>
                <div className="w-[25%]">
                    <AdminNavBar activeItem={"dashboard"}/>
                </div>
                <div className="w-[2px] bg-[#F69412]"></div>
                <div className='bg-[#EFEFEF] w-full'>
                    <div className='bg-[#D9D9D9] flex items-center h-[8%]  pl-5'>
                        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
                    </div>
                    <div className='h-[92%] p-8 ml-10'>
                        <div className='grid grid-cols-2 gap-8'>
                            <div className='p-4 bg-gray-600 rounded-lg shadow-md w-96'>
                                <h2 className='text-lg text-white font-semibold mb-2'>Total Users</h2>
                                <p className='text-4xl text-white font-bold'>{userCount}</p>
                            </div>
                            <div className='p-4 bg-gray-600 rounded-lg shadow-md w-96'>
                                <h2 className='text-lg text-white font-semibold mb-2'>Total Guides</h2>
                                <p className='text-4xl text-white font-bold'>{guideCount}</p>
                            </div>
                            <div className='p-4 bg-gray-600 rounded-lg shadow-md w-96'>
                                <h2 className='text-lg text-white font-semibold mb-2'>Total Customers</h2>
                                <p className='text-4xl text-white font-bold'>{customerCount}</p>
                            </div>
                            <div className='p-4 bg-gray-600 rounded-lg shadow-md w-96'>
                                <h2 className='text-lg text-white font-semibold mb-2'>Total Tour Packages</h2>
                                <p className='text-4xl text-white font-bold'>{tourCount}</p>
                            </div>
                            <div className='p-4 bg-gray-600 rounded-lg shadow-md w-96'>
                                <h2 className='text-lg text-white font-semibold mb-2'>Total Revenue</h2>
                                <p className='text-4xl text-white font-bold'>${totalRevenue.toFixed(2)}</p>
                            </div>
                            {/* <div className='p-4 bg-gray-100 rounded-lg shadow-md col-span-2'>
                            <h2 className='text-lg font-semibold mb-2'>Revenue Over Time</h2>
                            <Bar data={revenueData.length ? revenueChartData : {}} />
                        </div>
                        <div className='p-4 bg-gray-100 rounded-lg shadow-md col-span-2'>
                            <h2 className='text-lg font-semibold mb-2'>User and Guide Distribution</h2>
                            <Pie data={userGuideChartData} />
                        </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
