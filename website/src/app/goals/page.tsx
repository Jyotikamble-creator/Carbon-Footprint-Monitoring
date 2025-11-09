"use client";

import { Target, Plus, TrendingUp, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PageLayout } from '@/components/layout/PageLayout';


interface Goal {
  id: number;
  title: string;
  description: string;
  target_value: number;
  current_value: number;
  unit: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'completed' | 'overdue';
  category: string;
}

interface GoalProgressProps {
  goal: Goal;
}

function GoalProgress({ goal }: GoalProgressProps) {
  const progress = Math.min((goal.current_value / goal.target_value) * 100, 100);
  const isCompleted = goal.status === 'completed';
  const isOverdue = goal.status === 'overdue';

  return (
    <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isCompleted ? 'bg-green-500/20' : isOverdue ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
            {isCompleted ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : isOverdue ? (
              <AlertCircle className="w-5 h-5 text-red-400" />
            ) : (
              <Target className="w-5 h-5 text-blue-400" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{goal.title}</h3>
            <p className="text-gray-400 text-sm">{goal.description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            {goal.current_value.toLocaleString()} / {goal.target_value.toLocaleString()} {goal.unit}
          </div>
          <div className="text-sm text-gray-400">
            {progress.toFixed(1)}% complete
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Progress</span>
          <span>{progress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              isCompleted ? 'bg-green-500' : isOverdue ? 'bg-red-500' : 'bg-blue-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700/50">
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Due: {new Date(goal.end_date).toLocaleDateString()}</span>
          </div>
          <span className="text-gray-500">•</span>
          <span>{goal.category}</span>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          isCompleted ? 'bg-green-500/20 text-green-400' :
          isOverdue ? 'bg-red-500/20 text-red-400' :
          'bg-blue-500/20 text-blue-400'
        }`}>
          {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
        </div>
      </div>
    </div>
  );
}

export default function GoalsPage() {
  // TODO: Replace with API call to fetch goals data
  const goals: Goal[] = [];
  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');
  const overdueGoals = goals.filter(g => g.status === 'overdue');

  return (
    <ProtectedRoute>
      <PageLayout
        title="Carbon Goals"
        description="Set and track your carbon reduction objectives"
        icon={Target}
        actions={
          <button
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Goal
          </button>
        }
      >

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">{activeGoals.length}</div>
                <div className="text-sm text-gray-400">Active Goals</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-white">{completedGoals.length}</div>
                <div className="text-sm text-gray-400">Completed</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <div>
                <div className="text-2xl font-bold text-white">{overdueGoals.length}</div>
                <div className="text-sm text-gray-400">Overdue</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-400">Avg Progress</div>
              </div>
            </div>
          </div>
        </div>

        {/* Goals List */}
        <div className="space-y-6">
          {goals.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Goals Yet</h3>
              <p className="text-gray-500">Create your first carbon reduction goal to get started.</p>
            </div>
          ) : (
            <>
              {activeGoals.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Active Goals</h2>
                  <div className="space-y-4">
                    {activeGoals.map(goal => (
                      <GoalProgress key={goal.id} goal={goal} />
                    ))}
                  </div>
                </div>
              )}

              {completedGoals.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Completed Goals</h2>
                  <div className="space-y-4">
                    {completedGoals.map(goal => (
                      <GoalProgress key={goal.id} goal={goal} />
                    ))}
                  </div>
                </div>
              )}

              {overdueGoals.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Overdue Goals</h2>
                  <div className="space-y-4">
                    {overdueGoals.map(goal => (
                      <GoalProgress key={goal.id} goal={goal} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}