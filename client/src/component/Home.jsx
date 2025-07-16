import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../service/apiClient';
import { Shield, Plus, MessageSquare, X, Search, Settings, Bell, Bookmark, TrendingUp, Clock, Users, Code, Star, ChevronRight, Zap, Activity, Eye, Heart, ArrowUpRight, Sparkles, Globe, Flame } from 'lucide-react';
import { useAuth } from './AuthContext';
import PostCard from './PostCard'; // Import the new PostCard component

const Home = () => {
  // States for THIS component's data and UI
  const [topics, setTopics] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicDescription, setNewTopicDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // API calls remain the same
  const fetchTopics = async () => {
    setTopicsLoading(true);
    try {
      const response = await api.get('/topics');
      setTopics(response.data.content);
    } catch (err) {
      console.error("Failed to fetch topics:", err);
    } finally {
      setTopicsLoading(false);
    }
  };

  const fetchRecentPosts = async () => {
    setPostsLoading(true);
    try {
      const response = await api.get('/posts?size=6'); // Fetch 6 recent posts
      setPosts(response.data.content);
    } catch (err) {
      console.error("Failed to fetch recent posts:", err);
    } finally {
      setPostsLoading(false);
    }
  };

  const createTopic = async () => {
    if (!newTopicName.trim()) return;
    try {
      await api.post('/topics', {
        name: newTopicName,
        description: newTopicDescription
      });
      setShowForm(false);
      setNewTopicName('');
      setNewTopicDescription('');
      fetchTopics();
    } catch (err) {
      console.error("Failed to create topic:", err);
    }
  };

  useEffect(() => {
    fetchTopics();
    fetchRecentPosts();
  }, []);

  const filteredTopics = useMemo(() => 
    topics.filter(topic =>
      topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ), [topics, searchQuery]
  );

  const renderTopicCard = (topic, index) => {
    // Create different card styles for visual variety
    const cardVariants = [
      'from-purple-500/10 to-pink-500/10 border-purple-500/20',
      'from-blue-500/10 to-cyan-500/10 border-blue-500/20',
      'from-green-500/10 to-emerald-500/10 border-green-500/20',
      'from-orange-500/10 to-red-500/10 border-orange-500/20',
      'from-teal-500/10 to-blue-500/10 border-teal-500/20',
      'from-rose-500/10 to-pink-500/10 border-rose-500/20'
    ];
    
    const iconVariants = [
      { icon: MessageSquare, color: 'text-purple-400' },
      { icon: Code, color: 'text-blue-400' },
      { icon: Star, color: 'text-yellow-400' },
      { icon: Flame, color: 'text-red-400' },
      { icon: Zap, color: 'text-cyan-400' },
      { icon: Globe, color: 'text-green-400' }
    ];

    const variant = cardVariants[index % cardVariants.length];
    const iconVariant = iconVariants[index % iconVariants.length];
    const IconComponent = iconVariant.icon;

    return (
      <div
        key={topic.id}
        onClick={() => navigate(`/topics/${topic.id}`)}
        className="group cursor-pointer transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2"
      >
        <div className={`relative bg-gradient-to-br ${variant} backdrop-blur-sm rounded-0x0 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 border`}>
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          {/* Floating elements for depth */}
          <div className="absolute top-4 right-4 w-12 h-12 bg-white/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 bg-teal-400/20 rounded-full blur-lg"></div>
          
          <div className="relative z-10 p-6">
            {/* Header with enhanced styling */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={`bg-gradient-to-br from-white/10 to-white/5 p-3 rounded-xl backdrop-blur-sm border border-white/10`}>
                    <IconComponent className={`w-6 h-6 ${iconVariant.color}`} />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-teal-400 group-hover:to-cyan-400 transition-all duration-300">
                    {topic.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{topic.creatorName || 'Anonymous'}</span>
                    </div>
                    <div className="w-1 h-1 bg-zinc-600 rounded-full"></div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(topic.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced post count badge */}
              <div className="relative">
                <div className="bg-gradient-to-r from-teal-500/20 to-cyan-500/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-teal-500/30">
                  <span className="text-sm font-semibold text-teal-300">{topic.postCount || 0}</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>

            {/* Enhanced description */}
            <div className="mb-4">
              <p className="text-zinc-300 text-sm leading-relaxed">
                {topic.description || 'No description provided'}
              </p>
            </div>

            {/* Stats row with more visual appeal */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                  <Eye className="w-3 h-3" />
                  <span>{Math.floor(Math.random() * 1000) + 100}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                  <Heart className="w-3 h-3" />
                  <span>{Math.floor(Math.random() * 50) + 5}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                  <Activity className="w-3 h-3" />
                  <span>Active</span>
                </div>
              </div>
              
              <div className="flex items-center text-teal-400 text-sm font-medium group-hover:text-cyan-400 transition-colors">
                <span>Explore</span>
                <ArrowUpRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEmptyState = () => (
    <div className="text-center py-20">
      <div className="relative mx-auto w-32 h-32 mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-full animate-pulse"></div>
        <div className="absolute inset-4 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-full flex items-center justify-center backdrop-blur-sm">
          <MessageSquare className="w-12 h-12 text-teal-400" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500/20 rounded-full animate-bounce"></div>
        <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-cyan-500/20 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
      </div>
      
      <h3 className="text-3xl font-bold text-white mb-4">
        {searchQuery ? 'No matches found' : 'Ready to start something amazing?'}
      </h3>
      
      <p className="text-zinc-400 max-w-md mx-auto mb-8 text-lg">
        {searchQuery 
          ? 'Try different keywords or create a new topic with that idea'
          : 'Create your first topic and watch the community grow around your ideas'}
      </p>
      
      {isAuthenticated && (
        <button
          onClick={() => setShowForm(true)}
          className="group relative bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white px-8 py-4 rounded-2xl transition-all duration-300 inline-flex items-center gap-3 font-semibold text-lg shadow-lg hover:shadow-teal-500/25 transform hover:scale-105"
        >
          <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          <span>Create Your First Topic</span>
          <Sparkles className="w-5 h-5 group-hover:animate-spin" />
        </button>
      )}
    </div>
  );

  const renderTopicSkeleton = () => (
    <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 backdrop-blur-sm rounded-2xl border border-zinc-800/50 p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-zinc-800/80 rounded-xl animate-pulse"></div>
        <div className="flex-1">
          <div className="h-6 w-40 bg-zinc-800/80 rounded-lg animate-pulse mb-2"></div>
          <div className="h-4 w-32 bg-zinc-800/80 rounded animate-pulse"></div>
        </div>
        <div className="h-8 w-16 bg-zinc-800/80 rounded-full animate-pulse"></div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 w-full bg-zinc-800/80 rounded animate-pulse"></div>
        <div className="h-4 w-3/4 bg-zinc-800/80 rounded animate-pulse"></div>
      </div>
      <div className="flex justify-between">
        <div className="flex gap-4">
          <div className="h-4 w-12 bg-zinc-800/80 rounded animate-pulse"></div>
          <div className="h-4 w-12 bg-zinc-800/80 rounded animate-pulse"></div>
        </div>
        <div className="h-4 w-16 bg-zinc-800/80 rounded animate-pulse"></div>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Enhanced background effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/10 via-transparent to-transparent"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-900/5 via-transparent to-transparent"></div>
      <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-5 bg-repeat"></div>
      
      {/* Floating orbs for ambient lighting */}
      <div className="fixed top-1/4 left-1/4 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      
      <main className="relative pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Hero section completely redesigned */}
          <div className="mb-16 relative">
            <div className="relative overflow-hidden rounded-none bg-gradient-to-r from-zinc-900/80 to-zinc-800/80 backdrop-blur-xl border border-zinc-700/50">
              {/* Animated background pattern */}
              <div className="absolute inset-0 bg-gradient-to-r from-teal-600/5 via-purple-600/5 to-cyan-600/5"></div>
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
              
              {/* Content */}
              <div className="relative z-10 p-8 lg:p-16">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 backdrop-blur-sm px-4 py-2 rounded-none border border-teal-500/20 mb-6">
                      <Sparkles className="w-4 h-4 text-teal-400" />
                      <span className="text-sm font-medium text-teal-300">Simple as it gets</span>
                    </div>
                    
                    <h1 className="text-4xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-teal-100 to-cyan-400 mb-6 leading-tight tracking-tight">
                      Minutegram
                    </h1>
                    
                    <p className="text-xl text-zinc-300 mb-4 leading-relaxed">
                      Share Whatever, Whenever...
                    </p>
                    
                    <p className="text-lg text-teal-400 mb-8 font-medium">
                      Your Privacy is taken seriously
                    </p>
                    
                    {!isAuthenticated && (
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                          onClick={() => navigate('/signup')} 
                          className="group bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white px-8 py-4 rounded-2xl transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-teal-500/25 transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                          <span>Join the Community</span>
                          <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                        <button 
                          onClick={() => navigate('/login')} 
                          className="bg-zinc-800/50 hover:bg-zinc-700/50 backdrop-blur-sm text-white px-8 py-4 rounded-2xl transition-all duration-300 font-semibold text-lg border border-zinc-700/50 hover:border-zinc-600/50"
                        >
                          Sign In
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="relative">
                  <div className="relative w-full h-80 lg:h-96">
  {/* blurred gradient bg, optional */}
  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-none blur-xl"></div>

  
  {/* image wrapper */}
  <div className="relative overflow-hidden h-full w-full border border-zinc-700/50 rounded-none">
      <img
        src="/min.jpg"
        alt="Minutegram"
        className="w-full h-full object-cover"
      />
    </div>
</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and controls section enhanced */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
              <div className="relative flex-1 max-w-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-cyan-600/20 rounded-2xl blur opacity-0 focus-within:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-zinc-900/80 backdrop-blur-xl rounded-2xl border border-zinc-700/50 focus-within:border-teal-500/50 transition-all duration-300">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                  <input 
                    type="text" 
                    placeholder="Search topics, ideas, discussions..." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    className="w-full pl-12 pr-4 py-4 bg-transparent rounded-2xl focus:outline-none text-white placeholder-zinc-500 text-lg"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {isAuthenticated && (
                  <>
                    <button className="bg-zinc-800/50 hover:bg-zinc-700/50 backdrop-blur-sm text-zinc-300 hover:text-white p-4 rounded-2xl transition-all duration-300 border border-zinc-700/50 hover:border-zinc-600/50">
                      <Bell className="w-5 h-5" />
                    </button>
                    <button className="bg-zinc-800/50 hover:bg-zinc-700/50 backdrop-blur-sm text-zinc-300 hover:text-white p-4 rounded-2xl transition-all duration-300 border border-zinc-700/50 hover:border-zinc-600/50">
                      <Bookmark className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setShowForm(true)} 
                      className="group bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white px-6 py-4 rounded-2xl transition-all duration-300 flex items-center gap-2 font-semibold shadow-lg hover:shadow-teal-500/25 transform hover:scale-105"
                    >
                      <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                      <span className="hidden sm:inline">New Topic</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Recent Posts Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">Recent Posts</h2>
            {postsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => <div key={i}>{renderTopicSkeleton()}</div>)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => <PostCard key={post.id} post={post} />)}
              </div>
            )}
          </div>

          {/* Topics grid with enhanced loading and content states */}
          <h2 className="text-2xl font-bold text-white mb-6">Topics</h2>
          {topicsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => 
                <div key={i}>{renderTopicSkeleton()}</div>
              )}
            </div>
          ) : filteredTopics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTopics.map((topic, index) => renderTopicCard(topic, index))}
            </div>
          ) : (
            renderEmptyState()
          )}
        </div>
      </main>

      {/* Enhanced modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-cyan-600/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-zinc-900/95 backdrop-blur-xl rounded-3xl border border-zinc-700/50 shadow-2xl">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Create New Topic</h2>
                    <p className="text-zinc-400">Start a conversation that matters</p>
                  </div>
                  <button 
                    onClick={() => setShowForm(false)} 
                    className="text-zinc-400 hover:text-white transition-colors rounded-2xl p-2 hover:bg-zinc-800/50"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-300 mb-3">Topic Name</label>
                    <input 
                      type="text" 
                      value={newTopicName} 
                      onChange={(e) => setNewTopicName(e.target.value)} 
                      className="w-full bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl px-4 py-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-300 text-lg" 
                      placeholder="Enter an engaging topic name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-zinc-300 mb-3">Description</label>
                    <textarea 
                      value={newTopicDescription} 
                      onChange={(e) => setNewTopicDescription(e.target.value)} 
                      className="w-full bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl px-4 py-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 resize-none h-32 transition-all duration-300 text-lg" 
                      placeholder="Describe what this topic is about and what kind of discussions you want to see"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-4 pt-6">
                    <button 
                      onClick={() => setShowForm(false)} 
                      className="px-6 py-3 rounded-2xl text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all duration-300 font-semibold"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={createTopic} 
                      disabled={!newTopicName.trim()} 
                      className="group bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 disabled:from-zinc-700 disabled:to-zinc-700 disabled:cursor-not-allowed text-white px-8 py-3 rounded-2xl transition-all duration-300 font-semibold shadow-lg hover:shadow-teal-500/25 transform hover:scale-105 disabled:transform-none disabled:shadow-none flex items-center gap-2"
                    >
                      <span>Create Topic</span>
                      <Sparkles className="w-4 h-4 group-hover:animate-spin" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;