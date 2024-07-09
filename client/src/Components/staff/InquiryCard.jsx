import React, { useEffect, useState } from 'react';
import instance from '../../api'; // Import the Axios instance for API requests
import Divider from '@mui/material/Divider';

const InquiryCard = (inquiryID) => {
    const [inquiry, setInquiry] = useState([]);

    // Fetch inquiries when the component mounts
    useEffect(() => {
        fetchInquiries();
    }, []);

    // Function to fetch inquiries from the API
    const fetchInquiries = async () => {
        try {
            const response = await instance.get(`/inquiry/${inquiryID.inquiryID}`);
            setInquiry(response.data);
        } catch (error) {
            console.error('Error fetching inquiries:', error);
        }
    };

    // Format date to 'YYYY-MM-DD' format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-CA');
    };

    return (
        <>
            <div className='flex flex-row'>
                <div className='bg-[#ffffff] w-full overflow-auto'>
                    <div className='mb-5 p-4'>
                        {inquiry && (
                            <div className={`flex flex-col w-full mb-4 p-4 bg-[#f2f2f2] rounded-lg shadow-md`}>
                                <div className="flex items-center">
                                    <div className="ml-8 mr-[60px] space-y-3 w-[50%]">
                                        <div>Inquiry ID: {inquiry.InquiryID}</div>
                                        <div>Inquiry Date: <b>{formatDate(inquiry.InquiryDate)}</b></div>
                                        <div>Customer ID: <b>{inquiry.CustomerID}</b></div>
                                        <div>Customer Name: <b>{inquiry.FirstName}</b></div>
                                        <div>Customer Email: <b>{inquiry.Email}</b> </div>
                                        <div>Customer Phone: <b>{inquiry.PhoneNumber}</b></div>
                                        <div>Customer Country: <b>{inquiry.Country}</b></div>
                                        <div>Arrival Date: <b>{formatDate(inquiry.ArrivalDate)}</b></div>
                                        <div>Departure Date: <b>{formatDate(inquiry.DepartureDate)}</b></div>
                                        <div>Adults Count: <b>{inquiry.AdultsCount}</b></div>
                                        <div>Children Count: <b>{inquiry.ChildrenCount}</b></div>
                                    </div>
                                    <Divider orientation="vertical" flexItem />
                                    <div className="flex mx-8 w-[40%] justify-center">
                                        <div>Message: <b>{inquiry.Message}</b></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div >
        </>
    );
}

export default InquiryCard;

