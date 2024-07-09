import React, { useState, useEffect } from "react";
import Navbar from '../../Components/admin/Navbar';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import instance from "../../api"; // Import the Axios instance for API requests
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import CustomDatePicker from '../../Components/CustomDatePicker';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

// Initial values for the form fields
const initialValues = {
  customerID: "",
  guideID: "",
  price: "",
  startDate: "",
  endDate: "",
  adultsCount: "",
  childrenCount: "",
  description: "",
  specialNotes: ""
};

// Validation schema for the form using Yup
const validationSchema = Yup.object().shape({
  customerID: Yup.number().required("Customer ID is required"),
  guideID: Yup.number().required("Guide ID is required"),
  price: Yup.number().required("Price is required"),
  startDate: Yup.date().required("Start date is required"),
  endDate: Yup.date().required("End date is required"),
  adultsCount: Yup.number().required("Number of adults is required"),
  childrenCount: Yup.number().required("Number of children is required"),
  description: Yup.string().required("Description is required"),
  specialNotes: Yup.string().required("Special notes are required")
});

// Fetch users data on component mount
const AddTour = () => {
  const [users, setUsers] = useState([]);
  const [tours, setTours] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const role = "All";
      try {
        const response = await instance.get("/user?role=All");
        setUsers(response.data?.rows);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Fetch tours data on component mount
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await instance.get("/trip");
        setTours(response.data);
      } catch (error) {
        console.error("Error fetching tours:", error);
      }
    };

    fetchTours();
  }, []);

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    const { customerID, guideID, price, startDate, endDate, adultsCount, childrenCount, description, specialNotes, totalDistance } = values;

    try {
      await instance.post("/trip/addTrip", {
        CustomerID: customerID,
        GuideID: guideID,
        Price: price,
        StartDate: startDate,
        EndDate: endDate,
        AdultsCount: adultsCount,
        ChildrenCount: childrenCount,
        Description: description,
        SpecialNotes: specialNotes
      });

      toast.success("Tour created successfully");
      setSubmitting(false);
    } catch (error) {
      toast.error("Failed to create tour");
      console.error("Error creating tour:", error.message);
      setSubmitting(false);
    }
  };

  // Filter users based on role
  const customers = users.filter(user => user.Role.toLowerCase() === 'customer');
  const guides = users.filter(user => user.Role.toLowerCase() === 'guide');

  return (
    <>
      <ToastContainer />
      <div className="flex flex-row">
        <div className="w-[25%]">
          <Navbar activeItem="addtour" />
        </div>
        <div className="w-[2px] bg-[#F69412]"></div>
        <div className='bg-[#EFEFEF] w-full overflow-auto h-screen'>
          <div className='bg-[#D9D9D9] flex items-center h-[8%]  pl-5'>
            <h1 className="text-2xl font-semibold">Add Tour</h1>
          </div>
          <div className='mb-5 p-4'>
            <div className='flex-col mt-10 px-5'>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, setFieldValue }) => (
                  <Form>
                    <div className="">
                      <div className="mb-4">
                        <label htmlFor="customerID" className="block text-sm font-medium text-gray-700">Select Customer:</label>
                        <Autocomplete
                          options={customers}
                          getOptionLabel={(option) => `${option.FirstName} ${option.LastName}`}
                          onChange={(event, value) => setFieldValue("customerID", value ? value.UserID : "")}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              placeholder="Search by first or last name"
                              fullWidth
                            />
                          )}
                        />
                        <Field type="hidden" name="customerID" />
                        <ErrorMessage name="customerID" component="div" className="text-red-500 text-sm" />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="guideID" className="block text-sm font-medium text-gray-700">Select Guide:</label>
                        <Autocomplete
                          options={guides}
                          getOptionLabel={(option) => `${option.FirstName} ${option.LastName}`}
                          onChange={(event, value) => setFieldValue("guideID", value ? value.UserID : "")}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              placeholder="Search by first or last name"
                              fullWidth
                            />
                          )}
                        />
                        <Field type="hidden" name="guideID" />
                        <ErrorMessage name="guideID" component="div" className="text-red-500 text-sm" />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price:</label>
                        <Field type="number" name="price" className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-white" />
                        <ErrorMessage name="price" component="div" className="text-red-500 text-sm" />
                      </div>
                      <div className="mb-4 flex space-x-8">
                        <div className="">
                          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date:</label>
                          <Field name="startDate" component={CustomDatePicker} />
                          <ErrorMessage name="startDate" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div className="">
                          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date:</label>
                          <Field name="endDate" component={CustomDatePicker} startDate={initialValues.startDate} />
                          <ErrorMessage name="endDate" component="div" className="text-red-500 text-sm" />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="adultsCount" className="block text-sm font-medium text-gray-700">Number of Adults:</label>
                        <Field type="number" name="adultsCount" className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-white" />
                        <ErrorMessage name="adultsCount" component="div" className="text-red-500 text-sm" />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="childrenCount" className="block text-sm font-medium text-gray-700">Number of Children:</label>
                        <Field type="number" name="childrenCount" className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-white" />
                        <ErrorMessage name="childrenCount" component="div" className="text-red-500 text-sm" />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description:</label>
                        <Field as="textarea" name="description" className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-white" />
                        <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="specialNotes" className="block text-sm font-medium text-gray-700">Special Notes:</label>
                        <Field as="textarea" name="specialNotes" className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-white" />
                        <ErrorMessage name="specialNotes" component="div" className="text-red-500 text-sm" />
                      </div>
                      <div className="">
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                          {isSubmitting ? "Submitting..." : "Submit"}
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Component to display tours
const TourList = ({ tours }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Tours</h2>
      <ul>
        {tours != null && tours.map(tour => (
          <li key={tour.TripID} className="mb-4 p-4 border rounded-md">
            <p className="font-semibold">Customer ID: {tour.CustomerID}</p>
            <p className="font-semibold">Guide ID: {tour.GuideID}</p>
            <p className="font-semibold">Price: ${tour.Price}</p>
            <p className="font-semibold">Start Date : {tour.StartDate.split('T')[0]}</p>
            <p className="font-semibold">End Date : {tour.EndDate.split('T')[0]}</p>
            <p className="font-semibold">Description : {tour.Description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddTour;
