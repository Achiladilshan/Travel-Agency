import { Outlet, Navigate } from "react-router-dom";

export default function ProtectedStaffRoute() {
  const role = localStorage.getItem('role');
 if(role === 'Staff' || role === 'staff'){
  return <Outlet />;
 }else{
   return <Navigate to='/login' />;
 }
}