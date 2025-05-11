import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

const Login= () => {

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log(formData);

    try {
      const res = await axios.post(
        'http://localhost:3000/api/auth/login',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

     
      toast.success(res.data?.message || 'Logged in successfully');
      setTimeout(() => {
        navigate('/home');
      }, 1000);

      setFormData({
        email: '',
        password: '',
      });

    } catch (error) {
      console.error(error.message);
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center w-[100vw] gap-50 bg-gradient-to-br from-white to-blue-100 p-4">

      <div>
        <img src="/start.png" className='h-[25em]' alt="Logo" />
      </div>

      <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg p-6">
        {/* Top Header */}
        <div className="flex justify-between items-center mb-6">

        <div className="flex items-center gap-3">
          <img className= "w-10 h-10 rounded-full" src="/Logo.png" alt="" />
          <h5 className="text-[20px] font-serif">Social Nest</h5>
        </div>

          <Link to={"/"}>
            <button className="text-sm text-white bg-blue-600 px-4 py-2 rounded-full">Sign up</button>
          </Link>
        </div>

        {/* Sign In Title */}
        <h2 className="text-2xl font-bold text-center text-black mb-1">Login</h2>

        <form onSubmit={handleSubmit}>
                  {/* Email Input */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-sm"
                  name="email"
                  value={FormData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <MdOutlineEmail />
                </span>
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-sm"
                  name="password"
                  value={FormData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <RiLockPasswordLine />
                </span>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center mb-6">
              <input type="checkbox" id="remember" className="mr-2 accent-blue-600" />
              <label htmlFor="remember" className="text-sm text-gray-700">Remember me</label>
            </div>

            {/* Sign In Button */}
            <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm mb-4">
              Login
            </button>
        </form>

        {/* Divider */}
        <div className="text-center text-gray-400 text-sm mb-4">Or</div>

        {/* Social Buttons */}
        <div className="space-y-3">
          <button className="w-full border border-gray-200 py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-medium">
            <span><FcGoogle /></span> Sign In with Google
          </button>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Login;
