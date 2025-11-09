"use client";

import { useState } from 'react';
import { Leaf, ShoppingCart, DollarSign, MapPin, Users, Award, CheckCircle } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PageLayout } from '@/components/layout/PageLayout';

interface OffsetProject {
  id: number;
  name: string;
  description: string;
  location: string;
  category: string;
  pricePerTon: number;
  availableCredits: number;
  totalCredits: number;
  rating: number;
  image: string;
  certification: string;
  impact: string;
}

interface ProjectCardProps {
  project: OffsetProject;
  onPurchase: (project: OffsetProject, amount: number) => void;
}

function ProjectCard({ project, onPurchase }: ProjectCardProps) {
  const [purchaseAmount, setPurchaseAmount] = useState(1);
  // const maxPurchase = Math.min(purchaseAmount, project.availableCredits);

  return (
    <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
      <div className="aspect-video bg-linear-to-br from-emerald-600 to-blue-600 relative">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
            <Award className="w-4 h-4 text-yellow-400" />
            <span className="text-white text-sm font-medium">{project.certification}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">{project.name}</h3>
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <MapPin className="w-4 h-4" />
              <span>{project.location}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-emerald-400">${project.pricePerTon}</div>
            <div className="text-xs text-gray-400">per ton CO₂</div>
          </div>
        </div>

        <p className="text-gray-300 text-sm mb-4">{project.description}</p>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Available Credits</span>
            <span className="text-white font-medium">
              {project.availableCredits.toLocaleString()} / {project.totalCredits.toLocaleString()} tons
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-emerald-500 h-2 rounded-full"
              style={{ width: `${(project.availableCredits / project.totalCredits) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 ${i < project.rating ? 'text-yellow-400' : 'text-gray-600'}`}
              >
                ★
              </div>
            ))}
          </div>
          <span className="text-sm text-gray-400">({project.rating}/5)</span>
        </div>

        <div className="bg-emerald-900/20 border border-emerald-700/50 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-1">
            <Leaf className="w-4 h-4" />
            <span>Environmental Impact</span>
          </div>
          <p className="text-emerald-300 text-xs">{project.impact}</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Purchase Amount (tons):</label>
            <input
              type="number"
              min="1"
              max={project.availableCredits}
              value={purchaseAmount}
              onChange={(e) => setPurchaseAmount(Math.max(1, parseInt(e.target.value) || 1))}
              className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Total Cost:</span>
            <span className="text-emerald-400 font-semibold">
              ${(purchaseAmount * project.pricePerTon).toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => onPurchase(project, purchaseAmount)}
            disabled={project.availableCredits === 0}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white rounded-lg transition-colors font-medium disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
            {project.availableCredits === 0 ? 'Sold Out' : 'Purchase Credits'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CarbonOffsetsPage() {
  // Carbon offset projects would be fetched from API in production
  const projects: OffsetProject[] = [];

  const handlePurchase = (project: OffsetProject, amount: number) => {
    // This would integrate with payment processor in production
    console.log(`Purchase request: ${amount} tons from "${project.name}" for $${(amount * project.pricePerTon).toLocaleString()}`);
  };

  // const totalCartValue = cart.reduce((sum, item) => sum + (item.amount * item.project.pricePerTon), 0);
  // const totalCartCredits = cart.reduce((sum, item) => sum + item.amount, 0);

  return (
    <ProtectedRoute>
      <PageLayout
        title="Carbon Offset Marketplace"
        description="Purchase verified carbon credits to offset your emissions"
        icon={Leaf}
      >

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="w-6 h-6 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-white">$0-0</div>
                <div className="text-sm text-gray-400">Price per ton CO₂</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">0</div>
                <div className="text-sm text-gray-400">Projects Available</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
              <div>
                <div className="text-2xl font-bold text-white">0%</div>
                <div className="text-sm text-gray-400">Verified Projects</div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <Leaf className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Projects Available</h3>
            <p className="text-gray-500">Carbon offset projects will be available soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onPurchase={handlePurchase}
              />
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">How Carbon Offsetting Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-white font-medium mb-2">Measure</h3>
              <p className="text-gray-400 text-sm">Calculate your carbon footprint using our comprehensive tracking tools</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-white font-medium mb-2">Offset</h3>
              <p className="text-gray-400 text-sm">Purchase verified carbon credits from high-impact projects worldwide</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-white font-medium mb-2">Report</h3>
              <p className="text-gray-400 text-sm">Generate comprehensive reports showing your carbon neutrality achievement</p>
            </div>
          </div>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}