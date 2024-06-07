import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import instance from "../../api";
import { useNavigate } from "react-router-dom";
import AdminNavBar from '../../Components/guide/Navbar';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2';

const GuideDashboard = () => {
  const navigate = useNavigate();
  const [guide, setGuide] = useState({});
  const [vehicle, setVehicle] = useState({});
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

  useEffect(() => {
    fetchGuideData();
    fetchVehicleData();
  }, []);

  useEffect(() => {
    if (Object.keys(guide).length > 0) {
      getavailability();
    }
  }, [guide]);

  const fetchGuideData = async () => {
    try {
      const response = await instance.get("/auth/current-user");
      const user = response.data.user;
      if (user && user?.role === "Guide") {
        const guideResponse = await instance.get("/user/getGuideProfile");
        setGuide(guideResponse.data);
      } else {
        toast.error("You are not authorized as a guide");
      }
    } catch (error) {
      toast.error("Failed to fetch guide data");
    }
  };

  const fetchVehicleData = async () => {
    try {
      const response = await instance.get("/vehicle/getVehicleProfile");
      setVehicle(response.data);
    } catch (error) {
      toast.error("Failed to fetch vehicle data");
    }
  };

  const handleInputChange = (e, setState) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const updateGuideProfile = async () => {
    try {
      await instance.put("/user/updateGuideProfile", guide);
      toast.success("Guide profile updated successfully");
      setShowGuideModal(false);
    } catch (error) {
      toast.error("Failed to update guide profile");
    }
  };

  const updateVehicleProfile = async () => {
    try {
      await instance.put("/vehicle/updateVehicleProfile", vehicle);
      toast.success("Vehicle profile updated successfully");
      setShowVehicleModal(false);
    } catch (error) {
      toast.error("Failed to update vehicle profile");
    }
  };

  const updateAvailability = async () => {
    try {
      console.log(availability);
      await instance.put(`/guideAvailability/updateAvailability/${guide.GuideID}`, { StartDate: availability.startDate, EndDate: availability.endDate });
      toast.success("Availability Updated successfully");
      handleavailabilityclose();
    } catch (error) {
      toast.error("Failed to update availability");
    }
  };

  const handleViewTours = () => {
    navigate('/guide/tours')
  }

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

  const handleavailabilityclose = () => {
    setAvailability({
      startDate: new Date(),
      endDate: "",
    });
    setShowAvailabilityModal(false)
    window.location.reload();
  }

  const handlenotavailable = async () => {
    try {
      console.log(availability);
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
        await instance.put(`/guideAvailability/updateAvailability/${guide.GuideID}`, { StartDate: null, EndDate: null });
        toast.success("Availability Updated successfully");
        window.location.reload();
      }
    } catch (error) {
      toast.error("Failed to update availability");
    }
  }


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

              <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">Manage Your Tours</h2>
                  <p>Click Here to Manage your Tours and Map Distance..</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary" onClick={handleViewTours}>View</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability Modal */}
            {showAvailabilityModal && (
              <div className="modal modal-open w-full">
                <div className="modal-box flex justify-center w-[30%] h-[65%]">
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
                      </div>
                      <div className="form-control mt-7">
                        <label className="label">End Date</label>
                        <DatePicker
                          selected={availability.endDate} // Date value
                          onChange={(date) => setAvailability({ ...availability, endDate: date })}
                          className="input input-bordered" // Optional class for styling
                          minDate={availability.startDate} // End date cannot be before start date
                        />
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
                  <h2 className="font-bold text-lg">Update Guide Profile</h2>
                  <div className="form-control">
                    <label className="label">Languages</label>
                    <input
                      type="text"
                      name="Languages"
                      value={guide.Languages || ""}
                      onChange={(e) => handleInputChange(e, setGuide)}
                      className="input input-bordered"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">Vehicle ID</label>
                    <input
                      type="text"
                      name="VehicleID"
                      value={guide.VehicleID || ""}
                      onChange={(e) => handleInputChange(e, setGuide)}
                      className="input input-bordered"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">Gui Type</label>
                    <input
                      type="text"
                      name="GuiType"
                      value={guide.GuiType || ""}
                      onChange={(e) => handleInputChange(e, setGuide)}
                      className="input input-bordered"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">Qualifications</label>
                    <input
                      type="text"
                      name="Qualifications"
                      value={guide.Qualifications || ""}
                      onChange={(e) => handleInputChange(e, setGuide)}
                      className="input input-bordered"
                    />
                  </div>
                  <div className="modal-action">
                    <button className="btn btn-primary" onClick={updateGuideProfile}>
                      Save
                    </button>
                    <button className="btn" onClick={() => setShowGuideModal(false)}>
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
                  <h2 className="font-bold text-lg">Update Vehicle Profile</h2>
                  <div className="form-control">
                    <label className="label">Vehicle Type</label>
                    <input
                      type="text"
                      name="type"
                      value={vehicle.type || ""}
                      onChange={(e) => handleInputChange(e, setVehicle)}
                      className="input input-bordered"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">Capacity</label>
                    <input
                      type="number"
                      name="capacity"
                      value={vehicle.capacity || ""}
                      onChange={(e) => handleInputChange(e, setVehicle)}
                      className="input input-bordered"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">Vehicle Number</label>
                    <input
                      type="text"
                      name="vehicleNumber"
                      value={vehicle.vehicleNumber || ""}
                      onChange={(e) => handleInputChange(e, setVehicle)}
                      className="input input-bordered"
                    />
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
                      onClick={() => setShowVehicleModal(false)}
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
