import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BsArrowLeft } from "react-icons/bs";

const Photos = () => {
  const [photos, setPhotos] = useState([]); // Store user's photos
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserPhotos = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://social-nest-2.onrender.com/api/user/profile`,
          {
            withCredentials: true,
          }
        );

        const userData = res.data;
        // Filter posts to include only images
        const userPhotos =
          userData.posts?.filter((post) => post.mediaType === "image") || [];
        setPhotos(userPhotos);
      } catch (error) {
        console.error("Error fetching user photos:", error);
        if (error.response?.status === 401) {
          setError("Unauthorized. Please log in.");
          navigate("/login", { state: { reason: "Session expired" } });
        } else {
          setError("Failed to load photos. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserPhotos();
  }, [navigate]);

  // const handleBackClick = () => {
  //   navigate('/profile'); // Navigate back to profile page
  // };

  if (loading) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-500">Loading photos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 max-w-7xl mx-auto">
        {/* <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-blue-500 font-semibold hover:text-blue-600 transition duration-200"
        >
          <BsArrowLeft size={24} />
        </button> */}
        <h1 className="text-xl font-semibold text-gray-800 text-center">
          Your Photos
        </h1>
        <div className="w-6"></div> {/* Spacer for alignment */}
      </div>

      {/* Photos Grid */}
      <div className="max-w-7xl mx-auto p-4">
        {photos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {photos.map((photo) => (
              <div
                key={photo._id}
                className="relative aspect-square overflow-hidden rounded-lg shadow-sm"
              >
                <img
                  src={photo.image}
                  alt="Post"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No photos yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Photos;
