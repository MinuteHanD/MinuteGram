import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../service/apiClient';
import { 
  MessageSquare, FileText, Plus, X, Upload, ChevronRight, 
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, 
  Image as ImageIcon, Link as LinkIcon, Clock, Users, TrendingUp
} from 'lucide-react';

// Shared components
const Card = React.memo(({ children, className = '', ...props }) => (
  <div 
    className={`bg-zinc-900 backdrop-blur-xl border border-zinc-800 rounded-xl shadow-lg shadow-black/20 ${className}`}
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
  size = 'md',
  ...props 
}) => {
  const baseStyles = 'rounded-lg font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-teal-600 hover:bg-teal-500 text-zinc-100 disabled:hover:bg-teal-600',
    secondary: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700',
    ghost: 'hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200',
    danger: 'bg-red-600 hover:bg-red-500 text-zinc-100'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button 
      type={type}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
});

const IconButton = React.memo(({ icon: Icon, label, active = false, ...props }) => (
  <button
    className={`p-2 rounded-lg ${active ? 'bg-teal-600 text-white' : 'hover:bg-zinc-700/50 text-zinc-400 hover:text-zinc-200'} transition-all flex items-center gap-2`}
    {...props}
  >
    <Icon className="w-5 h-5" />
    {label && <span className="text-sm">{label}</span>}
  </button>
));

