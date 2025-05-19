import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Posts from './Posts'; // Reuse the Posts component
import { useNavigate } from 'react-router-dom';

const SavedPosts = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:3000/api/user/profile', {
          withCredentials: true,
        });
        console.log('Saved posts response:', res.data.savedPosts); // Debug: Log the saved posts
        setSavedPosts(res.data.savedPosts || []);
      } catch (error) {
        console.error('Error fetching saved posts:', error);
        setError('Please log in to view saved posts.');
        // Redirect to login if not authenticated
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSavedPosts();
  }, [navigate]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading saved posts...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Saved Posts</h1>
      {savedPosts.length > 0 ? (
        <Posts posts={savedPosts} setPosts={setSavedPosts} />
      ) : (
        <p className="text-center text-gray-500">You have no saved posts.</p>
      )}
    </div>
  );
};

export default SavedPosts;