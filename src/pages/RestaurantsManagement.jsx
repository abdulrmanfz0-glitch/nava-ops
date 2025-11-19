// src/pages/RestaurantsManagement.jsx
import React from 'react';
import { Building2, Plus, Search } from 'lucide-react';

const RestaurantsManagement = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Restaurants Management</h1>
        <p className="text-gray-400">Manage your restaurant branches and operations</p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search restaurants..."
            className="w-full pl-10 pr-4 py-2 bg-white bg-opacity-5 border border-gray-700 rounded-lg text-white placeholder-gray-400"
          />
        </div>
        <button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Restaurant
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-gray-700 rounded-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Sample Restaurant</h3>
              <p className="text-sm text-gray-400">Main Branch</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Status</span>
              <span className="text-green-400">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Orders Today</span>
              <span className="text-white font-semibold">156</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantsManagement;


export default function RestaurantsManagement() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Restaurants Management
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-gray-600 dark:text-gray-400">
          Restaurant management features will be implemented here.
        </p>
      </div>
    </div>
  );
}
 
