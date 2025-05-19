import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaRegSmile } from 'react-icons/fa';
import { CiImageOn } from 'react-icons/ci';
import { BsThreeDotsVertical, BsPencilSquare, BsTrash } from 'react-icons/bs';
import Posts from './Posts';
import { toast, ToastContainer } from 'react-toastify';
import io from 'socket.io-client';

const socket = io('http://localhost:3000', { withCredentials: true });

const Second = () => {
  const [desc, setDesc] = useState('');
  const [postImage, setPostImage] = useState('');
  const [postPreview, setPostPreview] = useState('');
  const [mediaType, setMediaType] = useState('image');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [posts, setPosts] = useState([]);
  const [storyImage, setStoryImage] = useState('');
  const [storyPreview, setStoryPreview] = useState('');
  const [storyDescription, setStoryDescription] = useState('');
  const [stories, setStories] = useState([]);
  const [currentStory, setCurrentStory] = useState(null);
  const [storyIndex, setStoryIndex] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [editingStory, setEditingStory] = useState(null);
  const [editStoryImage, setEditStoryImage] = useState('');
  const [editStoryPreview, setEditStoryPreview] = useState('');
  const [editStoryDescription, setEditStoryDescription] = useState('');
  const [showStoryMenu, setShowStoryMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/user/Profile', {
          withCredentials: true,
        });
        setProfileImage(res.data.image);
        setCurrentUserId(res.data._id);
      } catch (error) {
        console.log('Error fetching profile:', error);
        toast.error('Please log in to continue.');
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/stories', {
          withCredentials: true,
        });
        setStories(res.data);
        console.log('Fetching stories data:', res.data);
      } catch (error) {
        console.log('Error fetching stories:', error);
        toast.error('Failed to load stories.');
      }
    };
    fetchStories();

    socket.on('newStory', fetchStories);
    socket.on('updateStory', fetchStories);
    socket.on('deleteStory', fetchStories);

    return () => {
      socket.off('newStory');
      socket.off('updateStory');
      socket.off('deleteStory');
    };
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:3000/api/posts', {
          withCredentials: true,
        });
        setPosts(res.data.map(post => ({
          ...post,
          likes: post.likes || [],
          liked: post.liked || false,
        })));
      } catch (error) {
        console.log('Error fetching posts:', error);
        setMessage('Failed to load posts.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleStoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Story file selected:', file.name, file.type, file.size);
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Story file is too large. Maximum size is 5MB.');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image for the story.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setStoryImage(reader.result);
        setStoryPreview(reader.result);
      };
      reader.onerror = () => {
        toast.error('Error reading story file.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditStoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Edit story file selected:', file.name, file.type, file.size);
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Story file is too large. Maximum size is 5MB.');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image for the story.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditStoryImage(reader.result);
        setEditStoryPreview(reader.result);
      };
      reader.onerror = () => {
        toast.error('Error reading story file.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStorySubmit = async (e) => {
    e.preventDefault();
    if (!storyImage) {
      toast.error('Please select an image for the story.');
      return;
    }
    if (storyDescription.length > 200) {
      toast.error('Description must be 200 characters or less.');
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        'http://localhost:3000/api/stories/create',
        { media: storyImage, mediaType: 'image', description: storyDescription },
        { withCredentials: true }
      );
      toast.success('Story created successfully!');
      setStoryImage('');
      setStoryPreview('');
      setStoryDescription('');
      socket.emit('newStory');
    } catch (error) {
      console.error('Error creating story:', error);
      toast.error(error.response?.data?.message || 'Failed to create story.');
    } finally {
      setLoading(false);
    }
  };

  const handleStoryUpdate = async (e) => {
    e.preventDefault();
    if (!editStoryImage) {
      toast.error('Please select an image for the story.');
      return;
    }
    if (editStoryDescription.length > 200) {
      toast.error('Description must be 200 characters or less.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `http://localhost:3000/api/stories/${editingStory}`,
        { media: editStoryImage, mediaType: 'image', description: editStoryDescription },
        { withCredentials: true }
      );
      setStories((prevStories) =>
        prevStories.map((story) =>
          story._id === editingStory
            ? { ...story, media: res.data.story.media, description: res.data.story.description }
            : story
        )
      );
      if (currentStory) {
        setCurrentStory((prev) =>
          prev.map((story) =>
            story._id === editingStory
              ? { ...story, media: res.data.story.media, description: res.data.story.description }
              : story
          )
        );
      }
      toast.success('Story updated successfully!');
      setEditingStory(null);
      setEditStoryImage('');
      setEditStoryPreview('');
      setEditStoryDescription('');
      setIsEditing(false);
      socket.emit('updateStory');
    } catch (error) {
      console.error('Error updating story:', error);
      toast.error(error.response?.data?.message || 'Failed to update story.');
    } finally {
      setLoading(false);
    }
  };

  const handleStoryDelete = async (storyId) => {
    if (!window.confirm('Are you sure you want to delete this story?')) return;

    try {
      setLoading(true);
      await axios.delete(`http://localhost:3000/api/stories/${storyId}`, {
        withCredentials: true,
      });
      setStories((prevStories) => prevStories.filter((story) => story._id !== storyId));
      if (currentStory && currentStory.some((story) => story._id === storyId)) {
        if (currentStory.length === 1) {
          setCurrentStory(null);
          setStoryIndex(0);
        } else {
          const newIndex = storyIndex >= currentStory.length - 1 ? storyIndex - 1 : storyIndex;
          setCurrentStory((prev) => prev.filter((story) => story._id !== storyId));
          setStoryIndex(newIndex);
        }
      }
      toast.success('Story deleted successfully!');
      socket.emit('deleteStory');
    } catch (error) {
      console.error('Error deleting story:', error);
      toast.error(error.response?.data?.message || 'Failed to delete story.');
    } finally {
      setLoading(false);
    }
  };

  const handleStoryClick = async (userStories, index) => {
    setCurrentStory(userStories);
    setStoryIndex(index);
    try {
      await axios.post(
        `http://localhost:3000/api/stories/${userStories[index]._id}/view`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.log('Error marking story as viewed:', error);
    }
  };

  useEffect(() => {
    if (currentStory && !isEditing) {
      const timer = setTimeout(() => {
        if (storyIndex < currentStory.length - 1) {
          setStoryIndex(storyIndex + 1);
        } else {
          setCurrentStory(null);
          setStoryIndex(0);
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentStory, storyIndex, isEditing]);

  const groupedStories = stories.reduce((acc, story) => {
    const userId = story.userId._id;
    if (!acc[userId]) {
      acc[userId] = { user: story.userId, stories: [] };
    }
    acc[userId].stories.push(story);
    return acc;
  }, {});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Post file selected:', file.name, file.type, file.size);
      if (file.size > 10 * 1024 * 1024) {
        setMessage('File is too large. Maximum size is 10MB.');
        return;
      }
      const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
      if (file.type.startsWith('video/') && !validVideoTypes.includes(file.type)) {
        setMessage('Unsupported video format. Please use MP4, WebM, or OGG.');
        return;
      }
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        setMessage('Please select a valid image or video file.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('Post file read successfully, type:', file.type);
        setPostImage(reader.result);
        setPostPreview(reader.result);
        setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
      };
      reader.onerror = () => {
        setMessage('Error reading file. Please try another.');
      };
      reader.readAsDataURL(file);
    } else {
      console.log('No post file selected');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!desc || !postImage) {
      setMessage('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      console.log('Sending post:', {
        description: desc,
        mediaType,
        image: postImage.slice(0, 50) + '...',
      });
      const res = await axios.post(
        'http://localhost:3000/api/posts/CreatePost',
        { description: desc, image: postImage, mediaType },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      const newPost = {
        ...res.data.newPost,
        likes: [],
        liked: false,
      };
      setPosts((prevPosts) => [newPost, ...prevPosts]);

      toast.success('Post created successfully!');
      setDesc('');
      setPostImage('');
      setPostPreview('');
      setMediaType('image');
      setMessage('');
    } catch (error) {
      console.error('Error creating post:', error.response?.data, error.message);
      setMessage(error.response?.data?.message || 'Failed to create post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 h-screen">
      <div className="Status bg-white shadow-lg rounded-2xl p-3 flex items-center w-full gap-5 overflow-x-auto">
        <div className="flex flex-col items-center">
          <label htmlFor="storyImage" className="cursor-pointer">
            <img
              src={profileImage || '/Profile.png'}
              alt="Add Story"
              className="w-20 h-20 rounded-full border-3 border-blue-500"
            />
            <span className="text-xs pt-10">Add Story</span>
          </label>
          <input
            id="storyImage"
            type="file"
            accept="image/*"
            onChange={handleStoryImageChange}
            className="hidden"
          />
        </div>
        {Object.values(groupedStories).map(({ user, stories }) => (
          <div key={user._id} className="flex flex-col items-center">
            <img
              src={user.image || '/Profile.png'}
              alt={user.username}
              className="w-20 h-20 rounded-full border-3 border-red-500 cursor-pointer"
              onClick={() => handleStoryClick(stories, 0)}
            />
            <span className="text-xs mt-1">{user.username}</span>
          </div>
        ))}
      </div>

      {currentStory && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="absolute top-0 left-0 right-0 flex gap-1 p-2">
            {currentStory.map((_, index) => (
              <div
                key={index}
                className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden"
              >
                <div
                  className={`h-full bg-white transition-all duration-[5000ms] ease-linear ${
                    index === storyIndex && !isEditing ? 'animate-progress' : ''
                  } ${index < storyIndex ? 'w-full' : 'w-0'}`}
                ></div>
              </div>
            ))}
          </div>

          <div className="absolute top-10 left-20 flex gap-3 items-center">
            <img
              src={currentStory[storyIndex].userId.image}
              className="h-10 w-10"
              alt="User"
            />
            <div>
              <h3 className="text-white text-[16px]">
                {currentStory[storyIndex].userId.name}
              </h3>
              <p className="text-white text-[16px]">
                {new Date(
                  currentStory[storyIndex].createdAt
                ).toLocaleDateString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              </p>
            </div>
          </div>

          <img
            src={currentStory[storyIndex].media}
            alt="Story"
            className="max-h-full max-w-full object-contain"
          />
          {currentStory[storyIndex].description && (
            <p className="absolute bottom-10 left-0 right-0 text-center text-white text-lg font-semibold drop-shadow-lg">
              {currentStory[storyIndex].description}
            </p>
          )}
          <button
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={() => {
              setCurrentStory(null);
              setStoryIndex(0);
              setShowStoryMenu(false);
              setIsEditing(false);
              setEditingStory(null);
            }}
          >
            ×
          </button>
          {currentUserId && currentStory[storyIndex].userId._id === currentUserId && (
            <div className="absolute top-4 right-12">
              <button
                onClick={() => setShowStoryMenu(!showStoryMenu)}
                className="text-white text-2xl"
              >
                <BsThreeDotsVertical />
              </button>
              {showStoryMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-50">
                  <button
                    onClick={() => {
                      setEditingStory(currentStory[storyIndex]._id);
                      setEditStoryImage(currentStory[storyIndex].media);
                      setEditStoryPreview(currentStory[storyIndex].media);
                      setEditStoryDescription(currentStory[storyIndex].description || '');
                      setShowStoryMenu(false);
                      setIsEditing(true);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    <BsPencilSquare />
                    Edit Story
                  </button>
                  <button
                    onClick={() => {
                      handleStoryDelete(currentStory[storyIndex]._id);
                      setShowStoryMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    <BsTrash />
                    Delete Story
                  </button>
                </div>
              )}
            </div>
          )}
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white text-3xl p-4"
            onClick={() => {
              if (storyIndex > 0) {
                setStoryIndex(storyIndex - 1);
              }
            }}
          >
            {'<'}
          </button>
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white text-3xl p-4"
            onClick={() => {
              if (storyIndex < currentStory.length - 1) {
                setStoryIndex(storyIndex + 1);
              } else {
                setCurrentStory(null);
                setStoryIndex(0);
              }
            }}
          >
            {'>'}
          </button>

          {editingStory && (
            <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-60">
              <form
                onSubmit={handleStoryUpdate}
                className="bg-white shadow-lg w-full max-w-md p-5 rounded-2xl"
              >
                <img
                  src={editStoryPreview}
                  alt="preview"
                  className="h-[200px] w-full object-cover rounded-xl"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditStoryImageChange}
                  className="block w-full my-2 text-gray-700"
                />
                <textarea
                  placeholder="Add a description..."
                  value={editStoryDescription}
                  onChange={(e) => setEditStoryDescription(e.target.value)}
                  maxLength={200}
                  className="w-full p-3 rounded-xl bg-gray-100 focus:outline-none text-black resize-none"
                  rows={3}
                />
                <p className="text-sm text-gray-500">{editStoryDescription.length}/200</p>
                <div className="flex gap-2 mt-2">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded-lg"
                    disabled={loading}
                  >
                    {loading ? 'Updating Story...' : 'Update Story'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingStory(null);
                      setEditStoryImage('');
                      setEditStoryPreview('');
                      setEditStoryDescription('');
                      setIsEditing(false);
                    }}
                    className="bg-gray-500 text-white p-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {storyPreview && !editingStory && (
        <form
          onSubmit={handleStorySubmit}
          className="bg-white shadow-lg w-full p-5 mt-2 rounded-2xl"
        >
          <img
            src={storyPreview}
            alt="preview"
            className="h-[200px] w-full object-cover rounded-xl"
          />
          <textarea
            placeholder="Add a description..."
            value={storyDescription}
            onChange={(e) => setStoryDescription(e.target.value)}
            maxLength={200}
            className="w-full p-3 mt-2 rounded-xl bg-gray-100 focus:outline-none text-black resize-none"
            rows={3}
          />
          <p className="text-sm text-gray-500">{storyDescription.length}/200</p>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-lg mt-2"
            disabled={loading}
          >
            {loading ? 'Posting Story...' : 'Post Story'}
          </button>
        </form>
      )}

      <form onSubmit={handleSubmit}>
        <div className="bg-white shadow-lg w-full p-5 mt-2 rounded-2xl flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <img
                src={profileImage || '/Profile.png'}
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
            {postPreview && (
              mediaType === 'image' ? (
                <img
                  src={postPreview}
                  alt="preview"
                  className="h-[200px] w-full object-cover rounded-xl"
                />
              ) : (
                <video
                  src={postPreview}
                  controls
                  className="h-[200px] w-full object-cover rounded-xl"
                />
              )
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
                accept="image/*,video/mp4,video/webm,video/ogg,.mp4,.webm,.ogg"
                onChange={handleImageChange}
                className="hidden"
              />
              <FaRegSmile />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-lg"
              disabled={loading}
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </form>

      {message && (
        <p
          className={`mt-2 ${
            message.includes('successfully') ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {message}
        </p>
      )}

      <Posts posts={posts} setPosts={setPosts} />
      <ToastContainer />
    </div>
  );
};

export default Second;