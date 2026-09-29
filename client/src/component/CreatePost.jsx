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
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 p-6">
      <div className="max-w-3xl mx-auto bg-base-200/70 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-base-300/10">
        <h2 className="text-3xl font-bold mb-6">Create New Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-base-content mb-2">Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-base-100/50 text-base-content px-4 py-2 rounded-xl border border-base-300/30 focus:ring-2 focus:ring-primary transition-all duration-300"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-base-content mb-2">Content</label>
            <textarea 
              value={content} 
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-base-100/50 text-base-content px-4 py-2 rounded-xl border border-base-300/30 focus:ring-2 focus:ring-primary transition-all duration-300 h-32 resize-none"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-base-content mb-2">Image (optional)</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="w-full text-base-content"
            />
          </div>
          <button 
            type="submit" 
            className="bg-primary text-primary-content px-6 py-3 rounded-xl hover:bg-primary-focus transition-all duration-300 shadow-lg"
          >
            Create Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