const PostCard = React.memo(({ post, onInteraction }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const contentPreviewLength = 280;
  const hasLongContent = post.content.length > contentPreviewLength;

  return (
    <Card 
      className="p-6 hover:border-teal-500/30 transition-all space-y-4 cursor-pointer"
      onClick={() => navigate(`/posts/${post.id}`)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-zinc-100">
              {post.title || 'Untitled'}
            </h3>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Clock className="w-4 h-4" />
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>
        <IconButton 
          icon={MoreHorizontal} 
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      <div className="space-y-4">
        <p className="text-zinc-300 leading-relaxed">
          {isExpanded ? post.content : `${post.content.slice(0, contentPreviewLength)}${hasLongContent ? '...' : ''}`}
          {hasLongContent && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="ml-2 text-teal-400 hover:text-teal-300 font-medium"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </p>

        {post.imageUrl && (
            <div className="relative rounded-xl overflow-hidden border border-zinc-700 bg-zinc-900">
                {post.mediaType === 'video' ? (
                    <video
                        controls
                        src={post.imageUrl}
                        className="max-h-96 w-full object-cover"
                    />
                ) : (
                    <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="max-h-96 w-full object-cover"
                    />
                )}
            </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-zinc-700/50">
          <div className="flex items-center gap-4">
            <IconButton
              icon={Heart}
              label={post.likesCount?.toString() || '0'}
              active={post.liked}
              onClick={(e) => {
                e.stopPropagation();
                onInteraction('like', post.id);
              }}
            />
            <IconButton
              icon={MessageCircle}
              label={post.commentsCount?.toString() || '0'}
              onClick={(e) => {
                e.stopPropagation();
                onInteraction('comment', post.id);
              }}
            />
            <IconButton
              icon={Share2}
              onClick={(e) => {
                e.stopPropagation();
                onInteraction('share', post.id);
              }}
            />
          </div>
          <IconButton
            icon={Bookmark}
            active={post.bookmarked}
            onClick={(e) => {
              e.stopPropagation();
              onInteraction('bookmark', post.id);
            }}
          />
        </div>
      </div>
    </Card>
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);

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
    fileInputRef.current?.click();
  };

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const [topicResponse, postsResponse] = await Promise.all([
        api.get(`/topics/${topicId}`),
        api.get(`/topics/${topicId}/posts`, {
          params: {
            sort: sortBy === 'newest' ? 'createdAt,desc' :
                  sortBy === 'popular' ? 'likes,desc' :
                  'commentsCount,desc'
          }
        })
      ]);
      setTopicName(topicResponse.data.name);
      setPosts(postsResponse.data.content);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      alert('Failed to fetch posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostInteraction = async (type, postId) => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      switch (type) {
        case 'like':
          await api.post(`/posts/${postId}/like`);
          break;
        case 'comment':
          navigate(`/posts/${postId}`);
          break;
        case 'share':
          navigator.clipboard.writeText(`${window.location.origin}/posts/${postId}`);
          alert('Link copied to clipboard!');
          break;
        case 'bookmark':
          await api.post(`/posts/${postId}/bookmark`);
          break;
        default:
          break;
      }
      fetchPosts();
    } catch (err) {
      console.error(`Failed to ${type} post:`, err);
    }
  };

  useEffect(() => {
    fetchPosts();
    return () => {
      if (mediaPreview) {
        URL.revokeObjectURL(mediaPreview);
      }
    };
  }, [topicId, sortBy]);

  // Filter buttons for sorting
  const filterButtons = [
    { id: 'newest', label: 'Newest', icon: Clock },
    { id: 'popular', label: 'Popular', icon: TrendingUp },
    { id: 'discussed', label: 'Most Discussed', icon: MessageCircle },
  ];

  // Post skeleton for loading state
  const renderPostSkeleton = () => (
    <Card className="p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-zinc-800 animate-pulse"></div>
          <div>
            <div className="h-6 w-48 bg-zinc-800 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 w-full bg-zinc-800 rounded animate-pulse"></div>
        <div className="h-4 w-full bg-zinc-800 rounded animate-pulse"></div>
        <div className="h-4 w-3/4 bg-zinc-800 rounded animate-pulse"></div>
      </div>
      <div className="pt-4 border-t border-zinc-700/50 flex justify-between">
        <div className="flex gap-4">
          <div className="h-8 w-16 bg-zinc-800 rounded animate-pulse"></div>
          <div className="h-8 w-16 bg-zinc-800 rounded animate-pulse"></div>
          <div className="h-8 w-10 bg-zinc-800 rounded animate-pulse"></div>
        </div>
        <div className="h-8 w-10 bg-zinc-800 rounded animate-pulse"></div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-zinc-950 relative">
      {/* Subtle gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-teal-900/5 via-zinc-900/5 to-zinc-900/5" />
      
      {/* Subtle dot pattern */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-10 bg-repeat" />
      
      <div className="relative pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          {/* Topic Header */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-800 mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-600/10 to-emerald-600/10"></div>
            <div className="relative z-10 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-lg bg-teal-500/10">
                  <FileText className="w-8 h-8 text-teal-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {topicName}
                  </h1>
                  <p className="text-zinc-400 mt-1 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                  </p>
                </div>
              </div>
              
              {token && (
                <Button 
                  onClick={() => setShowForm(!showForm)}
                  className="self-start md:self-auto"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Post</span>
                </Button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center p-1 bg-zinc-900 border border-zinc-800 rounded-lg">
              {filterButtons.map((filter) => {
                const Icon = filter.icon;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setSortBy(filter.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                      sortBy === filter.id
                        ? 'bg-teal-600 text-white'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{filter.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Create Post Form */}
          {showForm && (
            <Card className="p-6 mb-8 border-teal-500/20">
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
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  />
                  
                  <div className="relative">
                    <textarea
                      name="content"
                      placeholder="Write your post..."
                      value={formData.content}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all resize-none"
                    />
                    <div className="absolute bottom-3 right-3 text-sm text-zinc-500">
                      {formData.content.length} / 2000
                    </div>
                  </div>

                  <div className="flex items-center gap-4 border-t border-zinc-700/50 pt-4">
                    <Button type="button" variant="secondary" onClick={openFilePicker}>
                      <ImageIcon className="w-5 h-5" />
                      <span>Add Media</span>
                    </Button>
                  </div>

                  {mediaPreview && (
                    <div className="relative z-10 rounded-xl overflow-hidden border border-zinc-700 bg-zinc-900">
                      {mediaFile?.type.startsWith('video/') ? (
                        <video 
                          controls 
                          src={mediaPreview} 
                          className="w-full h-auto max-h-96 object-cover"
                          preload="metadata"
                        />
                      ) : (
                        <img 
                          src={mediaPreview} 
                          alt="Preview" 
                          className="w-full h-auto max-h-96 object-cover"
                          loading="lazy"
                        />
                      )}
                      <Button
                        variant="danger"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          URL.revokeObjectURL(mediaPreview);
                          setMediaPreview(null);
                          setMediaFile(null);
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={!formData.title.trim() || !formData.content.trim() || isSubmitting}
                    >
                      {isSubmitting ? 'Publishing...' : 'Publish Post'}
                    </Button>
                  </div>
                </div>
              </form>
            </Card>
          )}

          {/* Posts */}
          <div className="space-y-6">
            {/* Hidden file input */}
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />

            {isLoading ? (
              Array(3).fill(0).map((_, index) => (
                <div key={`skeleton-${index}`} className="animate-pulse">
                  {renderPostSkeleton()}
                </div>
              ))
            ) : posts.length > 0 ? (
              posts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onInteraction={handlePostInteraction}
                />
              ))
            ) : (
              <Card className="py-16 text-center">
                <div className="bg-teal-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="w-8 h-8 text-teal-400" />
                </div>
                <h3 className="text-2xl font-semibold text-zinc-100 mb-3">No posts yet</h3>
                <p className="text-zinc-400 max-w-md mx-auto mb-8">
                  {token ? 'Start a discussion by creating the first post' : 'Sign in to start a discussion'}
                </p>
                {!token && (
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </Button>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicPage;