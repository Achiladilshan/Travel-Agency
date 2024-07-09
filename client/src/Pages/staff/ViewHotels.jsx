import React, { useEffect, useState } from 'react';
import StaffSideBar from '../../Components/staff/StaffSideBar';
import instance from '../../api'; // Import the Axios instance for API requests

const ViewHotels = () => {
    const [hotels, setHotels] = useState([]);
    const [filteredHotels, setFilteredHotels] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch hotels when the component mounts
    useEffect(() => {
        fetchHotels();
    }, []);

    // Filter and paginate hotels whenever search term, hotels list, or current page changes
    useEffect(() => {
        filterAndPaginateHotels();
    }, [searchTerm, hotels, currentPage]);

    // Function to fetch hotels from the API
    const fetchHotels = async () => {
        try {
            const response = await instance.get('/hotel/');
            setHotels(response.data.hotels);
        } catch (error) {
            console.error('Error fetching hotels:', error);
        }
    };

    // Function to filter and paginate the hotels list based on search term and current page
    const filterAndPaginateHotels = () => {
        const filtered = Array.isArray(hotels) ? hotels.filter(hotel =>
            hotel.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (hotel.Address && hotel.Address.toLowerCase().includes(searchTerm.toLowerCase()))
        ) : [];
        
        // Paginate the filtered hotels
        setFilteredHotels(filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
    };
    

    // Handle search input change
    const handleSearchChange = (e) => {
        const value = e.target.value;
        const regex = /^[a-zA-Z]*$/; // Regex to allow only alphabets and numbers
        if (regex.test(value)) {
            setSearchTerm(value);
        }
        setCurrentPage(1); // Reset to first page on new search
    };

    // Handle next page button click
    const handleNextPage = () => {
        if (currentPage < Math.ceil(filteredHotels.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Handle previous page button click
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="flex flex-row">
            <div className="w-[25%]">
                <StaffSideBar activeItem="Inquiry" />
            </div>
            <div className="w-[2px] bg-[#F69412]"></div>
            <div className='bg-[#EFEFEF] w-full overflow-auto h-screen'>
                <div className='bg-[#D9D9D9] flex items-center h-[8%]  pl-5'>
                    <h1 className="text-2xl font-semibold mb-4">Hotels</h1>
                </div>
                <div className='mb-5 p-4'>
                    <input
                        type="text"
                        placeholder="Search by hotel name or location"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="border p-2 bg-white rounded w-full mb-5"
                    />

                    {filteredHotels.length === 0 ? (
                        <p>No hotels found.</p>
                    ) : (
                        <div>
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
                                    {filteredHotels.map(hotel => (
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
                            <div className="flex justify-between items-center mt-4">
                                <button
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span>
                                    Page {currentPage} of {Math.ceil(hotels.length / itemsPerPage)}
                                </span>
                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage === Math.ceil(hotels.length / itemsPerPage)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewHotels;
