import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { BsImage, BsCameraVideo, BsArrowLeft } from "react-icons/bs"; // Added BsArrowLeft

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("images");
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3000/api/auth/Profile", {
          withCredentials: true,
        });
        const data = res.data;
        setName(data.name);
        setEmail(data.email);
        setImage(data.image || "/Profile.png");
        setFollowers(data.followers || []);
        setFollowing(data.following || []);
        setPosts(data.posts || []);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        if (error.response?.status === 401) {
          setError("Session expired. Please log in again.");
          navigate("/login", { replace: true });
        } else {
          setError("Failed to load profile. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleUpdateClick = () => {
    navigate("/UpdateProfile", {
      state: { name, email, image },
    });
  };

  const filteredPosts = posts.filter((post) =>
    activeTab === "images"
      ? post.mediaType === "image"
      : post.mediaType === "video"
  );

  const handleBackClick = () => {
    navigate("/home"); // Navigate to home page
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

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

        <div className="flex justify-center items-start lg:gap-10 gap-5 p-3">
          <div>
            <img
              src={image}
              alt=""
              className="lg:h-[200px] h-[100px] w-[100px]  lg:w-[200px] rounded-full border-2 border-black"
            />
            <p className="font-semibold lg:text-[18px] text-[10px] mt-3 text-center">
              {email}
            </p>
          </div>

          <div>
            <h1 className="lg:text-[25px]">{name}</h1>

            <div className="flex gap-5 mt-3 text-[22px]">
              <div>
                <h2 className="font-bold lg:text-2xl">{followers?.length}</h2>
                <p className="lg:text-[20px] text-[10px]">followers</p>
              </div>

              <div>
                <h2 className="font-bold lg:text-2xl">{following?.length}</h2>
                <p className="lg:text-[20px] text-[10px]">Following</p>
              </div>

              <div>
                <h2 className="font-bold lg:text-2xl">{posts?.length}</h2>
                <p className="lg:text-[20px] text-[10px]">Posts</p>
              </div>
            </div>

            <div className="flex gap-5 pt-10">
              <button
                className="bg-blue-500 text-white p-2 lg:text-[15px] text-[12px] rounded-lg cursor-pointer"
                onClick={handleUpdateClick}
              >
                Edit profile
              </button>
              <button className="bg-blue-500 text-white lg:text-[15px] text-[12px] p-2 rounded-lg cursor-pointer">
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

        <div className="my-2 pb-2 bg-white shadow-xl grid grid-cols-3 gap-1">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div key={post._id} className="relative">
                {post.mediaType === "image" ? (
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-[200px] h-[200px] object-contain"
                  />
                ) : (
                  <video
                    src={post.image}
                    controls
                    className="w-[200px] h-[200px] object-contain"
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
  );
};

export default Profile;
