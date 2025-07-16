import React, { useState } from 'react';
import { Send, User } from 'lucide-react';
import { ModernButton, ModernTextarea } from './Utopia'; // Reusing components from Utopia

const CommentForm = ({ postId, onCommentAdded }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onCommentAdded(newComment);
      setNewComment('');
    } catch (error) {
      // Error is handled by the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleAddComment} className="flex items-start gap-4 mb-10 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/60 shadow-inner">
      <div className="w-12 h-12 rounded-full bg-teal-500/20 flex-shrink-0 flex items-center justify-center">
        <User className="w-6 h-6 text-teal-400" />
      </div>
      <div className="flex-1">
        <ModernTextarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="What are your thoughts on this post?"
          className="mb-3 bg-zinc-800 border-zinc-700 focus:border-teal-500 focus:ring-teal-500/50"
          rows="3"
        />
        <div className="flex justify-end mt-2">
          <ModernButton type="submit" disabled={!newComment.trim() || isSubmitting}>
            {isSubmitting ? 'Posting...' : 'Post Comment'}
            <Send className="w-4 h-4 ml-2" />
          </ModernButton>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
