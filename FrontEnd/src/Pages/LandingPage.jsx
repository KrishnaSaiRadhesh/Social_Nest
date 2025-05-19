// import React from 'react'
// import Header from '../Components/Landing/Header'
// import First from '../Components/Landing/First'
// import Second from '../Components/Landing/Second'
// import Third from '../Components/Landing/Third'
// import io from 'socket.io-client';

// const socket = io('http://localhost:3000', { withCredentials: true });

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


import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../Components/Landing/Header';
import First from '../Components/Landing/First';
import Second from '../Components/Landing/Second';
import Friends from '../Components/Landing/Friends';
import Messages from '../Components/Chat/Messages';
import Photos from '../Components/Landing/Photos';
import Videos from '../Components/Landing/Videos';
import Third from "../Components/Landing/Third"

const LandingPage = ({ socket }) => {
  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-10">
        <Header />
      </div>

      {/* Main layout: below header */}
      <div className="flex flex-1 pt-[64px]">
        {/* Left Sidebar */}
        <div className="w-[350px] fixed top-[64px] bottom-0 mt-4 left-0">
          <First socket={socket} />
        </div>

        {/* Middle Scrollable Content */}
        <div className="flex-1 max-w-7xl mx-auto overflow-y-auto pt-4 px-4 mt-4">
          <Routes>
            <Route path="/" element={<Second />} />
            <Route path="feed" element={<Second />} />
            <Route path="friends" element={<Friends />} />
            <Route path="messages" element={<Messages socket={socket} />} />
            <Route path="photos" element={<Photos />} />
            <Route path="videos" element={<Videos />} />
          </Routes>
        </div>

        {/* Right Sidebar */}
        <div className="w-[350px] fixed top-[64px] bottom-0 mt-8 right-0">
          <Third />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;