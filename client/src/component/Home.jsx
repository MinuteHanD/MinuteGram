// Home.js - REWRITTEN

import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../service/apiClient';
import { Shield, Plus, MessageSquare, X, Search, Settings, Bell, Bookmark, TrendingUp, Clock, Users, Code, Star, ChevronRight } from 'lucide-react';
// This is the SINGLE SOURCE OF TRUTH for user data.
import { useAuth } from './AuthContext';

const Home = () => {
  // States for THIS component's data and UI
  const [topics, setTopics] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicDescription, setNewTopicDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  // Get user data from the context. NOT from a local fetch.
  const { user, isAuthenticated } = useAuth();

  // API calls are now lean and focused on this component's needs.
  const fetchTopics = async () => {
    setTopicsLoading(true); // Set loading state for topics specifically.
    try {
      const response = await api.get('/topics');
      setTopics(response.data.content);
    } catch (err) {
      console.error("Failed to fetch topics:", err);
      // Handle error, maybe show a toast notification.
    } finally {
      setTopicsLoading(false);
    }
  };

  const createTopic = async () => {
    if (!newTopicName.trim()) return;
    try {
      // We don't need to refetch all topics. We can just add the new one to the state
      // for a faster, better user experience (optimistic update or just append).
      // For simplicity, we will just refetch after creation.
      await api.post('/topics', {
        name: newTopicName,
        description: newTopicDescription
      });
      setShowForm(false);
      setNewTopicName('');
      setNewTopicDescription('');
      fetchTopics(); // Refresh the list.
    } catch (err) {
      console.error("Failed to create topic:", err);
    }
  };

  // This useEffect fetches data required ONLY for the Home component.
  // Authentication is handled elsewhere.
  useEffect(() => {
    fetchTopics();
  }, []); // Empty array ensures this runs ONCE when the component mounts.

  // useMemo will prevent re-filtering the topics on every single keystroke if other
  // state (not searchQuery or topics) were to change. It's a good practice.
  const filteredTopics = useMemo(() => 
    topics.filter(topic =>
      topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ), [topics, searchQuery]
  );

  // All your rendering logic (JSX) was mostly fine. I'm leaving it as is.
  // The only change is replacing checks for `token` with checks for `isAuthenticated` or `user`.
  //
  // For example, this:
  //   {token && <button>...</button>}
  // Becomes this:
  //   {isAuthenticated && <button>...</button>}
  
  // --- Start of JSX (largely unchanged, just using corrected state) ---

  const renderTopicCard = (topic) => (
    // ... your existing JSX ...
    // Example change: if you used topic.creatorName, and creatorName comes from the user context...
    // <p>Created by {topic.creatorName || user?.name || 'Anonymous'}</p>
    // This part depends on your DTOs, but the principle holds.
    <div
      key={topic.id}
      onClick={() => navigate(`/topics/${topic.id}`)}
      className="group cursor-pointer"
    >
      <div className="bg-zinc-900 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10 border border-zinc-800 hover:border-teal-500/30">
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="bg-teal-500/10 p-2 rounded">
                <MessageSquare className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-teal-400 transition-colors">
                  {topic.name}
                </h3>
                <p className="text-xs text-zinc-500 flex items-center">
                  <Users className="w-3 h-3 mr-1" />
                  Created by {topic.creatorName || 'Anonymous'}
                </p>
              </div>
            </div>
            <div className="bg-zinc-800 px-2 py-1 rounded text-xs font-medium text-teal-300">
              {topic.postCount || 0} posts
            </div>
          </div>
          <p className="text-zinc-400 text-sm line-clamp-2 mb-4">
            {topic.description || 'No description provided'}
          </p>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="flex items-center text-zinc-500">
                <Clock className="w-3 h-3 mr-1" />
                {new Date(topic.createdAt).toLocaleDateString()}
              </span>
            </div>
            <span className="text-teal-400 flex items-center group-hover:underline">
              View topic <ChevronRight className="w-3 h-3 ml-1" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmptyState = () => (
     <div className="text-center py-16 bg-zinc-900 rounded-lg border border-zinc-800">
       <div className="bg-teal-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
         <MessageSquare className="w-8 h-8 text-teal-400" />
       </div>
       <h3 className="text-2xl font-semibold text-white mb-3">No topics found</h3>
       <p className="text-zinc-400 max-w-md mx-auto mb-8">
         {searchQuery 
           ? 'Try adjusting your search terms'
           : 'Be the first to create a topic and start the conversation'}
       </p>
       {/* CORRECTED: Check for authentication status, not a raw token. */}
       {isAuthenticated && (
         <button
           onClick={() => setShowForm(true)}
           className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-2.5 rounded-lg transition-colors inline-flex items-center gap-2"
         >
           <Plus className="w-5 h-5" />
           <span>Create New Topic</span>
         </button>
       )}
     </div>
  );

  const renderTopicSkeleton = () => (
    // ... your skeleton JSX ...
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-zinc-800 rounded animate-pulse"></div>
        <div>
          <div className="h-5 w-40 bg-zinc-800 rounded animate-pulse mb-2"></div>
          <div className="h-3 w-24 bg-zinc-800 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="h-4 w-full bg-zinc-800 rounded animate-pulse mb-2"></div>
      <div className="h-4 w-5/6 bg-zinc-800 rounded animate-pulse mb-4"></div>
      <div className="flex justify-between">
        <div className="h-3 w-20 bg-zinc-800 rounded animate-pulse"></div>
        <div className="h-3 w-20 bg-zinc-800 rounded animate-pulse"></div>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="fixed inset-0 bg-gradient-to-br from-teal-900/5 via-zinc-900/5 to-zinc-900/5" />
      <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-10 bg-repeat" />
      
      <main className="relative pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12 relative overflow-hidden rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-800">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-600/10 to-emerald-600/10"></div>
            <div className="relative z-10 p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between">
              <div className="mb-6 lg:mb-0 lg:mr-8 text-left max-w-xl">
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                  Welcome to <span className="text-teal-400">Minutegram</span>
                </h1>
                <p className="text-zinc-400 text-lg mb-6">
                  Desperate need for a job -- Amritanshu
                </p>
                {/* CORRECTED: Logic based on authentication state */}
                {!isAuthenticated && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={() => navigate('/signup')} className="...">Join</button>
                    <button onClick={() => navigate('/login')} className="...">Sign in</button>
                  </div>
                )}
              </div>
              <div className="hidden lg:block w-64 h-64 relative">
                <img src="/Logo2.png" alt="Custom Icon"/>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                <input type="text" placeholder="Search topics..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 rounded-lg border border-zinc-800 focus:outline-none focus:border-teal-500 text-white placeholder-zinc-500"/>
              </div>
              <div className="flex items-center gap-3">
                {/* CORRECTED: Check for authentication status */}
                {isAuthenticated && (
                  <button onClick={() => setShowForm(true)} className="bg-teal-600 hover:bg-teal-500 text-white h-full px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap">
                    <Plus className="w-5 h-5" /><span className="hidden sm:inline">New Topic</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* CORRECTED: Logic based on topicsLoading state */}
          {topicsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <div key={i}><renderTopicSkeleton/></div>)}
            </div>
          ) : filteredTopics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTopics.map(renderTopicCard)}
            </div>
          ) : (
            renderEmptyState()
          )}
        </div>
      </main>

      {/* Your modal JSX is fine, no changes needed there */}
      {showForm && (
        // ... your modal JSX ...
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div onClick={(e) => e.stopPropagation()} className="bg-zinc-900 rounded-lg p-6 w-full max-w-md border border-zinc-800 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Create New Topic</h2>
              <button onClick={() => setShowForm(false)} className="text-zinc-400 hover:text-white transition-colors rounded-full p-1 hover:bg-zinc-800"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Topic Name</label>
                <input type="text" value={newTopicName} onChange={(e) => setNewTopicName(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500" placeholder="Enter topic name"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Description</label>
                <textarea value={newTopicDescription} onChange={(e) => setNewTopicDescription(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 resize-none h-32" placeholder="Enter topic description"/>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">Cancel</button>
                <button onClick={createTopic} disabled={!newTopicName.trim()} className="bg-teal-600 hover:bg-teal-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg transition-colors font-medium">Create Topic</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;