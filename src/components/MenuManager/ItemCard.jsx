import { useState } from 'react';
import { Edit2, Trash2, Check, X, Star, TrendingUp, TrendingDown, DollarSign, Package } from 'lucide-react';

export default function ItemCard({ item, isEditing, onEdit, onCancelEdit, onSave, onDelete }) {
  const [editForm, setEditForm] = useState({
    name: item.name,
    description: item.description || '',
    category: item.category,
    price: item.price,
    cost: item.cost,
    available: item.available ?? true
  });

  const handleSave = () => {
    onSave(editForm);
  };

  const handleCancel = () => {
    setEditForm({
      name: item.name,
      description: item.description || '',
      category: item.category,
      price: item.price,
      cost: item.cost,
      available: item.available ?? true
    });
    onCancelEdit();
  };

  const profitMargin = item.price > 0 ? (((item.price - item.cost) / item.price) * 100).toFixed(1) : 0;
  const profit = (item.price - item.cost) * (item.sold || 0);
  const revenue = item.price * (item.sold || 0);

  if (isEditing) {
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-2 border-emerald-300 dark:border-emerald-700 rounded-xl p-4 shadow-lg">
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Item Name *
            </label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g., Margherita Pizza"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="Brief description of the item"
            />
          </div>

          {/* Price and Cost */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price (SAR) *
              </label>
              <input
                type="number"
                value={editForm.price}
                onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cost (SAR) *
              </label>
              <input
                type="number"
                value={editForm.cost}
                onChange={(e) => setEditForm({ ...editForm, cost: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          {/* Category and Availability */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <input
                type="text"
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g., Main Course"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editForm.available}
                  onChange={(e) => setEditForm({ ...editForm, available: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Available
                </span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 pt-2">
            <button
              onClick={handleSave}
              disabled={!editForm.name || editForm.price <= 0}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start space-x-4">
        {/* Image Placeholder */}
        <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <Package className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                {item.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.category}
              </p>
            </div>
            <div className="flex items-center space-x-1 ml-2">
              <button
                onClick={onEdit}
                className="p-2 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="Edit item"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={onDelete}
                className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="Delete item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Description */}
          {item.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {item.description}
            </p>
          )}

          {/* Metrics */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
              <div className="flex items-center space-x-1 mb-1">
                <DollarSign className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Price</span>
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                SAR {item.price}
              </p>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-lg">
              <div className="flex items-center space-x-1 mb-1">
                <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Margin</span>
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {profitMargin}%
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 px-3 py-2 rounded-lg">
              <div className="flex items-center space-x-1 mb-1">
                <Package className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Sold</span>
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {item.sold || 0}
              </p>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">
              <div className="flex items-center space-x-1 mb-1">
                <Star className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Rating</span>
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {item.rating || 'N/A'}
              </p>
            </div>
          </div>

          {/* Status and Revenue */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.available
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                    : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                }`}
              >
                {item.available ? '🟢 Available' : '🔴 Unavailable'}
              </span>
              {item.popularity > 70 && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
                  🔥 Trending
                </span>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">Revenue</p>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                SAR {revenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
