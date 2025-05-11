import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = () => {
//   const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState('');
  const [message, setMessage] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ( !desc || !image) {
      setMessage('Please fill in all fields.');
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:3000/api/posts/CreatePost',
        {  description:desc, image },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      const data = res.data;
      setMessage('Post created successfully!')
      setDesc('');
      setImage('');
      console.log(data);
    } catch (error) {
      console.error(error);
      setMessage('Failed to create post.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Create New Post</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        {/* <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ display: 'block', marginBottom: '10px', width: '100%' }}
        /> */}
        <textarea
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          required
          style={{ display: 'block', marginBottom: '10px', width: '100%' }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
          style={{ marginBottom: '10px' }}
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
