import { React, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { AiOutlineDashboard } from "react-icons/ai";
import { FaCartArrowDown } from "react-icons/fa";
import { FaPerson } from "react-icons/fa6";
import { AiOutlineStock } from "react-icons/ai";
import { MdLogout } from "react-icons/md";
import { MdTour } from "react-icons/md";
import { MdOutlinePayment } from "react-icons/md";
import { MdFeedback } from "react-icons/md";
import { FaHotel } from "react-icons/fa6";

const AdminSideBar = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Function to toggle the sidebar state
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };
  const handleLogout = () => {
    localStorage.clear(); // Clear all items from local storage
    window.location.href = '/login'; // Redirect to login page
  };

  // Define the width for expanded and collapsed sidebar
  const expandedWidth = "w-15p";
  const collapsedWidth = "w-5p";

  return (
    <div
      className={`${
        isExpanded ? expandedWidth : collapsedWidth
      } bg-blue-100 h-screen p-5 transition-width duration-300`}
    >
      <div className="flex items-center space-x-4 p-2 mb-5">
        {/* Toggle button */}
        <button
          onClick={toggleSidebar}
          className="text-xl rounded-full p-2 hover:bg-blue-200"
        >
          {isExpanded ? <FiX /> : <FiMenu />}
        </button>
        {/* Logo and title */}
        {isExpanded && (
          <div className="flex-grow">
            <svg
              className="h-8 w-8 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            ></svg>
            <span className="text-lg text-blue-800 font-semibold">Admin Dashboard</span>
          </div>
        )}
      </div>

      <nav>
        <a
          href="/admin-dashboard"
          class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-blue-200"
        >
          <svg
            class="w-6 h-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            
          <AiOutlineDashboard size="20" /></svg>
          {!isExpanded ? null : <span class="ml-3 text-black">Dashboard</span>}

        </a>

        <a
          href="/admin/user"
          class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-blue-200"
        >
          <svg
            class="w-6 h-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          > <FaPerson size ="20"/>  </svg>

          {!isExpanded ? null : (
            <>
              <span class="flex-1 ml-3 whitespace-nowrap text-black">User Management</span>
             
            </>
          )}
          {/* <span class="">Orders</span> */}
        </a>
        <a
          href="/admin/tourpackage"
          class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-blue-200"
        >
          <svg
            class="w-6 h-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          ><MdTour size="20" className="mx-auto my-auto"/> </svg>
          {!isExpanded ? null : <span class="ml-3 text-black">Tour Package</span>}
          {/* <span class="ml-3">Suppliers</span> */}
        </a>

        <a
          href="/inventry/inventory"
          class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-blue-200"
        >
          <svg
            class="w-6 h-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          > <MdOutlinePayment size = "20"/> </svg>
          {!isExpanded ? null : <span class="ml-3 text-black">Payments</span>}
          {/* <span class="ml-3">Inventory</span> */}
        </a>

        <a
          href="/admin/hotel"
          class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-blue-200"
        >
          <svg
            class="w-6 h-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          > <FaHotel size = "20"/> </svg>
          {!isExpanded ? null : <span class="ml-3 text-black">Hotel</span>}
          {/* <span class="ml-3">Inventory</span> */}
        </a>

        <a
          href="/admin/feedback"
          class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-blue-200"
        >
          <svg
            class="w-6 h-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          > <MdFeedback size = "20"/> </svg>
          {!isExpanded ? null : <span class="ml-3 text-black">Feedback</span>}
          {/* <span class="ml-3">Inventory</span> */}
        </a>
      </nav>
      <div className="mt-auto">
        <a
          href="#"
          className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-blue-200"
          onClick={handleLogout} // Attach the handleLogout function to the onClick event
        >
          <MdLogout size="24" color="red" />
          {!isExpanded ? null : <span className="ml-3 text-black">Logout</span>}
        </a>
    </div>
    </div>
  );
};

export default AdminSideBar;
