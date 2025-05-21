import React, { useEffect, useState } from "react";
import axios from "axios";
import Posts from "./Posts";
import { useNavigate } from "react-router-dom";

const SavedPosts = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://social-nest-backend.onrender.com/api/user/profile",
          {
            withCredentials: true,
          }
        );
        // console.log('Saved posts response:', res.data.savedPosts);
        // Filter out null or invalid entries, ensuring required fields are present
        const validPosts = (res.data.savedPosts || []).filter(
          (post) =>
            post &&
            post._id &&
            post.createdAt && // Ensure createdAt exists
            post.user && // Ensure user object exists
            post.user.name // Ensure user.name exists
        );
        console.log("Valid posts:", validPosts);
        setSavedPosts(res.data.savedPosts);
      } catch (error) {
        console.error("Error fetching saved posts:", error);
        setError("Please log in to view saved posts.");
        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSavedPosts();
  }, [navigate]);

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear all saved posts?"))
      return;
    try {
      const validPosts = savedPosts.filter(
        (post) =>
          post && post._id && post.createdAt && post.user && post.user.name
      );
      if (validPosts.length === 0) {
        setSavedPosts([]);
        alert("All saved posts cleared!");
        return;
      }

      await Promise.all(
        validPosts.map((post) =>
          axios.post(
            `https://social-nest-backend.onrender.com/api/posts/${post._id}/unsave`,
            {},
            { withCredentials: true }
          )
        )
      );
      setSavedPosts([]);
      alert("All saved posts cleared!");
    } catch (error) {
      console.error("Error clearing saved posts:", error);
      alert("Failed to clear saved posts.");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading saved posts...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          Your Saved Posts ({savedPosts.length})
        </h1>
        {savedPosts.length > 0 && (
          <button
            onClick={handleClearAll}
            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
          >
            Clear All
          </button>
        )}
      </div>
      {savedPosts.length > 0 ? (
        <Posts posts={savedPosts} setPosts={setSavedPosts} />
      ) : (
        <p className="text-center text-gray-500">You have no saved posts.</p>
      )}
    </div>
  );
};

export default SavedPosts;
