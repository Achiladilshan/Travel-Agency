import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminSideBar from '../../Components/admin/AdminSideBar';
import instance from '../../api';
import AdminNavBar from '../../Components/admin/Navbar';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [newUser, setNewUser] = useState({
        FirstName: '',
        LastName: '',
        Email: '',
        PhoneNumber: '',
        Password: '',
        Role: 'Customer',
        Country: '',
        VehicleID: '',
        Languages: '',
        GuiType: '',
        Qualifications: ''
    });
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchUsers();
        fetchVehicles();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await instance.get('/user/');
            setUsers(response.data);
        } catch (error) {
            toast.error('Failed to fetch users');
        }
    };

    const fetchVehicles = async () => {
        try {
            const response = await instance.get('/vehicle/');
            setVehicles(response.data);
        } catch (error) {
            toast.error('Failed to fetch vehicles');
        }
    };

    const handleDelete = async (UserId) => {
        try {
            await instance.delete(`/user/deleteUser/${UserId}`);
            toast.success('User deleted successfully');
            fetchUsers();
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            if (newUser.Role === 'Customer') {
                await instance.post('user/registerCustomer', newUser);
            } else if (newUser.Role === 'Guide') {
                await instance.post('user/registerGuide', newUser);
            } else if (newUser.Role === 'Staff') {
                await instance.post('user/registerStaff', newUser);
            }
            toast.success('User registered successfully');
            setShowModal(false);
            fetchUsers();
        } catch (error) {
            toast.error('Failed to register user');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUser({
            ...newUser,
            [name]: value
        });
    };

    return (
        <>
            <div className='flex flex-row'>
                <div className="w-[25%]">
                    <AdminNavBar activeItem={"chat"} />
                </div>
                <div className="w-[2px] bg-[#F69412]"></div>
                <div className='bg-[#EFEFEF] w-full'>
                    <div className='bg-[#D9D9D9] flex items-center h-[8%]  pl-5'>
                        <h1 className="text-2xl font-semibold">User Management</h1>
                    </div>
                    <div className='h-[92%] p-4'>
                        <button className='btn btn-primary mb-4' onClick={() => setShowModal(true)}>Add User</button>
                        <table className='table w-full'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.UserID}>
                                        <td>{user.UserID}</td>
                                        <td>{user.FirstName}</td>
                                        <td>{user.LastName}</td>
                                        <td>{user.Email}</td>
                                        <td>{user.PhoneNumber}</td>
                                        <td>{user.Role}</td>
                                        <td>
                                            <button className='btn btn-danger' onClick={() => handleDelete(user.UserID)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className='fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 w-full modal modal-open'>
                    <div className='bg-white p-4 rounded-lg w-96 modal-box'>
                        <h3 className='font-bold text-lg'>Register New User</h3>
                        <form onSubmit={handleRegister}>
                            <input type='text' name='FirstName' value={newUser.FirstName} onChange={handleChange} placeholder='First Name' className='input input-bordered w-full mb-4' required />
                            <input type='text' name='LastName' value={newUser.LastName} onChange={handleChange} placeholder='Last Name' className='input input-bordered w-full mb-4' required />
                            <input type='email' name='Email' value={newUser.Email} onChange={handleChange} placeholder='Email' className='input input-bordered w-full mb-4' required />
                            <input type='text' name='PhoneNumber' value={newUser.PhoneNumber} onChange={handleChange} placeholder='Phone Number' className='input input-bordered w-full mb-4' required />
                            <input type='password' name='Password' value={newUser.Password} onChange={handleChange} placeholder='Password' className='input input-bordered w-full mb-4' required />
                            <select name='Role' value={newUser.Role} onChange={handleChange} className='select select-bordered w-full mb-4'>
                                <option value='Customer'>Customer</option>
                                <option value='Guide'>Guide</option>
                                <option value='Staff'>Staff</option>
                            </select>
                            {newUser.Role === 'Customer' && (
                                <input type='text' name='Country' value={newUser.Country} onChange={handleChange} placeholder='Country' className='input input-bordered w-full mb-4' required />
                            )}
                            {newUser.Role === 'Guide' && (
                                <>
                                    <select name='VehicleID' value={newUser.VehicleID} onChange={handleChange} className='select select-bordered w-full mb-4' required>
                                        <option value=''>Select Vehicle</option>
                                        {vehicles.map(vehicle => (
                                            <option key={vehicle.VehicleID} value={vehicle.VehicleID}>{vehicle.VehicleNumber}</option>
                                        ))}
                                    </select>
                                    <input type='text' name='Languages' value={newUser.Languages} onChange={handleChange} placeholder='Languages' className='input input-bordered w-full mb-4' required />
                                    <input type='text' name='GuiType' value={newUser.GuiType} onChange={handleChange} placeholder='Guide Type' className='input input-bordered w-full mb-4' required />
                                    <input type='text' name='Qualifications' value={newUser.Qualifications} onChange={handleChange} placeholder='Qualifications' className='input input-bordered w-full mb-4' required />
                                </>
                            )}
                            <div className='modal-action'>
                                <button type='button' className='btn btn-secondary' onClick={() => setShowModal(false)}>Cancel</button>
                                <button type='submit' className='btn btn-primary'>Register</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserManagement;
