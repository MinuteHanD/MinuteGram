import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');

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

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div>
      <h2>Comments</h2>
      <ul>
        {comments.map(comment => (
          <li key={comment.id}>
            {comment.content} - <small>{comment.authorName}</small>
          </li>
        ))}
      </ul>
      <textarea
        placeholder="Add a comment"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={addComment}>Comment</button>
    </div>
  );
};

export default Comments;
