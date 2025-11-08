"use client";
import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardHeader from '@/components/dashboard/Header';
import { getSuggestions } from "@/lib/analytics/api";
import type { SuggestionResponse } from "@/types/analytics/analyticstypes";
import ReactMarkdown from 'react-markdown';
import {
  Brain,
  Lightbulb,
  TrendingDown,
  Target,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  BarChart3
} from 'lucide-react';

export default function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState<SuggestionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  async function loadSuggestions() {
    setLoading(true);
    setError(null);
    try {
      const data = await getSuggestions();
      setSuggestions(data);
    } catch (err) {
      console.error('Suggestions error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load AI suggestions');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSuggestions();
  }, []);

  const categories = [
    { id: 'all', label: 'All Suggestions', icon: Brain },
    { id: 'reduction', label: 'Emission Reduction', icon: TrendingDown },
    { id: 'efficiency', label: 'Efficiency Improvements', icon: Zap },
    { id: 'targets', label: 'Target Setting', icon: Target },
    { id: 'monitoring', label: 'Monitoring & Reporting', icon: BarChart3 }
  ];

  const filteredSuggestions = suggestions?.suggestions.filter(suggestion => {
    if (selectedCategory === 'all') return true;
    return suggestion.category === selectedCategory;
  }) || [];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-900/20 border-red-700/50';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-700/50';
      case 'low': return 'text-green-400 bg-green-900/20 border-green-700/50';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-700/50';
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryMap = {
      reduction: TrendingDown,
      efficiency: Zap,
      targets: Target,
      monitoring: BarChart3
    };
    const IconComponent = categoryMap[category as keyof typeof categoryMap] || Lightbulb;
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <ProtectedRoute requiredRole="analyst">
      <React.Fragment>
        {error && (
          <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4 flex items-center gap-3 mb-8">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Category Filter */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Brain className="w-12 h-12 text-emerald-400 animate-pulse mx-auto mb-4" />
                  <p className="text-gray-400">AI is analyzing your data...</p>
                  <p className="text-gray-500 text-sm mt-2">Generating personalized suggestions</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Summary Stats */}
                {suggestions && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                      <div className="flex items-center justify-between mb-4">
                        <Lightbulb className="w-8 h-8 text-emerald-400" />
                        <span className="text-sm text-gray-400">TOTAL</span>
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">
                        {suggestions.total_suggestions}
                      </div>
                      <p className="text-gray-400 text-sm">AI Suggestions</p>
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                      <div className="flex items-center justify-between mb-4">
                        <TrendingDown className="w-8 h-8 text-red-400" />
                        <span className="text-sm text-gray-400">HIGH PRIORITY</span>
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">
                        {suggestions.suggestions.filter(s => s.priority === 'high').length}
                      </div>
                      <p className="text-gray-400 text-sm">Critical Actions</p>
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                      <div className="flex items-center justify-between mb-4">
                        <Target className="w-8 h-8 text-blue-400" />
                        <span className="text-sm text-gray-400">POTENTIAL SAVINGS</span>
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">
                        {suggestions.potential_savings_kg > 1000
                          ? `${(suggestions.potential_savings_kg / 1000).toFixed(1)}t`
                          : `${suggestions.potential_savings_kg.toFixed(1)}kg`
                        }
                      </div>
                      <p className="text-gray-400 text-sm">CO₂ Reduction</p>
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                      <div className="flex items-center justify-between mb-4">
                        <Clock className="w-8 h-8 text-purple-400" />
                        <span className="text-sm text-gray-400">IMPLEMENTATION</span>
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">
                        {suggestions.implementation_time_weeks}
                      </div>
                      <p className="text-gray-400 text-sm">Weeks to Complete</p>
                    </div>
                  </div>
                )}

                {/* Suggestions List */}
                <div className="space-y-6">
                  {filteredSuggestions.length === 0 ? (
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 text-center">
                      <Brain className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">No Suggestions Found</h3>
                      <p className="text-gray-400">
                        {selectedCategory === 'all'
                          ? "AI analysis is still processing your data. Check back soon for personalized insights."
                          : `No ${selectedCategory} suggestions available at this time.`
                        }
                      </p>
                    </div>
                  ) : (
                    filteredSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {getCategoryIcon(suggestion.category)}
                            <div>
                              <h3 className="text-lg font-semibold text-white">
                                {suggestion.title}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(suggestion.priority)}`}>
                                  {suggestion.priority.toUpperCase()} PRIORITY
                                </span>
                                <span className="text-gray-400 text-sm">
                                  {suggestion.category.replace('_', ' ').toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-emerald-400 font-semibold">
                              {suggestion.potential_savings > 1000
                                ? `${(suggestion.potential_savings / 1000).toFixed(1)}t CO₂`
                                : `${suggestion.potential_savings.toFixed(1)}kg CO₂`
                              }
                            </div>
                            <div className="text-gray-400 text-sm">
                              {suggestion.implementation_time} weeks
                            </div>
                          </div>
                        </div>

                        <div className="text-gray-300 prose prose-invert max-w-none">
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                              strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                              em: ({ children }) => <em className="text-gray-300 italic">{children}</em>,
                              code: ({ children }) => <code className="bg-gray-800 px-1 py-0.5 rounded text-sm">{children}</code>,
                            }}
                          >
                            {suggestion.description}
                          </ReactMarkdown>
                        </div>

                        {suggestion.action_items && suggestion.action_items.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-white font-medium mb-2">Action Items:</h4>
                            <ul className="space-y-1">
                              {suggestion.action_items.map((item, itemIndex) => (
                                <li key={itemIndex} className="flex items-start gap-2 text-gray-300">
                                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                                  <ReactMarkdown
                                    components={{
                                      p: ({ children }) => <span>{children}</span>,
                                      strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                                      em: ({ children }) => <em className="text-gray-300 italic">{children}</em>,
                                      code: ({ children }) => <code className="bg-gray-800 px-1 py-0.5 rounded text-sm">{children}</code>,
                                    }}
                                  >
                                    {item}
                                  </ReactMarkdown>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {suggestion.expected_outcome && (
                          <div className="mt-4 p-3 bg-emerald-900/20 border border-emerald-700/50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Target className="w-4 h-4 text-emerald-400" />
                              <span className="text-emerald-400 font-medium text-sm">Expected Outcome</span>
                            </div>
                            <ReactMarkdown
                              components={{
                                p: ({ children }) => <span>{children}</span>,
                                strong: ({ children }) => <strong className="text-emerald-200 font-semibold">{children}</strong>,
                                em: ({ children }) => <em className="text-emerald-300 italic">{children}</em>,
                                code: ({ children }) => <code className="bg-emerald-900/50 px-1 py-0.5 rounded text-sm">{children}</code>,
                              }}
                            >
                              {suggestion.expected_outcome}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
      </React.Fragment>
    </ProtectedRoute>
  );
}