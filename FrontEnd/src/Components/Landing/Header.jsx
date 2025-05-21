import React, { useEffect, useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { IoNotifications } from "react-icons/io5";
import { FaBookmark } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const [image, setImage] = useState("");
  const [modelopen, setModelopen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "https://social-nest-backend.onrender.com/api/user/Profile",
          {
            withCredentials: true,
          }
        );
        const data = res.data;
        console.log("Image profile", data);
        setImage(data.image);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        if (error.response?.status === 401) {
          setImage("");
          navigate("/login", { replace: true });
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  const toggleModel = () => {
    setModelopen((modelopen) => !modelopen);
  };

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        "https://social-nest-backend.onrender.com/api/auth/logout",
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setImage("");
        setModelopen(false);
        localStorage.clear();
        sessionStorage.clear();
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="bg-gray-100 p-5 shadow-lg flex items-center justify-around relative">
      <div className="Logo flex items-center gap-3">
        <img className="w-10 h-10 rounded-full" src="/Logo.png" alt="logo" />
        <h2 className="lg:text-[28px] font-serif">Social Nest</h2>
      </div>

      {/* <div className="flex items-center gap-1 border-2 p-2 rounded-2xl w-[30em]">
        <HiOutlineSearch />
        <input type="text" className="w-full outline-0" />
      </div> */}

      <div className="flex items-center gap-[5em]">
        <IoNotifications size={25} />
        <Link to="/saved" title="Saved Posts">
          <FaBookmark
            size={25}
            className="cursor-pointer hover:text-blue-500 transition"
          />
        </Link>
      </div>

      <div className="relative">
        <div className="cursor-pointer" onClick={toggleModel}>
          <img
            className="w-10 h-10 rounded-full"
            src={image || "./Profile.png"}
            alt="profile"
          />
        </div>

        {modelopen && (
          <div className="bg-white shadow-xl rounded-xl absolute right-0 mt-2 overflow-hidden w-40 p-3 z-50">
            <Link to="/profile">
              <p className="cursor-pointer hover:bg-gray-200 px-2 py-1">
                My profile
              </p>
            </Link>
            <p
              onClick={handleLogout}
              className="cursor-pointer hover:bg-gray-200 px-2 py-1"
            >
              Logout
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
