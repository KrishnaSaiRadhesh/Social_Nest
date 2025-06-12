import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BsArrowLeft } from "react-icons/bs";

const Videos = () => {
  const [videos, setVideos] = useState([]); // Store user's videos
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserVideos = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://social-nest-2.onrender.com/api/user/profile`,
          {
            withCredentials: true,
          }
        );

        const userData = res.data;
        // Filter posts to include only videos
        const userVideos =
          userData.posts?.filter((post) => post.mediaType === "video") || [];
        setVideos(userVideos);
      } catch (error) {
        console.error("Error fetching user videos:", error);
        if (error.response?.status === 401) {
          setError("Unauthorized. Please log in.");
          navigate("/login", { state: { reason: "Session expired" } });
        } else {
          setError("Failed to load videos. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserVideos();
  }, [navigate]);

  if (loading) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-500">Loading videos...</p>
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
        <h1 className="text-xl font-semibold text-gray-800 text-center">
          Your Videos
        </h1>
        <div className="w-6"></div> {/* Spacer for alignment */}
      </div>

      {/* Videos Grid */}
      <div className="max-w-7xl mx-auto p-4">
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {videos.map((video) => (
              <div
                key={video._id}
                className="relative aspect-square overflow-hidden rounded-lg shadow-sm"
              >
                <video
                  src={video.image}
                  controls
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No videos yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Videos;
