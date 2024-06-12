import React, { useEffect, useState } from 'react';
import StaffSideBar from '../../Components/staff/StaffSideBar';
import instance from '../../api'; // Adjust the path as needed

const ViewHotels = () => {
    const [hotels, setHotels] = useState([]);

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        try {
            const response = await instance.get('/hotel/');
            setHotels(response.data);
        } catch (error) {
            console.error('Error fetching hotels:', error);
        }
    };

    return (
        <div className='flex flex-row'>
            <StaffSideBar activeItem="hotels" />
            <div className='flex-grow p-4'>
                <h1 className="text-2xl font-semibold mb-4">Hotels</h1>
                {hotels.length === 0 ? (
                    <p>No hotels found.</p>
                ) : (
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border">Hotel ID</th>
                                <th className="py-2 px-4 border">Name</th>
                                <th className="py-2 px-4 border">Type</th>
                                <th className="py-2 px-4 border">Phone Number</th>
                                <th className="py-2 px-4 border">Description</th>
                                <th className="py-2 px-4 border">Packages</th>
                                <th className="py-2 px-4 border">Address</th>
                                <th className="py-2 px-4 border">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hotels.map(hotel => (
                                <tr key={hotel.HotelID}>
                                    <td className="py-2 px-4 border">{hotel.HotelID}</td>
                                    <td className="py-2 px-4 border">{hotel.Name}</td>
                                    <td className="py-2 px-4 border">{hotel.HotType}</td>
                                    <td className="py-2 px-4 border">{hotel.PhoneNumber}</td>
                                    <td className="py-2 px-4 border">{hotel.HotDesc}</td>
                                    <td className="py-2 px-4 border">{hotel.Packages}</td>
                                    <td className="py-2 px-4 border">{hotel.Address}</td>
                                    <td className="py-2 px-4 border">{hotel.Email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ViewHotels;
