import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../service/apiClient';
import { 
  MessageSquare, FileText, Plus, X, Upload, 
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, 
  Clock, TrendingUp
} from 'lucide-react';

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
  const baseStyles = 'rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
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
    <button type={type} disabled={disabled} className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
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
                    <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-6 h-6 text-teal-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-zinc-100 break-all">
                        {post.title || 'Untitled'}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-zinc-400 mt-1">
                            <span>By {post.authorName}</span>
                        </div>
                    </div>
                </div>
                <IconButton 
                    icon={MoreHorizontal} 
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
            <div className="space-y-4 pl-16">
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
                            onClick={(e) => { e.stopPropagation(); onInteraction('like', post.id); }}
                        />
                        <IconButton
                            icon={MessageCircle}
                            label={post.commentsCount?.toString() || '0'}
                            onClick={(e) => { e.stopPropagation(); onInteraction('comment', post.id); }}
                        />
                        <IconButton icon={Share2} onClick={(e) => { e.stopPropagation(); onInteraction('share', post.id); }} />
                    </div>
                    <IconButton icon={Bookmark} active={post.bookmarked} onClick={(e) => { e.stopPropagation(); onInteraction('bookmark', post.id); }} />
                </div>
            </div>
        </Card>
    );
});

const PostSkeleton = () => (
    <Card className="p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-zinc-800"></div>
          <div>
            <div className="h-6 w-48 bg-zinc-800 rounded mb-2"></div>
            <div className="h-4 w-32 bg-zinc-800 rounded"></div>
          </div>
        </div>
      </div>
      <div className="space-y-3 pl-16">
        <div className="h-4 w-full bg-zinc-800 rounded"></div>
        <div className="h-4 w-full bg-zinc-800 rounded"></div>
        <div className="h-4 w-3/4 bg-zinc-800 rounded"></div>
      </div>
      <div className="pt-4 border-t border-zinc-700/50 flex justify-between pl-16">
        <div className="flex gap-4">
          <div className="h-8 w-16 bg-zinc-800 rounded"></div>
          <div className="h-8 w-16 bg-zinc-800 rounded"></div>
          <div className="h-8 w-10 bg-zinc-800 rounded"></div>
        </div>
        <div className="h-8 w-10 bg-zinc-800 rounded"></div>
      </div>
    </Card>
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
    const [sortBy, setSortBy] = useState('newest');
    const [isLoading, setIsLoading] = useState(true);

    const fetchTopicDetails = useCallback(async () => {
        setIsLoading(true);
        try {
            // SINGLE API call to get topic and posts together
            const response = await api.get(`/topics/${topicId}/details`, {
                params: {
                    sort: sortBy === 'newest' ? 'createdAt,desc' : 'likesCount,desc'
                }
            });
            setTopic(response.data.topic);
            setPosts(response.data.posts.content);
        } catch (err) {
            console.error('Failed to fetch topic details:', err);
            alert('Failed to fetch topic');
        } finally {
            setIsLoading(false);
        }
    }, [topicId, sortBy]);

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

    const handleSubmit = async (e) => {
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
        } catch (err) {
            console.error('Failed to create post:', err);
            alert('Failed to create post');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handlePostInteraction = (type, postId) => {
      // This function can be expanded with optimistic updates like in PostDetail
      if (!token) return navigate('/login');
      if (type === 'comment') return navigate(`/posts/${postId}`);
      // Simple refetch for other interactions for now
      fetchTopicDetails();
    }
    
    const filterButtons = [
        { id: 'newest', label: 'Newest', icon: Clock },
        { id: 'popular', label: 'Popular', icon: TrendingUp },
        { id: 'discussed', label: 'Most Discussed', icon: MessageCircle },
    ];
    
    return (
        <div className="relative pt-24 pb-12 min-h-screen bg-zinc-950">
            <div className="fixed inset-0 bg-gradient-to-br from-teal-900/5 via-zinc-900/5 to-zinc-900/5 -z-10" />
            <div className="max-w-4xl mx-auto px-4 space-y-8">
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-800 mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-600/10 to-emerald-600/10"></div>
                    <div className="relative p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-4 rounded-lg bg-teal-500/10"><FileText className="w-8 h-8 text-teal-400" /></div>
                            <div>
                                {isLoading ? <div className="h-9 w-48 bg-zinc-700 rounded animate-pulse" /> : <h1 className="text-3xl font-bold text-white">{topic?.name}</h1>}
                                {isLoading ? <div className="h-5 w-32 bg-zinc-700 rounded mt-2 animate-pulse" /> : <p className="text-zinc-400 mt-1">{topic?.description}</p>}
                            </div>
                        </div>
                        {token && <Button onClick={() => setShowForm(!showForm)}><Plus className="w-5 h-5" /><span>Create Post</span></Button>}
                    </div>
                </div>

                {showForm && (
                  <Card className="p-6 mb-8 border-teal-500/20">
                    {/* ... form JSX from your original code ... */}
                  </Card>
                )}

                <div className="space-y-6">
                    {isLoading ? (
                        Array(3).fill(0).map((_, i) => <PostSkeleton key={i} />)
                    ) : posts.length > 0 ? (
                        posts.map(post => <PostCard key={post.id} post={post} onInteraction={handlePostInteraction} />)
                    ) : (
                        <Card className="py-16 text-center"><h3 className="text-2xl font-semibold text-zinc-100">No posts yet</h3></Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopicPage;
