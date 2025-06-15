import React, { useEffect, useState } from "react";
import axios from "axios";
import Posts from "./Posts"; // Import the Posts component
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
        // Fetch all saved posts for the authenticated user
        const res = await axios.get(
          "http://localhost:3000/api/auth/saved-posts",
          {
            withCredentials: true,
          }
        );
        // Filter out null or invalid posts
        const validPosts = (res.data.savedPosts || []).filter(
          (post) =>
            post &&
            post._id &&
            post.createdAt &&
            post.user &&
            post.user.name &&
            post.user.image
        );
        console.log("Valid saved posts:", validPosts);
        // Map posts to include the 'liked' field expected by Posts component
        const formattedPosts = validPosts.map((post) => ({
          ...post,
          liked: post.liked || false, // Ensure 'liked' field is present
        }));
        setSavedPosts(formattedPosts);
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
      if (savedPosts.length === 0) {
        alert("No saved posts to clear!");
        return;
      }

      // Unsave all posts
      await Promise.all(
        savedPosts.map((post) =>
          axios.post(
            `http://localhost:3000/api/${post._id}/unsave`,
            {},
            { withCredentials: true }
          )
        )
      );
      setSavedPosts([]);
      alert("All saved posts cleared!");
    } catch (error) {
      console.error("Error clearing saved posts:", error);
      alert(error.response?.data?.message || "Failed to clear saved posts.");
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
      <Posts posts={savedPosts} setPosts={setSavedPosts} />
    </div>
  );
};

export default SavedPosts;
