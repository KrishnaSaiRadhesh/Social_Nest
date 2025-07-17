import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api"; // Import api instance
import { BsArrowLeft, BsCamera } from "react-icons/bs";

const UpdateProfile = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [name, setName] = useState(state?.name || "");
  const [email, setEmail] = useState(state?.email || "");
  const [image, setImage] = useState(state?.image || "");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.put("/user/UpdateProfile", { name, email, image }); // Use api
      const data = res.data;
      setName(data.name);
      setEmail(data.email);
      setImage(data.image);

      // Navigate back to profile after successful update
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = async () => {
    try {
      await api.get("/user"); // Use api to verify auth
      navigate("/profile", { state: { fromUpdateProfile: true } });
    } catch (error) {
      console.error(
        "Auth check failed:",
        error.response?.status,
        error.response?.data
      );
      navigate("/login", {
        state: { reason: "Please log in to access the profile page" },
      });
    }
  };

  return (
    <div className="min-h-screen bg-white text-white flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-gray-900 rounded-lg shadow-lg p-6 sm:p-8">
        {/* Back Button */}
        <div className="flex justify-start mb-6">
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 text-blue-400 font-semibold hover:bg-gray-700 p-2 rounded-lg transition duration-200"
          >
            <BsArrowLeft size={20} />
            Back
          </button>
        </div>

        {/* Header */}
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6">
          Edit Profile
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <img
                src={image || "/Profile.png"}
                alt="Profile"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-gray-600"
              />
              <label
                htmlFor="imageInput"
                className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600 transition duration-200"
              >
                <BsCamera size={20} />
              </label>
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name || ""}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email || ""}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-blue-500 text-white rounded-lg font-semibold ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
            } transition duration-200 flex items-center justify-center gap-2`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Updating...
              </>
            ) : (
              "Update"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;