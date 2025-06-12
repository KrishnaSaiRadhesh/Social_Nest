import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { BsImage, BsCameraVideo, BsArrowLeft } from "react-icons/bs"; // Added BsArrowLeft

const UserProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [activeTab, setActiveTab] = useState("images");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const profileRes = await axios.get(
          `https://social-nest-2.onrender.com/api/user/${id}`,
          {
            withCredentials: true,
          }
        );
        const profileData = profileRes.data;

        setName(profileData.name);
        setEmail(profileData.email);
        setImage(profileData.image);
        setFollowers(profileData.followers || []);
        setFollowing(profileData.following || []);
        setPosts(profileData.posts || []);

        const currentUserRes = await axios.get(
          "https://social-nest-2.onrender.com/api/user/profile",
          {
            withCredentials: true,
          }
        );
        const currentUserData = currentUserRes.data;
        setCurrentUserId(currentUserData._id);
        setIsFollowing(currentUserData.following?.includes(id) || false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        if (error.response?.status === 400) {
          setError("Invalid user ID");
        } else if (error.response?.status === 401) {
          setError("Unauthorized. Please log in.");
          navigate("/login");
        } else if (error.response?.status === 404) {
          setError("User not found");
        } else {
          setError("Failed to load profile. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id && id !== "undefined") {
      fetchData();
    } else {
      setError("Invalid user ID");
      setLoading(false);
    }
  }, [id, navigate]);

  const handleFollow = async () => {
    try {
      await axios.post(
        `https://social-nest-2.onrender.com/api/user/follow/${id}`,
        {},
        { withCredentials: true }
      );
      setIsFollowing(true);
      setFollowers((prev) => [...prev, currentUserId]);
    } catch (error) {
      console.error("Error following user:", error);
      setError("Failed to follow user");
    }
  };

  const handleUnFollow = async () => {
    try {
      await axios.post(
        `https://social-nest-2.onrender.com/api/user/unfollow/${id}`,
        {},
        { withCredentials: true }
      );
      setIsFollowing(false);
      setFollowers((prev) =>
        prev.filter((followerId) => followerId !== currentUserId)
      );
    } catch (error) {
      console.error("Error unfollowing user:", error);
      setError("Failed to unfollow user");
    }
  };

  const filteredPosts = posts.filter((post) =>
    activeTab === "images"
      ? post.mediaType === "image"
      : post.mediaType === "video"
  );

  const handleBackClick = () => {
    navigate("/home"); // Navigate to home page
  };

  if (loading) return <p className="text-center p-4">Loading...</p>;
  if (error) return <p className="text-center p-4 text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex flex-col justify-center items-center max-w-7xl mx-auto p-3">
        {/* Back Button */}
        <div className="w-full max-w-7xl flex justify-start mb-4">
          <button
            className="flex items-center gap-2 p-2 text-blue-500 font-semibold hover:bg-gray-100 rounded-lg"
            onClick={handleBackClick}
          >
            <BsArrowLeft size={20} />
            Back
          </button>
        </div>

        <div className="flex justify-center items-start gap-10 p-3">
          <div>
            <img src={image || "/Profile.png"} alt="" className="w-[200px]" />
            <p className="font-semibold text-[18px] mt-3 text-center">
              {email}
            </p>
          </div>

          <div>
            <h1 className="text-[25px]">{name}</h1>

            <div className="flex gap-5 mt-3 text-[22px]">
              <div>
                <h2 className="font-bold text-2xl">{followers.length}</h2>
                <p>followers</p>
              </div>
              <div>
                <h2 className="font-bold text-2xl">{following.length}</h2>
                <p>Following</p>
              </div>
              <div>
                <h2 className="font-bold text-2xl">{posts.length}</h2>
                <p>Post</p>
              </div>
            </div>

            <div className="flex gap-5 pt-10">
              {currentUserId !== id && (
                <button
                  className={`p-2 rounded text-white ${
                    isFollowing ? "bg-red-500" : "bg-blue-500"
                  }`}
                  onClick={isFollowing ? handleUnFollow : handleFollow}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              )}
              <button className="bg-blue-500 text-white p-2 rounded-lg cursor-pointer">
                Share Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-4">
        <div className="flex justify-center border-b border-gray-300">
          <button
            className={`flex items-center gap-2 p-3 text-lg font-semibold ${
              activeTab === "images"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("images")}
          >
            <BsImage />
            Images
          </button>
          <button
            className={`flex items-center gap-2 p-3 text-lg font-semibold ${
              activeTab === "videos"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("videos")}
          >
            <BsCameraVideo />
            Videos
          </button>
        </div>

        <div className="my-2 pb-2 bg-white shadow-xl">
          <div className="grid grid-cols-3 gap-1">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div key={post._id} className="relative">
                  {post.mediaType === "image" ? (
                    <img
                      src={post.image}
                      alt="Post"
                      className="h-[300px] w-[400px] object-contain"
                    />
                  ) : (
                    <video
                      src={post.image}
                      controls
                      className="h-[300px] w-[400px] object-contain"
                    />
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center p-4 text-gray-500">
                {activeTab === "images" ? "No images yet." : "No videos yet."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
