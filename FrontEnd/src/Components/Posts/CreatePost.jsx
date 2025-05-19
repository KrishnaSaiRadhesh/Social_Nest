import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = ({ onPostCreated }) => {
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState('');
  const [message, setMessage] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!desc || !image) {
      setMessage('Please fill in all fields.');
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:3000/api/posts/CreatePost',
        { description: desc, image },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      setMessage('Post created successfully!');
      setDesc('');
      setImage('');
      if (onPostCreated) onPostCreated(res.data.newPost);
    } catch (error) {
      console.error(error);
      setMessage('Failed to create post.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Create N</h2>
      {message && <p className="text-red-500 mb-4">{message}</p>}
      <div>
        <textarea
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          required
          className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
          className="block w-full mb-4 text-gray-700"
        />
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default CreatePost;