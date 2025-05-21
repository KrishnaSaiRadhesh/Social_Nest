import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoPersonOutline } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "https://social-nest-backend.onrender.com/api/auth/signup",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      toast.success(res.data?.message || "Registered successfully");
      setTimeout(() => {
        navigate("/login");
      }, 1000);

      setFormData({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      console.error(error.message);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center w-full gap-4 sm:gap-6 md:gap-8 lg:gap-12 bg-gradient-to-br from-white to-blue-100 p-4 sm:p-6 md:p-8">
      {/* Image Section - Hidden on small screens, smaller on tablets */}
      <div className="hidden sm:block flex-shrink-0">
        <img
          src="/start.png"
          className="h-[16rem] sm:h-[18rem] md:h-[20rem] lg:h-[25rem] object-contain"
          alt="Logo"
        />
      </div>

      {/* Form Section */}
      <div className="w-full max-w-[18rem] sm:max-w-[22rem] md:max-w-[26rem] lg:max-w-[28rem] bg-white rounded-3xl shadow-lg p-4 sm:p-5 md:p-6">
        {/* Top Header */}
        <div className="flex justify-between items-center mb-4 sm:mb-5 md:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <img
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-full"
              src="/Logo.png"
              alt="Social Nest Logo"
            />
            <h5 className="text-base sm:text-lg md:text-xl font-serif">
              Social Nest
            </h5>
          </div>
          <Link to="/login">
            <button className="text-xs sm:text-sm md:text-sm text-white bg-blue-600 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full">
              Login
            </button>
          </Link>
        </div>

        {/* Sign Up Title */}
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-black mb-1">
          Sign Up
        </h2>
        <p className="text-xs sm:text-sm md:text-sm text-gray-500 text-center mb-4 sm:mb-5 md:mb-6">
          Enter your details to proceed further
        </p>

        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="mb-3 sm:mb-4">
            <label className="text-xs sm:text-sm md:text-sm font-medium text-gray-700">
              Name
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Name"
                className="w-full mt-1 px-3 py-2 sm:px-3.5 sm:py-2.5 md:px-4 md:py-3 rounded-xl border border-gray-200 bg-gray-100 text-xs sm:text-sm"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
              <span className="absolute right-3 sm:right-3.5 md:right-4 top-1/2 transform -translate-y-1/2">
                <IoPersonOutline className="text-gray-500 text-base sm:text-lg" />
              </span>
            </div>
          </div>

          {/* Email Input */}
          <div className="mb-3 sm:mb-4">
            <label className="text-xs sm:text-sm md:text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                className="w-full mt-1 px-3 py-2 sm:px-3.5 sm:py-2.5 md:px-4 md:py-3 rounded-xl border border-gray-200 bg-gray-100 text-xs sm:text-sm"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
              <span className="absolute right-3 sm:right-3.5 md:right-4 top-1/2 transform -translate-y-1/2">
                <MdOutlineEmail className="text-gray-500 text-base sm:text-lg" />
              </span>
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-3 sm:mb-4">
            <label className="text-xs sm:text-sm md:text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                className="w-full mt-1 px-3 py-2 sm:px-3.5 sm:py-2.5 md:px-4 md:py-3 rounded-xl border border-gray-200 bg-gray-100 text-xs sm:text-sm"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
              <span className="absolute right-3 sm:right-3.5 md:right-4 top-1/2 transform -translate-y-1/2">
                <RiLockPasswordLine className="text-gray-500 text-base sm:text-lg" />
              </span>
            </div>
          </div>

          {/* Remember Me */}
          {/* <div className="flex items-center mb-4 sm:mb-5 md:mb-6">
            <input
              type="checkbox"
              id="remember"
              className="mr-2 accent-blue-600 h-3.5 w-3.5 sm:h-4 sm:w-4"
              disabled={loading}
            />
            <label
              htmlFor="remember"
              className="text-xs sm:text-sm md:text-sm text-gray-700"
            >
              Remember me
            </label>
          </div> */}

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 sm:py-2.5 md:py-3 rounded-xl font-semibold text-xs sm:text-sm hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {/* Guest Login */}
        <Link to="/home">
          <p className="text-center text-black text-xs sm:text-sm md:text-sm font-semibold mt-3 sm:mt-4">
            Guest Login
          </p>
        </Link>

        {/* Divider */}
        <div className="text-center text-gray-400 text-xs sm:text-sm my-3 sm:my-4">
          Or
        </div>

        {/* Social Buttons */}
        <div className="space-y-2 sm:space-y-3">
          <button
            className="w-full border border-gray-200 py-2 sm:py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            <FcGoogle className="text-base sm:text-lg md:text-xl" />
            Sign Up with Google
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;
