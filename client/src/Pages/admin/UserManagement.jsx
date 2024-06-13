import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import instance from '../../api';
import AdminNavBar from '../../Components/admin/Navbar';
import CountryDropdown from '../../Components/admin/CountryDropdown';
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
        Languages: '',
        GuiType: '',
        Qualifications: '',
        VehicleType: '',
        VehicleMake: '',
        Capacity: '',
        VehicleNumber: '',
        Description: '',
    });

    const [editMode, setEditMode] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Filter and Pagination State
    const [filterRole, setFilterRole] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [itemsPerPage, setitemsPerPage] = useState(10);

    useEffect(() => {
        fetchUsers();
    }, [filterRole]);

    const fetchUsers = async () => {
        try {
            const response = await instance.get('/user/', {
                params: {
                    role: filterRole,
                }
            });
            console.log(response.data.rows);
            setUsers(response.data.rows);
        } catch (error) {
            toast.error('Failed to fetch users');
        }
    };

    useEffect(() => {
        filterUsers();
    }, [searchQuery, users]);

    const filterUsers = () => {
        const filtered = users.filter(user =>
            user.Email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.PhoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.FirstName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        setFilteredUsers(filtered);
    };

    const handlePageChange = (direction) => {
        if (direction === 'next' && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        } else if (direction === 'prev' && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset page to 1 when searching
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

    const validateForm = (user) => {
        const errors = {};

        if (!user.FirstName) {
            errors.FirstName = 'First Name is required';
        }
        if (!user.LastName) {
            errors.LastName = 'Last Name is required';
        }
        if (!user.Email) {
            errors.Email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(user.Email)) {
            errors.Email = 'Email is invalid';
        }
        if (!user.PhoneNumber) {
            errors.PhoneNumber = 'Phone Number is required';
        } else if (!/^\d+$/.test(user.PhoneNumber)) {
            errors.PhoneNumber = 'Phone Number is invalid';
        }
        if (!editMode && !user.Password) {
            errors.Password = 'Password is required';
        }
        if (!user.Role) {
            errors.Role = 'Role is required';
        }

        if (user.Role === 'Customer' && !user.Country) {
            errors.Country = 'Country is required for Customers';
        }

        if (user.Role === 'Guide') {
            if (!user.Languages) {
                errors.Languages = 'Languages are required for Guides';
            }
            if (!user.GuiType) {
                errors.GuiType = 'Guide Type is required for Guides';
            }
            if (!user.Qualifications) {
                errors.Qualifications = 'Qualifications are required for Guides';
            }
            if (!user.VehicleType) {
                errors.VehicleType = 'Vehicle Type is required';
            }
            if (!user.VehicleMake) {
                errors.VehicleMake = 'Vehicle Make is required';
            }
            if (!user.Capacity) {
                errors.Capacity = 'Capacity is required';
            }
            if (!user.VehicleNumber) {
                errors.VehicleNumber = 'Vehicle Number is required';
            } else if (!/^[A-Z]{2,3}\d{4}$/.test(user.VehicleNumber)) {
                errors.VehicleNumber = 'Invalid Vehicle Number format. It should be in the format ABC4989 or KX3121.';
            }
            if (!user.Description) {
                errors.Description = 'Description is required';
            }
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleRegister = async () => {
        if (validateForm(newUser)) {
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
                    } else if (newUser.Role === 'Admin') {
                        await instance.post('user/registerAdmin', newUser);
                    }
                    toast.success('User registered successfully');
                }
                setShowModal(false);
                fetchUsers();
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    const { errors } = error.response.data;
                    Object.keys(errors).forEach((key) => {
                        toast.error(errors[key]);
                    });
                } else {
                    toast.error('Failed to register/update user');
                }
            }
        }
    };

    const handleChange = (e) => {
        let { name, value } = e.target;

        if (name === 'VehicleNumber') {
            value = value.toUpperCase();
        }
        const validations = {
            FirstName: /^[a-zA-Z]{1,15}$/,
            LastName: /^[a-zA-Z]{1,15}$/,
            PhoneNumber: /^[\d+]{1,15}$/,
            Languages: /^[a-zA-Z,]{1,50}$/,
            Qualifications: /^[a-zA-Z,]{1,100}$/,
            Capacity: /^(?:[1-9]|\d{2})$/,
            VehicleNumber: /^[a-zA-Z0-9]{1,7}$/,
            Password: /^.{1,60}$/,
            VehicleMake: /^.{1,20}$/,
            Email: /^.{1,100}$/,
        };

        const valid = validations[name] ? validations[name].test(value) : true;

        if (valid || value === '') {
            setNewUser((prevUser) => ({
                ...prevUser,
                [name]: value,
            }));
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: '',
            }));
        }
    };

    const handleEdit = (user) => {
        resetForm();
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
            Languages: '',
            GuiType: '',
            Qualifications: '',
            VehicleType: '',
            VehicleMake: '',
            Capacity: '',
            VehicleNumber: '',
            Description: '',
        });
        setEditMode(false);
        setErrors({});
    };

    const handleFilterChange = (e) => {
        setFilterRole(e.target.value);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentusers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem)

    return (
        <>
            <ToastContainer />
            <div className='flex flex-row h-screen overflow-hidden'>
                <div className="w-[25%]">
                    <AdminNavBar activeItem={"user"} />
                </div>
                <div className="w-[2px] bg-[#F69412]"></div>
                <div className='bg-[#EFEFEF] w-full overflow-auto h-screen'>
                    <div className='bg-[#D9D9D9] flex items-center h-[8%]  pl-5'>
                        <h1 className="text-2xl font-semibold">User Management</h1>
                    </div>
                    <div className='mb-5 p-4'>
                        <div className="flex justify-between items-center mb-4">
                            <button
                                className='btn btn-primary'
                                onClick={() => { resetForm(); setShowModal(true); }}
                            >
                                Add User
                            </button>
                            <select
                                name="filterRole"
                                value={filterRole}
                                onChange={handleFilterChange}
                                className="select select-bordered"
                            >
                                <option value=''>All Roles</option>
                                <option value='Customer'>Customer</option>
                                <option value='Admin'>Admin</option>
                                <option value='Guide'>Guide</option>
                                <option value='Staff'>Staff</option>
                            </select>
                        </div>
                        <div className="flex mb-4">
                            <input
                                type="text"
                                placeholder="Search by Name,Email or Phone Number"
                                value={searchQuery}
                                onChange={handleSearchInputChange}
                                className="input input-bordered mr-2 w-[30%]"
                            />
                            <button className="btn" onClick={() => setSearchQuery('')}>Clear</button>
                        </div>
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
                                {users ? (
                                    currentusers.map(user => (
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
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7">Loading...</td>
                                    </tr>
                                )}
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
            </div>

            {showModal && (
                <div className='fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 w-full modal modal-open'>
                    <div className='bg-white p-4 rounded-lg w-96 modal-box'>
                        <h3 className='font-bold text-lg mb-4'>{editMode ? 'Edit User' : 'Register New User'}</h3>
                        <div>
                            <input
                                type='text'
                                name='FirstName'
                                value={newUser.FirstName}
                                onChange={handleChange}
                                placeholder='First Name'
                                className='input input-bordered w-full mt-4'
                            />
                            {errors.FirstName && <p className="text-red-500">{errors.FirstName}</p>}

                            <input
                                type='text'
                                name='LastName'
                                value={newUser.LastName}
                                onChange={handleChange}
                                placeholder='Last Name'
                                className='input input-bordered w-full mt-4'
                            />
                            {errors.LastName && <p className="text-red-500">{errors.LastName}</p>}

                            <input
                                type='email'
                                name='Email'
                                value={newUser.Email}
                                onChange={handleChange}
                                placeholder='Email'
                                className='input input-bordered w-full mt-4'
                            />
                            {errors.Email && <p className="text-red-500">{errors.Email}</p>}

                            <input
                                type='text'
                                name='PhoneNumber'
                                value={newUser.PhoneNumber}
                                onChange={handleChange}
                                placeholder='Phone Number'
                                className='input input-bordered w-full mt-4'
                            />
                            {errors.PhoneNumber && <p className="text-red-500">{errors.PhoneNumber}</p>}

                            {!editMode && (
                                <>
                                    <input
                                        type='password'
                                        name='Password'
                                        value={newUser.Password}
                                        onChange={handleChange}
                                        placeholder='Password'
                                        className='input input-bordered w-full mt-4'
                                    />
                                    {errors.Password && <p className="text-red-500">{errors.Password}</p>}
                                </>
                            )}

                            <select
                                name='Role'
                                value={newUser.Role}
                                onChange={handleChange}
                                disabled={editMode}
                                className='select select-bordered w-full mt-4'
                            >
                                <option value='Customer'>Customer</option>
                                <option value='Admin'>Admin</option>
                                <option value='Guide'>Guide</option>
                                <option value='Staff'>Staff</option>
                            </select>
                            {errors.Role && <p className="text-red-500">{errors.Role}</p>}

                            {newUser.Role === 'Customer' && (
                                <>
                                    <CountryDropdown
                                        name="Country"
                                        value={newUser.Country}
                                        onChange={handleChange}
                                    />
                                    {errors.Country && <p className="text-red-500">{errors.Country}</p>}
                                </>
                            )}

                            {newUser.Role === 'Guide' && (
                                <>
                                    <input
                                        type='text'
                                        name='Languages'
                                        value={newUser.Languages}
                                        onChange={handleChange}
                                        placeholder='Languages'
                                        className='input input-bordered w-full mt-4'
                                    />
                                    {errors.Languages && <p className="text-red-500">{errors.Languages}</p>}

                                    <select
                                        name="GuiType"
                                        value={newUser.GuiType || ""}
                                        onChange={handleChange}
                                        className="select select-bordered w-full mt-4"
                                    >
                                        <option value="Chauffeur Guide">Chauffeur Guide</option>
                                        <option value="National Guide">National Guide</option>
                                    </select>
                                    {errors.GuiType && <p className="text-red-500">{errors.GuiType}</p>}

                                    <input
                                        type='text'
                                        name='Qualifications'
                                        value={newUser.Qualifications}
                                        onChange={handleChange}
                                        placeholder='Qualifications'
                                        className='input input-bordered w-full mt-4'
                                    />
                                    {errors.Qualifications && <p className="text-red-500">{errors.Qualifications}</p>}

                                    <label className="label mt-4">Vehicle Type</label>
                                    <select
                                        name="VehicleType"
                                        value={newUser.VehicleType || ""}
                                        onChange={handleChange}
                                        className="select select-bordered w-full"
                                    >
                                        <option value="Van">Van</option>
                                        <option value="Car">Car</option>
                                        <option value="Bus">Bus</option>
                                    </select>
                                    {errors.VehicleType && <p className="text-red-500">{errors.VehicleType}</p>}

                                    <label className="label mt-4">Make<span className="opacity-50">(ex: Toyota KDH)</span></label>
                                    <input
                                        type="text"
                                        name="VehicleMake"
                                        value={newUser.VehicleMake || ""}
                                        onChange={handleChange}
                                        className="input input-bordered w-full"
                                    />
                                    {errors.VehicleMake && <p className="text-red-500">{errors.VehicleMake}</p>}

                                    <label className="label mt-4">Capacity</label>
                                    <input
                                        type="text"
                                        name="Capacity"
                                        value={newUser.Capacity || ""}
                                        onChange={handleChange}
                                        className="input input-bordered w-full"
                                    />
                                    {errors.Capacity && <p className="text-red-500">{errors.Capacity}</p>}

                                    <label className="label mt-4">Vehicle Number<span className="opacity-50">(ex: ABC4989 or KX3121)</span></label>
                                    <input
                                        type="text"
                                        name="VehicleNumber"
                                        value={newUser.VehicleNumber || ""}
                                        onChange={handleChange}
                                        className="input input-bordered w-full"
                                    />
                                    {errors.VehicleNumber && <p className="text-red-500">{errors.VehicleNumber}</p>}

                                    <label className="label mt-4">Description</label>
                                    <TextField
                                        name="Description"
                                        fullWidth
                                        value={newUser.Description || ""}
                                        onChange={handleChange}
                                        multiline
                                        rows={5}
                                    />
                                    {errors.Description && <p className="text-red-500">{errors.Description}</p>}
                                </>
                            )}
                            <div className='modal-action'>
                                <button type='button' className='btn btn-secondary text-white' onClick={() => setShowModal(false)}>Cancel</button>
                                <button type='submit' className='btn btn-primary' onClick={handleRegister}>{editMode ? 'Update' : 'Register'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserManagement;

