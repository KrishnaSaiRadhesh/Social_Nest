// import React, { useEffect, useState } from "react";

// import { RiHome6Line } from "react-icons/ri";
// import { FaUserFriends } from "react-icons/fa";
// import { MdOutlineEventNote } from "react-icons/md";
// import { IoVideocam } from "react-icons/io5";
// import { IoChatboxEllipsesOutline } from "react-icons/io5";
// import {
//   BiMessageSquareDetail,
//   BiMoviePlay,
//   BiSolidVideos,
// } from "react-icons/bi";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { IoMdPhotos } from "react-icons/io";
// import { FaBookmark } from "react-icons/fa6";
// import { ToastContainer } from "react-toastify";

// const First = ({ socket }) => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [image, setImage] = useState("");
//   const [followers, setFollowers] = useState([]);
//   const [following, setFollowing] = useState([]);
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         // Check if user is authenticated (Google or JWT)
//         const authRes = await axios.get(
//           "https://social-nest-2.onrender.com/api/auth/Profile",
//           {
//             withCredentials: true,
//           }
//         );
//         if (!authRes.data || authRes.status !== 200) {
//           navigate("/login");
//           return;
//         }

//         const user = authRes.data;
//         setName(user.name);
//         setEmail(user.email);
//         setImage(user.image || "./Profile.png");

//         // Fetch profile data from your custom endpoint
//         const res = await axios.get(
//           "https://social-nest-2.onrender.com/api/auth/Profile",
//           {
//             withCredentials: true,
//           }
//         );
//         const data = res.data;
//         setFollowers(data.followers);
//         setFollowing(data.following);
//         setPosts(data.posts);
//       } catch (error) {
//         console.log(error);
//         if (error.response?.status === 401) {
//           navigate("/login");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [navigate]);

//   if (loading) {
//     return <div className="p-4 h-screen text-center">Loading...</div>;
//   }

//   return (
//     <div className="py-2 pl-4 h-screen">
//       <div className="hidden lg:block md:hidden">
//         <div className="bg-white shadow-lg p-4 rounded-2xl">
//           <div className="Profile p-3 bg-gray-50 rounded-2xl">
//             <div className="pro-sec flex gap-2 items-center">
//               <img
//                 src={image || "./Profile.png"}
//                 alt="Profile_image"
//                 className="w-10 h-10 rounded-full"
//               />
//               <div>
//                 <h1 className="text-[20px]">{name}</h1>
//                 <p>{email}</p>
//               </div>
//             </div>
//             <div className="section2 flex items-center mt-3 gap-5">
//               <div>
//                 <h2 className="font-semibold text-[18px]">
//                   {followers?.length}
//                 </h2>
//                 <p className="text-[18px]">followers</p>
//               </div>
//               <div>
//                 <h2 className="font-semibold text-[18px]">
//                   {following?.length}
//                 </h2>
//                 <p className="text-[18px]">Following</p>
//               </div>
//               <div>
//                 <h2 className="font-semibold text-[18px]">{posts?.length}</h2>
//                 <p className="text-[18px]">Post</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="Feed-section bg-white shadow-lg mt-2 rounded-2xl h-[26em]">
//           <div className="Sec-1 p-2">
//             <Link to="/home/feed">
//               <h3 className="flex items-center gap-5 px-3 py-2 rounded-2xl hover:bg-[#1B56FD] hover:text-white text-black text-[20px] mt-2">
//                 <RiHome6Line /> Feed
//               </h3>
//             </Link>
//             <Link to="/home/friends">
//               <h3 className="flex items-center gap-5 px-3 py-2 rounded-2xl hover:bg-[#1B56FD] hover:text-white text-black text-[20px] mt-2">
//                 <FaUserFriends /> Friends
//               </h3>
//             </Link>
//             <Link to="/messages">
//               <h3 className="flex items-center gap-5 px-3 py-2 rounded-2xl hover:bg-[#1B56FD] hover:text-white text-black text-[20px] mt-2">
//                 <IoChatboxEllipsesOutline /> Messages
//               </h3>
//             </Link>
//             <Link to="/saved" title="Saved Posts">
//               <h3 className="flex items-center gap-5 px-3 py-2 rounded-2xl hover:bg-[#1B56FD] hover:text-white text-black text-[20px] mt-2">
//                 <FaBookmark /> Saved Posts
//               </h3>
//             </Link>
//             <Link to="/home/photos">
//               <h3 className="flex items-center gap-5 px-3 py-2 rounded-2xl hover:bg-[#1B56FD] hover:text-white text-black text-[20px] mt-2">
//                 <MdOutlineEventNote /> Photos
//               </h3>
//             </Link>
//             <Link to="/home/videos">
//               <h3 className="flex items-center gap-5 px-3 py-2 rounded-2xl hover:bg-[#1B56FD] hover:text-white text-black text-[20px] mt-2">
//                 <IoVideocam /> Videos
//               </h3>
//             </Link>
//           </div>

//           <div className="text-xs text-gray-500 flex space-x-2 px-5 py-1 mt-2">
//             <a href="#" className="hover:underline">
//               Privacy
//             </a>
//             <span>·</span>
//             <a href="#" className="hover:underline">
//               Terms
//             </a>
//             <span>·</span>
//             <a href="#" className="hover:underline">
//               Advertising
//             </a>
//             <span>·</span>
//             <a href="#" className="hover:underline">
//               Cookies
//             </a>
//           </div>
//           <div className="text-xs text-gray-500 mt-1 px-5 mb-2">
//             Social © 2023
//           </div>
//         </div>
//       </div>

