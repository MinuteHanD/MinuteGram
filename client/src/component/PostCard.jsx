import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, User, Clock } from 'lucide-react';
import { ModernCard } from './Utopia';

const PostCard = ({ post }) => {
  const navigate = useNavigate();

  return (
    <ModernCard 
      className="p-6 group cursor-pointer transition-all duration-300 hover:border-primary hover:shadow-2xl hover:shadow-primary/20"
      onClick={() => navigate(`/posts/${post.id}`)}
    >
      <h3 className="text-xl font-bold text-primary-content mb-2 truncate">{post.title}</h3>
      <p className="text-base-content/70 line-clamp-2 mb-4">{post.content}</p>
      <div className="flex justify-between items-center text-sm text-base-content/50 border-t border-base-300 pt-4">
        <div className="flex items-center gap-2">
          <User size={14}/>
          <span>{post.authorName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14}/>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageSquare size={14}/> 
          <span>{post.commentsCount}</span>
        </div>
      </div>
    </ModernCard>
  );
};

export default PostCard;
