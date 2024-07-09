import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import instance from '../api';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../Components/Navbar';
import BgImage from '../Assets/bg.png';
import 'react-datepicker/dist/react-datepicker.css';
import jwtDecode from 'jwt-decode';

const LoggedInInquiry = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        const decoded = jwtDecode(token);
        try {
          const response = await instance.get(`/user/${decoded.id}`);
          setUserDetails(response.data);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };
    
    fetchUserDetails();
  }, []);

  const initialValues = {
    arrivalDate: '',
    departureDate: '',
    numAdults: '',
    numChildren: '',
    message: ''
  };

  const validationSchema = Yup.object({
    arrivalDate: Yup.date().required('Arrival Date is required'),
    departureDate: Yup.date().required('Departure Date is required'),
    numAdults: Yup.number().min(1, 'At least 1 adult is required').required('Number of Adults is required'),
    numChildren: Yup.number().min(0, 'Number of Children cannot be negative').nullable(),
    message: Yup.string().required('Message is required')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    const data = { ...values, userID: userDetails.id };
    try {
      const res = await instance.post('/inquiry/addInquiry', data);
      toast.success('User Inquiry Added');
      navigate('/customer-dashboard');
    } catch (err) {
      console.log(err);
      toast.error('Error in User Inquiry!');
    }
    setSubmitting(false);
  };

  return (
    <>
      <ToastContainer />
      <Navbar buttonState={'LOGOUT'} buttonLoc={'/logout'} />
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
        </div>
      </div>
    </>
  );
};

export default LoggedInInquiry;
