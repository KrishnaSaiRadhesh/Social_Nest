import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3000/api/user/Profile", {
          withCredentials: true,
        });
        const data = res.data;
        setName(data.name);
        setEmail(data.email);
        setImage(data.image);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setError("Failed to load profile. Please try again.");
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleUpdateClick = () => {
    navigate('/UpdateProfile', {
      state: { name, email, image }
    });
  };
 
  return (
    <div className='text-black'>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <>
          <h1>{name}</h1>
          <p>{email}</p>
          {image && <img src={image} alt="Profile" width="150" />}
          <button onClick={handleUpdateClick}>Update</button>
        </>
      )}
    </div>
  );
};

export default Profile;