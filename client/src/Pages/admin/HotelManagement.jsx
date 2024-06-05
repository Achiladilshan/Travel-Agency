import React, { useState, useEffect } from 'react';
import AdminNavBar from '../../Components/admin/Navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'daisyui/dist/full.css'; // Ensure DaisyUI is properly imported
import instance from '../../api'; // Ensure this is the correct path to your axios instance

const HotelManagement = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        try {
            const response = await instance.get('/hotel/');
            setHotels(response.data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch hotels');
            console.log(error);
            setLoading(false);
        }
    };

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

    const handleUpdateClick = (hotel) => {
        setSelectedHotel(hotel);
        setShowUpdateModal(true);
    };

    const handleDeleteClick = (hotel) => {
        setSelectedHotel(hotel);
        setShowDeleteModal(true);
    };

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

        return errors;
    };


    const handleAddHotel = async () => {
        const errors = validateHotel(selectedHotel);
        if (Object.keys(errors).length > 0) {
            // Display error messages
            Object.values(errors).forEach(error => toast.error(error));
            return;
        }

        try {
            await instance.post('/hotel/addHotel', selectedHotel);
            toast.success('Hotel added successfully');
            setShowAddModal(false);
            fetchHotels();
        } catch (error) {
            toast.error('Failed to add hotel');
            console.log(error);
        }
    };

    const handleUpdateHotel = async () => {
        const errors = validateHotel(selectedHotel);
        if (Object.keys(errors).length > 0) {
            // Display error messages
            Object.values(errors).forEach(error => toast.error(error));
            return;
        }

        try {
            await instance.put(`/hotel/updateHotel/${selectedHotel.HotelID}`, selectedHotel);
            toast.success('Hotel updated successfully');
            setShowUpdateModal(false);
            fetchHotels();
        } catch (error) {
            toast.error('Failed to update hotel');
        }
    };



    const handleDeleteHotel = async () => {
        try {
            await instance.delete(`/hotel/deleteHotel/${selectedHotel.HotelID}`);
            toast.success('Hotel deleted successfully');
            setShowDeleteModal(false);
            fetchHotels();
        } catch (error) {
            toast.error('Failed to delete hotel');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedHotel({ ...selectedHotel, [name]: value });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <ToastContainer />
            <div className='flex flex-row'>
                <div className="w-[25%]">
                    <AdminNavBar activeItem={"hotel"} />
                </div>
                <div className="w-[2px] bg-[#F69412]"></div>
                <div className='bg-[#EFEFEF] w-full'>
                    <div className='bg-[#D9D9D9] flex items-center h-[8%]  pl-5'>
                        <h1 className="text-2xl font-semibold">Hotel Management</h1>
                    </div>
                    <div className='h-[92%] p-4'>
                        <button className="btn btn-primary mb-4" onClick={handleAddClick}>Add Hotel</button>
                        <div className="overflow-x-auto">
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
                                    {hotels.map(hotel => (
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
                                                <button className="btn btn-primary mr-2" onClick={() => handleUpdateClick(hotel)}>Update</button>
                                                <button className="btn btn-danger" onClick={() => handleDeleteClick(hotel)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Add Modal */}
                    {showAddModal && (
                        <div className="modal modal-open">
                            <div className="modal-box">
                                <h2 className="font-bold text-lg">Add Hotel</h2>
                                <div className="form-control">
                                    <label className="label">Name</label>
                                    <input type="text" name="Name" value={selectedHotel.Name} onChange={handleInputChange} className="input input-bordered" />
                                </div>
                                <div className="form-control">
                                    <label className="label">Type</label>
                                    <input type="text" name="HotType" value={selectedHotel.HotType} onChange={handleInputChange} className="input input-bordered" />
                                </div>
                                <div className="form-control">
                                    <label className="label">Phone Number</label>
                                    <input type="text" name="PhoneNumber" value={selectedHotel.PhoneNumber} onChange={handleInputChange} className="input input-bordered" />
                                </div>
                                <div className="form-control">
                                    <label className="label">Description</label>
                                    <input type="text" name="HotDesc" value={selectedHotel.HotDesc} onChange={handleInputChange} className="input input-bordered" />
                                </div>
                                <div className="form-control">
                                    <label className="label">Packages</label>
                                    <input type="text" name="Packages" value={selectedHotel.Packages} onChange={handleInputChange} className="input input-bordered" />
                                </div>
                                <div className="form-control">
                                    <label className="label">Address</label>
                                    <input type="text" name="Address" value={selectedHotel.Address} onChange={handleInputChange} className="input input-bordered" />
                                </div>
                                <div className="form-control">
                                    <label className="label">Email</label>
                                    <input type="email" name="Email" value={selectedHotel.Email} onChange={handleInputChange} className="input input-bordered" />
                                </div>
                                <div className="modal-action">
                                    <button className="btn btn-primary" onClick={handleAddHotel}>Save</button>
                                    <button className="btn" onClick={() => setShowAddModal(false)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Update Modal */}
                    {showUpdateModal && (
                        <div className="modal modal-open">
                            <div className="modal-box">
                                <h2 className="font-bold text-lg">Update Hotel</h2>
                                <div className="form-control">
                                    <label className="label">Name</label>
                                    <input type="text" name="Name" value={selectedHotel.Name} onChange={handleInputChange} className="input input-bordered" />
                                </div>
                                <div className="form-control">
                                    <label className="label">Type</label>
                                    <input type="text" name="HotType" value={selectedHotel.HotType} onChange={handleInputChange} className="input input-bordered" />
                                </div>
                                <div className="form-control">
                                    <label className="label">Phone Number</label>
                                    <input type="text" name="PhoneNumber" value={selectedHotel.PhoneNumber} onChange={handleInputChange} className="input input-bordered" />
                                </div>
                                <div className="form-control">
                                    <label className="label">Description</label>
                                    <input type="text" name="HotDesc" value={selectedHotel.HotDesc} onChange={handleInputChange} className="input input-bordered" />
                                </div>
                                <div className="form-control">
                                    <label className="label">Packages</label>
                                    <input type="text" name="Packages" value={selectedHotel.Packages} onChange={handleInputChange} className="input input-bordered" />
                                </div>
                                <div className="form-control">
                                    <label className="label">Address</label>
                                    <input type="text" name="Address" value={selectedHotel.Address} onChange={handleInputChange} className="input input-bordered" />
                                </div>
                                <div className="form-control">
                                    <label className="label">Email</label>
                                    <input type="email" name="Email" value={selectedHotel.Email} onChange={handleInputChange} className="input input-bordered" />
                                </div>
                                <div className="modal-action">
                                    <button className="btn btn-primary" onClick={handleUpdateHotel}>Save</button>
                                    <button className="btn" onClick={() => setShowUpdateModal(false)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Delete Modal */}
                    {showDeleteModal && (
                        <div className="modal modal-open">
                            <div className="modal-box">
                                <h2 className="font-bold text-lg">Delete Hotel</h2>
                                <p>Are you sure you want to delete this hotel?</p>
                                <div className="modal-action">
                                    <button className="btn btn-danger" onClick={handleDeleteHotel}>Delete</button>
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
