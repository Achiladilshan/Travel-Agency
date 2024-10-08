import React, { useState, useEffect } from 'react';
import AdminNavBar from '../../Components/admin/Navbar';
import instance from '../../api'; // Import the Axios instance for API requests
import { toast, ToastContainer } from 'react-toastify';
import { Button } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import 'daisyui/dist/full.css'; // Ensure DaisyUI is properly imported

const TourPackage = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [errors, setErrors] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const [updateselectedImage, setUpdateSelectedImage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Fetch packages on component mount and when currentPage changes
    useEffect(() => {
        fetchPackages();
    }, [currentPage]);

    // Function to fetch tour packages from the server
    const fetchPackages = async () => {
        try {
            const response = await instance.get('/tourPackages/getAllTourPackages', {
                params: {
                    page: currentPage,
                    limit: 10 // Assuming a limit of 10 users per page
                }
            });
            setPackages(response.data.packages);
            setTotalPages(response.data.totalPages);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch tour packages');
            console.log(error);
            setLoading(false);
        }
    };

    // Function to handle page navigation
    const handlePageChange = (direction) => {
        if (direction === 'next' && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        } else if (direction === 'prev' && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Function to handle "Add" button click
    const handleAddClick = () => {
        setSelectedPackage({
            Name: '',
            Description: '',
            Price: '',
            Itinerary: '',
            NoOfDates: ''
        });
        setSelectedImage(null);
        setErrors({});
        setShowAddModal(true);
    };

    // Function to handle image selection
    const handleImageChange = (event) => {
        const imageFile = event.target.files[0];
        setSelectedImage(imageFile);
    };

    // Function to handle "Update" button click
    const handleUpdateClick = (pkg) => {
        setSelectedPackage(pkg);
        setUpdateSelectedImage(pkg.Photo); 
        setSelectedImage(null);
        setErrors({});
        setShowUpdateModal(true);
    };

    // Function to handle "Delete" button click
    const handleDeleteClick = (pkg) => {
        setSelectedPackage(pkg);
        setShowDeleteModal(true);
    };

    // Function to validate add form inputs
    const validateInputs = () => {
        let formErrors = {};
        if (!selectedPackage.Name) formErrors.Name = 'Name is required';
        if (!selectedPackage.Description) formErrors.Description = 'Description is required';
        if (!selectedPackage.Price || selectedPackage.Price <= 0) formErrors.Price = 'Price must be a positive number';
        if (!selectedPackage.Itinerary) formErrors.Itinerary = 'Itinerary is required';
        if (!selectedPackage.NoOfDates || selectedPackage.NoOfDates <= 0) formErrors.NoOfDates = 'No. of Days must be a positive number';

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0; // Return true if there are no validation errors
    };

    // Function to handle adding a new package
    const handleAddPackage = async () => {
        if (!validateInputs()) return;
        try {
            if (selectedImage != null) {
                const formData = new FormData();
                formData.append('image', selectedImage);
                formData.append('Name', selectedPackage.Name);
                formData.append('Description', selectedPackage.Description);
                formData.append('Price', selectedPackage.Price);
                formData.append('Itinerary', selectedPackage.Itinerary);
                formData.append('NoOfDates', selectedPackage.NoOfDates);

                await instance.post('/tourPackages/addTourPackage', formData);
                toast.success('Tour package added successfully');
                setShowAddModal(false);
                fetchPackages();
            }
            else {
                throw new Error('Select an Image to Upload');
            }
        } catch (error) {
            if (error.message === 'Select an Image to Upload') {
                toast.error('Please select an Image to upload');
            } else {
                toast.error('Failed to add tour package');
            }
            console.log(error);
        }
    };

    // Function to handle updating a package
    const handleUpdatePackage = async () => {
        if (!validateInputs()) return;
        try {
            const formData = new FormData();
            // Check if a new image is selected
            if (selectedImage) {
                formData.append('image', selectedImage);
            } else {
                // If no new image is selected, append the current image URL as a string
                formData.append('imageUrl', updateselectedImage);
            }

            formData.append('Name', selectedPackage.Name);
            formData.append('Description', selectedPackage.Description);
            formData.append('Price', selectedPackage.Price);
            formData.append('Itinerary', selectedPackage.Itinerary);
            formData.append('NoOfDates', selectedPackage.NoOfDates);

            await instance.put(`/tourPackages/updateTourPackage/${selectedPackage.PackageID}`, formData);
            toast.success('Tour package updated successfully');
            setShowUpdateModal(false);
            fetchPackages();
        } catch (error) {
            toast.error('Failed to update tour package');
            console.log(error);
        }
    };

    // Function to handle deleting a package
    const handleDeletePackage = async () => {
        try {
            await instance.delete(`/tourPackages/deleteTourPackage/${selectedPackage.PackageID}`);
            toast.success('Tour package deleted successfully');
            setShowDeleteModal(false);
            fetchPackages();
        } catch (error) {
            toast.error('Failed to delete tour package');
            console.log(error);
        }
    };

    // Function to handle input changes in the form fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let newValue = value; // Initialize the new value

        // Validation rules based on input name
        switch (name) {
            case 'Name':
                // Allow only alphabets, numbers, and spaces
                newValue = value.replace(/[^A-Za-z0-9 ]/g, '').substring(0, 30);
                break;
            case 'Price':
                // Allow only numbers and ensure maximum 9 digits, exclude full stop
                newValue = value.replace(/[^0-9]/g, '').slice(0, 9);
                break;
            case 'NoOfDates':
                // Allow only numbers and ensure maximum 2 digits
                newValue = value.replace(/\D/g, '').slice(0, 2);
                break;
            default:
                break;
        }

        // Update the selectedPackage state with the new value
        setSelectedPackage({ ...selectedPackage, [name]: newValue });
    };

    // Render loading message while data is being fetched
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <ToastContainer />
            <div className='flex flex-row'>
                <div className="w-[25%]">
                    <AdminNavBar activeItem={"tourpackage"} />
                </div>
                <div className="w-[2px] bg-[#F69412]"></div>
                <div className='bg-[#EFEFEF] w-full overflow-auto h-screen'>
                    <div className='bg-[#D9D9D9] flex items-center h-[8%] pl-5'>
                        <h1 className="text-2xl font-semibold">Tour Package Management</h1>
                    </div>
                    <div className='mb-5 p-4'>
                        <button className="btn btn-primary mb-4" onClick={handleAddClick}>Add Tour Package</button>
                        <div className="">
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Price</th>
                                        <th>No. of Days</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {packages.map(pkg => (
                                        <tr key={pkg.PackageID}>
                                            <td>{pkg.PackageID}</td>
                                            <td>{pkg.Name}</td>
                                            <td>$ {pkg.Price}</td>
                                            <td>{pkg.NoOfDates}</td>
                                            <td>
                                                <button className="btn mr-3" style={{ backgroundColor: '#c79500', color: '#fff' }} onClick={() => handleUpdateClick(pkg)}>Update</button>
                                                <button className="btn" style={{ backgroundColor: '#730000', color: '#fff' }} onClick={() => handleDeleteClick(pkg)}>Delete</button>
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

                    {/* Add Package Modal */}
                    {showAddModal && (
                        <div className="modal modal-open">
                            <div className="modal-box">
                                <h2 className="font-bold text-lg">Add Tour Package</h2>
                                <div className="form-control">
                                    <label className="label">Name</label>
                                    <input type="text" name="Name" value={selectedPackage.Name} onChange={handleInputChange} className="input input-bordered" />
                                    {errors.Name && <p className="text-red-500">{errors.Name}</p>}
                                </div>
                                <div className="form-control">
                                    <label className="label">Description</label>
                                    <textarea rows={3} name="Description" value={selectedPackage.Description} onChange={handleInputChange} className="textarea textarea-bordered" />
                                    {errors.Description && <p className="text-red-500">{errors.Description}</p>}
                                </div>
                                <div className="form-control grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Price ($)</label>
                                        <input type="number" name="Price" value={selectedPackage.Price} onChange={handleInputChange} className="input input-bordered" />
                                        {errors.Price && <p className="text-red-500">{errors.Price}</p>}
                                    </div>
                                    <div>
                                        <label className="label">No. of Days</label>
                                        <input type="number" name="NoOfDates" value={selectedPackage.NoOfDates} onChange={handleInputChange} className="input input-bordered" />
                                        {errors.NoOfDates && <p className="text-red-500">{errors.NoOfDates}</p>}
                                    </div>
                                </div>
                                <div className="form-control">
                                    <label className="label">Itinerary</label>
                                    <textarea rows={6} name="Itinerary" value={selectedPackage.Itinerary} onChange={handleInputChange} className="textarea textarea-bordered" />
                                    {errors.Itinerary && <p className="text-red-500">{errors.Itinerary}</p>}
                                </div>
                                <div className='mt-4'>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }} // Hide the default file input UI
                                        id="imageInput"
                                    />
                                    <label htmlFor="imageInput">
                                        <Button variant="outlined" component="span">Choose Photo</Button>
                                    </label>
                                    {selectedImage && (
                                        <div>
                                            <p>Selected Image:</p>
                                            <img src={URL.createObjectURL(selectedImage)} alt="Selected" style={{ maxWidth: '200px' }} />
                                        </div>
                                    )}
                                </div>
                                <div className="modal-action">
                                    <button className="btn btn-primary" onClick={handleAddPackage}>Save</button>
                                    <button className="btn" onClick={() => setShowAddModal(false)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Update Package Modal */}
                    {showUpdateModal && (
                        <div className="modal modal-open">
                            <div className="modal-box">
                                <h2 className="font-bold text-lg">Update Tour Package</h2>
                                <div className="form-control">
                                    <label className="label">Name</label>
                                    <input type="text" name="Name" value={selectedPackage.Name} onChange={handleInputChange} className="input input-bordered" />
                                    {errors.Name && <p className="text-red-500">{errors.Name}</p>}
                                </div>
                                <div className="form-control">
                                    <label className="label">Description</label>
                                    <textarea rows={3} name="Description" value={selectedPackage.Description} onChange={handleInputChange} className="textarea textarea-bordered" />
                                    {errors.Description && <p className="text-red-500">{errors.Description}</p>}
                                </div>
                                <div className="form-control grid grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label">Price ($)</label>
                                        <input type="number" name="Price" value={selectedPackage.Price} onChange={handleInputChange} className="input input-bordered" />
                                        {errors.Price && <p className="text-red-500">{errors.Price}</p>}
                                    </div>
                                    <div className="form-control">
                                        <label className="label">No. of Days</label>
                                        <input type="number" name="NoOfDates" value={selectedPackage.NoOfDates} onChange={handleInputChange} className="input input-bordered" />
                                        {errors.NoOfDates && <p className="text-red-500">{errors.NoOfDates}</p>}
                                    </div>
                                </div>
                                <div className="form-control">
                                    <label className="label">Itinerary</label>
                                    <textarea rows={6} name="Itinerary" value={selectedPackage.Itinerary} onChange={handleInputChange} className="textarea textarea-bordered" />
                                    {errors.Itinerary && <p className="text-red-500">{errors.Itinerary}</p>}
                                </div>
                                <div className='mt-4'>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }} // Hide the default file input UI
                                        id="imageInput"
                                    />
                                    <label htmlFor="imageInput">
                                        <Button variant="outlined" component="span">Choose Photo</Button>
                                    </label>
                                    {selectedImage && (
                                        <div>
                                            <p>Selected Image:</p>
                                            <img src={URL.createObjectURL(selectedImage)} alt="Selected" style={{ maxWidth: '200px' }} />
                                        </div>
                                    )}
                                    {!selectedImage && (
                                        <div>
                                            <p>Selected Image:</p>
                                            <img src={updateselectedImage} alt="Selected" style={{ maxWidth: '200px' }} />
                                        </div>
                                    )}
                                </div>
                                <div className="modal-action">
                                    <button className="btn btn-primary" onClick={handleUpdatePackage}>Save</button>
                                    <button className="btn" onClick={() => setShowUpdateModal(false)}>Cancel</button>
                                </div>

                            </div>
                        </div>
                    )}

                    {/* Delete Package Modal */}
                    {showDeleteModal && (
                        <div className="modal modal-open">
                            <div className="modal-box">
                                <h2 className="font-bold text-lg">Delete Tour Package</h2>
                                <p>Are you sure you want to delete this tour package?</p>
                                <div className="modal-action">
                                    <button className="btn " style={{ backgroundColor: '#730000', color: '#fff' }} onClick={handleDeletePackage}>Delete</button>
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

export default TourPackage;

