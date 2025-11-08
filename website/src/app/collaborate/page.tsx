"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Users, MessageCircle, Share2, UserPlus, Target, TrendingUp, CheckCircle } from 'lucide-react';
import DashboardHeader from '@/components/dashboard/Header';

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

  // TODO: Replace with API calls to fetch team data, goals, and discussions
  const teamMembers: TeamMember[] = [];
  const sharedGoals: SharedGoal[] = [];
  const recentComments: Comment[] = [];

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
                    <div className="text-2xl font-bold text-white">
                      {teamMembers.length > 0 ? Math.round((teamMembers.reduce((sum, member) => sum + member.completedGoals, 0) / teamMembers.reduce((sum, member) => sum + member.goals, 0)) * 100) || 0 : 0}%
                    </div>
                    <div className="text-sm text-gray-400">Avg Progress</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Members */}
            {teamMembers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No Team Members Yet</h3>
                <p className="text-gray-500">Invite team members to start collaborating on sustainability goals.</p>
              </div>
            ) : (
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
            )}
          </div>
        )}

        {/* Shared Goals Tab */}
        {activeTab === 'goals' && (
          <div className="space-y-6">
            {sharedGoals.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No Shared Goals Yet</h3>
                <p className="text-gray-500">Create shared goals to collaborate with your team on sustainability objectives.</p>
              </div>
            ) : (
              sharedGoals.map(goal => (
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
              ))
            )}
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
            {recentComments.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No Discussions Yet</h3>
                <p className="text-gray-500">Start the first discussion about sustainability initiatives.</p>
              </div>
            ) : (
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}