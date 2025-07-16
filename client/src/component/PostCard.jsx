import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, User, Clock, ArrowUpRight } from 'lucide-react';

const PostCard = ({ post }) => {
  const navigate = useNavigate();

  return (
    <div
      key={post.id}
      onClick={() => navigate(`/posts/${post.id}`)}
      className="group cursor-pointer bg-zinc-800/50 backdrop-blur-sm rounded-2xl border border-zinc-700/50 p-6 transition-all duration-300 hover:bg-zinc-800/80 hover:border-teal-500/50"
    >
      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-teal-400 transition-colors">
        {post.title}
      </h3>
      <div className="flex items-center gap-4 text-xs text-zinc-400 mb-4">
        <div className="flex items-center gap-1">
          <User className="w-3 h-3" />
          <span>{post.authorName}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageSquare className="w-3 h-3" />
          <span>{post.commentsCount}</span>
        </div>
      </div>
      <p className="text-sm text-zinc-300 mb-4 line-clamp-2">
        {post.content}
      </p>
      <div className="flex justify-end">
        <div className="flex items-center text-teal-400 text-sm font-medium group-hover:text-cyan-400 transition-colors">
          <span>Read More</span>
          <ArrowUpRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};

export default PostCard;
