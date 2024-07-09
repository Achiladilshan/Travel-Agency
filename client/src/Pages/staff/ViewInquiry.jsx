import React, { useState, useEffect } from 'react';
import instance from '../../api'; // Import the Axios instance for API requests
import StaffSideBar from '../../Components/staff/StaffSideBar';
import Chat from '../../Components/staff/Chat';
import InquiryCard from '../../Components/staff/InquiryCard';


const ViewInquiry = () => {
  const [inquiries, setInquiries] = useState([]);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedInquiryID, setSelectedInquiryID] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch inquiries when the component mounts
  useEffect(() => {
    fetchInquiries();
  }, []);

  // Function to fetch inquiries from the API
  const fetchInquiries = async () => {
    try {
      const response = await instance.get('/inquiry/');
      setInquiries(response.data);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    }
  };

  // Function to handle the "Chat" button click
  const handleChatClick = (inquiryID) => {
    setSelectedInquiryID(inquiryID);
    setShowChatModal(true);
  };

  // Toggle modal visibility
  const handleModalToggle = (inquiryID) => {
    setSelectedInquiryID(inquiryID);
    setShowModal(!showModal);
  };

  // Function to handle the "Cancel" button click
  const handleCancelClick = async (inquiryID) => {
    try {
      await instance.put(`/inquiry/updateInquiryStatus/${inquiryID}`, { Status: 'cancel' });
      fetchInquiries(); // Refresh inquiries list after status update
    } catch (error) {
      console.error('Error updating inquiry status:', error);
    }
  };

  return (
    <div className="flex flex-row">
      <div className="w-[25%]">
        <StaffSideBar activeItem="Inquiry" />
      </div>
      <div className="w-[2px] bg-[#F69412]"></div>
      <div className='bg-[#EFEFEF] w-full overflow-auto h-screen'>
        <div className='bg-[#D9D9D9] flex items-center h-[8%]  pl-5'>
          <h1 className="text-2xl font-semibold">Inquiries</h1>
        </div>
        <div className='mb-5 p-4'>
          <div className='flex-col mt-10 px-5'>
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Inquiry ID</th>
                  <th className="py-2 px-4 border-b">Inquiry Date</th>
                  <th className="py-2 px-4 border-b">Arrival Date</th>
                  <th className="py-2 px-4 border-b">Departure Date</th>
                  <th className="py-2 px-4 border-b">Customer Name</th>
                  <th className="py-2 px-4 border-b">Country</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">More Details</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inquiry) => (
                  <tr key={inquiry.InquiryID}>
                    <td className="py-2 px-4 border-b">{inquiry.InquiryID}</td>
                    <td className="py-2 px-4 border-b">{inquiry.InquiryDate.split('T')[0]}</td>
                    <td className="py-2 px-4 border-b">{inquiry.ArrivalDate.split('T')[0]}</td>
                    <td className="py-2 px-4 border-b">{inquiry.DepartureDate.split('T')[0]}</td>
                    <td className="py-2 px-4 border-b">{inquiry.FirstName} {inquiry.LastName}</td>
                    <td className="py-2 px-4 border-b">{inquiry.Country}</td>
                    <td className="py-2 px-4 border-b">{inquiry.Status}</td>
                    <td className="py-2 px-4 border">
                      <button
                        onClick={() => handleModalToggle(inquiry.InquiryID)}
                        className={`bg-purple-500 text-white px-2 py-1 rounded mr-2`}
                      >
                        More Details
                      </button>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <div className='flex'>
                        <button
                          onClick={() => handleChatClick(inquiry.InquiryID)}
                          className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 mr-2"
                        >
                          Chat
                        </button>
                        <button
                          onClick={() => handleCancelClick(inquiry.InquiryID)}
                          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {showChatModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-md p-4 w-full max-w-lg h-auto overflow-y-auto relative">
              <button className="absolute top-4 right-4 text-[red] font-bold text-xl" onClick={() => setShowChatModal(false)}>
                Close
              </button>
              <Chat inquiryID={selectedInquiryID} />
            </div>
          </div>
        )}

        {showModal && selectedInquiryID && (
          <div className="modal modal-open">
            <div className="modal-box max-w-7xl h-auto">
              <h2 className="font-bold text-lg mb-2">Inquiry Details</h2>
              <InquiryCard inquiryID={selectedInquiryID} />
              <div className="modal-action">
                <button className="btn btn-secondary text-white" onClick={handleModalToggle}>Close</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ViewInquiry;
