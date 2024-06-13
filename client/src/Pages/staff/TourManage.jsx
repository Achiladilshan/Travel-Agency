import React, { useState, useEffect } from "react";
import StaffSideBar from "../../Components/staff/StaffSideBar";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import instance from "../../api";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import CustomDatePicker from '../../Components/CustomDatePicker';

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

const TourManage = () => {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [tours, setTours] = useState([]);
  const [inputData, setInputData] = useState("");
  const [inputData1, setInputData1] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGuide, setSelectedGuide] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await instance.get("/user");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

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

  const handleSearch = (e) => {
    setInputData(e.target.value);
    setSelectedUser(users.filter(user => user.UserID === parseInt(e.target.value, 10) && (user.Role.toLowerCase() === 'customer')));
  };

  const handleGuideSearch = (e) => {
    setInputData1(e.target.value);
    setSelectedGuide(users.filter(user => (user.FirstName == e.target.value || user.LastName == e.target.value) && user.Role.toLowerCase() === 'guide'));
  }

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
      setShowModal(false);
    } catch (error) {
      toast.error("Failed to create tour");
      console.error("Error creating tour:", error.message);
      setSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-row">
        <div className="w-[25%]">
          <StaffSideBar activeItem="addtour" />
        </div>
        <div className="w-[2px] bg-[#F69412]"></div>
        <div className='bg-[#EFEFEF] w-full overflow-auto h-screen'>
          <div className='bg-[#D9D9D9] flex items-center h-[8%]  pl-5'>
            <h1 className="text-2xl font-semibold">Create Trip</h1>
          </div>
          <div className='mb-5 p-4'>
            <div className='flex-col mt-10 px-5'>
              {/* <button className="btn" onClick={() => setShowModal(true)}>Create Tour</button> */}
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className={` `}>
                      <div className="">
                        <div className="mb-4">
                          <label htmlFor="customerID" className="block text-sm font-medium text-gray-700">Select Customer:</label>
                          <input type="text" name="selectCustomerID" value={inputData} onChange={handleSearch} className="mt-1 p-2 w-full border bg-white border-gray-300 rounded-md" />
                          <Field as="select" name="customerID" className="mt-1 p-2 w-full border border-gray-300 bg-white rounded-md">
                            <option value="">Select Customer</option>
                            {selectedUser && selectedUser.map(user => (
                              <option key={user.UserID} value={user.UserID}>{user.FirstName}</option>
                            ))}
                          </Field>
                          <ErrorMessage name="customerID" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="guideID" className="block text-sm font-medium text-gray-700">Select Guide:</label>
                          <input type="text" name="selectGuideID" value={inputData1} onChange={handleGuideSearch} className="mt-1 p-2 w-full border bg-white border-gray-300 rounded-md" />
                          <Field as="select" name="guideID" className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-white">
                            <option value="">Select Guide</option>
                            {selectedGuide && selectedGuide.map(user => (
                              <option key={user.UserID} value={user.UserID}>{user.FirstName} {user.LastName}</option>
                            ))}
                          </Field>
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
                        {/* <div className="mb-4">
                    <label htmlFor="totalDistance" className="block text-sm font-medium text-gray-700">Total Distance:</label>
                    <Field type="number" name="totalDistance" className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-white" />
                    <ErrorMessage name="totalDistance" component="div" className="text-red-500 text-sm" />
                  </div> */}
                        {/* Submit and cancel buttons */}
                        <div className=" ">
                          <button type="submit" disabled={isSubmitting} className="btn btn-primary" >
                            {isSubmitting ? "Submitting..." : "Submit"}
                          </button>
                          {/* <button className="btn btn-danger" onClick={() => setShowModal(false)}>
                      Cancel
                    </button> */}
                        </div>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
              {/* Component to display tours */}
              {/* <TourList tours={tours} /> */}
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


export default TourManage;
