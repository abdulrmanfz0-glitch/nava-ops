import { useState, useMemo } from 'react';
import { X, Plus, Search, Filter, Edit2, Trash2, Image as ImageIcon, Check, XCircle, UtensilsCrossed } from 'lucide-react';
import { useMenu } from '../../contexts/MenuContext';
import ItemCard from './ItemCard';
import AddItemForm from './AddItemForm';

export default function MenuManagerPanel({ isOpen, onClose }) {
  const { menuItems, categories, addMenuItem, updateMenuItem, deleteMenuItem } = useMenu();

  const [activeTab, setActiveTab] = useState('all'); // all, add, categories
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [editingItem, setEditingItem] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Filter and search menu items
  const filteredItems = useMemo(() => {
    let items = [...menuItems];

    // Filter by category
    if (filterCategory !== 'all') {
      items = items.filter(item => item.category === filterCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query)
      );
    }

    return items;
  }, [menuItems, filterCategory, searchQuery]);

  // Handle item update
  const handleUpdateItem = (itemId, updates) => {
    updateMenuItem(itemId, updates);
    setEditingItem(null);
  };

  // Handle item delete
  const handleDeleteItem = (itemId) => {
    deleteMenuItem(itemId);
    setShowDeleteConfirm(null);
  };

  // Handle add new item
  const handleAddItem = (newItem) => {
    addMenuItem(newItem);
    setActiveTab('all');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-screen w-full max-w-2xl bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-700 z-50 animate-slideInRight">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center">
            <UtensilsCrossed className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>
              Menu Manager
            </h2>
            <p className="text-xs text-white/80">
              {menuItems.length} items • {categories.length} categories
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 px-6 pt-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>All Items</span>
          <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
            {menuItems.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg font-medium transition-colors ${
            activeTab === 'add'
              ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Add New</span>
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg font-medium transition-colors ${
            activeTab === 'categories'
              ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Categories</span>
        </button>
      </div>

      {/* Content */}
      <div className="h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar">
        {activeTab === 'all' && (
          <div className="p-6 space-y-4">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search items..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Items Grid */}
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    isEditing={editingItem === item.id}
                    onEdit={() => setEditingItem(item.id)}
                    onCancelEdit={() => setEditingItem(null)}
                    onSave={(updates) => handleUpdateItem(item.id, updates)}
                    onDelete={() => setShowDeleteConfirm(item.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <UtensilsCrossed className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery || filterCategory !== 'all'
                    ? 'No items match your filters'
                    : 'No menu items yet. Add your first item!'}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'add' && (
          <div className="p-6">
            <AddItemForm onAdd={handleAddItem} onCancel={() => setActiveTab('all')} />
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="p-6 space-y-4">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-6 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                Category Overview
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {categories.map((category) => {
                  const itemCount = menuItems.filter(item => item.category === category).length;
                  const categoryRevenue = menuItems
                    .filter(item => item.category === category)
                    .reduce((sum, item) => sum + (item.price * item.sold), 0);

                  return (
                    <div
                      key={category}
                      className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {category}
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-600 dark:text-gray-400">
                          {itemCount} items
                        </p>
                        <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          SAR {categoryRevenue.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md mx-4 shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Delete Item?
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteItem(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Floating Button Component
export function MenuManagerButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group hover:scale-110 z-40"
      title="Menu Manager"
    >
      <UtensilsCrossed className="w-6 h-6 group-hover:scale-110 transition-transform" />
    </button>
  );
}
