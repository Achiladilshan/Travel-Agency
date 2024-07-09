import React, { useEffect, useState } from 'react';
import Navbar from '../../Components/admin/Navbar';
import instance from '../../api'; // Import the Axios instance for API requests
import CustomDatePicker from '../../Components/CustomDatePicker'; // Import your custom date picker component
import { Formik, Field, Form } from 'formik';

const ViewGuidesAdmin = () => {
    const [guides, setGuides] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredGuides, setFilteredGuides] = useState([]);
    const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

    // Fetch guides when the component mounts
    useEffect(() => {
        fetchGuides();
    }, []);

    // Filter guides whenever search term or date range changes
    useEffect(() => {
        filterGuides();
    }, [searchTerm, dateRange]);

    // Function to fetch guides from the API
    const fetchGuides = async () => {
        try {
            const response = await instance.get('user/getAllGuides');
            setGuides(response.data);
            setFilteredGuides(response.data);
        } catch (error) {
            console.error('Error fetching guides:', error);
        }
    };

    // Handle search input change
    const handleSearch = (event) => {
        const value = event.target.value;
        const regex = /^[a-zA-Z0-9]*$/; // Regex to allow only alphabets and numbers
        if (regex.test(value)) {
            setSearchTerm(value);
        }
    };
    

    // Handle date range form submission
    const handleDateSubmit = (values) => {
        setDateRange(values);
        filterGuides(); // Filter guides based on the new date range
    };

    // Function to filter guides based on search term and date range
    const filterGuides = () => {
        const filtered = guides.filter(guide => {
            const searchTermLower = searchTerm.toLowerCase();
            const matchesName = guide.FirstName && guide.FirstName.toLowerCase().includes(searchTermLower);
            const matchesID = guide.GuideID && guide.GuideID.toString().toLowerCase().includes(searchTermLower);
            const matchesDateRange = dateRange.startDate && dateRange.endDate ?
                (new Date(guide.StartDate) <= new Date(dateRange.startDate) && new Date(dateRange.endDate) <= new Date(guide.EndDate)) :
                true; // Check if the guide's date range matches the selected date range
            return matchesDateRange && (matchesName || matchesID); // Return guides that match both the date range and either name or ID
        });
        setFilteredGuides(filtered);
    };
    
    return (
        <div className="flex flex-row">
            <div className="w-[25%]">
                <Navbar activeItem="guide" />
            </div>
            <div className="w-[2px] bg-[#F69412]"></div>
            <div className='bg-[#EFEFEF] w-full overflow-auto h-screen'>
                <div className='bg-[#D9D9D9] flex items-center h-[8%]  pl-5'>
                    <h1 className="text-2xl font-semibold mb-4">Guides</h1>
                </div>
                <div className='mb-5 p-4'>
                    <Formik
                        initialValues={{ startDate: '', endDate: '' }}
                        onSubmit={handleDateSubmit}
                    >
                        {() => (
                            <Form className="mb-4">
                                <div className="flex space-x-4">
                                    <Field
                                        name="startDate"
                                        component={CustomDatePicker}
                                        placeholderText="Start Date"
                                    />
                                    <Field
                                        name="endDate"
                                        component={CustomDatePicker}
                                        placeholderText="End Date"
                                    />
                                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                                        Set Date Range
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search by Name or Guide ID"
                            value={searchTerm}
                            onChange={handleSearch}
                            className="border border-gray-300 bg-white p-2 rounded-md w-full"
                        />
                    </div>
                    {filteredGuides.length === 0 ? (
                        <p>No guides found.</p>
                    ) : (
                        <table className="min-w-full bg-white border">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border">Guide ID</th>
                                    <th className="py-2 px-4 border">First Name</th>
                                    <th className="py-2 px-4 border">Last Name</th>
                                    <th className="py-2 px-4 border">Email</th>
                                    <th className="py-2 px-4 border">Phone Number</th>
                                    <th className="py-2 px-4 border">Vehicle ID</th>
                                    <th className="py-2 px-4 border">Vehicle Type</th>
                                    <th className="py-2 px-4 border">Vehicle Model</th>
                                    <th className="py-2 px-4 border">Start Date</th>
                                    <th className="py-2 px-4 border">End Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredGuides.map(guide => (
                                    <tr key={guide.UserID}>
                                        <td className="py-2 px-4 border">{guide.GuideID}</td>
                                        <td className="py-2 px-4 border">{guide.FirstName}</td>
                                        <td className="py-2 px-4 border">{guide.LastName}</td>
                                        <td className="py-2 px-4 border">{guide.Email}</td>
                                        <td className="py-2 px-4 border">{guide.PhoneNumber}</td>
                                        <td className="py-2 px-4 border">{guide.VehicleID}</td>
                                        <td className="py-2 px-4 border">{guide.VehicleType}</td>
                                        <td className="py-2 px-4 border">{guide.VehicleModel}</td>
                                        <td className="py-2 px-4 border">{guide.StartDate.split('T')[0]}</td>
                                        <td className="py-2 px-4 border">{guide.EndDate.split('T')[0]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewGuidesAdmin;
