import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../service/apiClient';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if(e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("post", new Blob([JSON.stringify({ title, content })], { type: "application/json" }));
      if (imageFile) {
        formData.append("image", imageFile);
      }
  
      const response = await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      navigate(`/posts/${response.data.id}`);
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Failed to create post");
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-100 to-dark-200 p-6">
      <div className="max-w-3xl mx-auto bg-dark-100/70 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-dark-300/10">
        <h2 className="text-3xl font-bold mb-6">Create New Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-dark-400 mb-2">Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-dark-100/50 text-dark-400 px-4 py-2 rounded-xl border border-dark-300/30 focus:ring-2 focus:ring-dark-300 transition-all duration-300"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-dark-400 mb-2">Content</label>
            <textarea 
              value={content} 
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-dark-100/50 text-dark-400 px-4 py-2 rounded-xl border border-dark-300/30 focus:ring-2 focus:ring-dark-300 transition-all duration-300 h-32 resize-none"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-dark-400 mb-2">Image (optional)</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="w-full text-dark-400"
            />
          </div>
          <button 
            type="submit" 
            className="bg-dark-300 text-dark-50 px-6 py-3 rounded-xl hover:bg-dark-400 transition-all duration-300 shadow-lg"
          >
            Create Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
