import React, { useEffect, useState } from 'react';
import instance from '../../api'; // Import the Axios instance for API requests
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../../Components/admin/Navbar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from '../../Assets/logo.png';
import TripCard from '../../Components/staff/TripCard';
import Swal from 'sweetalert2';

const AdminOnGoingTrip = () => {
    const [ongoingTrips, setOngoingTrips] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [Payments, setPayments] = useState();
    const [PaymentAmount, setPaymentAmount] = useState();
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
        SpecialNotes: '',
        GuideID: ''
    });
    const [guides, setGuides] = useState([]);
    const [filteredGuides, setFilteredGuides] = useState([]);
    const [searchGuide, setSearchGuide] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchOngoingTrips();
        fetchAllGuides(); // Fetch all guides initially
    }, []);

    // Fetch all ongoing trips
    const fetchOngoingTrips = async () => {
        try {
            const res = await instance.get(`/trip/`);
            const ongoingtrips = res.data.filter(trip =>
                trip.Status != 'Close' && trip.Status != 'End'
            );
            setOngoingTrips(ongoingtrips);
            ongoingtrips.forEach(trip => fetchPaidAmount(trip.TripID));
        } catch (error) {
            console.error('Error fetching ongoing trips:', error);
        }
    };

    // Fetch the total amount paid for a specific trip
    const fetchPaidAmount = async (tripId) => {
        try {
            const response = await instance.get(`/customerPayment/getTotalPaymentByTripID/${tripId}`);
            setPaidAmounts(prevState => ({
                ...prevState,
                [tripId]: response.data.TotalPayment
            }));
        } catch (error) {
            console.error('Error fetching paid amount:', error);
        }
    };

    // Fetch payment details for a specific trip
    const fetchPayments = async (tripId) => {
        try {
            const response = await instance.get(`/customerPayment/getPaymentByTripID/${tripId}`);
            setPayments(response.data);
        } catch (error) {
            console.error('Error fetching paid amount:', error);
        }
    };

    // Fetch all guides
    const fetchAllGuides = async () => {
        try {
            const response = await instance.get('/user/getAllGuides');
            setGuides(response.data);
        } catch (error) {
            console.error('Error fetching guides:', error);
        }
    };

    // Toggle modal visibility
    const handleModalToggle = (trip) => {
        setSelectedTrip(trip);
        setShowModal(!showModal);
    };

    // Function to handle Status of a trip
    const handleTrip = async (trip) => {
        if (trip.Status === 'Active') {
            // Show confirmation dialog using SweetAlert
            const confirmResult = await Swal.fire({
                icon: 'question',
                title: 'Are you sure?',
                text: 'Do you want to start this trip?',
                showCancelButton: true,
                confirmButtonText: 'Yes, start it!',
                cancelButtonText: 'No, cancel'
            });

            // Check if user confirmed
            if (confirmResult.isConfirmed) {
                try {
                    // Update trip status to 'Start' using API call
                    await instance.put('/trip/updateTripStatus', { TripID: trip.TripID, Status: 'Started' });

                    // Show success message using SweetAlert
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!'
                    }).then(() => {
                        window.location.reload(); // Reload window on confirmation
                    });
                } catch (error) {
                    console.error('Error updating trip status:', error);

                    // Show error message using SweetAlert
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Failed to update trip status.'
                    });
                }
            }
        } else if (trip.Status === 'Started') {
            // Show confirmation dialog using SweetAlert
            const confirmResult = await Swal.fire({
                icon: 'question',
                title: 'Are you sure?',
                text: 'Do you want to end this trip?',
                showCancelButton: true,
                confirmButtonText: 'Yes, end it!',
                cancelButtonText: 'No, cancel'
            });

            // Check if user confirmed
            if (confirmResult.isConfirmed) {
                try {
                    // Update trip status to 'Start' using API call
                    await instance.put('/trip/updateTripStatus', { TripID: trip.TripID, Status: 'End' });

                    // Show success message using SweetAlert
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!'
                    }).then(() => {
                        window.location.reload(); // Reload window on confirmation
                    });
                } catch (error) {
                    console.error('Error updating trip status:', error);

                    // Show error message using SweetAlert
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Failed to update trip status.'
                    });
                }
            }
        }
    };

    // Open the payment modal
    const openPaymentModal = (trip) => {
        setSelectedTrip(trip);
        document.getElementById('payment-modal').checked = true;
    };

    // Open the view previous payment modal
    const openViewPaymentModal = (trip) => {
        setSelectedTrip(trip);
        fetchPayments(trip.TripID)
        document.getElementById('view-payment-modal').checked = true;
    };

    // Open the update trip modal
    const openUpdateModal = (trip) => {
        setSelectedTrip(trip);
        setTripData({
            Price: trip.Price,
            StartDate: trip.StartDate.split('T')[0],
            EndDate: trip.EndDate.split('T')[0],
            AdultsCount: trip.AdultsCount,
            ChildrenCount: trip.ChildrenCount,
            Description: trip.Description,
            SpecialNotes: trip.SpecialNotes,
            GuideID: trip.GuideID
        });
        document.getElementById('update-modal').checked = true;
    };

    // Handle update form submission
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        if (!tripData.Price || !tripData.StartDate || !tripData.EndDate || !tripData.AdultsCount || !tripData.GuideID) {
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

    // Handle input changes in the update form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTripData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle guide search input
    const handleGuideSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setSearchGuide(searchTerm);
        if (searchTerm.length > 2) {
            const filtered = guides.filter(guide =>
                guide.FirstName.toLowerCase().includes(searchTerm) ||
                guide.LastName.toLowerCase().includes(searchTerm)
            );
            setFilteredGuides(filtered);
        } else {
            setFilteredGuides([]);
        }
    };

    // Generate PDF for payment
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
                    `$${PaymentAmount}`,
                    paymentType,
                    transactionNo,
                    new Date().toISOString().split('T')[0]
                ]
            ]
        });
        return doc.output('blob');
    };

    // Handle payment form submission
    const handlePaymentSubmit = async (e) => {

        e.preventDefault();
        const paidAmount = paidAmounts[selectedTrip.TripID] || 0;
        const paymentAmount = parseInt(PaymentAmount, 10); // Convert to integer


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

        // Check if the trip price is less than the payment amount and there is no previous payment
        if (paidAmount === 0 && paymentAmount > selectedTrip.Price) {
            toast.error('The Amount is Larger than the Package Price.');
            return;
        }

        // Check if the total payment (previous + current) exceeds the trip price
        if (paidAmount > 0 && (paidAmount + paymentAmount) > selectedTrip.Price) {
            toast.error('The Total Payment Amount Exceeds the Package Price.');
            return;
        }

        // Check if the payment amount equals the trip price and the payment type is full payment
        if (paymentAmount === selectedTrip.Price) {
            if (paymentType !== 'Full Payment' || paidAmount > 0) {
                toast.error('Full payment should be made when no amount has been previously paid.');
                return;
            }
        }

        // Check if the payment type is Advance
        if (paymentType === 'Advance Payment') {
            // Advance payment should be less than the trip price when added to previous payments
            if ((paidAmount + paymentAmount) >= selectedTrip.Price) {
                toast.error('Advance payment should be less than package price when added with previous paid amount.');
                return;
            }
        }

        // Check if the payment type is Balance Payment
        if (paymentType === 'Balance Payment') {
            // Balance payment should be equal to the trip price when added to previous payments
            if ((paidAmount + paymentAmount) !== selectedTrip.Price) {
                toast.error('Balance payment should be equal to package price when added with previous paid amount.');
                return;
            }
        }

        // Check if the payment type is Full Payment
        if (paymentType === 'Full Payment') {
            if (paidAmount > 0 && paymentAmount !== selectedTrip.Price) {
                toast.error('Full payment should be equal to package price.');
                return;
            }
        }

        try {
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
            handleCancel();
            toast.success('Payment submitted successfully');
        } catch (error) {
            console.error('Error submitting payment:', error);
            toast.error('Error submitting payment');
        }
    };

    // Handle cancellation of payment form
    const handleCancel = () => {
        setPaymentAmount('');
        setPaymentType('');
        setTransactionNo('');
        document.getElementById('payment-modal').checked = false;
    };

    return (
        <> 
            <ToastContainer /> {/* Container for displaying toast notifications */}
            <div className='flex flex-row'>
                <div className="w-[25%]">
                    <Navbar activeItem="ongoing-trip" />
                </div>
                <div className="w-[2px] bg-[#F69412]"></div>
                <div className='bg-[#EFEFEF] w-full overflow-auto h-screen'>
                    <div className='bg-[#D9D9D9] flex items-center h-[8%]  pl-5'>
                        <h1 className="text-2xl font-semibold">Ongoing Trips</h1>
                    </div>
                    <div className='mb-5 p-4'>
                        <div className='flex-col mt-10 px-5'>
                            {ongoingTrips.length === 0 ? (
                                <div className="text-gray-500 text-lg">No Ongoing Trips found</div>
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
                                            <th className="py-2 px-4 border">More Details</th>
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
                                                <td className="py-2 px-4 border">${trip.Price}</td>
                                                <td className="py-2 px-4 border">${paidAmounts[trip.TripID] || 'Loading...'}</td>
                                                <td className="py-2 px-4 border">
                                                    <div className='flex'>
                                                        <button
                                                            onClick={() => handleModalToggle(trip.TripID)}
                                                            className={`bg-purple-500 text-white px-2 py-1 rounded mr-2`}
                                                        >
                                                            More Details
                                                        </button>
                                                        <button
                                                            onClick={() => openUpdateModal(trip)}
                                                            className="bg-yellow-500 text-white px-2 py-1 rounded"
                                                        >
                                                            Update Trip
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="py-2 px-4 border">
                                                    <div className='flex'>
                                                        {trip.Status === 'Active' && (
                                                            <>
                                                                <button className="bg-[#19b911] text-white px-2 py-1 rounded mr-2" onClick={() => handleTrip(trip)}>Start Trip</button>
                                                            </>
                                                        )}
                                                        {trip.Status === 'Started' && (
                                                            <>
                                                                <button className="bg-[#cd0909] text-white px-2 py-1 rounded mr-2" onClick={() => handleTrip(trip)}>End Trip</button>
                                                            </>
                                                        )}
                                                        {trip.Price !== paidAmounts[trip.TripID] && (
                                                            <button
                                                                onClick={() => openPaymentModal(trip)}
                                                                className="bg-[#3453b8] text-white px-2 py-1 rounded mr-2"
                                                            >
                                                                Payment
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => openViewPaymentModal(trip)}
                                                            className="bg-[#bd6807] text-white px-2 py-1 rounded mr-2"
                                                        >
                                                            View Payments
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Modal for submitting a payment */}
                        <input type="checkbox" id="payment-modal" className="modal-toggle" />
                        <div className="modal">
                            <div className="modal-box">
                                <h2 className="text-xl font-semibold mb-4">Customer Payment</h2>
                                <form onSubmit={handlePaymentSubmit}>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Amount</label>
                                        <input
                                            type="number"
                                            value={PaymentAmount}
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
                                            <option value="Advance Payment">Advance Payment</option>
                                            <option value="Balance Payment">Balance Payment</option>
                                            <option value="Full Payment">Full Payment</option>
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
                                            onClick={handleCancel}
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

                        {/* Modal for viewing previous payments */}
                        <input type="checkbox" id="view-payment-modal" className="modal-toggle" />
                        <div className="modal">
                            <div className="modal-box max-w-3xl">
                                <h2 className="text-xl font-semibold mb-4">Previous Payments</h2>
                                <table className="min-w-full bg-white border">
                                    <thead>
                                        <tr>
                                            <th className="py-2 px-4 border">Payment ID</th>
                                            <th className="py-2 px-4 border">Trip ID</th>
                                            <th className="py-2 px-4 border">Date</th>
                                            <th className="py-2 px-4 border">Payment Type</th>
                                            <th className="py-2 px-4 border">Amount</th>
                                            <th className="py-2 px-4 border">Transaction No</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Payments && Payments.map(payment => (
                                            <tr key={payment.PaymentID}>
                                                <td className="py-2 px-4 border">{payment.PaymentID}</td>
                                                <td className="py-2 px-4 border">{payment.TripID}</td>
                                                <td className="py-2 px-4 border">{payment.Date.split('T')[0]}</td>
                                                <td className="py-2 px-4 border">{payment.PaymentType}</td>
                                                <td className="py-2 px-4 border">$ {payment.Amount}</td>
                                                <td className="py-2 px-4 border">{payment.TransactionNo}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="flex justify-end mt-4">
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById('view-payment-modal').checked = false}
                                        className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Modal for updating trip details */}
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
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Select Guide</label>
                                        <input
                                            type="text"
                                            value={searchGuide}
                                            onChange={handleGuideSearch}
                                            className="border rounded bg-white p-2 w-full"
                                            placeholder="Search by guide name"
                                        />
                                        {filteredGuides.length > 0 && (
                                            <ul className="bg-white border rounded mt-2 max-h-48 overflow-y-auto">
                                                {filteredGuides.map(guide => (
                                                    <li
                                                        key={guide.GuideID}
                                                        onClick={() => {
                                                            setTripData(prevState => ({
                                                                ...prevState,
                                                                GuideID: guide.GuideID
                                                            }));
                                                            setFilteredGuides([]);
                                                            setSearchGuide(guide.FirstName + ' ' + guide.LastName);
                                                        }}
                                                        className="p-2 cursor-pointer hover:bg-gray-200"
                                                    >
                                                        {guide.FirstName} {guide.LastName}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
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

                {/* Modal for More trip details */}
                {showModal && selectedTrip && (
                    <div className="modal modal-open">
                        <div className="modal-box max-w-7xl h-auto">
                            <h2 className="font-bold text-lg mb-2">Trip Details</h2>
                            <TripCard allocatedTrip={selectedTrip} />
                            <div className="modal-action">
                                <button className="btn btn-secondary text-white" onClick={handleModalToggle}>Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminOnGoingTrip;
