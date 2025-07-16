import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../service/apiClient';
import { Plus, Search, ArrowUpRight, MessageSquare, Users, Clock } from 'lucide-react';
import { useAuth } from './AuthContext';
import PostCard from './PostCard';
import { ModernButton, ModernCard, ModernInput, ModernTextarea } from './Utopia';

const Home = () => {
  const [topics, setTopics] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicDescription, setNewTopicDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

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
      const response = await api.get('/posts?size=6');
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

  const TopicCard = ({ topic }) => (
    <ModernCard 
      className="p-6 group cursor-pointer transition-all duration-300 hover:border-primary hover:shadow-2xl hover:shadow-primary/20"
      onClick={() => navigate(`/topics/${topic.id}`)}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold text-primary-content mb-2">{topic.name}</h3>
        <div className="text-sm text-base-content flex items-center gap-1"><MessageSquare size={14}/> {topic.postCount || 0}</div>
      </div>
      <p className="text-base-content/70 line-clamp-2 mb-4">{topic.description || 'No description provided.'}</p>
      <div className="flex justify-between items-center text-sm text-base-content/50 border-t border-base-300 pt-4">
        <div className="flex items-center gap-2">
          <Users size={14}/>
          <span>{topic.creatorName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14}/>
          <span>{new Date(topic.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </ModernCard>
  );

  const SkeletonCard = () => (
    <ModernCard className="p-6 animate-pulse">
      <div className="h-6 bg-base-300 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-base-300 rounded w-full mb-1"></div>
      <div className="h-4 bg-base-300 rounded w-5/6 mb-4"></div>
      <div className="flex justify-between items-center border-t border-base-300 pt-4">
        <div className="h-5 bg-base-300 rounded w-1/3"></div>
        <div className="h-5 bg-base-300 rounded w-1/4"></div>
      </div>
    </ModernCard>
  );

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="text-center py-20 sm:py-32">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-primary-content tracking-tight">
          Welcome to <span className="text-primary">MinuteGram</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-base-content/70">
          A place for communities to share, discuss, and connect over their interests.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <ModernButton size="lg" onClick={() => document.getElementById('topics-section')?.scrollIntoView({ behavior: 'smooth' })}>
            Explore Topics
          </ModernButton>
          {!isAuthenticated && (
            <ModernButton size="lg" variant="secondary" onClick={() => navigate('/signup')}>
              Get Started <ArrowUpRight size={20}/>
            </ModernButton>
          )}
        </div>
      </div>

      {/* Recent Posts */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-primary-content mb-6">Recent Posts</h2>
        {postsLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => <PostCard key={post.id} post={post} />)}
          </div>
        )}
      </div>

      {/* Topics Section */}
      <div id="topics-section">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 className="text-3xl font-bold text-primary-content">Topics</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50"/>
              <ModernInput 
                type="text"
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {isAuthenticated && (
              <ModernButton onClick={() => setShowForm(true)}>
                <Plus size={20}/> New Topic
              </ModernButton>
            )}
          </div>
        </div>
        {topicsLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredTopics.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic) => <TopicCard key={topic.id} topic={topic} />)}
          </div>
        ) : (
          <div className="text-center py-16 bg-base-200 rounded-lg">
            <h3 className="text-xl font-semibold text-primary-content">No topics found</h3>
            <p className="text-base-content/70 mt-2">Try adjusting your search or create a new topic!</p>
          </div>
        )}
      </div>

      {/* Create Topic Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <ModernCard className="w-full max-w-lg p-8">
            <h2 className="text-2xl font-bold text-primary-content mb-4">Create a New Topic</h2>
            <div className="space-y-4">
              <ModernInput 
                label="Topic Name"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                placeholder="e.g., Web Development"
              />
              <ModernTextarea
                label="Description"
                value={newTopicDescription}
                onChange={(e) => setNewTopicDescription(e.target.value)}
                placeholder="A brief description of your topic."
              />
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <ModernButton variant="secondary" onClick={() => setShowForm(false)}>Cancel</ModernButton>
              <ModernButton onClick={createTopic} disabled={!newTopicName.trim()}>Create</ModernButton>
            </div>
          </ModernCard>
        </div>
      )}
    </div>
  );
};

export default Home;