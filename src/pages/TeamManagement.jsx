// src/pages/TeamManagement.jsx
import React from 'react';
import { Users, Plus, Search } from 'lucide-react';

const TeamManagement = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Team Management</h1>
        <p className="text-gray-400">Manage your team members and their permissions</p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search team members..."
            className="w-full pl-10 pr-4 py-2 bg-white bg-opacity-5 border border-gray-700 rounded-lg text-white placeholder-gray-400"
          />
        </div>
        <button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Member
        </button>
      </div>

      <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-center py-12 text-gray-400">
          <div className="text-center">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No team members yet. Add your first team member to get started.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;
