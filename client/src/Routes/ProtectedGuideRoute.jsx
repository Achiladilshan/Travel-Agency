
import { Outlet, Navigate } from "react-router-dom";

export default function ProtectedGuideRoute() {
  const role = localStorage.getItem('role');
 if(role === 'Guide' || role === 'guide'){
  return <Outlet />;
 }else{
   return <Navigate to='/login' />;
 }
}