import React, { useState, useEffect } from 'react';
import AdminSideBar from '../../Components/admin/AdminSideBar';
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
        setShowAddModal(true);
    };

    const handleUpdateClick = (pkg) => {
        setSelectedPackage(pkg);
        setShowUpdateModal(true);
    };

    const handleDeleteClick = (pkg) => {
        setSelectedPackage(pkg);
        setShowDeleteModal(true);
    };

    const handleAddPackage = async () => {
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
            console.log(error?.message)
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
                <AdminSideBar />
                <div className='bg-white w-full p-4'>
                    <h1 className='text-2xl font-bold mb-4'>Tour Package Management</h1>
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

                    {/* Add Modal */}
                    {showAddModal && (
                        <div className="modal modal-open">
                            <div className="modal-box">
                                <h2 className="font-bold text-lg">Add Tour Package</h2>
                                <div className="form-control">
                                    <label className="label">Name</label>
                                    <input type="text" name="Name" value={selectedPackage.Name} onChange={handleInputChange} className="input input-bordered" />
                                </div>
                                <div className="form-control">
                                    <label className="label">Description</label>
                                    <input type="text" name="Description" value={selectedPackage.Description} onChange={handleInputChange} className="input input-bordered" />
                                </div>
                                <div className="form-control">
                                    <label className="label">Price</label>
                                    <input type="number" name="Price" value={selectedPackage.Price} onChange={handleInputChange} className="input input-bordered" />
                                </div>
                                <div className="form-control">
                                    <label className="label">Itinerary</label>
                                    <input type="text" name="Itinerary" value={selectedPackage.Itinerary} onChange={handleInputChange} className="input input-bordered" />
                                </div>
                                <div className="form-control">
                                    <label className="label">No. of Days</label>
                                    <input type="number" name="NoOfDates" value={selectedPackage.NoOfDates} onChange={handleInputChange} className="input input-bordered" />
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
                                </div>
                                <div className="form-control">
                                    <label className="label">Description</label>
                                    <input type="text" name="Description" value={selectedPackage.Description} onChange={handleInputChange} className="input input-bordered" />
                                </div>
                                <div className="form-control">
                                    <label className="label">Price</label>
                                    <input type="number" name="Price" value={selectedPackage.Price} onChange={handleInputChange} className="input input-bordered" />
                                </div>
                                <div className="form-control">
                                    <label className="label">Itinerary</label>
                                    <input type="text" name="Itinerary" value={selectedPackage.Itinerary} onChange={handleInputChange} className="input input-bordered" />
                                </div>
                                <div className="form-control">
                                    <label className="label">No. of Days</label>
                                    <input type="number" name="NoOfDates" value={selectedPackage.NoOfDates} onChange={handleInputChange} className="input input-bordered" />
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
