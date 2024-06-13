import React, { useEffect, useState } from 'react';
import StaffSideBar from '../../Components/staff/StaffSideBar';
import instance from '../../api'; // Adjust the path as needed
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../Assets/logo.png';

const OnGoingTrip = () => {
    const [ongoingTrips, setOngoingTrips] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [status, setStatus] = useState('');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentType, setPaymentType] = useState('');
    const [transactionNo, setTransactionNo] = useState('');
    const [paidAmounts, setPaidAmounts] = useState({});
    const [tripData, setTripData] = useState({
        Price: '',
        StartDate: '',
        EndDate: '',
        AdultsCount: '',
        ChildrenCount: '',
        Description: '',
        SpecialNotes: ''
    });

    useEffect(() => {
        fetchOngoingTrips();
    }, []);

    const fetchOngoingTrips = async () => {
        try {
            const response = await instance.get('/trip/get/onGoingTrips');
            setOngoingTrips(response.data);
            response.data.forEach(trip => fetchPaidAmount(trip.TripID));
        } catch (error) {
            console.error('Error fetching ongoing trips:', error);
        }
    };

    const fetchPaidAmount = async (tripId) => {
        try {
            const response = await instance.get(`/customerPayment/getTotalPaymentByTripID/${tripId}`);
            console.log(response)
            setPaidAmounts(prevState => ({
                ...prevState,
                [tripId]: response.data.TotalPayment
            }));
        } catch (error) {
            console.error('Error fetching paid amount:', error);
        }
    };

    const handleStatusChange = async (tripId) => {
        try {
            await instance.post('/trip/updateTripStatus', { TripID: tripId, Status: status });
            fetchOngoingTrips(); // Refresh the trips list
            toast.success('Trip status updated successfully');
        } catch (error) {
            console.error('Error updating trip status:', error);
            toast.error('Error updating trip status');
        }
    };

    const openPaymentModal = (trip) => {
        setSelectedTrip(trip);
        document.getElementById('payment-modal').checked = true;
    };

    const openUpdateModal = (trip) => {
        setSelectedTrip(trip);
        setTripData({
            Price: trip.Price,
            StartDate: trip.StartDate.split('T')[0],
            EndDate: trip.EndDate.split('T')[0],
            AdultsCount: trip.AdultsCount,
            ChildrenCount: trip.ChildrenCount,
            Description: trip.Description,
            SpecialNotes: trip.SpecialNotes
        });
        document.getElementById('update-modal').checked = true;
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        if (!tripData.Price || !tripData.StartDate || !tripData.EndDate || !tripData.AdultsCount) {
            toast.error('Please fill in all required fields');
            return;
        }
        try {
            await instance.put('/trip/updateTripData', { TripID: selectedTrip.TripID, ...tripData });
            document.getElementById('update-modal').checked = false;
            fetchOngoingTrips(); // Refresh the trips list
            toast.success('Trip data updated successfully');
        } catch (error) {
            console.error('Error updating trip data:', error);
            toast.error('Error updating trip data');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTripData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        doc.addImage(logo, 'PNG', pageWidth / 2 - 20, 10, 40, 20); // Centered logo
        doc.setFontSize(12);
        doc.text('SWEN Tours & Travels (Pvt) Ltd.', pageWidth / 2, 40, { align: 'center' });
        doc.text('Nagoda road, Katukurunda', pageWidth / 2, 48, { align: 'center' });

        doc.setFontSize(16);
        doc.text('Customer Payment Bill', pageWidth / 2, 60, { align: 'center' });

        doc.autoTable({
            startY: 70,
            head: [['Trip ID', 'Amount', 'Payment Type', 'Transaction Number', 'Date']],
            body: [
                [
                    selectedTrip.TripID,
                    paymentAmount,
                    paymentType,
                    transactionNo,
                    new Date().toISOString().split('T')[0]
                ]
            ]
        });
        return doc.output('blob');
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        if (!paymentAmount || paymentAmount <= 0) {
            toast.error('Please enter a valid payment amount');
            return;
        }
        if (!paymentType) {
            toast.error('Please select a payment type');
            return;
        }
        if (!transactionNo) {
            toast.error('Please enter a transaction number');
            return;
        }

        try {
            const paymentData = {
                TripID: selectedTrip.TripID,
                Amount: paymentAmount,
                Date: new Date().toISOString().split('T')[0], // Today's date
                PaymentType: paymentType,
                TransactionNo: transactionNo
            };
            const pdfBlob = generatePDF();
            const formData = new FormData();
            formData.append('TripID', selectedTrip.TripID);
            formData.append('Amount', paymentAmount);
            formData.append('Date', new Date().toISOString().split('T')[0]);
            formData.append('PaymentType', paymentType);
            formData.append('TransactionNo', transactionNo);
            formData.append('bill', pdfBlob, `Bill_Trip_${selectedTrip.TripID}.pdf`);

            await instance.post('/customerPayment/addPayment', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            document.getElementById('payment-modal').checked = false;
            fetchOngoingTrips(); // Refresh the trips list
            toast.success('Payment submitted successfully');
        } catch (error) {
            console.error('Error submitting payment:', error);
            toast.error('Error submitting payment');
        }
    };


    return (
        <div className="flex flex-row">
            <div className="w-[25%]">
                <StaffSideBar activeItem="ongoingtrip" />
            </div>
            <div className="w-[2px] bg-[#F69412]"></div>
            <div className='bg-[#EFEFEF] w-full overflow-auto h-screen'>
                <div className='bg-[#D9D9D9] flex items-center h-[8%]  pl-5'>
                    <h1 className="text-2xl font-semibold">Ongoing Trips</h1>
                </div>
                <div className='mb-5 p-4'>
                    <div className='flex-col mt-10 px-5'>
                        {ongoingTrips.length === 0 ? (
                            <p>No ongoing trips found.</p>
                        ) : (
                            <table className="min-w-full bg-white border">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border">Trip ID</th>
                                        <th className="py-2 px-4 border">Customer ID</th>
                                        <th className="py-2 px-4 border">Guide ID</th>
                                        <th className="py-2 px-4 border">Start Date</th>
                                        <th className="py-2 px-4 border">End Date</th>
                                        <th className="py-2 px-4 border">Status</th>
                                        <th className="py-2 px-4 border">Price</th>
                                        <th className="py-2 px-4 border">Paid Amount</th>
                                        <th className="py-2 px-4 border">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ongoingTrips.map(trip => (
                                        <tr key={trip.TripID}>
                                            <td className="py-2 px-4 border">{trip.TripID}</td>
                                            <td className="py-2 px-4 border">{trip.CustomerID}</td>
                                            <td className="py-2 px-4 border">{trip.GuideID}</td>
                                            <td className="py-2 px-4 border">{trip.StartDate.split('T')[0]}</td>
                                            <td className="py-2 px-4 border">{trip.EndDate.split('T')[0]}</td>
                                            <td className="py-2 px-4 border">{trip.Status}</td>
                                            <td className="py-2 px-4 border">{trip.Price}</td>
                                            <td className="py-2 px-4 border">{paidAmounts[trip.TripID] || 'Loading...'}</td>
                                            <td className="py-2 px-4 border">
                                                <select
                                                    value={status}
                                                    onChange={(e) => setStatus(e.target.value)}
                                                    className="mr-2 border bg-white rounded p-1"
                                                >
                                                    <option value="">Select Status</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                    <option value="Started">Started</option>
                                                    <option value="Completed">Completed</option>
                                                </select>
                                                <button
                                                    onClick={() => handleStatusChange(trip.TripID)}
                                                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                                >
                                                    Update Status
                                                </button>
                                                <button
                                                    onClick={() => openPaymentModal(trip)}
                                                    className="bg-green-500 text-white px-2 py-1 rounded"
                                                >
                                                    Payment
                                                </button>
                                                <button
                                                    onClick={() => openUpdateModal(trip)}
                                                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                                                >
                                                    Update Trip
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <input type="checkbox" id="payment-modal" className="modal-toggle" />
                    <div className="modal">
                        <div className="modal-box">
                            <h2 className="text-xl font-semibold mb-4">Customer Payment</h2>
                            <form onSubmit={handlePaymentSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Amount</label>
                                    <input
                                        type="number"
                                        value={paymentAmount}
                                        onChange={(e) => setPaymentAmount(e.target.value)}
                                        className="border rounded bg-white p-2 w-full"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Payment Type</label>
                                    <select
                                        value={paymentType}
                                        onChange={(e) => setPaymentType(e.target.value)}
                                        className="border rounded bg-white p-2 w-full"
                                        required
                                    >
                                        <option value="">Select Payment Type</option>
                                        <option value="Bank Payment">Bank Payment</option>
                                        <option value="Cash">Cash</option>
                                        <option value="Online Transfer">Online Transfer</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Transaction Number</label>
                                    <input
                                        type="text"
                                        value={transactionNo}
                                        onChange={(e) => setTransactionNo(e.target.value)}
                                        className="border rounded bg-white p-2 w-full"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById('payment-modal').checked = false}
                                        className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                    >
                                        Submit Payment
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <input type="checkbox" id="update-modal" className="modal-toggle" />
                    <div className="modal">
                        <div className="modal-box">
                            <h2 className="text-xl font-semibold mb-4">Update Trip</h2>
                            <form onSubmit={handleUpdateSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Price</label>
                                    <input
                                        type="number"
                                        name="Price"
                                        value={tripData.Price}
                                        onChange={handleInputChange}
                                        className="border rounded bg-white p-2 w-full"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Start Date</label>
                                    <input
                                        type="date"
                                        name="StartDate"
                                        value={tripData.StartDate}
                                        onChange={handleInputChange}
                                        className="border rounded bg-white p-2 w-full"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">End Date</label>
                                    <input
                                        type="date"
                                        name="EndDate"
                                        value={tripData.EndDate}
                                        onChange={handleInputChange}
                                        className="border rounded bg-white p-2 w-full"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Adults Count</label>
                                    <input
                                        type="number"
                                        name="AdultsCount"
                                        value={tripData.AdultsCount}
                                        onChange={handleInputChange}
                                        className="border rounded bg-white p-2 w-full"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Children Count</label>
                                    <input
                                        type="number"
                                        name="ChildrenCount"
                                        value={tripData.ChildrenCount}
                                        onChange={handleInputChange}
                                        className="border rounded bg-white p-2 w-full"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Description</label>
                                    <textarea
                                        name="Description"
                                        value={tripData.Description}
                                        onChange={handleInputChange}
                                        className="border rounded bg-white p-2 w-full"
                                        required
                                    ></textarea>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Special Notes</label>
                                    <textarea
                                        name="SpecialNotes"
                                        value={tripData.SpecialNotes}
                                        onChange={handleInputChange}
                                        className="border rounded bg-white p-2 w-full"
                                    ></textarea>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById('update-modal').checked = false}
                                        className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                    >
                                        Update Trip
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnGoingTrip;
