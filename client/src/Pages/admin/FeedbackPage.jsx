import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import instance from '../../api'; // Import the Axios instance for API requests
import AdminNavBar from '../../Components/admin/Navbar';

const FeedbackPage = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch feedbacks when the component mounts
    useEffect(() => {
        fetchFeedbacks();
    }, []);

    // Function to fetch all feedbacks from the API
    const fetchFeedbacks = async () => {
        try {
            const response = await instance.get('/feedback/getAllFeedback');
            setFeedbacks(response.data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch feedbacks');
            setLoading(false);
        }
    };

    // Display loading indicator while fetching data
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <ToastContainer />
            <div className='flex flex-row'>
                <div className="w-[25%]">
                    <AdminNavBar activeItem={"feedback"} />
                </div>
                <div className="w-[2px] bg-[#F69412]"></div>
                <div className='bg-[#EFEFEF] w-full'>
                    <div className='bg-[#D9D9D9] flex items-center h-[8%]  pl-5'>
                        <h1 className="text-2xl font-semibold">Feedbacks</h1>
                    </div>
                    <div className='h-[92%] p-4'>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead className="bg-gray-800 text-white">
                                    <tr>
                                        <th className="w-1/12 py-2">ID</th>
                                        <th className="w-1/12 py-2">Trip ID</th>
                                        <th className="w-1/12 py-2">Rating</th>
                                        <th className="w-2/7 py-2">Remarks</th>
                                        <th className="w-2/7 py-2">Highlights</th>
                                        <th className="w-2/7 py-2">Low Points</th>
                                        <th className="w-1/10 py-2">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {feedbacks.map(feedback => (
                                        <tr key={feedback.FeedbackID} className="text-center border-b">
                                            <td className="py-2">{feedback.FeedbackID}</td>
                                            <td className="py-2">{feedback.TripID}</td>
                                            <td className="py-2">{feedback.Rating}</td>
                                            <td className="py-2">{feedback.Remarks}</td>
                                            <td className="py-2">{feedback.Highlights}</td>
                                            <td className="py-2">{feedback.LowPoints}</td>
                                            <td className="py-2">{feedback.Date.split('T')[0]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};

export default FeedbackPage;
