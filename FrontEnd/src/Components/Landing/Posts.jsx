import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoMdHeartEmpty, IoMdHeart } from 'react-icons/io';
import { FaEdit, FaRegComment, FaTrash } from 'react-icons/fa';
import { RiShareForwardLine } from 'react-icons/ri';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa6';

const Posts = ({ posts, setPosts }) => {
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState('');
  const [likes, setLikes] = useState({});
  const [commentText, setCommentText] = useState({});
  const [editingPost, setEditingPost] = useState(null);
  const [editDesc, setEditDesc] = useState('');
  const [editMedia, setEditMedia] = useState('');
  const [editMediaType, setEditMediaType] = useState('image');
  const [editMessage, setEditMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showComments, setShowComments] = useState({});
  const [savedPosts, setSavedPosts] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:3000/api/user/profile', {
          withCredentials: true,
        });
        console.log('Profile response:', res.data); // Debug: Log the full response
        setCurrentUserId(res.data._id);

        // Initialize savedPosts based on user's saved posts
        const userSavedPosts = res.data.savedPosts || [];
        console.log('userSavedPosts:', userSavedPosts); // Debug: Log savedPosts

        const initialSavedPosts = {};
        posts.forEach((post) => {
          // Handle both populated objects and raw IDs
          initialSavedPosts[post._id] = userSavedPosts.some((savedPost) => {
            if (typeof savedPost === 'string') {
              // If savedPost is a raw ID (string)
              return savedPost === post._id;
            } else if (savedPost && savedPost._id) {
              // If savedPost is a populated object
              return savedPost._id.toString() === post._id.toString();
            }
            return false; // If savedPost is neither, skip
          });
        });
        setSavedPosts(initialSavedPosts);
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Please log in to continue.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []); // Run only on mount, not when posts change

  useEffect(() => {
    // Initialize likes and showComments based on props
    const initialLikes = {};
    const initialShowComments = {};
    posts.forEach((post) => {
      initialLikes[post._id] = post.liked || false;
      initialShowComments[post._id] = false;
    });
    setLikes(initialLikes);
    setShowComments(initialShowComments);
  }, [posts]);

  const commentSubmit = async (postId) => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/posts/${postId}/comment`,
        { commentText: commentText[postId] || '' },
        { withCredentials: true }
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, comments: [...(post.comments || []), res.data.comment] }
            : post
        )
      );
      setCommentText((prev) => ({ ...prev, [postId]: '' }));
      alert('Commented successfully');
    } catch (error) {
      console.error('Error commenting:', error);
      alert(error.response?.data?.message || 'Failed to comment.');
    }
  };

  const handleLike = async (id) => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/posts/${id}/like`,
        {},
        { withCredentials: true }
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === id
            ? { ...post, likes: res.data.likes, liked: res.data.liked } // Simplified likes update
            : post
        )
      );
      setLikes((prevLikes) => ({ ...prevLikes, [id]: res.data.liked }));
    } catch (err) {
      console.error('Like failed:', err);
      alert(err.response?.data?.message || 'Failed to like post.');
    }
  };

  const handleSave = async (postId) => {
    try {
      const isSaved = savedPosts[postId];
      const endpoint = isSaved ? 'unsave' : 'save';
      const res = await axios.post(
        `http://localhost:3000/api/posts/${postId}/${endpoint}`,
        {},
        { withCredentials: true }
      );
      setSavedPosts((prevSaved) => ({
        ...prevSaved,
        [postId]: res.data.saved,
      }));
      alert(res.data.saved ? 'Post saved!' : 'Post unsaved!');
    } catch (error) {
      console.error(`Error ${savedPosts[postId] ? 'unsaving' : 'saving'} post:`, error);
      alert(error.response?.data?.message || `Failed to ${savedPosts[postId] ? 'unsave' : 'save'} post.`);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post._id);
    setEditDesc(post.description);
    setEditMedia(post.image);
    setEditMediaType(post.mediaType || 'image');
    setEditMessage('');
  };

  const handleEditMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Edit file selected:', file.name, file.type, file.size);
      if (file.size > 10 * 1024 * 1024) {
        setEditMessage('File is too large. Maximum size is 10MB.');
        return;
      }
      const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
      if (file.type.startsWith('video/') && !validVideoTypes.includes(file.type)) {
        setEditMessage('Unsupported video format. Please use MP4, WebM, or OGG.');
        return;
      }
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        setEditMessage('Please select a valid image or video file.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditMedia(reader.result);
        setEditMediaType(file.type.startsWith('video/') ? 'video' : 'image');
      };
      reader.onerror = () => {
        setEditMessage('Error reading file.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (postId) => {
    if (!editDesc || !editMedia) {
      setEditMessage('Please provide a description and media.');
      return;
    }
    try {
      const res = await axios.put(
        `http://localhost:3000/api/posts/${postId}`,
        { description: editDesc, image: editMedia, mediaType: editMediaType },
        { withCredentials: true }
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...res.data.updatedPost, liked: post.liked } : post
        )
      );
      setEditingPost(null);
      setEditDesc('');
      setEditMedia('');
      setEditMediaType('image');
      setEditMessage('');
      alert('Post updated successfully');
    } catch (error) {
      console.error('Error updating post:', error);
      setEditMessage(error.response?.data?.message || 'Failed to update post.');
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/posts/${postId}`, {
        withCredentials: true,
      });
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      alert('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert(error.response?.data?.message || 'Failed to delete post.');
    }
  };

  const toggleComments = (postId) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!currentUserId) {
    return <p className="text-center text-red-500">User not authenticated. Please log in.</p>;
  }

  return (
    <div className="my-4 p-4 bg-white shadow-xl rounded-lg max-w-7xl mx-auto">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id} className="mb-6 border-b pb-4">
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-3">
                <img
                  src={post.user?.image || '/Profile.png'}
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h1 className="font-semibold text-lg text-gray-800">{post.user?.name || 'Unknown'}</h1>
                  <p className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    }).replace(',', ' at')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {post.user?._id && currentUserId && String(post.user._id) === String(currentUserId) ? (
                  <>
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-blue-500 hover:text-blue-700 transition flex items-center gap-1"
                      title="Edit Post"
                    >
                      <FaEdit size={18} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-red-500 hover:text-red-700 transition flex items-center gap-1"
                      title="Delete Post"
                    >
                      <FaTrash size={18} />
                      <span>Delete</span>
                    </button>
                  </>
                ) : (
                  <BsThreeDotsVertical className="text-gray-500" />
                )}
              </div>
            </div>
            {editingPost === post._id ? (
              <div className="p-4 bg-gray-100 rounded-lg">
                {editMessage && <p className="text-red-500 mb-4">{editMessage}</p>}
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="Edit description"
                  className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="file"
                  accept="image/*,video/mp4,video/webm,video/ogg,.mp4,.webm,.ogg"
                  onChange={handleEditMediaChange}
                  className="block w-full mb-4 text-gray-700"
                />
                {editMedia && (
                  <div className="mb-4">
                    {editMediaType === 'image' ? (
                      <img
                        src={editMedia}
                        alt="Preview"
                        className="w-full h-40 object-contain rounded-lg"
                      />
                    ) : (
                      <video
                        src={editMedia}
                        controls
                        className="w-full h-40 object-contain rounded-lg"
                      />
                    )}
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(post._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingPost(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                {post.description && <p className="p-4 text-lg text-gray-800">{post.description}</p>}
                {post.mediaType === 'video' ? (
                  <video
                    src={post.image}
                    controls
                    className="p-4 rounded-lg object-contain max-w-full"
                  />
                ) : (
                  <img
                    src={post.image}
                    alt="Post"
                    className="p-4 rounded-lg object-contain max-w-full"
                  />
                )}
                <div className="bg-gray-200 h-px w-[95%] mx-auto my-2" />
                <div className="flex items-center justify-between px-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={() => handleLike(post._id)}
                    >
                      {likes[post._id] ? (
                        <IoMdHeart className="text-red-500 text-xl" />
                      ) : (
                        <IoMdHeartEmpty className="text-xl" />
                      )}
                      <h5>{likes[post._id] ? 'Liked' : 'Like'}</h5>
                      <p>{post.likes?.length || 0}</p>
                    </div>
                    <div
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={() => toggleComments(post._id)}
                    >
                      <FaRegComment className="text-xl" />
                      <h5>Comment</h5>
                      <p>{post.comments?.length || 0}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <RiShareForwardLine className="text-xl" />
                      <h5>Share</h5>
                    </div>
                  </div>
                  <div
                    className="cursor-pointer"
                    onClick={() => handleSave(post._id)}
                    title={savedPosts[post._id] ? 'Unsave Post' : 'Save Post'}
                  >
                    {savedPosts[post._id] ? (
                      <FaBookmark className="text-xl text-blue-500" />
                    ) : (
                      <FaRegBookmark className="text-xl text-gray-500" />
                    )}
                  </div>
                </div>
                <div className="mt-2 px-4">
                  <input
                    type="text"
                    value={commentText[post._id] || ''}
                    onChange={(e) =>
                      setCommentText((prev) => ({ ...prev, [post._id]: e.target.value }))
                    }
                    placeholder="Add a comment..."
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => commentSubmit(post._id)}
                    className="bg-blue-500 text-white px-3 py-1 mt-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    Post
                  </button>
                </div>
                {showComments[post._id] && (
                  <div className="mt-2 px-4 transition-all duration-300">
                    {post.comments?.map((comment, idx) => (
                      <div key={idx} className="mt-2 flex items-center gap-2 text-sm text-gray-700">
                        <img
                          src={comment.user?.image || '/Profile.png'}
                          alt="User"
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <strong>{comment.user?.name || 'User'}:</strong>
                        <span>{comment.commentText}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No posts found</p>
      )}
    </div>
  );
};

export default Posts;