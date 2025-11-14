// src/pages/Branches.jsx - Multi-Branch Management
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import {
  Building2, MapPin, Users, TrendingUp, TrendingDown, Plus,
  Edit2, Trash2, BarChart3, Award, Activity, Target, X, Check
} from 'lucide-react';

export default function Branches() {
  const { branches, addBranch, updateBranch, deleteBranch, getBranchStatistics } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    manager: '',
    performanceScore: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingBranch) {
      updateBranch(editingBranch.id, formData);
      setEditingBranch(null);
    } else {
      addBranch(formData);
    }
    setFormData({ name: '', location: '', manager: '', performanceScore: 0 });
    setShowAddModal(false);
  };

  const handleEdit = (branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      location: branch.location,
      manager: branch.manager,
      performanceScore: branch.performanceScore
    });
    setShowAddModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      deleteBranch(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              Branch Management
            </h1>
            <p className="text-blue-200">Manage and monitor all your branches</p>
          </div>
          <button
            onClick={() => {
              setEditingBranch(null);
              setFormData({ name: '', location: '', manager: '', performanceScore: 0 });
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white text-blue-900 rounded-lg hover:bg-blue-50 transition font-medium"
          >
            <Plus size={20} />
            Add Branch
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Building2 size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Branches</div>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{branches.length}</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <Activity size={24} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Branches</div>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {branches.filter(b => b.status === 'active').length}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <Award size={24} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Avg Performance</div>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {(branches.reduce((sum, b) => sum + b.performanceScore, 0) / branches.length).toFixed(1)}%
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Target size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Top Performer</div>
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-white truncate">
            {branches.sort((a, b) => b.performanceScore - a.performanceScore)[0]?.name || 'N/A'}
          </p>
        </div>
      </div>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((branch, index) => {
          const stats = getBranchStatistics(branch.id);
          return (
            <div
              key={branch.id}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${
                    branch.performanceScore >= 90 ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                    branch.performanceScore >= 80 ? 'bg-blue-100 dark:bg-blue-900/30' :
                    branch.performanceScore >= 70 ? 'bg-amber-100 dark:bg-amber-900/30' :
                    'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    <Building2 size={24} className={
                      branch.performanceScore >= 90 ? 'text-emerald-600 dark:text-emerald-400' :
                      branch.performanceScore >= 80 ? 'text-blue-600 dark:text-blue-400' :
                      branch.performanceScore >= 70 ? 'text-amber-600 dark:text-amber-400' :
                      'text-red-600 dark:text-red-400'
                    } />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{branch.name}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      <MapPin size={12} />
                      {branch.location}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(branch)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(branch.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Performance Score */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Performance Score</span>
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">{branch.performanceScore}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      branch.performanceScore >= 90 ? 'bg-emerald-500' :
                      branch.performanceScore >= 80 ? 'bg-blue-500' :
                      branch.performanceScore >= 70 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${branch.performanceScore}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-3">
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Entries</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.totalEntries}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-3">
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Transactions</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.totalSold}</p>
                </div>
              </div>

              {/* Manager */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Branch Manager</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                  <Users size={14} />
                  {branch.manager}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {editingBranch ? 'Edit Branch' : 'Add New Branch'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingBranch(null);
                }}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Branch Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Manager Name *
                </label>
                <input
                  type="text"
                  value={formData.manager}
                  onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Initial Performance Score (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.performanceScore}
                  onChange={(e) => setFormData({ ...formData, performanceScore: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingBranch(null);
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  {editingBranch ? 'Update' : 'Add'} Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
