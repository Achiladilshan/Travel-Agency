import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import Navbar from '../../Components/customer/Navbar';
import instance from '../../api';


const ViewPayment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const fetchUserID = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          setUserID(decodedToken.id); // Assuming the token contains a UserID field
        } catch (error) {
          console.error('Error decoding token:', error);
          setError('Invalid token');
        }
      } else {
        setError('No access token found');
      }
    };

    fetchUserID();
  }, []);

  useEffect(() => {
    if (userID) {
      const fetchPayments = async () => {
        try {
          const response = await instance.get(`/customerPayment/getPaymentByCustomerID/${userID}`);
          setPayments(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching payments:', error);
          setError('Error fetching payments');
          setLoading(false);
        }
      };

      fetchPayments();
    }
  }, [userID]);

  if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;

  return (
    <div className='flex'>
      <div className= "w-[25%]">
        <Navbar activeItem={"view-payment"}/>
      </div>
      <div className= "w-[2px] bg-[#F69412]">
      </div>
      <div className="bg-[#EFEFEF] pl-5 w-lvw">
        <h1 className="text-2xl font-semibold mb-4">Payments</h1>
        {payments.length === 0 ? (
          <p>No payments found.</p>
        ) : (
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Payment ID</th>
                <th className="py-2 px-4 border">Trip ID</th>
                <th className="py-2 px-4 border">Amount</th>
                <th className="py-2 px-4 border">Payment Type</th>
                <th className="py-2 px-4 border">Transaction Number</th>
                <th className="py-2 px-4 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment.PaymentID}>
                  <td className="py-2 px-4 border">{payment.PaymentID}</td>
                  <td className="py-2 px-4 border">{payment.TripID}</td>
                  <td className="py-2 px-4 border">{payment.Amount}</td>
                  <td className="py-2 px-4 border">{payment.PaymentType}</td>
                  <td className="py-2 px-4 border">{payment.TransactionNo}</td>
                  <td className="py-2 px-4 border">{new Date(payment.Date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ViewPayment;
