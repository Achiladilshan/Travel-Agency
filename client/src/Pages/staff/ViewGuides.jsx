import React, { useEffect, useState } from 'react';
import StaffSideBar from '../../Components/staff/StaffSideBar';
import instance from '../../api'; // Adjust the path as needed

const ViewGuides = () => {
    const [guides, setGuides] = useState([]);

    useEffect(() => {
        fetchGuides();
    }, []);

    const fetchGuides = async () => {
        try {
            const response = await instance.get('user/getAllGuides');
            setGuides(response.data);
        } catch (error) {
            console.error('Error fetching guides:', error);
        }
    };

    return (
        <div className="flex flex-row">
            <div className="w-[25%]">
                <StaffSideBar activeItem="guides" />
            </div>
            <div className="w-[2px] bg-[#F69412]"></div>
            <div className='bg-[#EFEFEF] w-full overflow-auto h-screen'>
                <div className='bg-[#D9D9D9] flex items-center h-[8%]  pl-5'>
                    <h1 className="text-2xl font-semibold">Guides</h1>
                </div>
                <div className='mb-5 p-4'>
                    <div className='flex-col mt-10 px-5'>
                        {guides.length === 0 ? (
                            <p>No guides found.</p>
                        ) : (
                            <table className="min-w-full bg-white border">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border">User ID</th>
                                        <th className="py-2 px-4 border">First Name</th>
                                        <th className="py-2 px-4 border">Last Name</th>
                                        <th className="py-2 px-4 border">Email</th>
                                        <th className="py-2 px-4 border">Phone Number</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {guides.map(guide => (
                                        <tr key={guide.UserID}>
                                            <td className="py-2 px-4 border">{guide.UserID}</td>
                                            <td className="py-2 px-4 border">{guide.FirstName}</td>
                                            <td className="py-2 px-4 border">{guide.LastName}</td>
                                            <td className="py-2 px-4 border">{guide.Email}</td>
                                            <td className="py-2 px-4 border">{guide.PhoneNumber}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewGuides;
