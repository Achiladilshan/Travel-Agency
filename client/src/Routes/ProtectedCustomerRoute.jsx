import { Outlet, Navigate } from "react-router-dom";

export default function ProtectedCustomerRoute() {
  const role = localStorage.getItem('role');
 if(role === 'Customer' || role === 'customer'){
  return <Outlet />;
 }else{
   return <Navigate to='/login' />;
 }
}