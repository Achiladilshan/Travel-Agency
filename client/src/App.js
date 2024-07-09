import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/Home';
import LoginPage from './Pages/Login';
import Tours from './Pages/Tours';
import AboutUs from './Pages/Aboutus';
import Inquire from './Pages/Inquire';
import CustomerCurrent from './Pages/customer/currentTrips';
import CustomerPrevious from './Pages/customer/previousTrips';
import AdminDashboard from './Pages/admin/AdminDashboard';
import UserManagement from './Pages/admin/UserManagement';
import FeedbackPage from './Pages/admin/FeedbackPage';
import GuideDashboard from './Pages/guide/GuideDashboard';
import HotelManagement from './Pages/admin/HotelManagement';
import TourPackage from './Pages/admin/TourPackage';
import ProtectedAdminRoute from './Routes/ProtectedAdminRoute';
import ProtectedGuideRoute from './Routes/ProtectedGuideRoute';
import ProtectedCustomertRoute from './Routes/ProtectedCustomerRoute';
import ProtectedStaffRoute from './Routes/ProtectedStaffRoute';
import TourManage from './Pages/staff/TourManage';
import AddTour from './Pages/admin/AddTour';
import Guidecurrent from './Pages/guide/CurrentTrips';
import Guideprevious from './Pages/guide/PreviousTrips';
import OnGoingTrip from './Pages/staff/OnGoingTrip';
import PreviousTrips from './Pages/staff/PreviousTrips';
import ViewHotels from './Pages/staff/ViewHotels';
import ViewGuides from './Pages/staff/ViewGuides';
import ViewInquiry from './Pages/staff/ViewInquiry';
import GuidePayments from './Pages/staff/GuidePayment';
import GuidePaymentsAdmin from './Pages/admin/GuidePaymentAdmin';
import InquiryPage from './Pages/customer/InquiryPage';
import ViewPayment from './Pages/customer/ViewPayment';
import AdminOnGoingTrip from './Pages/admin/AdminOnGoingTrip ';
import AdminPreviousTrips from './Pages/admin/AdminPreviousTrips';
import ViewGuidesAdmin from './Pages/admin/ViewGuidesAdmin';


function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePage />}/>
        <Route exact path="/login" element={<LoginPage />}/>
        <Route exact path="/tours" element={<Tours />}/>
        <Route exact path="/about-us" element={<AboutUs />}/>
        <Route exact path="/inquire" element={<Inquire />}/>
        <Route element={<ProtectedCustomertRoute/>}>
          <Route exact path="/Customer/current-trip" element={<CustomerCurrent />}/>
          <Route exact path="/Customer/previous-trip" element={<CustomerPrevious />}/>
          <Route exact path="/Customer/view-payment" element={<ViewPayment/>}/>
          <Route exact path="/Customer/inquiry" element={<InquiryPage />}/>
        </Route>
        <Route element={<ProtectedAdminRoute/>}>
          <Route path="/admin-dashboard" element={<AdminDashboard/>} />
          <Route path='/admin/user' element={<UserManagement/>}/>
          <Route path='/admin/feedback' element={<FeedbackPage/>}/>
          <Route path='/admin/hotel' element={<HotelManagement/>}/>
          <Route path='/admin/ongoing-trip' element={<AdminOnGoingTrip/>}/>
          <Route path='/admin/previous-trip' element={<AdminPreviousTrips/>}/>
          <Route path='/admin/guide' element={<ViewGuidesAdmin/>}/>
          <Route path='/admin/tourpackage' element={<TourPackage/>}/>
          <Route path='/admin/guidepayment' element={<GuidePaymentsAdmin/>}/>
          <Route path='/admin/addtour' element={<AddTour/>}/>

        </Route>
        
        <Route element={<ProtectedGuideRoute/>}>
        <Route path='/guide-dashboard' element={<GuideDashboard/>}/>
        <Route path='/guide/currenttrips' element={<Guidecurrent/>}/>
        <Route path='/guide/previoustrips' element={<Guideprevious/>}/>
        </Route>

        <Route element={<ProtectedStaffRoute/>}>
        <Route path='/staff-dashboard' element={<ViewInquiry/>}/>
        <Route path='/staff/addtour' element={<TourManage/>}/>
        <Route path='/staff/ongoingTrip' element={<OnGoingTrip/>}/>
        <Route path='/staff/previousTrip' element={<PreviousTrips/>}/>
        <Route path='/staff/hotels' element={<ViewHotels/>}/>
        <Route path='/staff/guides' element={<ViewGuides/>}/>
        <Route path='/staff/guidepayment' element={<GuidePayments/>}/>
        {/* <Route path='/staff/inquiry' element={<ViewInquiry/>}/> */}
        {/* <Route path='/staff/chat/:inquiryID' element={</>}/> */}
        </Route>

        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
