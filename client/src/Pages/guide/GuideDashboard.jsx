import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import instance from "../../api"; // Import the Axios instance for API requests
import AdminNavBar from '../../Components/guide/Navbar';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2';
import { TextField } from '@mui/material';

const GuideDashboard = () => {
  const [errors, setErrors] = useState({});
  const [guide, setGuide] = useState({});
  const [Originalguidedata, setOriginalguidedata] = useState(null);
  const [vehicle, setVehicle] = useState({});
  const [OriginalvehicleData, setOriginalvehicleData] = useState(null);
  const [availability, setAvailability] = useState({
    startDate: new Date(),
    endDate: "",
  });
  const [currentavailability, setcurrentAvailability] = useState({
    startDate: "",
    endDate: "",
  });
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [loading, setloading] = useState(true);

  // Fetch guide data when the component mounts
  useEffect(() => {
    fetchGuideData();
  }, []);

  // Fetch vehicle data and availability once guide data is fetched
  useEffect(() => {
    if (Object.keys(guide).length > 0) {
      getavailability();
      fetchVehicleData();
    }
  }, [guide]);

  // Fetch current user and guide profile data
  const fetchGuideData = async () => {
    try {
      const response = await instance.get("/auth/current-user");
      const user = response.data.user;
      if (user && user?.role === "Guide") {
        const guideResponse = await instance.get("/user/getGuideProfile");
        setGuide(guideResponse.data);
        setOriginalguidedata(guideResponse.data);
      } else {
        toast.error("You are not authorized as a guide");
      }
    } catch (error) {
      toast.error("Failed to fetch guide data");
    }
  };

  // Fetch vehicle data for the guide
  const fetchVehicleData = async () => {
    try {
      const response = await instance.get(`/vehicle/${guide.VehicleID}`);
      setVehicle(response.data);
      setOriginalvehicleData(response.data);
    } catch (error) {
      toast.error("Failed to fetch vehicle data");
    }
  };

  // Fetch availability data for the guide
  const getavailability = async () => {
    try {
      const response = await instance.get(`/guideAvailability/getAvailability/${guide.GuideID}`);
      setcurrentAvailability({
        startDate: response.data.StartDate,
        endDate: response.data.EndDate,
      });
    } catch (error) {
      toast.error("Failed to fetch vehicle data");
    } finally {
      setloading(false); // Set loading to false regardless of success or failure
    }
  }

  // Handle input changes for vehicle form with validation
  const handleInputChangevehicle = (e, setter) => {
    const { name, value } = e.target;
    let newValue = value;

    // Input limitations and validation based on the input name
    switch (name) {
      case "Capacity":
        newValue = value.replace(/\D/g, '').slice(0, 2);
        break;
      case "VehicleNumber":
        // Convert to uppercase and remove non-alphanumeric characters
        newValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');

        // Ensure the format is correct: 2-3 letters followed by 4 digits
        const letters = newValue.slice(0, 3).replace(/[^A-Z]/g, ''); // First 3 characters as letters
        const numbers = newValue.slice(letters.length).replace(/[^0-9]/g, ''); // Remaining characters as numbers

        if (letters.length > 3) {
          newValue = letters.slice(0, 3) + numbers.slice(0, 4);
        } else if (numbers.length > 4) {
          newValue = letters.slice(0, 3) + numbers.slice(0, 4);
        } else {
          newValue = letters + numbers;
        }
        break;
      case "Make":
        newValue = value.replace(/[^a-zA-Z ]/g, ' ');
        break;
    }

    // Update the state with the new value
    setter(prevState => ({
      ...prevState,
      [name]: newValue
    }));
  };

// Update guide profile data
  const updateGuideProfile = async () => {
    if (validateGuideProfile()) {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You want to Update Your Details?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!'
      });

      if (result.isConfirmed) {
        try {
          await instance.put("/user/updateGuideProfile", guide);
          Swal.fire({
            title: 'Success!',
            text: 'Guide profile updated successfully',
            icon: 'success',
          }).then(() => {
            window.location.reload();
          });
        } catch (error) {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to update guide profile',
            icon: 'error'
          });
        }
      }
    }
  };

  // Validate vehicle profile data
  const validateVehicleProfile = () => {
    const errors = {};

    // Required validation for all fields
    if (!vehicle.Type) {
      errors.type = "Vehicle type is required";
    }
    if (!vehicle.Capacity) {
      errors.capacity = "Capacity is required";
    }
    if (!vehicle.VehicleNumber) {
      errors.vehicleNumber = "Vehicle number is required";
    } else {
      // Validate VehicleNumber format: 2-3 letters followed by 4 digits
      const vehicleNumberPattern = /^[A-Z]{2,3}\d{4}$/;
      if (!vehicleNumberPattern.test(vehicle.VehicleNumber)) {
        errors.vehicleNumber = "Vehicle number must be in the format XX1234 or ABC1234";
      }
    }
    if (!vehicle.Description) {
      errors.description = "Description is required";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Update vehicle profile data
  const updateVehicleProfile = async () => {
    if (validateVehicleProfile()) {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You want to Update Vehicle Details?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!'
      });

      if (result.isConfirmed) {
        try {
          await instance.put(`/vehicle/${vehicle.VehicleID}`, vehicle);
          Swal.fire({
            title: 'Success!',
            text: 'Vehicle profile has been updated successfully.',
            icon: 'success',
          }).then(() => {
            window.location.reload();
          });

        } catch (error) {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to update vehicle profile',
            icon: 'error'
          });
        }
      }
    }
  };

  // Update guide availability data
  const updateAvailability = async () => {
    const newErrors = {};

    if (!availability.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!availability.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await instance.put(`/guideAvailability/updateAvailability/${guide.GuideID}`, { StartDate: availability.startDate, EndDate: availability.endDate });
      Swal.fire({
        title: 'Success!',
        text: 'Availability has been updated successfully.',
        icon: 'success',
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update availability',
        icon: 'error'
      });
    }
  };

