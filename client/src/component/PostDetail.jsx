import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../service/apiClient';
import { MessageSquare, Send, User, Clock, ThumbsUp, ArrowLeft } from 'lucide-react';

const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

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

  useEffect(() => {
    fetchPostDetails();
  }, [postId]);

  if (!post) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="w-full max-w-5xl mx-4">
          <div className="bg-zinc-800/50 backdrop-blur-lg rounded-xl p-8 animate-pulse space-y-4">
            <div className="h-8 w-2/3 bg-zinc-700 rounded-lg" />
            <div className="h-4 w-1/4 bg-zinc-700 rounded-lg" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-zinc-700 rounded-lg" />
              <div className="h-4 w-full bg-zinc-700 rounded-lg" />
              <div className="h-4 w-2/3 bg-zinc-700 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-zinc-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Posts</span>
        </button>

        {/* Post Content */}
        <article className="bg-zinc-800/50 backdrop-blur-lg rounded-xl p-8 border border-zinc-700">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-zinc-100">
              {post.title}
            </h1>
            
            {/* Author Info */}
            <div className="flex items-center space-x-6 text-zinc-400">
              <div className="flex items-center space-x-2">
                <div className="bg-zinc-900/50 p-2 rounded-lg">
                  <User className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="font-medium">{post.authorName || 'Anonymous'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-zinc-900/50 p-2 rounded-lg">
                  <Clock className="w-4 h-4 text-emerald-400" />
                </div>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            {/* Image */}
            {post.imageUrl && (
              <div className="relative rounded-xl overflow-hidden bg-zinc-900/50">
                <img 
                  src={post.imageUrl} 
                  alt="Post content" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Image failed to load:', post.imageUrl);
                    e.target.style.display = 'none';
                  }} 
                />
              </div>
            )}

            {/* Content */}
            <div className="border-t border-zinc-700 pt-6">
              <p className="text-zinc-300 leading-relaxed text-lg whitespace-pre-wrap">
                {post.content}
              </p>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <section className="bg-zinc-800/50 backdrop-blur-lg rounded-xl p-8 border border-zinc-700">
          <div className="flex items-center space-x-4 mb-8">
            <div className="bg-zinc-900/50 p-3 rounded-lg">
              <MessageSquare className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-100">
              Comments ({comments.length})
            </h2>
          </div>

          {/* Comments List */}
          {comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div 
                  key={comment.id} 
                  className="group bg-zinc-900/50 p-6 rounded-lg border border-zinc-700 hover:border-emerald-500/20 transition-all duration-200"
                >
                  <p className="text-zinc-300 mb-4 leading-relaxed">{comment.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-zinc-400">
                      <div className="bg-zinc-800 p-2 rounded-lg">
                        <User className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span className="font-medium">{comment.authorName}</span>
                      <span>•</span>
                      <span className="text-sm">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <ThumbsUp className="w-4 h-4 text-zinc-500 hover:text-emerald-400 transition-colors" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 space-y-4">
              <div className="bg-zinc-900/50 w-20 h-20 mx-auto rounded-full flex items-center justify-center">
                <MessageSquare className="w-10 h-10 text-zinc-600" />
              </div>
              <p className="text-xl font-semibold text-zinc-300">No comments yet</p>
              <p className="text-zinc-500">Be the first to share your thoughts</p>
            </div>
          )}

          {/* Comment Form */}
          {token ? (
            <div className="mt-8 space-y-4">
              <textarea
                placeholder="Write your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full bg-zinc-900/50 text-zinc-100 px-6 py-4 rounded-lg border border-zinc-700 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 h-32 placeholder:text-zinc-600 resize-none"
              />
              <div className="flex justify-end">
                <button 
                  onClick={addComment} 
                  className="bg-emerald-600 hover:bg-emerald-500 text-zinc-100 px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-emerald-600"
                  disabled={!newComment.trim()}
                >
                  <Send className="w-5 h-5" />
                  <span className="font-medium">Post Comment</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-8 bg-zinc-900/50 rounded-lg p-6 text-center">
              <button 
                onClick={() => navigate('/login')}
                className="bg-emerald-600 hover:bg-emerald-500 text-zinc-100 px-8 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 mx-auto"
              >
                <MessageSquare className="w-5 h-5" />
                <span className="font-medium">Login to Comment</span>
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default PostDetails;