//       <div className="absolute lg:hidden bottom-0 left-0 bg-white border p-5 w-[100vw] z-10">
//         <ul className="flex gap-4 justify-between">
//           <Link to="/home/feed">
//             <li>
//               <BiMoviePlay />
//             </li>
//           </Link>
//           <Link to="/home/friends">
//             <li>
//               <FaUserFriends />
//             </li>
//           </Link>
//           <Link to="/messages">
//             <li>
//               <BiMessageSquareDetail />
//             </li>
//           </Link>
//           <Link to="/home/photos">
//             <li>
//               <IoMdPhotos />
//             </li>
//           </Link>
//           <Link to="/home/videos">
//             <li>
//               <BiSolidVideos />
//             </li>
//           </Link>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default First;

import React, { useEffect, useState } from "react";
import { RiHome6Line } from "react-icons/ri";
import { FaUserFriends } from "react-icons/fa";
import { MdOutlineEventNote } from "react-icons/md";
import { IoVideocam } from "react-icons/io5";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBookmark } from "react-icons/fa6";
import { ToastContainer } from "react-toastify";
import React, { useEffect, useState } from 'react';
import { RiHome6Line } from 'react-icons/ri';
import { FaBookmark, FaUserFriends } from 'react-icons/fa';
import { MdOutlineEventNote } from 'react-icons/md';
import { IoVideocam } from 'react-icons/io5';
import { IoChatboxEllipsesOutline } from 'react-icons/io5';
import { BiMessageSquareDetail, BiMoviePlay, BiSolidVideos } from 'react-icons/bi';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoMdPhotos } from 'react-icons/io';

const First = ({ socket }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const authRes = await axios.get(
          "http://localhost:3000/api/auth/Profile",
          {
            withCredentials: true,
          }
        );
        if (!authRes.data || authRes.status !== 200) {
          navigate("/login");
          return;
        }

        const user = authRes.data;
        setName(user.name);
        setEmail(user.email);
        setImage(user.image || "./Profile.png");

        // Fetch profile data from your custom endpoint
        const res = await axios.get("http://localhost:3000/api/auth/Profile", {
          withCredentials: true,
        });
        const data = res.data;
        setFollowers(data.followers);
        setFollowing(data.following);
        setPosts(data.posts);
      } catch (error) {
        console.log(error);
        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="p-4 h-screen">
      <div className="hidden lg:block md:hidden">
        <div className="bg-white shadow-lg p-5 rounded-2xl">
          <div className="Profile p-5 bg-gray-50 rounded-2xl">
            <div className="pro-sec flex gap-2 items-center">
              <img
                src={image || './Profile.png'}
                alt="Profile_image"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h1 className="text-2xl">{name}</h1>
                <p>{email}</p>
              </div>
            </div>
          </div>
          <div className="section2 flex items-center justify-around mt-3">
            <div className="text-center">
              <h2 className="font-semibold text-base sm:text-lg">
                {followers?.length}
              </h2>
              <p className="text-sm sm:text-base text-gray-500">followers</p>
            </div>
            <div className="text-center">
              <h2 className="font-semibold text-base sm:text-lg">
                {following?.length}
              </h2>
              <p className="text-sm sm:text-base text-gray-500">Following</p>
            </div>
            <div className="text-center">
              <h2 className="font-semibold text-base sm:text-lg">
                {posts?.length}
              </h2>
              <p className="text-sm sm:text-base text-gray-500">Post</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="Feed-section bg-white shadow-lg mt-2 rounded-2xl h-auto">
        <div className="Sec-1 p-5">
          <Link to="/home/feed">
            <h3 className="flex items-center gap-4 px-3 py-2 rounded-2xl hover:bg-[#1B56FD] hover:text-white text-black text-base sm:text-lg mt-2">
              <RiHome6Line /> Feed
            </h3>
          </Link>
          <Link to="/home/friends">
            <h3 className="flex items-center gap-4 px-3 py-2 rounded-2xl hover:bg-[#1B56FD] hover:text-white text-black text-base sm:text-lg mt-2">
              <FaUserFriends /> Friends
            </h3>
          </Link>
          <Link to="/messages">
            <h3 className="flex items-center gap-4 px-3 py-2 rounded-2xl hover:bg-[#1B56FD] hover:text-white text-black text-base sm:text-lg mt-2">
              <IoChatboxEllipsesOutline /> Messages
            </h3>
          </Link>
          <Link to="/saved" title="Saved Posts">
            <h3 className="flex items-center gap-4 px-3 py-2 rounded-2xl hover:bg-[#1B56FD] hover:text-white text-black text-base sm:text-lg mt-2">
              <FaBookmark /> Saved Posts
            </h3>
          </Link>
          <Link to="/home/photos">
            <h3 className="flex items-center gap-4 px-3 py-2 rounded-2xl hover:bg-[#1B56FD] hover:text-white text-black text-base sm:text-lg mt-2">
              <MdOutlineEventNote /> Photos
            </h3>
          </Link>
          <Link to="/home/videos">
            <h3 className="flex items-center gap-4 px-3 py-2 rounded-2xl hover:bg-[#1B56FD] hover:text-white text-black text-base sm:text-lg mt-2">
              <IoVideocam /> Videos
            </h3>
          </Link>
        </div>

        <div className="text-xs text-gray-500 flex flex-wrap gap-2 py-1 px-3 mt-2">
          <a href="#" className="hover:underline">
            Privacy
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Terms
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Advertising
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Cookies
          </a>
        </div>
        <div className="text-xs text-gray-500 pl-3 pb-3">
          Social © 2023
        </div>
      </div>
    </div>
  );
};

export default First;