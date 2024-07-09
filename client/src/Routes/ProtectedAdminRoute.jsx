import { Outlet, Navigate } from "react-router-dom";

export default function ProtectedAdminRoute() {
  const role = localStorage.getItem('role');
 if(role === 'Admin' || role === 'admin'){
  return <Outlet />;
 }else{
   return <Navigate to='/login' />;
 }
}