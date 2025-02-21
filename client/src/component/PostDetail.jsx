import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../service/apiClient';
import { MessageSquare, Send, User, Clock, ThumbsUp, ArrowLeft } from 'lucide-react';

// Move reusable components outside the main component to avoid unnecessary re-renders
const Card = ({ children, className = '' }) => (
  <div className={`bg-zinc-800/40 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-lg shadow-black/20 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2';
  const variants = {
    primary: 'bg-emerald-600 hover:bg-emerald-500 text-zinc-100 shadow-emerald-900/20 shadow-lg hover:shadow-emerald-900/30 hover:shadow-xl',
    secondary: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700',
    ghost: 'hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200'
  };
  
  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// Memoized video player to avoid restarting video on unrelated re-renders
const VideoPlayer = React.memo(({ src }) => (
  <video controls src={src} className="w-full" />
));

const PostDetails = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

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
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </Button>

        <Card className="p-8 space-y-8">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap gap-6 text-zinc-400 text-sm">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <User className="w-4 h-4 text-emerald-400" />
                </div>
                <span>{post.authorName || 'Anonymous'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Clock className="w-4 h-4 text-emerald-400" />
                </div>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {post.imageUrl && (
              <div className="relative rounded-2xl overflow-hidden bg-zinc-900">
                {post.mediaType === 'video' ? (
                  <VideoPlayer src={post.imageUrl} />
                ) : (
                  <img src={post.imageUrl} alt="" className="w-full object-cover" />
                )}
              </div>
            )}

            <div className="prose prose-invert max-w-none">
              <p className="text-zinc-300 leading-relaxed">{post.content}</p>
            </div>
          </div>
        </Card>

        <Card className="p-8">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-emerald-500/10">
                <MessageSquare className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-100">
                Comments ({comments.length})
              </h2>
            </div>

            <div className="space-y-6">
              {comments.map(comment => (
                <Card key={comment.id} className="p-6 hover:border-emerald-500/30 transition-colors">
                  <p className="text-zinc-300 mb-4">{comment.content}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3 text-zinc-400">
                      <User className="w-4 h-4 text-emerald-400" />
                      <span>{comment.authorName}</span>
                      <span>•</span>
                      <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <Button variant="ghost" className="opacity-0 group-hover:opacity-100">
                      <ThumbsUp className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {token ? (
              <div className="space-y-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full bg-zinc-900/50 text-zinc-100 p-4 rounded-xl border border-zinc-700 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none h-32"
                />
                <div className="flex justify-end">
                  <Button onClick={addComment} disabled={!newComment.trim()}>
                    <Send className="w-5 h-5" />
                    <span>Post Comment</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center p-8">
                <Button onClick={() => navigate('/login')}>
                  <MessageSquare className="w-5 h-5" />
                  <span>Login to Comment</span>
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PostDetails;
