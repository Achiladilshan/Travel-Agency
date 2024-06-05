import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import instance from "../../api";
import { useNavigate } from "react-router-dom";
import { ContactSupportOutlined } from "@mui/icons-material";
import AdminNavBar from '../../Components/guide/Navbar';

const GuideDashboard = () => {
  const navigate = useNavigate();
  const [guide, setGuide] = useState({});
  const [vehicle, setVehicle] = useState({});
  const [availability, setAvailability] = useState({
    startDate: "",
    endDate: "",
  });
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);

  useEffect(() => {
    fetchGuideData();
    fetchVehicleData();
  }, []);

  const fetchGuideData = async () => {
    try {
      const response = await instance.get("/auth/current-user");
      const user = response.data.user;
      if (user && user?.role === "Guide") {
        const guideResponse = await instance.get("/user/getGuideProfile");
        setGuide(guideResponse.data);
        // console.log(guide);
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

  // const updateVehicleProfile = async () => {
  //   try {
  //     await instance.put("/vehicle/updateVehicleProfile", vehicle);
  //     toast.success("Vehicle profile updated successfully");
  //     setShowVehicleModal(false);
  //   } catch (error) {
  //     toast.error("Failed to update vehicle profile");
  //   }
  // };

  const updateAvailability = async () => {
    try {
      await instance.post("/guideAvailability/addAvailability", { GuideID: guide.GuideID, StartDate: availability.startDate, EndDate: availability.endDate });
      toast.success("Availability Added successfully");
      setShowAvailabilityModal(false);
    } catch (error) {
      toast.error("Failed to update availability");
    }
  };

  const handleViewTours = () => {
    navigate('/guide/tours')
  }

  return (
    <div className='flex flex-row'>
      <div className="w-[25%]">
        <AdminNavBar activeItem={"dashbaord"} />
      </div>
      <div className="w-[2px] bg-[#F69412]"></div>
      <div className='bg-[#EFEFEF] w-full'>
        <div className='bg-[#D9D9D9] flex items-center h-[8%]  pl-5'>
          <h1 className="text-2xl font-semibold">Guide Dashboard</h1>
        </div>
        <div className='h-[92%] p-8 ml-10'>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            <div className="card w-96 bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Add Guide Availability</h2>
                <p>Add your availability date range</p>
                <div className="card-actions justify-end">
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowAvailabilityModal(true)}
                  >
                    Add
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

            {/* <div className="card w-96 bg-base-100 shadow-xl">
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
        </div> */}
          </div>

          <div className="w-96 m-8">
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
            <div className="modal modal-open">
              <div className="modal-box">
                <h2 className="font-bold text-lg">Update Availability</h2>
                <div className="form-control">
                  <label className="label">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={availability.startDate}
                    onChange={(e) => handleInputChange(e, setAvailability)}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={availability.endDate}
                    onChange={(e) => handleInputChange(e, setAvailability)}
                    className="input input-bordered"
                  />
                </div>
                <div className="modal-action">
                  <button className="btn btn-primary" onClick={updateAvailability}>
                    Save
                  </button>
                  <button
                    className="btn"
                    onClick={() => setShowAvailabilityModal(false)}
                  >
                    Cancel
                  </button>
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

          {/* Vehicle Profile Modal
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
      )} */}
        </div>
      </div>
    </div>

  );
};

export default GuideDashboard;
