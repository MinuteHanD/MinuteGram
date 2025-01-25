import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({}); // To store comments for each post

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts'); // Fetch all posts
      setPosts(response.data);

      // Fetch comments for each post after loading posts
      const commentsData = {};
      for (const post of response.data) {
        const response = await api.get(`/comments/post/${post.id}`); // Fetch comments for this post
        commentsData[post.id] = response.data;
      }
      setComments(commentsData);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch posts or comments');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <h2>Posts</h2>
      {posts.map((post) => (
        <div key={post.id} style={{ marginBottom: '2rem', border: '1px solid #ddd', padding: '1rem' }}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <strong>Comments:</strong>
          <ul>
            {comments[post.id]?.length > 0 ? (
              comments[post.id].map((comment) => (
                <li key={comment.id}>
                  {comment.content} - <small>by {comment.authorName}</small>
                </li>
              ))
            ) : (
              <li>No comments yet</li>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Posts;
