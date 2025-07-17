// ----- added third component

import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../Components/Landing/Header";
import First from "../Components/Landing/First";
import Second from "../Components/Landing/Second";
import Friends from "../Components/Landing/Friends";
import Messages from "../Components/Chat/Messages";
import Photos from "../Components/Landing/Photos";
import Videos from "../Components/Landing/Videos";
import Third from "../Components/Landing/Third";
import { RiHome6Line } from "react-icons/ri";
import { FaUserFriends } from "react-icons/fa";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { IoMdPhotos } from "react-icons/io";
import { IoVideocam } from "react-icons/io5";
import { Link } from "react-router-dom";
import { HiMenu } from "react-icons/hi"; // Hamburger icon

const LandingPage = ({ socket }) => {
  const [isThirdVisible, setIsThirdVisible] = useState(false);

  const toggleThird = () => {
    setIsThirdVisible(!isThirdVisible);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-20">
        <Header />
      </div>

      {/* Main layout: below header */}
      <div className="flex flex-col lg:flex-row flex-1 pt-[64px] lg:pt-[80px] w-full">
        {/* Left Spacer - Matches the width of First on desktop */}
        <div className="hidden lg:block lg:w-1/4"></div>

        {/* Middle Scrollable Content */}
        <div className="lg:w-1/2 w-full px-2 lg:px-4 py-5 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Second />} />
            <Route path="feed" element={<Second />} />
            <Route path="friends" element={<Friends />} />
            <Route path="messages" element={<Messages socket={socket} />} />
            <Route path="photos" element={<Photos />} />
            <Route path="videos" element={<Videos />} />
          </Routes>
        </div>

        {/* Right Spacer - Matches the width of Third on desktop */}
        <div className="hidden lg:block lg:w-1/4"></div>

        {/* Left Sidebar - Fixed on desktop */}
        <div className="hidden lg:block lg:w-1/4 px-2 fixed top-[80px] bottom-0 left-0 overflow-y-auto">
          <First socket={socket} />
        </div>

        {/* Right Sidebar - Fixed on desktop */}
        <div className="hidden lg:block lg:w-1/4 px-2 fixed top-[80px] bottom-0 right-0 overflow-y-auto">
          <Third />
        </div>
      </div>

      {/* Mobile Hamburger Menu and Third Component Toggle */}
      <div className="block lg:hidden">
        {/* Hamburger Menu */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 z-50 shadow-lg h-16 flex justify-between items-center">
          <button
            onClick={toggleThird}
            className="text-gray-700 hover:text-blue-500 focus:outline-none"
          >
            <HiMenu className="text-2xl" />
          </button>
          <ul className="flex justify-around items-center flex-1">
            <Link to="/home/feed">
              <li className="text-gray-700 hover:text-blue-500 flex flex-col items-center">
                <RiHome6Line className="text-xl sm:text-2xl" />
                <span className="text-xs">Feed</span>
              </li>
            </Link>
            <Link to="/home/friends">
              <li className="text-gray-700 hover:text-blue-500 flex flex-col items-center">
                <FaUserFriends className="text-xl sm:text-2xl" />
                <span className="text-xs">Friends</span>
              </li>
            </Link>
            <Link to="/messages">
              <li className="text-gray-700 hover:text-blue-500 flex flex-col items-center">
                <IoChatboxEllipsesOutline className="text-xl sm:text-2xl" />
                <span className="text-xs">Messages</span>
              </li>
            </Link>
            <Link to="/home/photos">
              <li className="text-gray-700 hover:text-blue-500 flex flex-col items-center">
                <IoMdPhotos className="text-xl sm:text-2xl" />
                <span className="text-xs">Photos</span>
              </li>
            </Link>
            <Link to="/home/videos">
              <li className="text-gray-700 hover:text-blue-500 flex flex-col items-center">
                <IoVideocam className="text-xl sm:text-2xl" />
                <span className="text-xs">Videos</span>
              </li>
            </Link>
          </ul>
        </div>

        {/* Toggleable Third Component */}
        {isThirdVisible && (
          <div className="fixed inset-0 bg-white bg-opacity-95 z-40 p-4 overflow-y-auto">
            <button
              onClick={toggleThird}
              className="text-gray-700 hover:text-blue-500 mb-4 focus:outline-none"
            >
              <HiMenu className="text-2xl rotate-180" />
            </button>
            <Third />
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;


// ---- added third component




// skelton

// import React, { useState, useEffect } from "react";
// import { Routes, Route } from "react-router-dom";
// import Header from "../Components/Landing/Header";
// import First from "../Components/Landing/First";
// import Second from "../Components/Landing/Second";
// import Friends from "../Components/Landing/Friends";
// import Messages from "../Components/Chat/Messages";
// import Photos from "../Components/Landing/Photos";
// import Videos from "../Components/Landing/Videos";
// import Third from "../Components/Landing/Third";
// import { RiHome6Line } from "react-icons/ri";
// import { FaUserFriends } from "react-icons/fa";
// import { IoChatboxEllipsesOutline } from "react-icons/io5";
// import { IoMdPhotos } from "react-icons/io";
// import { IoVideocam } from "react-icons/io5";
// import { Link } from "react-router-dom";
// import { HiMenu } from "react-icons/hi"; // Hamburger icon

// const LandingPage = ({ socket }) => {
//   const [isThirdVisible, setIsThirdVisible] = useState(false);
//   const [isLoading, setIsLoading] = useState(true); // Global loading state

//   useEffect(() => {
//     // Simulate initial data fetch delay (remove this in production)
//     const timer = setTimeout(() => setIsLoading(false), 1000);
//     return () => clearTimeout(timer);
//   }, []);

//   const toggleThird = () => {
//     setIsThirdVisible(!isThirdVisible);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex flex-col min-h-screen pt-[64px] lg:pt-[80px]">
//         {/* Skeleton for Header */}
//         <div className="fixed top-0 left-0 right-0 h-[64px] lg:h-[80px] bg-gray-200 animate-pulse z-20"></div>

//         {/* Skeleton for Main Layout */}
//         <div className="flex flex-col lg:flex-row flex-1 w-full">
//           {/* Left Sidebar Skeleton */}
//           <div className="hidden lg:block lg:w-1/4 px-2">
//             <div className="bg-white shadow-lg rounded-lg p-4 h-[calc(100vh-80px)]">
//               <div className="flex space-x-4 animate-pulse">
//                 <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
//                 <div className="flex-1 space-y-2">
//                   <div className="h-6 bg-gray-300 rounded"></div>
//                   <div className="h-4 bg-gray-300 rounded w-3/4"></div>
//                 </div>
//               </div>
//               <div className="mt-4 space-y-2">
//                 <div className="h-6 bg-gray-300 rounded"></div>
//                 <div className="h-6 bg-gray-300 rounded"></div>
//                 <div className="h-6 bg-gray-300 rounded"></div>
//               </div>
//             </div>
//           </div>

//           {/* Middle Content Skeleton */}
//           <div className="lg:w-1/2 w-full px-2 lg:px-4 py-5">
//             <div className="bg-white shadow-lg rounded-lg p-4 h-[calc(100vh-80px)]">
//               <div className="space-y-4">
//                 <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
//                 <div className="h-40 bg-gray-300 rounded animate-pulse"></div>
//                 <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
//               </div>
//             </div>
//           </div>

//           {/* Right Sidebar Skeleton */}
//           <div className="hidden lg:block lg:w-1/4 px-2">
//             <div className="bg-white shadow-lg rounded-lg p-4 h-[calc(100vh-80px)]">
//               <div className="space-y-4">
//                 <div className="h-6 bg-gray-300 rounded animate-pulse"></div>
//                 <div className="space-y-2">
//                   <div className="flex space-x-2 animate-pulse">
//                     <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
//                     <div className="h-4 bg-gray-300 rounded w-1/2"></div>
//                   </div>
//                   <div className="flex space-x-2 animate-pulse">
//                     <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
//                     <div className="h-4 bg-gray-300 rounded w-1/2"></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Fixed Header */}
//       <div className="fixed top-0 left-0 right-0 z-20">
//         <Header />
//       </div>

//       {/* Main layout: below header */}
//       <div className="flex flex-col lg:flex-row flex-1 pt-[64px] lg:pt-[80px] w-full">
//         {/* Left Spacer - Matches the width of First on desktop */}
//         <div className="hidden lg:block lg:w-1/4"></div>

//         {/* Middle Scrollable Content */}
//         <div className="lg:w-1/2 w-full px-2 lg:px-4 py-5 overflow-y-auto">
//           <Routes>
//             <Route path="/" element={<Second />} />
//             <Route path="feed" element={<Second />} />
//             <Route path="friends" element={<Friends />} />
//             <Route path="messages" element={<Messages socket={socket} />} />
//             <Route path="photos" element={<Photos />} />
//             <Route path="videos" element={<Videos />} />
//           </Routes>
//         </div>

//         {/* Right Spacer - Matches the width of Third on desktop */}
//         <div className="hidden lg:block lg:w-1/4"></div>

//         {/* Left Sidebar - Fixed on desktop */}
//         <div className="hidden lg:block lg:w-1/4 px-2 fixed top-[80px] bottom-0 left-0 overflow-y-auto">
//           <First socket={socket} />
//         </div>

//         {/* Right Sidebar - Fixed on desktop */}
//         <div className="hidden lg:block lg:w-1/4 px-2 fixed top-[80px] bottom-0 right-0 overflow-y-auto">
//           <Third />
//         </div>
//       </div>

//       {/* Mobile Hamburger Menu and Third Component Toggle */}
//       <div className="block lg:hidden">
//         {/* Hamburger Menu */}
//         <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 z-50 shadow-lg h-16 flex justify-between items-center">
//           <button
//             onClick={toggleThird}
//             className="text-gray-700 hover:text-blue-500 focus:outline-none"
//           >
//             <HiMenu className="text-2xl" />
//           </button>
//           <ul className="flex justify-around items-center flex-1">
//             <Link to="/home/feed">
//               <li className="text-gray-700 hover:text-blue-500 flex flex-col items-center">
//                 <RiHome6Line className="text-xl sm:text-2xl" />
//                 <span className="text-xs">Feed</span>
//               </li>
//             </Link>
//             <Link to="/home/friends">
//               <li className="text-gray-700 hover:text-blue-500 flex flex-col items-center">
//                 <FaUserFriends className="text-xl sm:text-2xl" />
//                 <span className="text-xs">Friends</span>
//               </li>
//             </Link>
//             <Link to="/messages">
//               <li className="text-gray-700 hover:text-blue-500 flex flex-col items-center">
//                 <IoChatboxEllipsesOutline className="text-xl sm:text-2xl" />
//                 <span className="text-xs">Messages</span>
//               </li>
//             </Link>
//             <Link to="/home/photos">
//               <li className="text-gray-700 hover:text-blue-500 flex flex-col items-center">
//                 <IoMdPhotos className="text-xl sm:text-2xl" />
//                 <span className="text-xs">Photos</span>
//               </li>
//             </Link>
//             <Link to="/home/videos">
//               <li className="text-gray-700 hover:text-blue-500 flex flex-col items-center">
//                 <IoVideocam className="text-xl sm:text-2xl" />
//                 <span className="text-xs">Videos</span>
//               </li>
//             </Link>
//           </ul>
//         </div>

//         {/* Toggleable Third Component */}
//         {isThirdVisible && (
//           <div className="fixed inset-0 bg-white bg-opacity-95 z-40 p-4 overflow-y-auto">
//             <button
//               onClick={toggleThird}
//               className="text-gray-700 hover:text-blue-500 mb-4 focus:outline-none"
//             >
//               <HiMenu className="text-2xl rotate-180" />
//             </button>
//             <Third />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LandingPage;