// Handle availability modal close
  const handleavailabilityclose = () => {
    setAvailability({
      startDate: new Date(),
      endDate: "",
    });
    setShowAvailabilityModal(false)
  }

  // Handle guide profile modal close
  const handleprofileclose = () => {
    setGuide(Originalguidedata);
    setErrors({});
    setShowGuideModal(false)
  }

  // Handle vehicle profile modal close
  const handlevehicleclose = () => {
    setVehicle(OriginalvehicleData);
    setErrors({});
    setShowVehicleModal(false)
  }

  // Set guide availability to "Not Available"
  const handlenotavailable = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You want to set Not Available?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!'
    });

    if (result.isConfirmed) {
      try {
        await instance.put(`/guideAvailability/updateAvailability/${guide.GuideID}`, { StartDate: null, EndDate: null });
        Swal.fire({
          title: 'Updated!',
          text: 'Availability has been updated successfully.',
          icon: 'success',
        }).then(() => {
          window.location.reload();
        });
      } catch (error) {
        Swal.fire(
          'Error!',
          'Failed to update availability',
          'error'
        );
      }
    }
  };

  // Validate guide profile form data
  const validateGuideProfile = () => {
    const errors = {};

    if (!guide.Languages) {
      errors.Languages = "Languages are required";
    }
    if (!guide.GuiType) {
      errors.GuiType = "Gui Type is required";
    }

    if (!guide.Qualifications) {
      errors.Qualifications = "Qualifications are required";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChangeprofile = (e, setter) => {
    const { name, value } = e.target;
    let newValue = value;

    // Input limitations based on the input name
    switch (name) {
      case "Languages":
        // Only allow alphabet letters, spaces, and commas
        newValue = value.replace(/[^a-zA-Z,]/g, "");
        break;
      case "Qualifications":
        // Only allow alphabet letters and numbers
        newValue = value.replace(/[^a-zA-Z0-9 ]/g, "");
        break;
      default:
        // For other inputs, no specific limitations
        break;
    }

    // Update the state with the new value
    setter(prevState => ({
      ...prevState,
      [name]: newValue
    }));
  };


  return (
    <>
      <ToastContainer />
      <div className='flex flex-row'>
        <div className="w-[25%]">
          <AdminNavBar activeItem={"dashboard"} />
        </div>
        <div className="w-[2px] bg-[#F69412]"></div>
        <div className='bg-[#EFEFEF] w-full'>
          <div className='bg-[#D9D9D9] flex items-center h-[8%]  pl-5'>
            <h1 className="text-2xl font-semibold">Guide Dashboard</h1>
          </div>
          <div className='h-[92%] p-8 ml-10'>

            <div className="gap-10 ml-8 mr-4 overflow-y-auto mt-2 flex flex-wrap">
              <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">Add Guide Availability</h2>
                  <p className="mb-4">Add your availability date range</p>
                  {loading ? (
                    <p>Loading...</p>
                  ) : (
                    <div>
                      {currentavailability.startDate ? (
                        <>
                          <p className="text-green-700"><b>Currently Available Date Range:</b></p>
                          <p>{currentavailability.startDate} &nbsp; to &nbsp; {currentavailability.endDate}</p>
                        </>
                      ) : (
                        <p className="text-red-700"><b>Not Available</b></p>
                      )}
                    </div>
                  )}


                  <div className="card-actions justify-end mt-5">
                    {currentavailability.startDate ? (
                      <button
                        className="btn bg-red-500 hover:bg-red-700 text-white"
                        onClick={handlenotavailable}
                      >
                        Not Available
                      </button>
                    ) : null}

                    <button
                      className="btn btn-primary"
                      onClick={() => setShowAvailabilityModal(true)}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>

              <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">Update Guide Profile</h2>
                  <p>Update your guide profile details</p>
                  <div className="card-actions justify-end">
                    <button
                      className="btn btn-primary"
                      onClick={() => setShowGuideModal(true)}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>

              <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">Update Vehicle Profile</h2>
                  <p>Update your vehicle profile details</p>
                  <div className="card-actions justify-end">
                    <button
                      className="btn btn-primary"
                      onClick={() => setShowVehicleModal(true)}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability Modal */}
            {showAvailabilityModal && (
              <div className="modal modal-open w-full">
                <div className="modal-box flex justify-center w-[20%] h-auto">
                  <div>
                    <h2 className="font-bold text-lg text-center my-8">Set Availability</h2>
                    <div>
                      <div className="form-control">
                        <label className="label">Start Date</label>
                        <DatePicker
                          selected={availability.startDate} // Date value
                          onChange={(date) => setAvailability({ ...availability, startDate: date })}
                          className="input input-bordered" // Optional class for styling
                          minDate={new Date()} // Disable past dates
                        />
                        {errors.startDate && <p className="text-red-500">{errors.startDate}</p>}
                      </div>
                      <div className="form-control mt-7">
                        <label className="label">End Date</label>
                        <DatePicker
                          selected={availability.endDate} // Date value
                          onChange={(date) => setAvailability({ ...availability, endDate: date })}
                          className="input input-bordered" // Optional class for styling
                          minDate={availability.startDate} // End date cannot be before start date
                        />
                        {errors.endDate && <p className="text-red-500">{errors.endDate}</p>}
                      </div>
                    </div>
                    <div className="modal-action justify-center mt-10">
                      <button className="btn btn-primary" onClick={updateAvailability}>
                        Save
                      </button>
                      <button
                        className="btn"
                        onClick={handleavailabilityclose}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Guide Profile Modal */}
            {showGuideModal && (
              <div className="modal modal-open">
                <div className="modal-box">
                  <h2 className="font-bold text-lg mb-5">Update Guide Profile</h2>
                  <div className="form-control">
                    <label className="label">
                      Languages <span className="opacity-50">(ex: English, Spanish)</span>
                    </label>
                    <input
                      type="text"
                      name="Languages"
                      value={guide.Languages || ""}
                      onChange={(e) => handleInputChangeprofile(e, setGuide)}
                      className="input input-bordered"
                    />
                    {errors.Languages && <p className="text-red-500">{errors.Languages}</p>}
                  </div>
                  <div className="form-control">
                    <label className="label">Gui Type</label>
                    <select
                      name="GuiType"
                      value={guide.GuiType || ""}
                      onChange={(e) => handleInputChangeprofile(e, setGuide)}
                      className="input input-bordered"
                    >
                      <option value="Chauffeur Guide">Chauffeur Guide</option>
                      <option value="National Guide">National Guide</option>
                    </select>
                    {errors.GuiType && <p className="text-red-500">{errors.GuiType}</p>}
                  </div>
                  <div className="form-control">
                    <label className="label">Qualifications</label>
                    <input
                      type="text"
                      name="Qualifications"
                      value={guide.Qualifications || ""}
                      onChange={(e) => handleInputChangeprofile(e, setGuide)}
                      className="input input-bordered"
                    />
                    {errors.Qualifications && <p className="text-red-500">{errors.Qualifications}</p>}
                  </div>
                  <div className="modal-action">
                    <button className="btn btn-primary" onClick={updateGuideProfile}>
                      Save
                    </button>
                    <button className="btn" onClick={handleprofileclose}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}


            {/* Vehicle Profile Modal */}
            {showVehicleModal && (
              <div className="modal modal-open">
                <div className="modal-box">
                  <h2 className="font-bold text-lg mb-5">Update Vehicle Profile</h2>
                  <div className="form-control">
                    <label className="label">Vehicle Type</label>
                    <select
                      name="Type"
                      value={vehicle.Type || ""}
                      onChange={(e) => handleInputChangevehicle(e, setVehicle)}
                      className="input input-bordered"
                    >
                      <option value="Van">Van</option>
                      <option value="Car">Car</option>
                      <option value="Bus">Bus</option>
                    </select>
                    {errors.type && <p className="text-red-500">{errors.type}</p>}
                  </div>
                  <div className="form-control">
                    <label className="label">Make<span className="opacity-50">(ex: Toyota KDH)</span></label>
                    <input
                      type="text"
                      name="Make"
                      value={vehicle.Make || ""}
                      onChange={(e) => handleInputChangevehicle(e, setVehicle)}
                      className="input input-bordered"
                    />
                    {errors.make && <p className="text-red-500">{errors.make}</p>}
                  </div>
                  <div className="form-control">
                    <label className="label">Capacity</label>
                    <input
                      type="text"
                      name="Capacity"
                      value={vehicle.Capacity || ""}
                      onChange={(e) => handleInputChangevehicle(e, setVehicle)}
                      className="input input-bordered"
                    />
                    {errors.capacity && <p className="text-red-500">{errors.capacity}</p>}
                  </div>
                  <div className="form-control">
                    <label className="label">Vehicle Number<span className="opacity-50">(ex: ABC4989 or KX3121)</span></label>
                    <input
                      type="text"
                      name="VehicleNumber"
                      value={vehicle.VehicleNumber || ""}
                      onChange={(e) => handleInputChangevehicle(e, setVehicle)}
                      className="input input-bordered"
                    />
                    {errors.vehicleNumber && <p className="text-red-500">{errors.vehicleNumber}</p>}
                  </div>
                  <div className="form-control">
                    <label className="label">Description</label>
                    <TextField
                      name="Description"
                      fullWidth
                      value={vehicle.Description || ""}
                      onChange={(e) => handleInputChangevehicle(e, setVehicle)}
                      multiline
                      rows={5}
                    />
                    {errors.description && <p className="text-red-500">{errors.description}</p>}
                  </div>
                  <div className="modal-action">
                    <button
                      className="btn btn-primary"
                      onClick={updateVehicleProfile}
                    >
                      Save
                    </button>
                    <button
                      className="btn"
                      onClick={handlevehicleclose}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default GuideDashboard;
