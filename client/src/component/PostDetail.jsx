import React, { useEffect, useState, useRef, useCallback } from 'react';
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
  MoreHorizontal,
  ThumbsUp, // Using ThumbsUp for a more active "like" feel
  CalendarDays, // Using CalendarDays for date, looks slicker
  MessageSquareText // For comments icon, clearer than MessageCircle
} from 'lucide-react';

// Reusable Components - Enhanced for a slicker look and feel
const ModernCard = React.memo(({ children, className = '', ...props }) => (
  <div 
    className={`bg-zinc-900/60 backdrop-blur-lg border border-zinc-700/70 rounded-2xl shadow-xl shadow-black/30 ${className} transition-all duration-300`}
    {...props}
  >
    {children}
  </div>
));

const ModernButton = React.memo(({ 
  children, 
  variant = 'primary', 
  className = '', 
  type = 'button',
  disabled = false,
  size = 'md',
  onClick,
  ...props 
}) => {
  const baseStyles = 'rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-98';
  const variants = {
    primary: 'bg-gradient-to-br from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white shadow-lg shadow-teal-500/20', // Back to original primary
    secondary: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700',
    ghost: 'hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-100',
    danger: 'bg-red-600 hover:bg-red-500 text-white',
    outline: 'border border-teal-500 text-teal-400 hover:bg-teal-500/10' // Back to original outline
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5',
    lg: 'px-7 py-3 text-lg'
  };
  
  return (
    <button 
      type={type} 
      disabled={disabled} 
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
});

const ModernIconButton = React.memo(({ icon: Icon, label, active = false, onClick, className = '', ...props }) => (
  <button
    className={`p-2.5 rounded-lg group ${active ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20' : 'hover:bg-zinc-800/70 text-zinc-400 hover:text-zinc-100'} transition-all flex items-center justify-center gap-2`}
    onClick={onClick}
    {...props}
  >
    <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-100'}`} />
    {label && <span className="text-sm font-medium">{label}</span>}
  </button>
));

const ModernInput = React.memo(({ label, id, type = 'text', className = '', ...props }) => (
  <div className="space-y-1">
    {label && <label htmlFor={id} className="block text-sm font-medium text-zinc-400">{label}</label>}
    <input
      id={id}
      type={type}
      className={`w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-colors duration-200 ${className}`}
      {...props}
    />
  </div>
));

const ModernTextarea = React.memo(({ label, id, className = '', ...props }) => (
  <div className="space-y-1">
    {label && <label htmlFor={id} className="block text-sm font-medium text-zinc-400">{label}</label>}
    <textarea
      id={id}
      rows="4"
      className={`w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-y transition-colors duration-200 ${className}`}
      {...props}
    ></textarea>
  </div>
));

// Skeleton Loader for Post Details
const PostDetailSkeleton = () => (
    <div className="animate-pulse">
        <div className="mb-6">
            <div className="h-10 w-48 bg-zinc-800 rounded-xl"></div>
        </div>
        <ModernCard className="p-6 md:p-10 space-y-8">
            <div className="h-12 w-3/4 bg-zinc-800 rounded-lg"></div> {/* Title */}
            <div className="flex items-center gap-4 py-4 border-y border-zinc-800">
                <div className="w-14 h-14 rounded-full bg-zinc-800"></div> {/* Avatar */}
                <div className="space-y-2 flex-1">
                    <div className="h-6 w-32 bg-zinc-800 rounded-md"></div> {/* Author */}
                    <div className="h-5 w-40 bg-zinc-800 rounded-md"></div> {/* Date */}
                </div>
            </div>
            <div className="h-80 w-full bg-zinc-800 rounded-lg"></div> {/* Media */}
            <div className="space-y-4">
                <div className="h-5 w-full bg-zinc-800 rounded-md"></div> {/* Content line 1 */}
                <div className="h-5 w-full bg-zinc-800 rounded-md"></div> {/* Content line 2 */}
                <div className="h-5 w-5/6 bg-zinc-800 rounded-md"></div> {/* Content line 3 */}
            </div>
            <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
                <div className="flex gap-4">
                    <div className="h-10 w-20 bg-zinc-800 rounded-lg"></div> {/* Interaction button 1 */}
                    <div className="h-10 w-20 bg-zinc-800 rounded-lg"></div> {/* Interaction button 2 */}
                    <div className="h-10 w-10 bg-zinc-800 rounded-lg"></div> {/* Interaction button 3 */}
                </div>
                <div className="flex gap-3">
                    <div className="h-10 w-10 bg-zinc-800 rounded-lg"></div> {/* Bookmark */}
                    <div className="h-10 w-10 bg-zinc-800 rounded-lg"></div> {/* More */}
                </div>
            </div>
        </ModernCard>
        <ModernCard className="mt-8 p-6 md:p-10">
            <div className="h-8 w-1/4 bg-zinc-800 rounded-md mb-8"></div> {/* Comments header */}
            <div className="space-y-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-zinc-800"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-5 w-3/4 bg-zinc-800 rounded-md"></div>
                        <div className="h-20 w-full bg-zinc-800 rounded-lg"></div>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-zinc-800"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-5 w-3/4 bg-zinc-800 rounded-md"></div>
                        <div className="h-20 w-full bg-zinc-800 rounded-lg"></div>
                    </div>
                </div>
            </div>
        </ModernCard>
    </div>
);

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Check for token existence
  const commentInputRef = useRef(null);

  const [postData, setPostData] = useState({ post: null, comments: [] });
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPostDetails = useCallback(async () => {
    try {
      const response = await api.get(`/posts/${postId}`);
      setPostData(response.data);
    } catch (err) {
      console.error('Failed to fetch post details:', err);
      // More direct and gen Z: "This post is like, ghosted. Probably deleted."
      alert('Ugh, this post is, like, totally ghosted. Might have been deleted.');
      navigate('/'); // Go back to home if post not found
    } finally {
      setIsLoading(false);
    }
  }, [postId, navigate]);

  useEffect(() => {
    fetchPostDetails();
  }, [fetchPostDetails]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return; // Don't submit empty comments or if already submitting
    if (!token) {
      navigate('/login'); // Redirect to login if no token
      return;
    }

    setIsSubmitting(true);
    try {
      // Optimistic UI update for immediate feedback
      const tempComment = {
        id: Date.now(), // Temporary ID
        content: newComment,
        authorName: 'You', // Placeholder for current user
        createdAt: new Date().toISOString()
      };
      setPostData(prev => ({
        ...prev,
        comments: [tempComment, ...prev.comments] // Add new comment to the top
      }));
      setNewComment(''); // Clear input immediately
      if (commentInputRef.current) commentInputRef.current.blur(); // Remove focus

      await api.post('/comments', {
        content: tempComment.content, // Use content from temp comment
        postId: Number(postId)
      });
      // A small delay before refetching to allow optimistic update to be seen
      setTimeout(() => fetchPostDetails(), 500); 
    } catch (err) {
      console.error('Failed to add comment:', err);
      alert('Failed to add comment. This is so not fetch.');
      // Revert optimistic update or refetch on error
      fetchPostDetails(); 
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleInteraction = async (type) => {
    if (!token) {
        navigate('/login'); // Redirect to login if not authenticated
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
        } catch (err) {
            console.error('Failed to like post:', err);
            setPostData(prev => ({...prev, post: originalPost})); // Revert on error
            alert('Couldn\'t, like, process that like. Try again, I guess.');
        }
    }
    
    // For sharing
    if (type === 'share') {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard! Spill the tea.');
    }

    // For bookmarking
    if (type === 'bookmark') {
        const originalPost = postData.post;
        const isBookmarked = originalPost.bookmarked;

        setPostData(prev => ({
            ...prev,
            post: {
                ...prev.post,
                bookmarked: !isBookmarked,
            }
        }));

        try {
            // Assuming an API endpoint for bookmarking
            await api.post(`/posts/${postId}/bookmark`); 
        } catch (err) {
            console.error('Failed to bookmark post:', err);
            setPostData(prev => ({...prev, post: originalPost})); // Revert on error
            alert('Failed to bookmark. My bad, I\'m literally just a program.');
        }
    }
  };

  // Render skeleton while loading
  if (isLoading) {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-200 py-12 px-4 max-w-5xl mx-auto">
            <PostDetailSkeleton />
        </div>
    );
  }

  const { post, comments } = postData;

  // Render "Post Not Found" state
  if (!post) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-400 flex items-center justify-center text-center p-8">
        <ModernCard className="p-10">
            <h3 className="text-3xl font-bold text-white mb-4">Post Not Found</h3>
            <p className="text-zinc-400 mb-6">Oops! This post might have been deleted or moved. So sorry about that. It's giving "gone with the wind."</p>
            <ModernButton onClick={() => navigate('/')}>
                <ArrowLeft className="w-5 h-5"/> Back to Home
            </ModernButton>
        </ModernCard>
      </div>
    );
  }
  
  // Comment Card Component - streamlined and visually distinct
  const CommentCard = React.memo(({ comment }) => (
    <div className="flex items-start gap-4 p-4 bg-zinc-900/50 rounded-xl border border-zinc-700/60 shadow-inner">
        <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 text-teal-400" />
        </div>
        <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-zinc-200 text-base">@{comment.authorName}</span>
                <span className="text-xs text-zinc-500">•</span>
                <span className="text-xs text-zinc-500">
                    {new Date(comment.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mt-1">{comment.content}</p>
        </div>
    </div>
  ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100 font-sans">
        {/* Background Gradients & Grid from Home Page for consistency */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/10 via-transparent to-transparent -z-10"></div>
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-900/5 via-transparent to-transparent -z-10"></div>
        <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-5 bg-repeat -z-10"></div>

        <div className="max-w-5xl mx-auto py-12 px-4 space-y-8">
            {/* Back Button - Prominent and easy to find */}
            <ModernButton 
                variant="ghost" 
                onClick={() => navigate(-1)} 
                className="mb-6 group text-zinc-400 hover:text-zinc-100 px-4 py-2" // Smaller padding
            >
                <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                <span>Back to previous page</span>
            </ModernButton>

            {/* Post Content Section - Main Card */}
            <ModernCard className="p-6 md:p-10 space-y-8">
                <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                    {post.title}
                </h1>
                
                {/* Author & Date Info - Clear and clean */}
                <div className="flex items-center gap-4 py-4 border-y border-zinc-700/60">
                    <div className="w-14 h-14 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0 shadow-md">
                        <User className="w-7 h-7 text-teal-400" />
                    </div>
                    <div>
                        <p className="font-semibold text-zinc-200 text-lg">@{post.authorName}</p>
                        <p className="text-sm text-zinc-400 flex items-center gap-2 mt-1">
                            <CalendarDays className="w-4 h-4" />
                            <span>Posted on {new Date(post.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </p>
                    </div>
                </div>

                {/* Media Display - Responsive and visually appealing */}
                {post.imageUrl && (
                    <div className="rounded-lg overflow-hidden border border-zinc-700/60 shadow-lg aspect-video max-h-[600px] flex items-center justify-center bg-black">
                        {post.mediaType === 'video' ? (
                            <video controls src={post.imageUrl} className="w-full h-full object-contain" />
                        ) : (
                            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-contain" />
                        )}
                    </div>
                )}

                {/* Post Content - Readable with good line height */}
                <div className="text-zinc-300 leading-relaxed text-lg whitespace-pre-wrap py-4">
                    {post.content}
                </div>
                
                {/* Interaction Buttons - More spaced out and visually distinct */}
                <div className="flex flex-wrap items-center justify-between pt-6 border-t border-zinc-700/60 gap-4">
                    <div className="flex items-center gap-5">
                        <ModernIconButton
                            icon={ThumbsUp} // Changed icon for a fresh feel
                            label={post.likesCount?.toString() || '0'}
                            active={post.liked}
                            onClick={() => handleInteraction('like')}
                        />
                        <ModernIconButton
                            icon={MessageSquareText} // Changed icon for clarity
                            label={comments.length?.toString() || '0'}
                            onClick={() => commentInputRef.current?.focus()}
                        />
                        <ModernIconButton
                            icon={Share2}
                            onClick={() => handleInteraction('share')}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <ModernIconButton
                            icon={Bookmark}
                            active={post.bookmarked}
                            onClick={() => handleInteraction('bookmark')}
                        />
                        <ModernIconButton
                            icon={MoreHorizontal}
                            onClick={() => alert('More options... Not implemented yet, lol. This feature is still on vacay.')}
                        />
                    </div>
                </div>
            </ModernCard>

            {/* Comments Section - Dedicated card, clean layout */}
            <ModernCard className="p-6 md:p-10">
                <h2 className="text-3xl font-bold text-white mb-8">
                    <MessageSquareText className="inline-block w-7 h-7 mr-3 text-teal-400" />
                    {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
                </h2>

                {token ? (
                    <form onSubmit={handleAddComment} className="flex items-start gap-4 mb-10 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/60 shadow-inner">
                        <div className="w-12 h-12 rounded-full bg-teal-500/20 flex-shrink-0 flex items-center justify-center">
                            <User className="w-6 h-6 text-teal-400" /> {/* User avatar placeholder */}
                        </div>
                        <div className="flex-1">
                            <ModernTextarea
                                ref={commentInputRef}
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="What are your thoughts on this post, Sir?"
                                className="mb-3 bg-zinc-800 border-zinc-700 focus:border-teal-500 focus:ring-teal-500/50"
                                rows="3"
                            />
                            <div className="flex justify-end mt-2">
                                <ModernButton type="submit" disabled={!newComment.trim() || isSubmitting}>
                                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                                    <Send className="w-4 h-4 ml-2" />
                                </ModernButton>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="text-center bg-zinc-800/50 p-6 rounded-xl border border-zinc-700/60 mb-10">
                        <p className="text-zinc-400 mb-4 text-lg">
                            Wanna join the convo? <Link to="/login" className="text-teal-400 hover:underline">Log in</Link> or <Link to="/signup" className="text-teal-400 hover:underline">sign up</Link> to drop a comment.
                        </p>
                    </div>
                )}

                {/* List of Comments */}
                <div className="space-y-6">
                    {comments.length > 0 ? (
                        // Map through comments and render CommentCard for each
                        comments.map(comment => <CommentCard key={comment.id} comment={comment} />)
                    ) : (
                        <div className="text-center py-8 text-zinc-400 bg-zinc-900/50 rounded-lg border border-zinc-700/60">
                            <p className="text-xl font-medium">No comments yet.</p>
                            <p className="text-sm mt-2">Be the first to share your perspective! It's giving "blank slate."</p>
                        </div>
                    )}
                </div>
            </ModernCard>
        </div>
    </div>
  );
};

export default PostDetail;