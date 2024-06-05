import React, { useState, useEffect } from 'react';
import AdminNavBar from '../../Components/admin/Navbar';
import instance from '../../api';
import { toast, ToastContainer } from 'react-toastify';
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

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const response = await instance.get('/tourPackages/getAllTourPackages');
            setPackages(response.data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch tour packages');
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        setSelectedPackage({
            Name: '',
            Description: '',
            Price: '',
            Itinerary: '',
            NoOfDates: ''
        });
        setErrors({});
        setShowAddModal(true);
    };

    const handleUpdateClick = (pkg) => {
        setSelectedPackage(pkg);
        setErrors({});
        setShowUpdateModal(true);
    };

    const handleDeleteClick = (pkg) => {
        setSelectedPackage(pkg);
        setShowDeleteModal(true);
    };

    const validateInputs = () => {
        let formErrors = {};
        if (!selectedPackage.Name) formErrors.Name = 'Name is required';
        if (!selectedPackage.Description) formErrors.Description = 'Description is required';
        if (!selectedPackage.Price || selectedPackage.Price <= 0) formErrors.Price = 'Price must be a positive number';
        if (!selectedPackage.Itinerary) formErrors.Itinerary = 'Itinerary is required';
        if (!selectedPackage.NoOfDates || selectedPackage.NoOfDates <= 0) formErrors.NoOfDates = 'No. of Days must be a positive number';

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleAddPackage = async () => {
        if (!validateInputs()) return;
        try {
            await instance.post('/tourPackages/addTourPackage', selectedPackage);
            toast.success('Tour package added successfully');
            setShowAddModal(false);
            fetchPackages();
        } catch (error) {
            toast.error('Failed to add tour package');
        }
    };

    const handleUpdatePackage = async () => {
        if (!validateInputs()) return;
        try {
            await instance.put(`/tourPackages/updateTourPackage/${selectedPackage.PackageID}`, selectedPackage);
            toast.success('Tour package updated successfully');
            setShowUpdateModal(false);
            fetchPackages();
        } catch (error) {
            toast.error('Failed to update tour package');
        }
    };

    const handleDeletePackage = async () => {
        try {
            await instance.delete(`/tourPackages/deleteTourPackage/${selectedPackage.PackageID}`);
            toast.success('Tour package deleted successfully');
            setShowDeleteModal(false);
            fetchPackages();
        } catch (error) {
            toast.error('Failed to delete tour package');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedPackage({ ...selectedPackage, [name]: value });
    };

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
                <div className='bg-[#EFEFEF] w-full'>
                    <div className='bg-[#D9D9D9] flex items-center h-[8%] pl-5'>
                        <h1 className="text-2xl font-semibold">Tour Package Management</h1>
                    </div>
                    <div className='h-[92%] p-4'>
                        <button className="btn btn-primary mb-4" onClick={handleAddClick}>Add Tour Package</button>
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th>Price</th>
                                        <th>Itinerary</th>
                                        <th>No. of Days</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {packages.map(pkg => (
                                        <tr key={pkg.PackageID}>
                                            <td>{pkg.PackageID}</td>
                                            <td>{pkg.Name}</td>
                                            <td>{pkg.Description}</td>
                                            <td>{pkg.Price}</td>
                                            <td>{pkg.Itinerary}</td>
                                            <td>{pkg.NoOfDates}</td>
                                            <td>
                                                <button className="btn btn-primary mr-2" onClick={() => handleUpdateClick(pkg)}>Update</button>
                                                <button className="btn btn-danger" onClick={() => handleDeleteClick(pkg)}>Delete</button>
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
                                <h2 className="font-bold text-lg">Add Tour Package</h2>
                                <div className="form-control">
                                    <label className="label">Name</label>
                                    <input type="text" name="Name" value={selectedPackage.Name} onChange={handleInputChange} className="input input-bordered" />
                                    {errors.Name && <p className="text-red-500">{errors.Name}</p>}
                                </div>
                                <div className="form-control">
                                    <label className="label">Description</label>
                                    <textarea rows={4} name="Description" value={selectedPackage.Description} onChange={handleInputChange} className="textarea textarea-bordered" />
                                    {errors.Description && <p className="text-red-500">{errors.Description}</p>}
                                </div>
                                <div className="form-control grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Price</label>
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
                                    <textarea rows={4} name="Itinerary" value={selectedPackage.Itinerary} onChange={handleInputChange} className="textarea textarea-bordered" />
                                    {errors.Itinerary && <p className="text-red-500">{errors.Itinerary}</p>}
                                </div>
                                <div className="modal-action">
                                    <button className="btn btn-primary" onClick={handleAddPackage}>Save</button>
                                    <button className="btn" onClick={() => setShowAddModal(false)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Update Modal */}
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
                                    <textarea rows={4} name="Description" value={selectedPackage.Description} onChange={handleInputChange} className="textarea textarea-bordered" />
                                    {errors.Description && <p className="text-red-500">{errors.Description}</p>}
                                </div>
                                <div className="form-control grid grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">Price</label>
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
                                    <textarea rows={4} name="Itinerary" value={selectedPackage.Itinerary} onChange={handleInputChange} className="textarea textarea-bordered" />
                                    {errors.Itinerary && <p className="text-red-500">{errors.Itinerary}</p>}
                                </div>
                                <div className="modal-action">
                                    <button className="btn btn-primary" onClick={handleUpdatePackage}>Save</button>
                                    <button className="btn" onClick={() => setShowUpdateModal(false)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Delete Modal */}
                    {showDeleteModal && (
                        <div className="modal modal-open">
                            <div className="modal-box">
                                <h2 className="font-bold text-lg">Delete Tour Package</h2>
                                <p>Are you sure you want to delete this tour package?</p>
                                <div className="modal-action">
                                    <button className="btn btn-danger" onClick={handleDeletePackage}>Delete</button>
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

