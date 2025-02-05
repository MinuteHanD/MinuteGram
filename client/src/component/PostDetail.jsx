import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../service/apiClient';
import { MessageSquare, Send, User, Clock, ThumbsUp } from 'lucide-react';

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
      <div className="min-h-screen bg-gradient-to-br from-dark-100 to-dark-200 flex items-center justify-center">
        <div className="bg-dark-100/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg animate-pulse">
          <div className="h-6 w-32 bg-dark-300/20 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-100 to-dark-200 p-6">
      <div className="max-w-4xl mx-auto py-8 space-y-8">
        {/* Post Content */}
        <div className="bg-dark-100/70 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-dark-300/10">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-dark-400 to-dark-300 bg-clip-text text-transparent">
              {post.title}
            </h2>
            
            <div className="flex items-center space-x-6 text-dark-300/70">
              <div className="flex items-center space-x-2">
                <div className="bg-dark-300/10 p-2 rounded-lg">
                  <User className="w-4 h-4" />
                </div>
                <span className="font-medium">{post.authorName || 'Anonymous'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-dark-300/10 p-2 rounded-lg">
                  <Clock className="w-4 h-4" />
                </div>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="border-t border-dark-300/10 pt-6">
              <p className="text-dark-400 leading-relaxed text-lg whitespace-pre-wrap">
                {post.content}
              </p>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-dark-100/70 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-dark-300/10">
          <div className="flex items-center space-x-4 mb-8">
            <div className="bg-dark-300/10 p-3 rounded-xl">
              <MessageSquare className="w-6 h-6 text-dark-300" />
            </div>
            <h3 className="text-2xl font-bold text-dark-400">
              Comments ({comments.length})
            </h3>
          </div>

          {comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div 
                  key={comment.id} 
                  className="group bg-dark-200/50 p-6 rounded-2xl border border-dark-300/10 hover:border-dark-300/30 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <p className="text-dark-300 mb-4 leading-relaxed">{comment.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-dark-300/70">
                      <div className="bg-dark-300/10 p-2 rounded-lg">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{comment.authorName}</span>
                      <span>•</span>
                      <span className="text-sm">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ThumbsUp className="w-4 h-4 text-dark-300/50 hover:text-dark-300 transition-colors" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 space-y-4">
              <div className="bg-dark-300/10 w-20 h-20 mx-auto rounded-full flex items-center justify-center">
                <MessageSquare className="w-10 h-10 text-dark-300/50" />
              </div>
              <p className="text-2xl font-bold text-dark-400">No comments yet</p>
              <p className="text-dark-300">Be the first to share your thoughts</p>
            </div>
          )}

          {token ? (
            <div className="mt-8 space-y-4">
              <textarea
                placeholder="Write your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full bg-dark-100/50 text-dark-400 px-6 py-4 rounded-2xl border border-dark-300/20 focus:border-dark-300/40 focus:ring-2 focus:ring-dark-300/20 transition-all duration-300 h-32 placeholder:text-dark-400/50 resize-none"
              />
              <div className="flex justify-end">
                <button 
                  onClick={addComment} 
                  className="bg-dark-300 text-dark-50 px-6 py-3 rounded-xl hover:bg-dark-400 transition-all duration-300 shadow-lg hover:shadow-dark-300/20 flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!newComment.trim()}
                >
                  <Send className="w-5 h-5" />
                  <span className="font-medium">Post Comment</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-8 bg-dark-200/50 rounded-2xl p-6 text-center">
              <button 
                onClick={() => navigate('/login')}
                className="bg-dark-300 text-dark-50 px-8 py-3 rounded-xl hover:bg-dark-400 transition-all duration-300 shadow-lg hover:shadow-dark-300/20 flex items-center space-x-3 mx-auto"
              >
                <MessageSquare className="w-5 h-5" />
                <span className="font-medium">Login to Comment</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;