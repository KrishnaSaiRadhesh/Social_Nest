import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaRegSmile } from "react-icons/fa";
import { CiImageOn } from "react-icons/ci";
import Posts from "./Posts";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Second = () => {
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [posts, setPosts] = useState([]); // Moved posts state to Second
  const location = useLocation();

  // Fetch profile image
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/user/Profile", {
          withCredentials: true,
        });
        setProfileImage(res.data.image);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile();
  }, []);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:3000/api/posts", {
          withCredentials: true,
        });
        setPosts(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setPreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // Handle post creation
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!desc || !image) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/api/posts/CreatePost",
        { description: desc, image },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const newPost = res.data.newPost;
      setPosts((prevPosts) => [
        { ...newPost, likes: [], liked: false }, // Add new post to state
        ...prevPosts,
      ]);

      toast.success("Post created successfully!");
      setDesc("");
      setImage("");
      setPreview("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 h-screen">
      {/* Status Section (Placeholder Images) */}
      <div className="Status bg-white shadow-lg rounded-2xl p-3 flex items-center w-full gap-5">
        {[...Array(8)].map((_, idx) => (
          <img
            key={idx}
            src="/Profile.png"
            alt="logos"
            className="w-20 h-20 rounded-full border-3"
          />
        ))}
      </div>

      {/* Post Creation Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white shadow-lg w-full p-5 mt-2 rounded-2xl flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <img
                src={profileImage || "/Profile.png"}
                alt="profile"
                className="w-8 h-8 rounded-full border-3"
              />
              <input
                placeholder="Write Something here....."
                className="border-none bg-gray-100 p-3 rounded-2xl w-full focus:outline-none text-black text-[15px]"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                required
              />
            </div>
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="h-[200px] w-full object-cover rounded-xl flex items-center"
              />
            )}
          </div>

          <div className="Post-section flex gap-3 items-center justify-between mt-2">
            <div className="p-4 flex gap-5">
              <label htmlFor="image" className="cursor-pointer">
                <CiImageOn />
              </label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="hidden"
              />
              <FaRegSmile />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-lg"
              disabled={loading}
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </form>

      {/* Display Message */}
      {message && (
        <p className={`mt-2 ${message.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
          {message}
        </p>
      )}

      {/* Posts Component */}
      <Posts posts={posts} setPosts={setPosts} />
      <ToastContainer/>
    </div>
  );
};

export default Second;