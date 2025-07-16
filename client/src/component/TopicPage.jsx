import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../service/apiClient';
import { 
  MessageSquare, FileText, Plus, X, Upload, 
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, 
  Clock, TrendingUp, Sparkles, Send, Image as ImageIcon, Video, Link, Eye, User, Calendar
} from 'lucide-react';
import Notification from './Notification'; // Import the Notification component
import { ModernCard, ModernButton, ModernIconButton, ModernInput, ModernTextarea } from './Utopia';

// Post Card for this page - simplified and more focused
const TopicPostCard = React.memo(({ post, onInteraction }) => {
    const navigate = useNavigate();
    const contentPreviewLength = 200; // Shorter preview for a denser feed
    const hasLongContent = post.content.length > contentPreviewLength;

    const handleCardClick = (e) => {
      // Navigate to post detail only if the click wasn't on an interactive element
      if (!e.target.closest('button')) {
        navigate(`/posts/${post.id}`);
      }
    };

    return (
        <ModernCard 
        className="p-5 flex flex-col group hover:border-teal-500/50 transition-all duration-300 transform hover:scale-[1.01]"
        onClick={handleCardClick}
        >
            {/* Image/Video Thumbnail - prominent feature */}
            {post.imageUrl && (
                <div className="relative rounded-lg overflow-hidden border border-zinc-700/60 bg-zinc-900 mb-4 aspect-video">
                    {post.mediaType === 'video' ? (
                        <video
                            src={post.imageUrl}
                            className="w-full h-full object-cover"
                            muted // Muted for preview
                            loop // Loop for preview
                        />
                    ) : (
                        <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <ModernButton size="sm" variant="primary" onClick={handleCardClick}>
                            <Eye className="w-4 h-4"/> View Post
                        </ModernButton>
                    </div>
                </div>
            )}

            {/* Post Details */}
            <div className="flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-zinc-100 mb-2 line-clamp-2 leading-snug break-words">
                  {post.title || 'Untitled Post'}
                </h3>
                <p className="text-zinc-400 text-sm mb-3 line-clamp-3">
                    {post.content.slice(0, contentPreviewLength)}{hasLongContent ? '...' : ''}
                </p>

                {/* Author and Date */}
                <div className="flex items-center gap-3 text-xs text-zinc-500 mb-4 mt-auto">
                    <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span className="font-medium text-teal-400">@{post.authorName}</span>
                    </div>
                    <span className="text-zinc-600">•</span>
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(post.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                </div>

                {/* Interaction Buttons - smaller and more compact */}
                <div className="flex items-center justify-between pt-3 border-t border-zinc-700/50">
                    <div className="flex items-center gap-3">
                        <ModernIconButton
                            icon={Heart}
                            label={post.likesCount?.toString() || '0'}
                            active={post.liked}
                            onClick={(e) => { e.stopPropagation(); onInteraction('like', post.id); }}
                            className="!p-2" // Smaller padding
                        />
                        <ModernIconButton
                            icon={MessageCircle}
                            label={post.commentsCount?.toString() || '0'}
                            onClick={(e) => { e.stopPropagation(); onInteraction('comment', post.id); }}
                            className="!p-2"
                        />
                        <ModernIconButton 
                            icon={Share2} 
                            onClick={(e) => { e.stopPropagation(); onInteraction('share', post.id); }} 
                            className="!p-2 hidden sm:flex" // Hide on small screens
                        />
                    </div>
                    <ModernIconButton 
                        icon={Bookmark} 
                        active={post.bookmarked} 
                        onClick={(e) => { e.stopPropagation(); onInteraction('bookmark', post.id); }} 
                        className="!p-2"
                    />
                </div>
            </div>
        </ModernCard>
    );
});

const PostSkeleton = () => (
    <ModernCard className="p-5 flex flex-col animate-pulse">
      <div className="relative rounded-lg overflow-hidden bg-zinc-800/80 mb-4 aspect-video"></div>
      <div className="h-5 w-3/4 bg-zinc-800/80 rounded-md mb-2"></div>
      <div className="h-4 w-full bg-zinc-800/80 rounded-md mb-1"></div>
      <div className="h-4 w-5/6 bg-zinc-800/80 rounded-md mb-4"></div>
      
      <div className="flex items-center gap-3 text-xs mb-4 mt-auto">
          <div className="h-4 w-20 bg-zinc-800/80 rounded-md"></div>
          <div className="h-4 w-16 bg-zinc-800/80 rounded-md"></div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-zinc-700/50">
        <div className="flex gap-3">
          <div className="h-8 w-14 bg-zinc-800/80 rounded-lg"></div>
          <div className="h-8 w-14 bg-zinc-800/80 rounded-lg"></div>
          <div className="h-8 w-10 bg-zinc-800/80 rounded-lg hidden sm:block"></div>
        </div>
        <div className="h-8 w-10 bg-zinc-800/80 rounded-lg"></div>
      </div>
    </ModernCard>
);

export const TopicPage = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const fileInputRef = useRef(null);

    const [topic, setTopic] = useState(null);
    const [posts, setPosts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', content: '' });
    const [mediaFile, setMediaFile] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sortBy, setSortBy] = useState('newest'); // Default to 'newest'
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState({ message: '', type: '' });

    const fetchTopicDetails = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get(`/topics/${topicId}/details`, {
                params: {
                    sort: sortBy === 'newest' ? 'createdAt,desc' : 'likesCount,desc'
                }
            });
            setTopic(response.data.topic);
            setPosts(response.data.posts.content);
        } catch (err) {
            console.error('Failed to fetch topic details:', err);
            setError('Failed to fetch topic details. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }, [topicId, sortBy]);

    useEffect(() => {
        if (topic) {
            document.title = `${topic.name} - MinuteGram`;
        }
    }, [topic]);

    useEffect(() => {
        fetchTopicDetails();
        return () => {
            if (mediaPreview) {
                URL.revokeObjectURL(mediaPreview);
            }
        };
    }, [fetchTopicDetails, mediaPreview]);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (mediaPreview) URL.revokeObjectURL(mediaPreview);
            setMediaFile(file);
            setMediaPreview(URL.createObjectURL(file));
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting || !topic) return;

        setIsSubmitting(true);
        try {
            const postFormData = new FormData();
            postFormData.append('post', JSON.stringify({
                title: formData.title,
                content: formData.content,
                topicName: topic.name
            }));
            if (mediaFile) {
                postFormData.append('image', mediaFile);
            }

            await api.post('/posts', postFormData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            setShowForm(false);
            setFormData({ title: '', content: '' });
            setMediaFile(null);
            if (mediaPreview) {
                URL.revokeObjectURL(mediaPreview);
                setMediaPreview(null);
            }
            fetchTopicDetails();
            setNotification({ message: 'Post created successfully!', type: 'success' });
        } catch (err) {
            console.error('Failed to create post:', err);
            setNotification({ message: 'Failed to create post. Please try again.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handlePostInteraction = (type, postId) => {
      if (!token) {
        return navigate('/login');
      }
      if (type === 'comment') {
        return navigate(`/posts/${postId}`);
      }
      fetchTopicDetails();
    }
    
    const filterButtons = [
        { id: 'newest', label: 'Newest', icon: Clock },
        { id: 'popular', label: 'Popular', icon: TrendingUp },
    ];
    
    return (
        <div className="relative min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100 font-sans">
            <Notification 
                message={notification.message} 
                type={notification.type} 
                onClose={() => setNotification({ message: '', type: '' })} 
            />
            {/* Background Gradient & Effects from Homepage */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/10 via-transparent to-transparent -z-10"></div>
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-900/5 via-transparent to-transparent -z-10"></div>
            <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-5 bg-repeat -z-10"></div>
            
            {/* Content Area */}
            <main className="relative pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-6 space-y-12">
                    {/* Topic Header - now more of a distinct, almost "magazine" style banner */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-900/90 to-zinc-800/80 border border-zinc-700/60 shadow-2xl">
                        {/* Subtle background overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/10 to-emerald-600/10 opacity-70"></div>
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                        
                        <div className="relative p-8 lg:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-5">
                                <div className="p-4 rounded-xl bg-teal-500/15 flex-shrink-0 shadow-md">
                                    <FileText className="w-9 h-9 text-teal-400" />
                                </div>
                                <div>
                                    {isLoading ? (
                                        <>
                                            <div className="h-10 w-64 bg-zinc-700 rounded-lg animate-pulse" />
                                            <div className="h-6 w-48 bg-zinc-700 rounded-md mt-3 animate-pulse" />
                                        </>
                                    ) : (
                                        <>
                                            <h1 className="text-4xl font-extrabold text-white leading-tight">
                                                {topic?.name}
                                            </h1>
                                            <p className="text-zinc-400 mt-2 text-lg max-w-lg">
                                                {topic?.description}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                            {token && (
                                <ModernButton 
                                    onClick={() => setShowForm(!showForm)} 
                                    size="lg"
                                    className="shrink-0 group"
                                >
                                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                                    <span>Create New Post</span>
                                    <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </ModernButton>
                            )}
                        </div>
                    </div>

                    {/* Create Post Form - using the new modal style for consistency */}
                    {showForm && (
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                            <div className="relative w-full max-w-3xl">
                                <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-cyan-600/20 rounded-3xl blur-xl"></div>
                                <div className="relative bg-zinc-900/95 backdrop-blur-xl rounded-3xl border border-zinc-700/50 shadow-2xl">
                                    <div className="p-8">
                                        <div className="flex justify-between items-center mb-8">
                                            <div>
                                                <h2 className="text-2xl font-bold text-white mb-2">Create New Post in "{topic?.name}"</h2>
                                                <p className="text-zinc-400">Share your thoughts, media, or questions with the community.</p>
                                            </div>
                                            <button 
                                                onClick={() => setShowForm(false)} 
                                                className="text-zinc-400 hover:text-white transition-colors rounded-full p-2 hover:bg-zinc-800/50"
                                            >
                                                <X className="w-6 h-6" />
                                            </button>
                                        </div>
                                        
                                        <form onSubmit={handleFormSubmit} className="space-y-6">
                                            <ModernInput
                                                id="post-title"
                                                label="Post Title"
                                                placeholder="A catchy title for your post..."
                                                value={formData.title}
                                                onChange={(e) => setFormData(prevState => ({ ...prevState, title: e.target.value }))}
                                                required
                                            />
                                            <ModernTextarea
                                                id="post-content"
                                                label="Your Message"
                                                placeholder="What's on your mind? Share details, insights, or questions."
                                                value={formData.content}
                                                onChange={(e) => setFormData(prevState => ({ ...prevState, content: e.target.value }))}
                                                required
                                            />

                                            {/* Media Upload Section */}
                                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                    accept="image/*,video/*"
                                                />
                                                <ModernButton 
                                                    type="button" 
                                                    onClick={() => fileInputRef.current?.click()} 
                                                    variant="secondary"
                                                    className="w-full sm:w-auto"
                                                >
                                                    <Upload className="w-5 h-5"/>
                                                    Upload Media
                                                </ModernButton>
                                                {mediaFile && (
                                                    <div className="flex items-center gap-2 text-zinc-300 text-sm bg-zinc-800/50 px-3 py-2 rounded-lg border border-zinc-700/60 w-full sm:w-auto overflow-hidden text-ellipsis whitespace-nowrap">
                                                        <span className="truncate">{mediaFile.name}</span>
                                                        <ModernIconButton 
                                                            icon={X} 
                                                            size="sm"
                                                            onClick={() => {
                                                                setMediaFile(null);
                                                                if (mediaPreview) URL.revokeObjectURL(mediaPreview);
                                                                setMediaPreview(null);
                                                                if (fileInputRef.current) fileInputRef.current.value = '';
                                                            }} 
                                                            className="text-zinc-500 hover:text-zinc-100 hover:bg-zinc-700/60 !p-1"
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {mediaPreview && (
                                                <div className="mt-4 relative w-full h-64 bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700 flex items-center justify-center">
                                                    {mediaFile && mediaFile.type.startsWith('video/') ? (
                                                        <video src={mediaPreview} controls className="max-h-full max-w-full object-contain" />
                                                    ) : (
                                                        <img src={mediaPreview} alt="Media preview" className="max-h-full max-w-full object-contain" />
                                                    )}
                                                    <ModernIconButton 
                                                        icon={X} 
                                                        className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white" 
                                                        onClick={() => {
                                                            setMediaFile(null);
                                                            if (mediaPreview) URL.revokeObjectURL(mediaPreview);
                                                            setMediaPreview(null);
                                                            if (fileInputRef.current) fileInputRef.current.value = '';
                                                        }}
                                                    />
                                                </div>
                                            )}

                                            <div className="flex justify-end gap-4 pt-6">
                                                <ModernButton 
                                                    type="button" 
                                                    variant="ghost" 
                                                    onClick={() => setShowForm(false)}
                                                >
                                                    Cancel
                                                </ModernButton>
                                                <ModernButton 
                                                    type="submit" 
                                                    disabled={isSubmitting || !formData.title || !formData.content}
                                                >
                                                    {isSubmitting ? 'Posting...' : <><Send className="w-5 h-5"/> Post Now</>}
                                                </ModernButton>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Filter and Sort options - a dedicated section now */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 p-4 bg-zinc-900/50 rounded-xl border border-zinc-700/60 shadow-inner">
                        <span className="text-zinc-400 text-base font-semibold mr-2">Browse Posts:</span>
                        <div className="flex gap-3 flex-wrap justify-center sm:justify-start">
                            {filterButtons.map(button => (
                                <ModernButton
                                    key={button.id}
                                    variant={sortBy === button.id ? 'primary' : 'outline'}
                                    size="sm"
                                    onClick={() => setSortBy(button.id)}
                                    className={sortBy !== button.id ? 'hover:text-teal-300 hover:border-teal-400' : ''}
                                >
                                    <button.icon className="w-4 h-4" />
                                    {button.label}
                                </ModernButton>
                            ))}
                        </div>
                    </div>
                    
                    {/* Posts Grid - main display of posts */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array(6).fill(0).map((_, i) => <PostSkeleton key={i} />)}
                        </div>
                    ) : error ? (
                        <ModernCard className="py-20 text-center flex flex-col items-center justify-center">
                            <XCircle className="w-16 h-16 text-red-500 mb-4" />
                            <h3 className="text-2xl font-bold text-white mb-2">Error</h3>
                            <p className="text-zinc-400">{error}</p>
                        </ModernCard>
                    ) : posts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map(post => <TopicPostCard key={post.id} post={post} onInteraction={handlePostInteraction} />)}
                        </div>
                    ) : (
                        <ModernCard className="py-20 text-center flex flex-col items-center justify-center">
                            <img src="https://assets-global.website-files.com/5f69ac96ef2c5608ed1165cd/601d51f28b4c2b9a7b7a1e0b_EmptyState.svg" alt="No posts" className="w-48 h-48 mb-6 opacity-80"/>
                            <h3 className="text-3xl font-bold text-zinc-100 mb-3">No posts yet!</h3>
                            <p className="text-zinc-400 text-lg max-w-md">Be the first to share something amazing in this topic.</p>
                            {token && (
                                <ModernButton onClick={() => setShowForm(true)} className="mt-8 group">
                                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"/> Start a New Post
                                    <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </ModernButton>
                            )}
                        </ModernCard>
                    )}
                </div>
            </main>
        </div>
    );
};

export default TopicPage;