import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import instance from '../api';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../Components/Navbar';
import BgImage from '../Assets/bg.png';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CountryDropdown from '../Components/admin/CountryDropdown';


const Inquire = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [pw, setPw] = useState('');
  const [oldForm, setOldForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    livingCountry: '',
    arrivalDate: '',
    departureDate: '',
    numAdults: '',
    numChildren: '',
    message: '',
    password: ''
  });

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    arrivalDate: '',
    departureDate: '',
    numAdults: '',
    numChildren: '',
    country: '',
    message: ''
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('First Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    mobile: Yup.string().required('Mobile number is required'),
    arrivalDate: Yup.date().required('Arrival Date is required'),
    departureDate: Yup.date().required('Departure Date is required'),
    numAdults: Yup.number().min(1, 'At least 1 adult is required').required('Number of Adults is required'),
    numChildren: Yup.number().min(0, 'Number of Children cannot be negative').nullable(),
    country: Yup.string().required('Country is required'),
    message: Yup.string().required('Message is required')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      console.log("Pressed");
      const res = await instance.post('/inquiry/addInquiry', values);
      if (res.data === 'Customer does not exist') {
        setShowModal(true);
        setOldForm(values);
        toast.info('New User Registration!')
      } else {
        toast.success('User Inquiry Added');
        navigate('/login');
      }
    } catch (err) {
      console.log(err);
      toast.error('Error in User Inquiry!');
    }
    setSubmitting(false);
  };


  const handlePwsSubmit = async (e) => {

    e.preventDefault();
    const data = {
      ...oldForm,
      password: pw
    }
    setOldForm(data);
    try {
      const res = await instance.post('/inquiry/addInquiryNewUser', data);
      toast.success('User Registered Successfully and Inquiry Added!');

    } catch (err) {
      console.log(err);
      toast.error('Failed to add User and Inquiry');
    }
    setShowModal(false);
  };
  

  return (
    <>
      <ToastContainer />

      <Navbar buttonState={'LOGIN'} buttonLoc={'/login'} />
      <img src={BgImage} alt="Background" className="absolute inset-0 w-full h-full z-0" style={{ objectFit: 'cover', objectPosition: 'center', zIndex: '-1', position: 'fixed' }} />
      <div className="max-w-md mx-auto my-8 p-6 rounded-md border-2 border-customYellow">
        <div className="max-w-md mx-auto my-2 p-6 bg-gray-100 rounded-md">
          <h2 className="text-2xl font-semibold flex justify-center mb-4">INQUIRY NOW</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-4">
                  <label className="block mb-1">First Name:</label>
                  <Field type="text" name="firstName" className="border-black bg-white border w-full p-2 rounded-md" />
                  <ErrorMessage name="firstName" component="div" className="text-red-600" />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Last Name:</label>
                  <Field type="text" name="lastName" className="border-black bg-white border w-full p-2 rounded-md" />
                  <ErrorMessage name="lastName" component="div" className="text-red-600" />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Email:</label>
                  <Field type="email" name="email" className="border-black bg-white border w-full p-2 rounded-md" />
                  <ErrorMessage name="email" component="div" className="text-red-600" />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Mobile:</label>
                  <Field type="tel" name="mobile" className="border-black bg-white border w-full p-2 rounded-md" />
                  <ErrorMessage name="mobile" component="div" className="text-red-600" />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Arrival Date:</label>
                  <Field type="date" name="arrivalDate" className="border-black bg-white border w-full p-2 rounded-md" />
                  <ErrorMessage name="arrivalDate" component="div" className="text-red-600" />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Departure Date:</label>
                  <Field type="date" name="departureDate" className="border-black bg-white border w-full p-2 rounded-md" />
                  <ErrorMessage name="departureDate" component="div" className="text-red-600" />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Country:</label>
                  <Field type="text" name="country" className="border-black bg-white border w-full p-2 rounded-md" />
                  <ErrorMessage name="country" component="div" className="text-red-600" />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Number of Adults:</label>
                  <Field type="number" name="numAdults" className="border-black bg-white border w-full p-2 rounded-md" />
                  <ErrorMessage name="numAdults" component="div" className="text-red-600" />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Number of Children:</label>
                  <Field type="number" name="numChildren" className="border-black bg-white border w-full p-2 rounded-md" />
                  <ErrorMessage name="numChildren" component="div" className="text-red-600" />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Message:</label>
                  <Field as="textarea" name="message" className="border-black bg-white border w-full h-48 p-2 rounded-md" />
                  <ErrorMessage name="message" component="div" className="text-red-600" />
                </div>
                <div className="flex justify-center">
                  <button type="submit" className="bg-customYellow text-white px-4 py-2 rounded-md hover:bg-yellow-600" disabled={isSubmitting}>Submit</button>
                </div>
              </Form>
            )}
          </Formik>
          {showModal && (
            <div className="modal modal-open">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Enter Your Password</h3>
                <form onSubmit={handlePwsSubmit}>
                  <label className="input input-bordered flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                      <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
                    </svg>
                    <input type="password" className="grow" onChange={e => setPw(e.target.value)} placeholder="Enter your password" />
                  </label>
                  <div className="modal-action">
                    <button type='submit' className="btn btn-primary">Submit</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Inquire;