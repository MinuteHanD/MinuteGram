import React, { useEffect, useState } from 'react';
import api from '../service/apiClient';

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  const fetchComments = async () => {
    try {
      const response = await api.get(`/comments/post/${postId}`);
      setComments(response.data);
    } catch (err) {
      alert('Failed to fetch comments');
    }
  };

  const addComment = async () => {
    try {
      await api.post('/comments', { content, postId });
      setContent('');
      fetchComments();
    } catch (err) {
      alert('Failed to add comment');
    }
  };

  const addReply = async (parentCommentId) => {
    try {
      await api.post('/comments', { 
        content: replyContent, 
        postId, 
        parentCommentId 
      });
      setReplyContent('');
      setReplyingTo(null);
      fetchComments();
    } catch (err) {
      alert('Failed to add reply');
    }
  };

  const renderComment = (comment, isReply = false) => (
    <div key={comment.id} style={{ 
      marginLeft: isReply ? '20px' : '0', 
      marginBottom: '10px',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      backgroundColor: isReply ? '#f9f9f9' : '#fff'
    }}>
      <div>
        <strong>{comment.authorName}</strong> - <small>{new Date(comment.createdAt).toLocaleDateString()}</small>
      </div>
      <div>{comment.content}</div>
      
      {!isReply && (
        <button 
          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
          style={{ marginTop: '5px', fontSize: '12px' }}
        >
          {replyingTo === comment.id ? 'Cancel' : 'Reply'}
        </button>
      )}
      
      {replyingTo === comment.id && (
        <div style={{ marginTop: '10px' }}>
          <textarea
            placeholder="Write a reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            style={{ width: '100%', minHeight: '60px' }}
          />
          <button onClick={() => addReply(comment.id)}>Post Reply</button>
        </div>
      )}
      
      {comment.replies && comment.replies.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          {comment.replies.map(reply => renderComment(reply, true))}
        </div>
      )}
    </div>
  );

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div>
      <h2>Comments</h2>
      <div>
        {comments.map(comment => renderComment(comment))}
      </div>
      <div style={{ marginTop: '20px' }}>
        <textarea
          placeholder="Add a comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: '100%', minHeight: '80px' }}
        />
        <button onClick={addComment}>Comment</button>
      </div>
    </div>
  );
};

export default Comments;
