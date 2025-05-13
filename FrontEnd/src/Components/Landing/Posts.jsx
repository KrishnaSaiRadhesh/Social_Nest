import axios from "axios";
import React, { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";
import { FaRegBookmark } from "react-icons/fa6";

const Posts = ({ posts, setPosts }) => {
  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState({});
  const [commentText, setCommentText] = useState({}); // Post-specific comment input

  // Initialize likes state when posts change
  useEffect(() => {
    const initialLikes = {};
    posts.forEach((post) => {
      initialLikes[post._id] = post.liked || false;
    });
    setLikes(initialLikes);
  }, [posts]);

  // Handle comment submission
  const commentSubmit = async (postId) => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/posts/${postId}/comment`,
        { commentText: commentText[postId] || "" },
        { withCredentials: true }
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, comments: [...(post.comments || []), res.data.comment] }
            : post
        )
      );
      setCommentText((prev) => ({ ...prev, [postId]: "" }));
      alert("Commented successfully");
    } catch (error) {
      console.error("Error commenting:", error);
    }
  };

  // Handle like/unlike
  const handleLike = async (postId) => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/posts/${postId}/like`,
        {},
        { withCredentials: true }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, likes: new Array(res.data.likes).fill(null), liked: res.data.liked }
            : post
        )
      );

      setLikes((prevLikes) => ({ ...prevLikes, [postId]: res.data.liked }));
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="my-2 pb-2 bg-white shadow-xl">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id} className="mb-4">
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-2 p-2">
                <img
                  src={post.user.image}
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
                <div className="p-2">
                  <h1>{post.user?.name}</h1>
                  <p>
                    {new Date(post.createdAt).toLocaleString("en-GB", {
                      day: "numeric",
                      month: "short",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    }).replace(",", " at")}
                  </p>
                </div>
              </div>
              <BsThreeDotsVertical />
            </div>
            <div>
              {post.description && <p className="pl-5">{post.description}</p>}
              <img src={post.image} alt="Post" className="p-8 rounded-b-lg" />
              <div className="bg-gray-200 h-[2px] w-[95%] text-center mx-5" />
              <div className="flex items-center justify-between px-5 mt-3">
                <div className="flex items-center gap-4">
                  <div
                    className="Like cursor-pointer flex items-center gap-1"
                    onClick={() => handleLike(post._id)}
                  >
                    {likes[post._id] ? (
                      <IoMdHeart className="text-red-500" />
                    ) : (
                      <IoMdHeartEmpty />
                    )}
                    <h5>{likes[post._id] ? "Liked" : "Like"}</h5>
                    <p>{post.likes?.length || 0} likes</p>
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      commentSubmit(post._id);
                    }}
                  >
                    <div className="Comment flex items-center gap-1">
                      <FaRegComment />
                      <h5>Comment</h5>
                    </div>
                    <input
                      type="text"
                      value={commentText[post._id] || ""}
                      onChange={(e) =>
                        setCommentText((prev) => ({
                          ...prev,
                          [post._id]: e.target.value,
                        }))
                      }
                      placeholder="Add a comment..."
                      className="border rounded p-1"
                    />
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-3 py-1 ml-2 rounded"
                    >
                      Post
                    </button>
                  </form>
                  <div className="flex items-center gap-1">
                    <RiShareForwardLine />
                    <h5>Share</h5>
                  </div>
                </div>
                <div className="Save">
                  <FaRegBookmark />
                </div>
              </div>
            </div>
            {post.comments?.map((comment, idx) => (
              <div
                key={idx}
                className="mt-2 flex items-center gap-2 text-sm text-gray-700"
              >
                <img
                  src={comment.user?.image}
                  alt="user"
                  className="h-10 w-10 rounded-full"
                />
                <strong>{comment.user?.name || "User"}:</strong>{" "}
                {comment.commentText}
                <span className="text-xs text-gray-500">
                  {" "}
                  {new Date(comment.createdAt).toLocaleString("en-GB", {
                    day: "numeric",
                    month: "short",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>No posts found</p>
      )}
    </div>
  );
};

export default Posts;