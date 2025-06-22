import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../service/apiClient';
import { 
  Send, 
  User, 
  Clock, 
  Heart, 
  MessageCircle,
  ArrowLeft, 
  Share2, 
  Bookmark, 
  MoreHorizontal
} from 'lucide-react';

const Card = ({ children, className = '', ...props }) => (
  <div 
    className={`bg-zinc-900 backdrop-blur-xl border border-zinc-800 rounded-xl shadow-lg shadow-black/20 ${className}`}
    {...props}
  >
    {children}
  </div>
);

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  type = 'button',
  disabled = false,
  ...props 
}) => {
  const baseStyles = 'rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-teal-600 hover:bg-teal-500 text-zinc-100 disabled:hover:bg-teal-600',
    secondary: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700',
    ghost: 'hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200',
  };
  
  return (
    <button type={type} disabled={disabled} className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const IconButton = ({ icon: Icon, label, active = false, ...props }) => (
  <button
    className={`p-2 rounded-lg ${active ? 'bg-teal-600 text-white' : 'hover:bg-zinc-700/50 text-zinc-400 hover:text-zinc-200'} transition-all flex items-center gap-2`}
    {...props}
  >
    <Icon className="w-5 h-5" />
    {label && <span className="text-sm">{label}</span>}
  </button>
);

const PostSkeleton = () => (
    <div className="animate-pulse">
        <Card className="p-6 md:p-8 space-y-6">
            <div className="h-8 w-3/4 bg-zinc-800 rounded"></div>
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-800"></div>
                <div className="space-y-2">
                    <div className="h-4 w-24 bg-zinc-800 rounded"></div>
                    <div className="h-4 w-32 bg-zinc-800 rounded"></div>
                </div>
            </div>
            <div className="h-40 w-full bg-zinc-800 rounded-lg"></div>
            <div className="space-y-3">
                <div className="h-4 w-full bg-zinc-800 rounded"></div>
                <div className="h-4 w-full bg-zinc-800 rounded"></div>
                <div className="h-4 w-5/6 bg-zinc-800 rounded"></div>
            </div>
        </Card>
        <Card className="mt-6 p-6 md:p-8">
            <div className="h-6 w-1/4 bg-zinc-800 rounded mb-6"></div>
            <div className="space-y-4">
                <div className="h-16 w-full bg-zinc-800 rounded-lg"></div>
                <div className="h-16 w-full bg-zinc-800 rounded-lg"></div>
            </div>
        </Card>
    </div>
);

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const commentInputRef = useRef(null);

  const [postData, setPostData] = useState({ post: null, comments: [] });
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPostDetails = async () => {
    try {
      const response = await api.get(`/posts/${postId}`);
      setPostData(response.data);
    } catch (err) {
      console.error('Failed to fetch post details:', err);
      alert('Failed to fetch post details. It might have been deleted.');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, [postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;
    if (!token) {
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/comments', {
        content: newComment,
        postId: Number(postId)
      });
      setNewComment('');
      await fetchPostDetails(); // Refetch all data to get the new comment
    } catch (err) {
      console.error('Failed to add comment:', err);
      alert('Failed to add comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleInteraction = async (type) => {
    if (!token) {
        navigate('/login');
        return;
    }
    
    // Optimistic UI update for likes
    if (type === 'like') {
        const originalPost = postData.post;
        const isLiked = originalPost.liked;
        const newLikesCount = isLiked ? originalPost.likesCount - 1 : originalPost.likesCount + 1;
        
        setPostData(prev => ({
            ...prev,
            post: {
                ...prev.post,
                liked: !isLiked,
                likesCount: newLikesCount
            }
        }));
        
        try {
            await api.post(`/posts/${postId}/like`);
            // We can refetch to ensure consistency, but for likes, optimistic is often enough
            // fetchPostDetails(); 
        } catch (err) {
            console.error('Failed to like post:', err);
            setPostData(prev => ({...prev, post: originalPost})); // Revert on error
        }
    }
    
    if (type === 'share') {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };


  if (isLoading) {
    return (
        <div className="max-w-4xl mx-auto py-8">
            <PostSkeleton />
        </div>
    );
  }

  const { post, comments } = postData;

  if (!post) {
    return (
      <div className="text-center py-20 text-zinc-400">
        Post not found.
      </div>
    );
  }
  
  const Comment = ({ comment }) => (
    <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-teal-900/50 flex items-center justify-center">
            <User className="w-5 h-5 text-teal-400" />
        </div>
        <div className="flex-1">
            <div className="flex items-center gap-2">
                <span className="font-semibold text-zinc-200">{comment.authorName}</span>
                <span className="text-xs text-zinc-500">•</span>
                <span className="text-xs text-zinc-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                </span>
            </div>
            <p className="text-zinc-300 mt-1">{comment.content}</p>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200">
        <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
            <Button variant="secondary" onClick={() => navigate(-1)} className="mb-4">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Topic</span>
            </Button>

            {/* Post Content Card */}
            <Card className="p-6 md:p-8 space-y-6">
                <h1 className="text-3xl md:text-4xl font-bold text-white">{post.title}</h1>
                
                <div className="flex items-center gap-4 border-b border-t border-zinc-800 py-4">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                        <User className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                        <p className="font-semibold text-zinc-200">{post.authorName}</p>
                        <p className="text-sm text-zinc-400">
                            Posted on {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {post.imageUrl && (
                    <div className="rounded-lg overflow-hidden border border-zinc-700">
                        {post.mediaType === 'video' ? (
                            <video controls src={post.imageUrl} className="w-full max-h-[500px] object-contain bg-black" />
                        ) : (
                            <img src={post.imageUrl} alt={post.title} className="w-full max-h-[500px] object-contain bg-black" />
                        )}
                    </div>
                )}

                <div className="text-zinc-300 leading-relaxed text-lg whitespace-pre-wrap">
                    {post.content}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                    <div className="flex items-center gap-4">
                        <IconButton
                            icon={Heart}
                            label={post.likesCount?.toString() || '0'}
                            active={post.liked}
                            onClick={() => handleInteraction('like')}
                        />
                        <IconButton
                            icon={MessageCircle}
                            label={comments.length?.toString() || '0'}
                            onClick={() => commentInputRef.current?.focus()}
                        />
                        <IconButton
                            icon={Share2}
                            onClick={() => handleInteraction('share')}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <IconButton
                            icon={Bookmark}
                            active={post.bookmarked}
                            onClick={() => handleInteraction('bookmark')}
                        />
                        <IconButton
                            icon={MoreHorizontal}
                        />
                    </div>
                </div>
            </Card>

            {/* Comments Section Card */}
            <Card className="p-6 md:p-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                    {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
                </h2>

                {token && (
                    <form onSubmit={handleAddComment} className="flex items-start gap-4 mb-8">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex-shrink-0" />
                        <div className="flex-1">
                            <textarea
                                ref={commentInputRef}
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 focus:border-teal-500 focus:ring-teal-500/50 transition resize-none"
                                rows="3"
                            />
                            <div className="flex justify-end mt-2">
                                <Button type="submit" disabled={!newComment.trim() || isSubmitting}>
                                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                                    <Send className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </form>
                )}

                <div className="space-y-6">
                    {comments.length > 0 ? (
                        comments.map(comment => <Comment key={comment.id} comment={comment} />)
                    ) : (
                        <p className="text-zinc-400 text-center py-8">Be the first to comment.</p>
                    )}
                </div>
            </Card>
        </div>
    </div>
  );
};

export default PostDetail;
