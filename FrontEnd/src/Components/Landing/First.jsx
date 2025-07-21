import React, { useEffect, useState } from "react";
import { RiHome6Line } from "react-icons/ri";
import { FaBookmark, FaUserFriends } from "react-icons/fa";
import { MdOutlineEventNote } from "react-icons/md";
import { IoVideocam } from "react-icons/io5";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";

const First = ({ socket }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get("/auth/user");
        if (!res.data || res.status !== 200) {
          throw new Error("Invalid response from server");
        }
        const data = res.data;
        console.log("Profile data:", data);
        setName(data.name || "Unknown");
        setEmail(data.email || "");
        setImage(data.googleImage || data.image || "./Profile.png");
        setFollowers(data.followers || []);
        setFollowing(data.following || []);
        setPosts(data.posts || []);
      } catch (error) {
        console.error("Error fetching profile:", error.response ? error.response.data : error.message);
        if (error.response?.status === 401) {
          setError("Session expired. Please log in again.");
          setTimeout(() => navigate("/login"), 1000);
        } else {
          setError("Failed to load profile. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="p-4 bg-white shadow-lg rounded-2xl h-[calc(100vh-80px)]">
        <div className="Profile p-5 bg-gray-50 rounded-2xl">
          <div className="pro-sec flex flex-col sm:flex-row gap-2 items-center w-full sm:w-auto text-center sm:text-left animate-pulse">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
          <div className="section2 flex items-center justify-around mt-3">
            <div className="text-center space-y-2">
              <div className="h-6 bg-gray-300 rounded w-10 mx-auto"></div>
              <div className="h-4 bg-gray-300 rounded w-16 mx-auto"></div>
            </div>
            <div className="text-center space-y-2">
              <div className="h-6 bg-gray-300 rounded w-10 mx-auto"></div>
              <div className="h-4 bg-gray-300 rounded w-16 mx-auto"></div>
            </div>
            <div className="text-center space-y-2">
              <div className="h-6 bg-gray-300 rounded w-10 mx-auto"></div>
              <div className="h-4 bg-gray-300 rounded w-16 mx-auto"></div>
            </div>
          </div>
        </div>
        <div className="Sec-1 p-5 mt-4 space-y-4">
          <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 h-screen">
      <div className="hidden lg:block md:hidden">
        <div className="bg-white shadow-lg p-5 rounded-2xl">
          <div className="Profile p-5 bg-gray-50 rounded-2xl">
            <div className="pro-sec flex flex-col sm:flex-row gap-2 items-center w-full sm:w-auto text-center sm:text-left">
              <img
                src={image}
                alt="Profile_image"
                className="w-10 h-10 rounded-full"
                onError={(e) => { e.target.src = "./Profile.png"; }}
              />
              <div>
                <h1 className="text-2xl truncate max-w-[150px] sm:max-w-none" title={name}>
                  {name}
                </h1>
                <p className="truncate max-w-[150px] sm:max-w-none">{email}</p>
              </div>
            </div>
          </div>
          <div className="section2 flex items-center justify-around mt-3">
            <div className="text-center">
              <h2 className="font-semibold text-base sm:text-lg">{followers.length}</h2>
              <p className="text-sm sm:text-base text-gray-500">followers</p>
            </div>
            <div className="text-center">
              <h2 className="font-semibold text-base sm:text-lg">{following.length}</h2>
              <p className="text-sm sm:text-base text-gray-500">Following</p>
            </div>
            <div className="text-center">
              <h2 className="font-semibold text-base sm:text-lg">{posts.length}</h2>
              <p className="text-sm sm:text-base text-gray-500">Post</p>
            </div>
          </div>
        </div>
      </div>

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
          <a href="#" className="hover:underline">Privacy</a>
          <span>·</span>
          <a href="#" className="hover:underline">Terms</a>
          <span>·</span>
          <a href="#" className="hover:underline">Advertising</a>
          <span>·</span>
          <a href="#" className="hover:underline">Cookies</a>
        </div>
        <div className="text-xs text-gray-500 pl-3 pb-3">Social © 2023</div>
      </div>
    </div>
  );
};

export default First;