import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [showCommentForm, setShowCommentForm] = useState(false); // Toggle comment form
  const [newComment, setNewComment] = useState('');
  const [showReplyForm, setShowReplyForm] = useState({}); // Tracks which comment's reply form to show
  const [replyContent, setReplyContent] = useState('');
  const [replies, setReplies] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); 

  const fetchPostDetails = async () => {
    try {
      const postResponse = await api.get(`/posts/${postId}`);
      setPost(postResponse.data);

      const commentsResponse = await api.get(`/comments/post/${postId}`);
      setComments(commentsResponse.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch post or comments');
    }
  };

  const addComment = async () => {
    try {
      await api.post('/comments', { content: newComment, postId });
      alert('Comment added successfully!');
      setNewComment('');
      setShowCommentForm(false);
      fetchPostDetails(); // Refresh comments
    } catch (err) {
      console.error(err);
      alert('Failed to add comment');
    }
  };

  const fetchReplies = async (commentId) => {
    try {
      const response = await api.get(`/comments/${commentId}/replies`);
      setReplies((prev) => ({ ...prev, [commentId]: response.data }));
    } catch (err) {
      console.error(err);
      alert('Failed to fetch replies');
    }
  };

  const addReply = async (parentCommentId) => {
    try {
      await api.post('/comments', { content: replyContent, postId, parentCommentId });
      alert('Reply added successfully!');
      setReplyContent('');
      setShowReplyForm({});
      fetchReplies(parentCommentId); // Refresh replies
    } catch (err) {
      console.error(err);
      alert('Failed to add reply');
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, [postId]);

  if (!post) return <p>Loading...</p>;

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <h3>Comments</h3>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            {comment.content} - <small>by {comment.authorName}</small>
            <button onClick={() => fetchReplies(comment.id)}>View Replies</button>
            {token ? (
            <button onClick={() => setShowReplyForm({ [comment.id]: true })}>Reply</button>
          ) : (
            <button onClick={() => navigate('/login')}>Login to Reply</button>
          )}
            
            {/* Replies */}
            {replies[comment.id] && (
              <ul>
                {replies[comment.id].map((reply) => (
                  <li key={reply.id}>
                    {reply.content} - <small>by {reply.authorName}</small>
                  </li>
                ))}
              </ul>
            )}
            {/* Reply Form */}
            {showReplyForm[comment.id] && (
              <div>
                <textarea
                  placeholder="Write your reply here..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                />
                <button onClick={() => addReply(comment.id)}>Submit</button>
                <button onClick={() => setShowReplyForm({})}>Cancel</button>
              </div>
            )}
          </li>
        ))}
      </ul>
      {/* Create New Comment */}
      {token ? (
        <button onClick={() => setShowCommentForm(!showCommentForm)}>Add Comment</button>
      ) : (
        <button onClick={() => navigate('/login')}>Login to Add Comment</button>
      )}
      
      {showCommentForm && (
        <div>
          <textarea
            placeholder="Write your comment here..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={addComment}>Submit</button>
          <button onClick={() => setShowCommentForm(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
