// import React from 'react'
// import Header from '../Components/Landing/Header'
// import First from '../Components/Landing/First'
// import Second from '../Components/Landing/Second'
// import Third from '../Components/Landing/Third'
// import io from 'socket.io-client';
// const socket = io('https://social-nest-2.onrender.com', { withCredentials: true });
// const LandingPage = () => {
//   return (
//     <div className='h-screen flex flex-col'>
//       {/* Fixed Header */}
//       <div className='fixed top-0 left-0 right-0 z-10'>
//         <Header />
//       </div>

//       {/* Main layout: below header */}
//       <div className='flex flex-1 pt-[64px]'> {/* Adjust pt to Header height */}
//         {/* Left Sidebar */}
//         <div className='w-[350px] fixed top-[64px] bottom-0 mt-4 left-0'>
//           <First socket={socket} />
//         </div>

//         {/* Middle Scrollable Content */}
//         <div className='flex-1 max-w-7xl mx-auto overflow-y-auto pt-4 px-4'>
//           <Second />
//         </div>

//         {/* Right Sidebar */}
//         <div className='w-[350px] fixed top-[64px] bottom-0 mt-8 right-0'>
//           <Third />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default LandingPage

// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import Header from "../Components/Landing/Header";
// import First from "../Components/Landing/First";
// import Second from "../Components/Landing/Second";
// import Friends from "../Components/Landing/Friends";
// import Messages from "../Components/Chat/Messages";
// import Photos from "../Components/Landing/Photos";
// import Videos from "../Components/Landing/Videos";
// import Third from "../Components/Landing/Third";

// const LandingPage = ({ socket }) => {
//   return (
//     <div className="h-screen flex flex-col">
//       {/* Fixed Header */}
//       <div className="fixed top-0 left-0 right-0 z-10">
//         <Header />
//       </div>

//       {/* Main layout: below header */}
//       <div className="flex flex-1 pt-[64px]">
//         {/* Left Sidebar */}
//         <div className="fixed top-[64px] bottom-0 mt-6 left-0">
//           <First socket={socket} />
//         </div>

//         {/* Middle Scrollable Content */}
//         <div className="flex-1 max-w-4xl mx-auto overflow-y-auto py-5 pt-4 px-4 mt-3">
//           <Routes>
//             <Route path="/" element={<Second />} />
//             <Route path="feed" element={<Second />} />
//             <Route path="friends" element={<Friends />} />
//             <Route path="messages" element={<Messages socket={socket} />} />
//             <Route path="photos" element={<Photos />} />
//             <Route path="videos" element={<Videos />} />
//           </Routes>
//         </div>

//         {/* Right Sidebar */}
//         <div className="fixed top-[64px] bottom-0 mt-8 right-0">
//           <Third />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LandingPage;

// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import Header from "../Components/Landing/Header";
// import First from "../Components/Landing/First";
// import Second from "../Components/Landing/Second";
// import Friends from "../Components/Landing/Friends";
// import Messages from "../Components/Chat/Messages";
// import Photos from "../Components/Landing/Photos";
// import Videos from "../Components/Landing/Videos";
// import Third from "../Components/Landing/Third";

// const LandingPage = ({ socket }) => {
//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Fixed Header */}
//       <div className="fixed top-0 left-0 right-0 z-20">
//         <Header />
//       </div>

//       {/* Main layout: below header */}
//       <div className="flex flex-col lg:flex-row flex-1 pt-[64px] lg:pt-[80px] w-full">
//         {/* Left Sidebar - Hidden on mobile, visible on larger screens */}
//         <div className="hidden lg:block lg:w-1/4 px-2">
//           <First socket={socket} />
//         </div>

//         {/* Middle Scrollable Content */}
//         <div className="lg:w-1/2 w-full flex-1 px-2 lg:px-4 py-5">
//           <Routes>
//             <Route path="/" element={<Second />} />
//             <Route path="feed" element={<Second />} />
//             <Route path="friends" element={<Friends />} />
//             <Route path="messages" element={<Messages socket={socket} />} />
//             <Route path="photos" element={<Photos />} />
//             <Route path="videos" element={<Videos />} />
//           </Routes>
//         </div>

//         {/* Right Sidebar - Hidden on mobile, visible on larger screens */}
//         <div className="hidden lg:block lg:w-1/4 px-2">
//           <Third />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LandingPage;

import React from "react";
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

const LandingPage = ({ socket }) => {
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

      {/* Mobile Bottom Navigation Bar */}
      <div className="block lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-3 z-50 shadow-lg h-16">
        <ul className="flex justify-around items-center h-full">
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
    </div>
  );
};

export default LandingPage;
