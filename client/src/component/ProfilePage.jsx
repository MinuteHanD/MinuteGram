import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  Bookmark, 
  MessageCircle, 
  Heart, 
  Settings, 
  Edit2, 
  Award 
} from 'lucide-react';
import api from '../service/apiClient';

const ProfilePage = () => {
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      setProfile(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setLoading(false);
    }
  };

  
  const mockProfileData = {
    username: 'amritanshu',
    email: 'amritanshu8@gmail.com',
    joinDate: '2023-06-15',
    bio: 'kya likhu bc',
    stats: {
      posts: 42,
      comments: 128,
      likes: 256,
      followers: 73,
      following: 51
    },
    recentActivity: [
      { type: 'post', title: 'Fuck React', date: '2 days ago' },
      { type: 'comment', title: 'This shit is ass', date: '5 days ago' },
      { type: 'like', title: 'Awesome Machine Learning Tutorial', date: '1 week ago' }
    ]
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-100 to-dark-200 flex items-center justify-center">
        <div className="animate-pulse text-dark-400">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-100 to-dark-200 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-dark-200/50 backdrop-blur border-dark-300/10 rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Profile Avatar */}
              <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {profile?.username?.[0].toUpperCase() || 'A'}
              </div>

              {/* Profile Info */}
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                  {profile?.username || mockProfileData.username}
                </h1>
                <div className="flex items-center space-x-3 text-dark-400 mt-2">
                  <div className="flex items-center space-x-1">
                    <Mail size={16} />
                    <span>{profile?.email || mockProfileData.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar size={16} />
                    <span>Joined {profile?.joinDate || mockProfileData.joinDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Profile Button */}
            <button 
              onClick={() => setEditMode(!editMode)}
              className="flex items-center space-x-2 bg-dark-300/10 text-dark-400 px-4 py-2 rounded-lg hover:bg-dark-300/20 transition"
            >
              <Edit2 size={16} />
              <span>{editMode ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>

          {/* Bio Section */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              <Award size={20} className="mr-2 text-red-500" /> About Me
            </h3>
            <p className="text-dark-400">
              {profile?.bio || mockProfileData.bio}
            </p>
          </div>
        </div>

        {/* Profile Statistics */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Stats Card */}
          <div className="bg-dark-200/50 backdrop-blur border-dark-300/10 rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <User size={20} className="mr-2 text-blue-500" /> Profile Statistics
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Bookmark, label: 'Posts', value: mockProfileData.stats.posts },
                { icon: MessageCircle, label: 'Comments', value: mockProfileData.stats.comments },
                { icon: Heart, label: 'Likes', value: mockProfileData.stats.likes },
                { icon: User, label: 'Followers', value: mockProfileData.stats.followers },
                { icon: User, label: 'Following', value: mockProfileData.stats.following }
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="text-center">
                  <div className="flex justify-center mb-2">
                    <Icon size={20} className="text-dark-400" />
                  </div>
                  <div className="font-bold text-lg">{value}</div>
                  <div className="text-dark-400 text-sm">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-dark-200/50 backdrop-blur border-dark-300/10 rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Settings size={20} className="mr-2 text-green-500" /> Recent Activity
            </h3>
            <div className="space-y-4">
              {mockProfileData.recentActivity.map((activity, index) => (
                <div 
                  key={index} 
                  className="bg-dark-300/10 rounded-lg p-3 hover:bg-dark-300/20 transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium capitalize">{activity.type}</span>: {activity.title}
                    </div>
                    <span className="text-dark-400 text-sm">{activity.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;