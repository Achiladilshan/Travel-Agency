import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import instance from '../../api';
import AdminNavBar from '../../Components/admin/Navbar';
import Swal from 'sweetalert2';
import { TextField } from '@mui/material';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState({});
    const [newUser, setNewUser] = useState({
        FirstName: '',
        LastName: '',
        Email: '',
        PhoneNumber: '',
        Password: '',
        Role: 'Customer',
        Country: '',
        VehicleType: '',
        VehicleMake: '',
        Capacity: '',
        Number: '',
        Description: '',
        Languages: '',
        GuiType: '',
        Qualifications: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await instance.get('/user/');
            setUsers(response.data);
        } catch (error) {
            toast.error('Failed to fetch users');
        }
    };

    const handleDelete = async (UserId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await instance.delete(`/user/deleteUser/${UserId}`);
                toast.success('User deleted successfully');
                fetchUsers();
            } catch (error) {
                toast.error('Failed to delete user');
            }
        }
    };

    const validatePhoneNumber = (phoneNumber) => {
        const phoneRegex = /^07\d{8}$/; // Phone number should start with '07' and followed by 8 digits
        return phoneRegex.test(phoneNumber);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validatePhoneNumber(newUser.PhoneNumber)) {
            toast.error('Invalid phone number');
            return;
        }
        try {
            if (editMode) {
                await instance.put(`/user/updateUser/${newUser.UserID}`, newUser);
                toast.success('User updated successfully');
            } else {
                if (newUser.Role === 'Customer') {
                    await instance.post('user/registerCustomer', newUser);
                } else if (newUser.Role === 'Guide') {
                    await instance.post('user/registerGuide', newUser);
                } else if (newUser.Role === 'Staff') {
                    await instance.post('user/registerStaff', newUser);
                }
                toast.success('User registered successfully');
            }
            setShowModal(false);
            fetchUsers();
        } catch (error) {
            toast.error('Failed to register/update user');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUser({
            ...newUser,
            [name]: value
        });
    };

    const handleEdit = (user) => {
        setNewUser(user);
        setEditMode(true);
        setShowModal(true);
    };

    const resetForm = () => {
        setNewUser({
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
        setEditMode(false);
    };

    return (
        <>
            <ToastContainer />
            <div className='flex flex-row'>
                <div className="w-[25%]">
                    <AdminNavBar activeItem={"user"} />
                </div>
                <div className="w-[2px] bg-[#F69412]"></div>
                <div className='bg-[#EFEFEF] w-full'>
                    <div className='bg-[#D9D9D9] flex items-center h-[8%]  pl-5'>
                        <h1 className="text-2xl font-semibold">User Management</h1>
                    </div>
                    <div className='h-[92%] p-4'>
                        <button
                            className='btn btn-primary mb-4'
                            onClick={() => { resetForm(); setShowModal(true); }}
                        >
                            Add User
                        </button>
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
                                            <button className='btn mr-3' style={{ backgroundColor: '#c79500', color: '#fff' }} onClick={() => handleEdit(user)}> Edit </button>
                                            <button className='btn' style={{ backgroundColor: '#730000', color: '#fff' }} onClick={() => handleDelete(user.UserID)}>Delete</button>
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
                        <h3 className='font-bold text-lg'>{editMode ? 'Edit User' : 'Register New User'}</h3>
                        <form onSubmit={handleRegister}>
                            <input type='text' name='FirstName' value={newUser.FirstName} onChange={handleChange} placeholder='First Name' className='input input-bordered w-full mb-4' required />
                            <input type='text' name='LastName' value={newUser.LastName} onChange={handleChange} placeholder='Last Name' className='input input-bordered w-full mb-4' required />
                            <input type='email' name='Email' value={newUser.Email} onChange={handleChange} placeholder='Email' className='input input-bordered w-full mb-4' required />
                            <input type='text' name='PhoneNumber' value={newUser.PhoneNumber} onChange={handleChange} placeholder='Phone Number' className='input input-bordered w-full mb-4' required />
                            {!editMode && (
                                <input type='password' name='Password' value={newUser.Password} onChange={handleChange} placeholder='Password' className='input input-bordered w-full mb-4' required />
                            )}
                            <select name='Role' value={newUser.Role} onChange={handleChange} className='select select-bordered w-full mb-4'>
                                <option value='Customer'>Customer</option>
                                <option value='Admin'>Admin</option>
                                <option value='Guide'>Guide</option>
                                <option value='Staff'>Staff</option>
                            </select>
                            {newUser.Role === 'Customer' && (
                                <input type='text' name='Country' value={newUser.Country} onChange={handleChange} placeholder='Country' className='input input-bordered w-full mb-4' required />
                            )}
                            {newUser.Role === 'Guide' && (
                                <>

                                    <input type='text' name='Languages' value={newUser.Languages} onChange={handleChange} placeholder='Languages' className='input input-bordered w-full mb-4' required />
                                    <select
                                        name="GuiType"
                                        value={newUser.GuiType || ""}
                                        onChange={handleChange}
                                        className="select select-bordered w-full mb-4"
                                    >
                                        <option value="Chauffeur Guide">Chauffeur Guide</option>
                                        <option value="National Guide">National Guide</option>
                                    </select>
                                    <input type='text' name='Qualifications' value={newUser.Qualifications} onChange={handleChange} placeholder='Qualifications' className='input input-bordered w-full mb-4' required />
                                    <label className="label">Vehicle Type</label>
                                    <select
                                        name="Type"
                                        value={newUser.VehicleType || ""}
                                        onChange={handleChange}
                                        className="select select-bordered w-full mb-4"
                                    >
                                        <option value="Van">Van</option>
                                        <option value="Car">Car</option>
                                        <option value="Bus">Bus</option>
                                    </select>
                                    {errors.type && <p className="text-red-500">{errors.type}</p>}
                                    <label className="label">Make<span className="opacity-50">(ex: Toyota KDH)</span></label>
                                    <input
                                        type="text"
                                        name="Make"
                                        value={newUser.VehicleMake || ""}
                                        onChange={handleChange}
                                        className="input input-bordered w-full mb-4"
                                    />
                                    {errors.make && <p className="text-red-500">{errors.make}</p>}

                                        <label className="label">Capacity</label>
                                        <input
                                            type="text"
                                            name="Capacity"
                                            value={newUser.Capacity || ""}
                                            onChange={handleChange}
                                            className="input input-bordered w-full mb-4"
                                        />
                                        {errors.capacity && <p className="text-red-500">{errors.capacity}</p>}
              
                  
                                        <label className="label">Vehicle Number<span className="opacity-50">(ex: ABC4989 or KX3121)</span></label>
                                        <input
                                            type="text"
                                            name="VehicleNumber"
                                            value={newUser.Number || ""}
                                            onChange={handleChange}
                                            className="input input-bordered w-full mb-4"
                                        />
                                        {errors.vehicleNumber && <p className="text-red-500">{errors.vehicleNumber}</p>}
      
                  
                                        <label className="label">Description</label>
                                        <TextField
                                            name="Description"
                                            fullWidth
                                            value={newUser.Description || ""}
                                            onChange={handleChange}
                                            multiline
                                            rows={5}
                                        />
                                        {errors.description && <p className="text-red-500">{errors.description}</p>}
         
                                </>
                            )}
                            <div className='modal-action'>
                                <button type='button' className='btn btn-secondary text-white' onClick={() => setShowModal(false)}>Cancel</button>
                                <button type='submit' className='btn btn-primary'>{editMode ? 'Update' : 'Register'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserManagement;
