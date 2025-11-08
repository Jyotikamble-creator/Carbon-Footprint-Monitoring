"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Users, MessageCircle, Share2, UserPlus, Target, TrendingUp, CheckCircle } from 'lucide-react';
import DashboardHeader from '@/components/dashboard/Header';
import ProtectedRoute from '@/components/ProtectedRoute';

interface TeamMember {
  id: number;
  name: string;
  avatar: string;
  role: string;
  emissions: number;
  goals: number;
  completedGoals: number;
}

interface SharedGoal {
  id: number;
  title: string;
  description: string;
  creator: string;
  progress: number;
  participants: number;
  comments: number;
  lastActivity: string;
}

interface Comment {
  id: number;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
}

export default function CollaboratePage() {
  const [activeTab, setActiveTab] = useState<'team' | 'goals' | 'discussions'>('team');

  // Mock data - in real app, this would come from API
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: '/api/placeholder/40/40',
      role: 'Sustainability Manager',
      emissions: 2500,
      goals: 5,
      completedGoals: 3
    },
    {
      id: 2,
      name: 'Mike Chen',
      avatar: '/api/placeholder/40/40',
      role: 'Operations Lead',
      emissions: 3200,
      goals: 4,
      completedGoals: 2
    },
    {
      id: 3,
      name: 'Emma Davis',
      avatar: '/api/placeholder/40/40',
      role: 'Data Analyst',
      emissions: 1800,
      goals: 6,
      completedGoals: 4
    },
    {
      id: 4,
      name: 'Alex Rodriguez',
      avatar: '/api/placeholder/40/40',
      role: 'Facilities Manager',
      emissions: 2900,
      goals: 3,
      completedGoals: 1
    }
  ];

  const sharedGoals: SharedGoal[] = [
    {
      id: 1,
      title: 'Company-wide 20% Emission Reduction',
      description: 'Reduce total company emissions by 20% this fiscal year through coordinated efforts across all departments.',
      creator: 'Sarah Johnson',
      progress: 65,
      participants: 12,
      comments: 8,
      lastActivity: '2 hours ago'
    },
    {
      id: 2,
      title: 'Office Energy Efficiency Initiative',
      description: 'Implement energy-saving measures across all office locations including LED lighting and smart thermostats.',
      creator: 'Mike Chen',
      progress: 40,
      participants: 8,
      comments: 15,
      lastActivity: '1 day ago'
    },
    {
      id: 3,
      title: 'Sustainable Supply Chain Program',
      description: 'Work with suppliers to reduce Scope 3 emissions and improve overall supply chain sustainability.',
      creator: 'Emma Davis',
      progress: 25,
      participants: 6,
      comments: 12,
      lastActivity: '3 days ago'
    }
  ];

  const recentComments: Comment[] = [
    {
      id: 1,
      author: 'Sarah Johnson',
      avatar: '/api/placeholder/32/32',
      content: 'Great progress on the emission reduction goal! The new LED lighting initiative is showing promising results.',
      timestamp: '2 hours ago',
      likes: 5
    },
    {
      id: 2,
      author: 'Mike Chen',
      avatar: '/api/placeholder/32/32',
      content: 'I\'ve scheduled a meeting with the facilities team to discuss the smart thermostat implementation.',
      timestamp: '4 hours ago',
      likes: 3
    },
    {
      id: 3,
      author: 'Emma Davis',
      avatar: '/api/placeholder/32/32',
      content: 'The data shows we\'re on track to meet our quarterly targets. Let\'s keep up the momentum!',
      timestamp: '6 hours ago',
      likes: 7
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-emerald-950 to-gray-900">
      <DashboardHeader />
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Users className="w-8 h-8 text-emerald-400" />
              Team Collaboration
            </h1>
            <p className="text-gray-400">Work together towards shared sustainability goals</p>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
              <UserPlus className="w-4 h-4" />
              Invite Team Member
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-8 bg-gray-800/40 p-1 rounded-lg backdrop-blur-sm">
          {[
            { id: 'team', label: 'Team Overview', icon: Users },
            { id: 'goals', label: 'Shared Goals', icon: Target },
            { id: 'discussions', label: 'Discussions', icon: MessageCircle }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as 'team' | 'goals' | 'discussions')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === id
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Team Overview Tab */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            {/* Team Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-blue-400" />
                  <div>
                    <div className="text-2xl font-bold text-white">{teamMembers.length}</div>
                    <div className="text-sm text-gray-400">Team Members</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-emerald-400" />
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {teamMembers.reduce((sum, member) => sum + member.goals, 0)}
                    </div>
                    <div className="text-sm text-gray-400">Active Goals</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {teamMembers.reduce((sum, member) => sum + member.completedGoals, 0)}
                    </div>
                    <div className="text-sm text-gray-400">Completed Goals</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                  <div>
                    <div className="text-2xl font-bold text-white">72%</div>
                    <div className="text-sm text-gray-400">Avg Progress</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Team Members</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teamMembers.map(member => (
                  <div key={member.id} className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-lg">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-white">{member.name}</div>
                      <div className="text-sm text-gray-400">{member.role}</div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span>{member.emissions.toLocaleString()} tCO₂e</span>
                        <span>{member.completedGoals}/{member.goals} goals</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-emerald-400">
                        {Math.round((member.completedGoals / member.goals) * 100)}%
                      </div>
                      <div className="text-xs text-gray-400">progress</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Shared Goals Tab */}
        {activeTab === 'goals' && (
          <div className="space-y-6">
            {sharedGoals.map(goal => (
              <div key={goal.id} className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{goal.title}</h3>
                    <p className="text-gray-400 text-sm mb-3">{goal.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>Created by {goal.creator}</span>
                      <span>•</span>
                      <span>{goal.participants} participants</span>
                      <span>•</span>
                      <span>Last activity {goal.lastActivity}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 px-3 py-1 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-sm text-gray-300">
                      <MessageCircle className="w-4 h-4" />
                      {goal.comments}
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 rounded-lg text-sm text-emerald-400">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Overall Progress</span>
                    <span className="text-white font-medium">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Discussions Tab */}
        {activeTab === 'discussions' && (
          <div className="space-y-6">
            {/* New Comment Form */}
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Start a Discussion</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="What's on your mind about sustainability?"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <div className="flex justify-end">
                  <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
                    Post Discussion
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Comments */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Recent Discussions</h3>
              {recentComments.map(comment => (
                <div key={comment.id} className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                  <div className="flex items-start gap-4">
                    <Image
                      src={comment.avatar}
                      alt={comment.author}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-white">{comment.author}</span>
                        <span className="text-sm text-gray-400">{comment.timestamp}</span>
                      </div>
                      <p className="text-gray-300 mb-3">{comment.content}</p>
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                          👍 {comment.likes}
                        </button>
                        <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}