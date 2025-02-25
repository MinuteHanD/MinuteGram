import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../service/apiClient';
import { 
  MessageSquare, 
  Send, 
  User, 
  Clock, 
  ThumbsUp, 
  ArrowLeft, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  ChevronUp
} from 'lucide-react';

const PostDetails = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [scrollToTop, setScrollToTop] = useState(false);

  const fetchPostDetails = async () => {
    try {
      const postResponse = await api.get(`/posts/${postId}`);
      const commentsResponse = await api.get(`/comments/post/${postId}`);
      setPost(postResponse.data);
      setComments(commentsResponse.data);
    } catch (err) {
      alert('Failed to fetch post or comments');
    }
  };

  const addComment = async () => {
    try {
      await api.post('/comments', { content: newComment, postId });
      setNewComment('');
      fetchPostDetails();
    } catch (err) {
      alert('Failed to add comment');
    }
  };

  const handleLike = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      await api.post(`/posts/${postId}/like`);
      fetchPostDetails();
    } catch (err) {
      alert('Failed to like post');
    }
  };

  useEffect(() => {
    fetchPostDetails();

    
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setScrollToTop(true);
      } else {
        setScrollToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [postId]);

  
  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <div className="fixed inset-0 bg-gradient-to-br from-teal-900/5 via-zinc-900/5 to-zinc-900/5" />
        <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-10 bg-repeat" />
        <div className="relative py-24">
          <div className="max-w-4xl mx-auto px-4">
            <div className="space-y-6">
              {/* Skeleton loaders */}
              <div className="h-10 w-2/3 bg-zinc-800 rounded-lg animate-pulse" />
              <div className="h-6 w-1/3 bg-zinc-800 rounded-lg animate-pulse" />
              <div className="h-96 bg-zinc-800 rounded-xl animate-pulse" />
              <div className="space-y-4">
                <div className="h-4 w-full bg-zinc-800 rounded animate-pulse" />
                <div className="h-4 w-full bg-zinc-800 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-zinc-800 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Background effects from Home page */}
      <div className="fixed inset-0 bg-gradient-to-br from-teal-900/5 via-zinc-900/5 to-zinc-900/5" />
      <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-10 bg-repeat" />
      
      {/* Main content */}
      <div className="relative py-24">
        <div className="max-w-4xl mx-auto px-4">
          {/* Back button */}
          <button 
            onClick={() => navigate(-1)}
            className="mb-8 flex items-center gap-2 text-zinc-400 hover:text-teal-400 transition-colors group"
          >
            <div className="p-2 bg-zinc-900 rounded-full group-hover:bg-teal-500/10 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span>Back to topics</span>
          </button>

          {/* Post content */}
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden mb-8">
            {/* Post header */}
            <div className="p-6 md:p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-5 mb-6">
                {/* Author info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">
                      {post.authorName || 'Anonymous'}
                    </div>
                    <div className="text-xs text-zinc-500">
                      Author
                    </div>
                  </div>
                </div>
                
                {/* Date & time */}
                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                  <Clock className="w-4 h-4 text-teal-400" />
                  <span>
                    {new Date(post.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              {/* Media content (if any) */}
              {post.imageUrl && (
                <div className="rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 mb-6">
                  {post.mediaType === 'video' ? (
                    <video
                      controls
                      src={post.imageUrl}
                      className="w-full max-h-[500px] object-contain"
                    />
                  ) : (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full max-h-[500px] object-contain"
                    />
                  )}
                </div>
              )}

              {/* Post content */}
              <div className="text-zinc-300 leading-relaxed whitespace-pre-line">
                {post.content}
              </div>
              
              {/* Action buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-800">
                <div className="flex items-center gap-4">
                  <button 
                    className="flex items-center gap-2 text-zinc-400 hover:text-teal-400 transition-colors"
                    onClick={handleLike}
                  >
                    <ThumbsUp className={`w-5 h-5 ${post.liked ? 'fill-teal-400 text-teal-400' : ''}`} />
                    <span className="text-sm">{post.likesCount || 0}</span>
                  </button>
                  <button className="flex items-center gap-2 text-zinc-400 hover:text-teal-400 transition-colors">
                    <MessageSquare className="w-5 h-5" />
                    <span className="text-sm">{comments.length} Comments</span>
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-zinc-400 hover:text-teal-400 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm hidden sm:inline">Share</span>
                  </button>
                  <button className="flex items-center gap-2 text-zinc-400 hover:text-teal-400 transition-colors">
                    <Bookmark className="w-5 h-5" />
                    <span className="text-sm hidden sm:inline">Save</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments section */}
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-teal-500/10 p-2 rounded">
                  <MessageSquare className="w-5 h-5 text-teal-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">
                  Comments ({comments.length})
                </h2>
              </div>

              {/* Comment form */}
              {token ? (
                <div className="mb-8">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-teal-500/20 flex-shrink-0 flex items-center justify-center">
                      <User className="w-5 h-5 text-teal-400" />
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-white resize-none focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors min-h-[120px]"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={addComment}
                      disabled={!newComment.trim()}
                      className="bg-teal-600 hover:bg-teal-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Post Comment</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6 mb-8 text-center">
                  <p className="text-zinc-400 mb-4">Login to join the conversation</p>
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-2.5 rounded-lg transition-colors inline-flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Sign In</span>
                  </button>
                </div>
              )}

              {/* Comments list */}
              <div className="space-y-6">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="border-b border-zinc-800 pb-6 last:border-b-0 last:pb-0">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-500/10 flex-shrink-0 flex items-center justify-center">
                          <User className="w-5 h-5 text-teal-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white">
                              {comment.authorName || 'Anonymous'}
                            </span>
                            <span className="text-xs text-zinc-500">•</span>
                            <span className="text-xs text-zinc-500">
                              {new Date(comment.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <p className="text-zinc-300">{comment.content}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <button className="text-xs text-zinc-500 hover:text-teal-400 transition-colors">
                              Like
                            </button>
                            <button className="text-xs text-zinc-500 hover:text-teal-400 transition-colors">
                              Reply
                            </button>
                          </div>
                        </div>
                        <button className="text-zinc-500 hover:text-white p-1">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-teal-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-8 h-8 text-teal-400" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">No comments yet</h3>
                    <p className="text-zinc-400">Be the first to share your thoughts</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      {scrollToTop && (
        <button
          onClick={scrollUp}
          className="fixed bottom-8 right-8 bg-zinc-800/80 hover:bg-teal-600 border border-zinc-700 rounded-full p-3 text-white shadow-lg transition-colors backdrop-blur-sm"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default PostDetails;