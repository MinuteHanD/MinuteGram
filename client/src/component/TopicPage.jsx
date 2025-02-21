import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../service/apiClient';
import { FileText, Plus, MessageSquare, ChevronRight, X, Upload } from 'lucide-react';

const TopicPage = () => {
    const { topicId } = useParams();
    const [posts, setPosts] = useState([]);
    const [topicName, setTopicName] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    const [mediaFile, setMediaFile] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const fetchPosts = async () => {
        try {
            const topicResponse = await api.get(`/topics/${topicId}`);
            setTopicName(topicResponse.data.name);
            const postsResponse = await api.get(`/topics/${topicId}/posts`);
            setPosts(postsResponse.data.content);
        } catch (err) {
            alert('Failed to fetch posts');
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setMediaFile(file);
            setMediaPreview(URL.createObjectURL(file));
        }
    };

    const createPost = async () => {
        try {
            const formData = new FormData();
            formData.append('post', JSON.stringify({
                title: newPostTitle,
                content: newPostContent,
                topicName: topicName
            }));
            if (mediaFile) {
                formData.append('image', mediaFile); // Keeping "image" key for backend compatibility
            }

            const response = await api.post('/posts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setShowForm(false);
            setNewPostTitle('');
            setNewPostContent('');
            setMediaFile(null);
            setMediaPreview(null);
            fetchPosts();
        } catch (err) {
            console.error('Failed to create post:', err);
            alert('Failed to create post');
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [topicId]);

    return (
        <div className="min-h-screen bg-zinc-900">
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="mb-12">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="bg-zinc-800 p-3 rounded-lg">
                                <FileText className="w-6 h-6 text-emerald-400" />
                            </div>
                            <h1 className="text-4xl font-bold text-zinc-100">
                                {topicName}
                            </h1>
                        </div>
                        {token && (
                            <button 
                                onClick={() => setShowForm(!showForm)}
                                className="bg-emerald-600 hover:bg-emerald-500 text-zinc-100 px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 font-medium"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Create Post</span>
                            </button>
                        )}
                    </div>
                </div>

                {showForm && (
                    <div className="mb-12 bg-zinc-800/50 backdrop-blur-lg rounded-xl p-6 border border-zinc-700">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-zinc-100">Create New Post</h2>
                            <button 
                                onClick={() => {
                                    setShowForm(false);
                                    setMediaPreview(null);
                                }}
                                className="text-zinc-400 hover:text-zinc-200 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Post Title"
                                    value={newPostTitle}
                                    onChange={(e) => setNewPostTitle(e.target.value)}
                                    className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                                />
                            </div>
                            <div>
                                <textarea
                                    placeholder="Write your post content..."
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    rows={6}
                                    className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all resize-none"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <label className="bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 cursor-pointer transition-all group">
                                        <input
                                            type="file"
                                            accept="image/*,video/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <div className="flex items-center space-x-2 text-zinc-400 group-hover:text-zinc-200">
                                            <Upload className="w-5 h-5" />
                                            <span>{mediaFile ? 'Change Media' : 'Add Media'}</span>
                                        </div>
                                    </label>
                                    {mediaFile && (
                                        <span className="text-zinc-400 text-sm">
                                            {mediaFile.name}
                                        </span>
                                    )}
                                </div>
                                {mediaPreview && (
                                    <div className="mt-4">
                                        {mediaFile.type.startsWith('video/') ? (
                                            <video controls src={mediaPreview} className="w-full rounded-xl max-h-64" />
                                        ) : (
                                            <img src={mediaPreview} alt="Preview" className="w-full rounded-xl max-h-64" />
                                        )}
                                    </div>
                                )}
                                <button
                                    onClick={createPost}
                                    disabled={!newPostTitle.trim() || !newPostContent.trim()}
                                    className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-zinc-100 px-6 py-2 rounded-lg transition-all duration-200 font-medium"
                                >
                                    Publish Post
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <button 
                                key={post.id}
                                onClick={() => navigate(`/posts/${post.id}`)}
                                className="w-full bg-zinc-800/50 hover:bg-zinc-800 backdrop-blur-lg border border-zinc-700 hover:border-zinc-600 rounded-xl p-6 transition-all duration-200 group text-left"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-zinc-900/50 p-2 rounded-lg group-hover:bg-emerald-500/10">
                                            <MessageSquare className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-zinc-100 group-hover:text-emerald-400 transition-colors">
                                                {post.title || 'Untitled Post'}
                                            </h3>
                                            <p className="text-sm text-zinc-400">
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-emerald-400 transform group-hover:translate-x-1 transition-all" />
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-zinc-800/50 backdrop-blur-lg rounded-xl border border-zinc-700">
                            <MessageSquare className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-zinc-300 mb-2">No posts yet</h3>
                            <p className="text-zinc-500">Be the first to start a discussion</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopicPage;