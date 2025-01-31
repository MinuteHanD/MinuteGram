import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../service/apiClient';
import { MessageSquare, Send } from 'lucide-react';

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

  if (!post) return <p className="text-dark-300">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto bg-dark-50 p-6 space-y-6">
      <div className="bg-dark-100 rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-dark-400 mb-4">{post.title}</h2>
        <p className="text-dark-300 mb-4">{post.content}</p>
      </div>

      <div className="bg-dark-100 rounded-xl p-6 shadow-lg space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <MessageSquare className="text-dark-300" />
          <h3 className="text-xl font-semibold text-dark-400">Comments</h3>
        </div>

        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="bg-dark-200 p-4 rounded-lg border border-dark-300/20">
              <p className="text-dark-300">{comment.content}</p>
              <small className="text-dark-300 italic">- {comment.authorName}</small>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-dark-400 font-bold text-xl">No comments yet.</p>
            <p className="text-dark-400 font-bold text-lg mt-2">Share your thoughts</p>
          </div>
        )}

        {token ? (
          <div className="mt-4 flex space-x-4">
            <textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full bg-dark-200 text-dark-400 px-4 py-2 rounded-lg border border-dark-300/30 focus:ring-2 focus:ring-dark-300 transition-all h-24"
            />
            <button 
              onClick={addComment} 
              className="dark-btn dark-btn-primary flex items-center space-x-2"
              disabled={!newComment.trim()}
            >
              <Send size={20} />
              <span>Send</span>
            </button>
          </div>
        ) : (
          <div className="text-center">
            <button 
              onClick={() => navigate('/login')}
              className="dark-btn dark-btn-secondary"
            >
              Login to Comment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetails;