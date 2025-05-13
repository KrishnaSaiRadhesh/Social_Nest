import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UserProfile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [activeTab, setActiveTab] = useState('posts'); // State for active tab
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const profileRes = await axios.get(`http://localhost:3000/api/user/${id}`, {
          withCredentials: true,
        });
        const profileData = profileRes.data;
   
        setName(profileData.name);
        setEmail(profileData.email);
        setImage(profileData.image);
        setFollowers(profileData.followers || []);
        setFollowing(profileData.following || []);
        setPosts(profileData.posts || []);

        const currentUserRes = await axios.get('http://localhost:3000/api/user/profile', {
          withCredentials: true,
        });
        const currentUserData = currentUserRes.data;
        setCurrentUserId(currentUserData._id);
        setIsFollowing(currentUserData.following?.includes(id) || false);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        if (error.response?.status === 400) {
          setError('Invalid user ID');
        } else if (error.response?.status === 401) {
          setError('Unauthorized. Please log in.');
          navigate('/login');
        } else if (error.response?.status === 404) {
          setError('User not found');
        } else {
          setError('Failed to load profile. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id && id !== 'undefined') {
      fetchData();
    } else {
      setError('Invalid user ID');
      setLoading(false);
    }
  }, [id, navigate]);

  const handleFollow = async () => {
    try {
      await axios.post(
        `http://localhost:3000/api/user/follow/${id}`,
        {},
        { withCredentials: true }
      );
      setIsFollowing(true);
      setFollowers((prev) => [...prev, currentUserId]);
    } catch (error) {
      console.error('Error following user:', error);
      setError('Failed to follow user');
    }
  };

  const handleUnFollow = async () => {
    try {
      await axios.post(
        `http://localhost:3000/api/user/unfollow/${id}`,
        {},
        { withCredentials: true }
      );
      setIsFollowing(false);
      setFollowers((prev) => prev.filter((followerId) => followerId !== currentUserId));
    } catch (error) {
      console.error('Error unfollowing user:', error);
      setError('Failed to unfollow user');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="flex flex-col justify-center items-center max-w-7xl mx-auto p-3">
        <div className="flex justify-center items-start gap-10 p-3">
          <div>
            <img src={image || '/Profile.png'} alt="" className="w-[200px]" />
            <p className="font-semibold text-[18px] mt-3 text-center">{email}</p>
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
                  className={`p-2 rounded text-white ${isFollowing ? 'bg-red-500' : 'bg-blue-500'}`}
                  onClick={isFollowing ? handleUnFollow : handleFollow}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              )}
              <button className="bg-blue-500 text-white p-2 rounded-lg cursor-pointer">
                Share Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center border-b border-gray-300">
          <button
            className={`px-5 py-2 font-semibold ${activeTab === 'posts' ? 'border-b-2 border-black' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            POSTS
          </button>
          <button
            className={`px-5 py-2 font-semibold ${activeTab === 'reels' ? 'border-b-2 border-black' : ''}`}
            onClick={() => setActiveTab('reels')}
          >
            REELS
          </button>
          <button
            className={`px-5 py-2 font-semibold ${activeTab === 'tagged' ? 'border-b-2 border-black' : ''}`}
            onClick={() => setActiveTab('tagged')}
          >
            TAGGED
          </button>
        </div>

        {/* Tab Content */}
        <div className="my-2 pb-2 bg-white shadow-xl">
          {activeTab === 'posts' && (
            <div className="grid grid-cols-3 gap-1">
              {posts.map((post) => (
                <div key={post._id}>
                  <img
                    src={post.image}
                    alt=""
                    className="h-[300px] w-[400px] object-contain"
                  />
                </div>
              ))}
            </div>
          )}
          {activeTab === 'reels' && (
            <div className="text-center p-5">
              <p>No reels available yet.</p>
            </div>
          )}
          {activeTab === 'tagged' && (
            <div className="text-center p-5">
              <p>No tagged posts available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;