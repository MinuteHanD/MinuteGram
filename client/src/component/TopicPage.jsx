import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../service/apiClient'; 
import { MessageSquare, FileText, Plus, X, Upload, ChevronRight } from 'lucide-react';


const Card = React.memo(({ children, className = '', ...props }) => (
  <div 
    className={`bg-zinc-800/40 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-lg shadow-black/20 ${className}`}
    {...props}
  >
    {children}
  </div>
));


const Button = React.memo(({ 
  children, 
  variant = 'primary', 
  className = '', 
  type = 'button',
  disabled = false,
  ...props 
}) => {
  const baseStyles = 'px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-emerald-600 hover:bg-emerald-500 text-zinc-100 disabled:hover:bg-emerald-600',
    secondary: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700',
    ghost: 'hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200'
  };
  
  return (
    <button 
      type={type}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
});


export const TopicPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  
  const fileInputRef = useRef(null);

  const [posts, setPosts] = useState([]);
  const [topicName, setTopicName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (mediaPreview) {
        URL.revokeObjectURL(mediaPreview);
      }
      setMediaFile(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  
  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  
  const fetchPosts = async () => {
    try {
      const [topicResponse, postsResponse] = await Promise.all([
        api.get(`/topics/${topicId}`),
        api.get(`/topics/${topicId}/posts`)
      ]);
      setTopicName(topicResponse.data.name);
      setPosts(postsResponse.data.content);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      alert('Failed to fetch posts');
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataObj = new FormData();
      formDataObj.append('post', JSON.stringify({
        title: formData.title,
        content: formData.content,
        topicName
      }));
      
      if (mediaFile) {
        formDataObj.append('image', mediaFile);
      }

      await api.post('/posts', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      
      setShowForm(false);
      setFormData({ title: '', content: '' });
      setMediaFile(null);
      if (mediaPreview) {
        URL.revokeObjectURL(mediaPreview);
        setMediaPreview(null);
      }
      fetchPosts();
    } catch (err) {
      console.error('Failed to create post:', err);
      alert('Failed to create post');
    }
  };

  
  useEffect(() => {
    fetchPosts();
    return () => {
      if (mediaPreview) {
        URL.revokeObjectURL(mediaPreview);
      }
    };
  }, [topicId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-emerald-500/10">
              <FileText className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              {topicName}
            </h1>
          </div>
          {token && (
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus className="w-5 h-5" />
              <span>Create Post</span>
            </Button>
          )}
        </div>

        {showForm && (
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-zinc-100">New Post</h2>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ title: '', content: '' });
                    if (mediaPreview) {
                      URL.revokeObjectURL(mediaPreview);
                      setMediaPreview(null);
                    }
                  }}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Post Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
                
                <textarea
                  name="content"
                  placeholder="Write your post..."
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Hidden file input controlled via ref */}
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      className="hidden"
                    />
                    <Button type="button" variant="secondary" onClick={openFilePicker}>
                      <Upload className="w-5 h-5" />
                      <span>{mediaFile ? 'Change Media' : 'Add Media'}</span>
                    </Button>
                    {mediaFile && (
                      <span className="text-zinc-400 text-sm">{mediaFile.name}</span>
                    )}
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={!formData.title.trim() || !formData.content.trim()}
                  >
                    Publish Post
                  </Button>
                </div>

                {mediaPreview && (
                  <div className="rounded-xl overflow-hidden bg-zinc-900">
                    {mediaFile?.type.startsWith('video/') ? (
                      <video controls src={mediaPreview} className="max-h-64 w-full" />
                    ) : (
                      <img src={mediaPreview} alt="Preview" className="max-h-64 w-full object-cover" />
                    )}
                  </div>
                )}
              </div>
            </form>
          </Card>
        )}

        <div className="space-y-4">
          {posts.map(post => (
            <Card
              key={post.id}
              onClick={() => navigate(`/posts/${post.id}`)}
              className="p-6 hover:border-emerald-500/30 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <MessageSquare className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-zinc-100 group-hover:text-emerald-400">
                      {post.title || 'Untitled'}
                    </h3>
                    <p className="text-sm text-zinc-400">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-emerald-400" />
              </div>
            </Card>
          ))}

          {!posts.length && (
            <Card className="py-20 text-center">
              <MessageSquare className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-zinc-300 mb-2">No posts yet</h3>
              <p className="text-zinc-500">Be the first to start a discussion</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopicPage;
