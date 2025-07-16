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
import Notification from './Notification';
import CommentForm from './CommentForm';

// Reply Form Component
const ReplyForm = ({ onReplySubmit, onCancel, isSubmitting }) => {
  const [replyContent, setReplyContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim() || isSubmitting) return;
    
    await onReplySubmit(replyContent);
    setReplyContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-700/60">
      <textarea
        value={replyContent}
        onChange={(e) => setReplyContent(e.target.value)}
        placeholder="Write your reply..."
        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-zinc-200 placeholder-zinc-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50 resize-none"
        rows="3"
      />
      <div className="flex justify-end gap-2 mt-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-zinc-400 hover:text-zinc-200 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!replyContent.trim() || isSubmitting}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          {isSubmitting ? 'Posting...' : 'Reply'}
          <Send className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};
import { ModernCard, ModernButton, ModernIconButton } from './Utopia';

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
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const fetchPostDetails = useCallback(async () => {
    try {
      const response = await api.get(`/posts/${postId}`);
      setPostData(response.data);
    } catch (err) {
      console.error('Failed to fetch post details:', err);
      setNotification({ message: 'Failed to fetch post details.', type: 'error' });
      navigate('/'); // Go back to home if post not found
    } finally {
      setIsLoading(false);
    }
  }, [postId, navigate]);

  useEffect(() => {
    fetchPostDetails();
  }, [fetchPostDetails]);

  const fetchPostData = fetchPostDetails; // Alias for use in CommentCard

  const handleAddComment = async (commentContent) => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await api.post('/comments', {
        content: commentContent,
        postId: Number(postId)
      });
      fetchPostDetails();
      setNotification({ message: 'Comment added successfully!', type: 'success' });
    } catch (err) {
      console.error('Failed to add comment:', err);
      setNotification({ message: 'Failed to add comment.', type: 'error' });
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
            setNotification({ message: 'Failed to like post.', type: 'error' });
        }
    }
    
    // For sharing
    if (type === 'share') {
      navigator.clipboard.writeText(window.location.href);
      setNotification({ message: 'Link copied to clipboard!', type: 'info' });
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
            setNotification({ message: 'Failed to bookmark post.', type: 'error' });
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
            <p className="text-zinc-400 mb-6">Oops! This post might have been deleted or moved.</p>
            <ModernButton onClick={() => navigate('/')}>
                <ArrowLeft className="w-5 h-5"/> Back to Home
            </ModernButton>
        </ModernCard>
      </div>
    );
  }
  
  // Comment Card Component - streamlined and visually distinct with reply support
  const CommentCard = React.memo(({ comment, isReply = false }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [isSubmittingReply, setIsSubmittingReply] = useState(false);

    const handleReply = async (replyContent) => {
      setIsSubmittingReply(true);
      try {
        await api.post('/comments', {
          content: replyContent,
          postId: parseInt(postId),
          parentCommentId: comment.id
        });
        setNotification({ message: 'Reply added successfully!', type: 'success' });
        setShowReplyForm(false);
        await fetchPostDetails(); // Refresh comments to show the new reply
      } catch (err) {
        console.error('Failed to add reply:', err);
        setNotification({ message: 'Failed to add reply.', type: 'error' });
      } finally {
        setIsSubmittingReply(false);
      }
    };

    return (
      <div className={`${isReply ? 'ml-8 border-l-2 border-teal-500/30 pl-4' : ''}`}>
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
                
                {/* Reply button - only show for authenticated users and not for replies */}
                {token && !isReply && (
                  <button
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    className="mt-3 text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Reply
                  </button>
                )}
            </div>
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <div className="mt-4 ml-4">
            <ReplyForm 
              onReplySubmit={handleReply} 
              onCancel={() => setShowReplyForm(false)}
              isSubmitting={isSubmittingReply}
            />
          </div>
        )}

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {comment.replies.map(reply => (
              <CommentCard key={reply.id} comment={reply} isReply={true} />
            ))}
          </div>
        )}
      </div>
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100 font-sans">
        <Notification 
            message={notification.message} 
            type={notification.type} 
            onClose={() => setNotification({ message: '', type: '' })} 
        />
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
                            onClick={() => setNotification({ message: 'More options are not yet implemented.', type: 'info' })}
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
                    <CommentForm postId={postId} onCommentAdded={handleAddComment} />
                ) : (
                    <div className="text-center bg-zinc-800/50 p-6 rounded-xl border border-zinc-700/60 mb-10">
                        <p className="text-zinc-400 text-lg">
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
                            <p className="text-sm mt-2">Be the first to share your perspective!</p>
                        </div>
                    )}
                </div>
            </ModernCard>
        </div>
    </div>
  );
};

export default PostDetail;