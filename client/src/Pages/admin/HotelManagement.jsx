import React, { useState, useEffect } from 'react';
import AdminNavBar from '../../Components/admin/Navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'daisyui/dist/full.css'; // Ensure DaisyUI is properly imported
import instance from '../../api'; // Import the Axios instance for API requests

const HotelManagement = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [errors, setErrors] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredHotels, setFilteredHotels] = useState([]);
    const [itemsPerPage, setitemsPerPage] = useState(10);

    // Fetch hotels from the API when component mounts
    useEffect(() => {
        fetchHotels();
    }, []);

    // Fetch hotels function
    const fetchHotels = async () => {
        try {
            const response = await instance.get('/hotel/');
            setHotels(response.data.hotels);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch hotels');
            console.log(error);
            setLoading(false);
        }
    };

    // Filter hotels based on search query whenever searchQuery or hotels array changes
    useEffect(() => {
        filterHotels();
    }, [searchQuery, hotels]);

    // Filter hotels based on search query
    const filterHotels = () => {
        const filtered = hotels.filter(hotel =>
            hotel.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            hotel.Address.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setTotalPages(Math.ceil(filtered.length / itemsPerPage)); // Calculate total pages based on filtered hotels
        setFilteredHotels(filtered); // Update filtered hotels state
    };

    // Handle pagination - move to previous or next page
    const handlePageChange = (direction) => {
        if (direction === 'next' && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        } else if (direction === 'prev' && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Handle input change in search bar
    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset page to 1 when searching
    };

    // Show add hotel modal
    const handleAddClick = () => {
        setSelectedHotel({
            Name: '',
            HotType: '',
            PhoneNumber: '',
            HotDesc: '',
            Packages: '',
            Address: '',
            Email: ''
        });
        setShowAddModal(true);
    };

    // Show update hotel modal for the selected hotel
    const handleUpdateClick = (hotel) => {
        setSelectedHotel(hotel);
        setShowUpdateModal(true);
    };

    // Show delete hotel modal for the selected hotel
    const handleDeleteClick = (hotel) => {
        setSelectedHotel(hotel);
        setShowDeleteModal(true);
    };

    // Validate hotel form inputs
    const validateHotel = (hotel) => {
        let errors = {};

        if (!hotel.Name) {
            errors.name = "Name is required";
        }

        if (!hotel.HotType) {
            errors.hotType = "Type is required";
        }

        if (!hotel.PhoneNumber) {
            errors.phoneNumber = "Phone Number is required";
        } else if (!/^07\d{8}$/.test(hotel.PhoneNumber)) {
            errors.phoneNumber = "Invalid phone number format";
        }

        if (!hotel.HotDesc) {
            errors.hotDesc = "Description is required";
        }

        if (!hotel.Packages) {
            errors.packages = "Packages is required";
        }

        if (!hotel.Address) {
            errors.address = "Address is required";
        }

        if (!hotel.Email) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(hotel.Email)) {
            errors.email = "Invalid email address";
        }

        setErrors(errors); // Update errors state with validation errors
        return Object.keys(errors).length === 0; // Return true if there are no validation errors
    };


    // Handle add hotel operation
    const handleAddHotel = async () => {
        if (!validateHotel(selectedHotel)) return; // Validate hotel form before proceeding
        try {
            await instance.post('/hotel/addHotel', selectedHotel); // Send POST request to add hotel
            toast.success('Hotel added successfully'); 
            setShowAddModal(false); // Hide add hotel modal
            window.location.reload(); // Refresh page to update hotel list
        } catch (error) {
            toast.error('Failed to add hotel');
            console.error(error);
        }
    };

    // Handle update hotel operation
    const handleUpdateHotel = async () => {
        if (!validateHotel(selectedHotel)) return; // Validate hotel form before proceeding
        try {
            await instance.put(`/hotel/updateHotel/${selectedHotel.HotelID}`, selectedHotel);
            toast.success('Hotel updated successfully');
            setShowUpdateModal(false);
            window.location.reload();
        } catch (error) {
            toast.error('Failed to update hotel');
            console.error(error);
        }
    };

    // Handle delete hotel operation
    const handleDeleteHotel = async () => {
        try {
            await instance.delete(`/hotel/deleteHotel/${selectedHotel.HotelID}`);
            toast.success('Hotel deleted successfully');
            setShowDeleteModal(false);
            window.location.reload();
        } catch (error) {
            toast.error('Failed to delete hotel');
            console.error(error);
        }
    };

    // Handle input change for hotel form fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let newValue = value; // Initialize the new value

        // Validation rules based on input name
        switch (name) {
            case 'Name':
                // Allow only alphabets and ensure maximum 15 characters
                newValue = value.replace(/[^A-Za-z\s]/g, '').substring(0, 15);
                break;
            case 'HotType':
                // Allow only numbers, alphabets, and spaces, ensure maximum 15 characters
                newValue = value.replace(/[^A-Za-z0-9\s]/g, '').substring(0, 15);
                break;
            case 'PhoneNumber':
                // Allow only numbers and "+", ensure maximum 15 characters
                newValue = value.replace(/[^0-9+]/g, '').substring(0, 15);
                break;
            case 'HotDesc':
                // Ensure maximum 200 characters
                newValue = value.substring(0, 200);
                break;
            case 'Packages':
                // Ensure maximum 1000 characters
                newValue = value.substring(0, 1000);
                break;
            case 'Address':
                // Ensure maximum 50 characters
                newValue = value.substring(0, 50);
                break;
            case 'Email':
                // Ensure maximum 100 characters
                newValue = value.substring(0, 100);
                break;
            default:
                break;
        }

        // Update the selectedHotel state with the new value
        setSelectedHotel({ ...selectedHotel, [name]: newValue });
    };

    // Render loading message while data is being fetched
    if (loading) {
        return <div>Loading...</div>;
    }

    // Calculate indexes for current page items in pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currenthotels = filteredHotels.slice(indexOfFirstItem, indexOfLastItem)


    return (
        <>
            <ToastContainer />
            <div className='flex flex-row'>
                <div className="w-[25%]">
                    <AdminNavBar activeItem={"hotel"} />
                </div>
                <div className="w-[2px] bg-[#F69412]"></div>
                <div className='bg-[#EFEFEF] w-full overflow-auto h-screen'>
                    <div className='bg-[#D9D9D9] flex items-center h-[8%]  pl-5'>
                        <h1 className="text-2xl font-semibold">Hotel Management</h1>
                    </div>
                    <div className='mb-5 p-4'>
                        <button className="btn btn-primary mb-4" onClick={handleAddClick}>Add Hotel</button>
                        <div className="flex mb-4">
                            <input
                                type="text"
                                placeholder="Search by name or address"
                                value={searchQuery}
                                onChange={handleSearchInputChange}
                                className="input input-bordered mr-2 w-[22%]"
                            />
                            <button className="btn" onClick={() => setSearchQuery('')}>Clear</button>
                        </div>
                        <div className="">
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th>Phone Number</th>
                                        <th>Description</th>
                                        <th>Packages</th>
                                        <th>Address</th>
                                        <th>Email</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currenthotels.map(hotel => (
                                        <tr key={hotel.HotelID}>
                                            <td>{hotel.HotelID}</td>
                                            <td>{hotel.Name}</td>
                                            <td>{hotel.HotType}</td>
                                            <td>{hotel.PhoneNumber}</td>
                                            <td>{hotel.HotDesc}</td>
                                            <td>{hotel.Packages}</td>
                                            <td>{hotel.Address}</td>
                                            <td>{hotel.Email}</td>
                                            <td>
                                                <button className="btn mr-3" style={{ backgroundColor: '#c79500', color: '#fff' }} onClick={() => handleUpdateClick(hotel)}>Update</button>
                                                <button className="btn" style={{ backgroundColor: '#730000', color: '#fff' }} onClick={() => handleDeleteClick(hotel)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="flex justify-between items-center mt-4 ">
                                <button
                                    className='btn'
                                    onClick={() => handlePageChange('prev')}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                                <span>Page {currentPage} of {totalPages}</span>
                                <button
                                    className='btn'
                                    onClick={() => handlePageChange('next')}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Add Hotel Modal */}
                    {showAddModal && (
                        <div className="modal modal-open">
                            <div className="modal-box">
                                <h2 className="font-bold text-lg">Add Hotel</h2>
                                <div className="form-control">
                                    <label className="label">Name</label>
                                    <input
                                        type="text"
                                        name="Name"
                                        value={selectedHotel.Name}
                                        onChange={handleInputChange}
                                        className="input input-bordered"
                                    />
                                    {errors.name && <p className="text-red-500">{errors.name}</p>}
                                </div>

                                <div className="form-control">
                                    <label className="label">Type</label>
                                    <input
                                        type="text"
                                        name="HotType"
                                        value={selectedHotel.HotType}
                                        onChange={handleInputChange}
                                        className="input input-bordered"
                                    />
                                    {errors.hotType && <p className="text-red-500">{errors.hotType}</p>}
                                </div>

                                <div className="form-control">
                                    <label className="label">Phone Number</label>
                                    <input
                                        type="text"
                                        name="PhoneNumber"
                                        value={selectedHotel.PhoneNumber}
                                        onChange={handleInputChange}
                                        className="input input-bordered"
                                    />
                                    {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber}</p>}
                                </div>

                                <div className="form-control">
                                    <label className="label">Description</label>
                                    <input
                                        type="text"
                                        name="HotDesc"
                                        value={selectedHotel.HotDesc}
                                        onChange={handleInputChange}
                                        className="input input-bordered"
                                    />
                                    {errors.hotDesc && <p className="text-red-500">{errors.hotDesc}</p>}
                                </div>

                                <div className="form-control">
                                    <label className="label">Packages</label>
                                    <input
                                        type="text"
                                        name="Packages"
                                        value={selectedHotel.Packages}
                                        onChange={handleInputChange}
                                        className="input input-bordered"
                                    />
                                    {errors.packages && <p className="text-red-500">{errors.packages}</p>}
                                </div>

                                <div className="form-control">
                                    <label className="label">Address</label>
                                    <input
                                        type="text"
                                        name="Address"
                                        value={selectedHotel.Address}
                                        onChange={handleInputChange}
                                        className="input input-bordered"
                                    />
                                    {errors.address && <p className="text-red-500">{errors.address}</p>}
                                </div>

                                <div className="form-control">
                                    <label className="label">Email</label>
                                    <input
                                        type="email"
                                        name="Email"
                                        value={selectedHotel.Email}
                                        onChange={handleInputChange}
                                        className="input input-bordered"
                                    />
                                    {errors.email && <p className="text-red-500">{errors.email}</p>}
                                </div>

                                <div className="modal-action">
                                    <button className="btn btn-primary" onClick={handleAddHotel}>Save</button>
                                    <button className="btn" onClick={() => setShowAddModal(false)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Update Hotel Modal */}
                    {showUpdateModal && (
                        <div className="modal modal-open">
                            <div className="modal-box">
                                <h2 className="font-bold text-lg">Update Hotel</h2>
                                <div className="form-control">
                                    <label className="label">Name</label>
                                    <input
                                        type="text"
                                        name="Name"
                                        value={selectedHotel.Name}
                                        onChange={handleInputChange}
                                        className="input input-bordered"
                                    />
                                    {errors.name && <p className="text-red-500">{errors.name}</p>}
                                </div>

                                <div className="form-control">
                                    <label className="label">Type</label>
                                    <input
                                        type="text"
                                        name="HotType"
                                        value={selectedHotel.HotType}
                                        onChange={handleInputChange}
                                        className="input input-bordered"
                                    />
                                    {errors.hotType && <p className="text-red-500">{errors.hotType}</p>}
                                </div>

                                <div className="form-control">
                                    <label className="label">Phone Number</label>
                                    <input
                                        type="text"
                                        name="PhoneNumber"
                                        value={selectedHotel.PhoneNumber}
                                        onChange={handleInputChange}
                                        className="input input-bordered"
                                    />
                                    {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber}</p>}
                                </div>

                                <div className="form-control">
                                    <label className="label">Description</label>
                                    <input
                                        type="text"
                                        name="HotDesc"
                                        value={selectedHotel.HotDesc}
                                        onChange={handleInputChange}
                                        className="input input-bordered"
                                    />
                                    {errors.hotDesc && <p className="text-red-500">{errors.hotDesc}</p>}
                                </div>

                                <div className="form-control">
                                    <label className="label">Packages</label>
                                    <input
                                        type="text"
                                        name="Packages"
                                        value={selectedHotel.Packages}
                                        onChange={handleInputChange}
                                        className="input input-bordered"
                                    />
                                    {errors.packages && <p className="text-red-500">{errors.packages}</p>}
                                </div>

                                <div className="form-control">
                                    <label className="label">Address</label>
                                    <input
                                        type="text"
                                        name="Address"
                                        value={selectedHotel.Address}
                                        onChange={handleInputChange}
                                        className="input input-bordered"
                                    />
                                    {errors.address && <p className="text-red-500">{errors.address}</p>}
                                </div>

                                <div className="form-control">
                                    <label className="label">Email</label>
                                    <input
                                        type="email"
                                        name="Email"
                                        value={selectedHotel.Email}
                                        onChange={handleInputChange}
                                        className="input input-bordered"
                                    />
                                    {errors.email && <p className="text-red-500">{errors.email}</p>}
                                </div>

                                <div className="modal-action">
                                    <button className="btn btn-primary" onClick={handleUpdateHotel}>Save</button>
                                    <button className="btn" onClick={() => setShowUpdateModal(false)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Delete Hotel Modal */}
                    {showDeleteModal && (
                        <div className="modal modal-open">
                            <div className="modal-box">
                                <h2 className="font-bold text-lg">Delete Hotel</h2>
                                <p>Are you sure you want to delete this hotel?</p>
                                <div className="modal-action">
                                    <button className="btn " style={{ backgroundColor: '#730000', color: '#fff' }} onClick={handleDeleteHotel}>Delete</button>
                                    <button className="btn" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default HotelManagement;
