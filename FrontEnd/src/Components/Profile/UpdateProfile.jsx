import React, { useState } from 'react';
import { redirect, useLocation } from 'react-router-dom';
import axios from 'axios';

const UpdateProfile = () => {
  const { state } = useLocation();
  const [name, setName] = useState(state?.name || '');
  const [email, setEmail] = useState(state?.email || '');
  const [image, setImage] = useState(state?.image || '');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.put("http://localhost:3000/api/user/UpdateProfile", {
        name,
        email,
        image
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      const data = res.data;
      setName(data.name);
      setEmail(data.email);
      setImage(data.image);
      

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-black text-white min-h-screen p-4'>
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter new name"
          value={name || ""}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <input
          type="email"
          placeholder="Enter new email"
          value={email || ""}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <br />
        {image && <img src={image} alt="Preview" width="150" />}
        <br />
        <button type="submit">{loading ? "Updating..." : "Update"}</button>
      </form>
    </div>
  );
};

export default UpdateProfile;
