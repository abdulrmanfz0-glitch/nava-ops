// src/pages/MenuManagement.jsx
import React, { useState, useRef } from 'react';
import {
  Plus, Edit, Trash2, Save, X, Search, Filter, Upload,
  Image as ImageIcon, Package, TrendingUp, Activity,
  Star, CheckCircle, XCircle, AlertCircle,
  ChevronDown, RefreshCw, Download, Eye, Copy, UtensilsCrossed
} from 'lucide-react';
import { useMenu } from '../contexts/MenuContext';

export default function MenuManagement() {
  const {
    menuItems,
    categories,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability,
    getStatistics,
    addCategory
  } = useMenu();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterAvailable, setFilterAvailable] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  // Form state - Restaurant Menu Item Model
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Main Course',
    price: '',
    cost: '',
    preparationTime: '',
    calories: '',
    allergens: [],
    image: '',
    available: true
  });

  // Allergen options
  const allergenOptions = ['Dairy', 'Gluten', 'Nuts', 'Eggs', 'Fish', 'Shellfish', 'Soy'];

  const stats = getStatistics();

  // Calculate margin percentage
  const calculateMargin = (price, cost) => {
    if (!price || price === 0) return 0;
    return ((price - cost) / price) * 100;
  };

  // Filter menu items
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesAvailable = filterAvailable === 'all' ||
                            (filterAvailable === 'available' && item.available) ||
                            (filterAvailable === 'unavailable' && !item.available);
    return matchesSearch && matchesCategory && matchesAvailable;
  });

  // Toggle allergen selection
  const toggleAllergen = (allergen) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter(a => a !== allergen)
        : [...prev.allergens, allergen]
    }));
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image URL input
  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, image: url }));
    setImagePreview(url);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'Main Course',
      price: '',
      cost: '',
      preparationTime: '',
      calories: '',
      allergens: [],
      image: '',
      available: true
    });
    setImagePreview('');
    setEditingItem(null);
    setShowForm(false);
  };

  // Handle edit
  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      category: item.category,
      price: item.price || '',
      cost: item.cost || '',
      preparationTime: item.preparationTime || '',
      calories: item.calories || '',
      allergens: item.allergens || [],
      image: item.image || '',
      available: item.available !== undefined ? item.available : true
    });
    setImagePreview(item.image || '');
    setShowForm(true);
  };

  // Handle save
  const handleSave = (e) => {
    e.preventDefault();
    console.log('💾 MenuManagement: Saving menu item', formData);

    const itemData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      cost: parseFloat(formData.cost) || 0,
      preparationTime: parseInt(formData.preparationTime) || 0,
      calories: parseInt(formData.calories) || 0
    };

    console.log('💾 MenuManagement: Processed menu item', itemData);

    if (editingItem) {
      console.log('💾 MenuManagement: Updating existing item', editingItem.id);
      updateMenuItem(editingItem.id, itemData);
    } else {
      console.log('💾 MenuManagement: Adding new item');
      const newItem = addMenuItem(itemData);
      console.log('💾 MenuManagement: Item added successfully', newItem);
    }

    resetForm();
  };

  // Handle delete with confirmation
  const handleDelete = (id, name) => {
    console.log('🗑️ MenuManagement: Delete requested for', id, name);
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      console.log('🗑️ MenuManagement: Delete confirmed, calling deleteMenuItem');
      deleteMenuItem(id);
      console.log('🗑️ MenuManagement: Delete called successfully');
    } else {
      console.log('🗑️ MenuManagement: Delete cancelled by user');
    }
  };

  // Handle duplicate
  const handleDuplicate = (item) => {
    const duplicate = {
      ...item,
      name: `${item.name} (Copy)`
    };
    delete duplicate.id;
    delete duplicate.createdAt;
    delete duplicate.updatedAt;
    addMenuItem(duplicate);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <UtensilsCrossed className="text-amber-600" />
            Menu Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your menu items, categories, and pricing
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          Add New Item
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Items</span>
            <Package className="text-blue-500" size={24} />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalItems}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Menu items available</div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Price</span>
            <TrendingUp className="text-green-500" size={24} />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {menuItems.length > 0
              ? (menuItems.reduce((sum, item) => sum + item.price, 0) / menuItems.length).toFixed(0)
              : 0} SAR
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Average item price</div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</span>
            <Activity className="text-purple-500" size={24} />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {(stats.totalRevenue || 0).toFixed(0)} SAR
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">From all sales</div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Rating</span>
            <Star className="text-yellow-500" size={24} />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.avgRating?.toFixed(1) || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Out of 5.0</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 transition"
              />
            </div>
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 transition"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={filterAvailable}
            onChange={(e) => setFilterAvailable(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 transition"
          >
            <option value="all">All Items</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-lg transition ${
                viewMode === 'list'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Menu Items Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all animate-fadeIn"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-200 dark:bg-slate-700">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={48} className="text-gray-400" />
                  </div>
                )}

                {/* Availability Badge */}
                <div className="absolute top-2 right-2">
                  {item.available ? (
                    <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-semibold flex items-center gap-1">
                      <CheckCircle size={12} /> Available
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-semibold flex items-center gap-1">
                      <XCircle size={12} /> Unavailable
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{item.description}</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded text-xs font-medium">
                    {item.category}
                  </span>
                </div>

                {/* Price and Cost */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Price</div>
                    <div className="text-lg font-bold text-green-600">
                      {item.price} SAR
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Cost</div>
                    <div className="text-lg font-bold text-red-600">{item.cost} SAR</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Margin</div>
                    <div className="text-lg font-bold text-blue-600">
                      {calculateMargin(item.price, item.cost).toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Sold</div>
                    <div className="text-lg font-bold text-purple-600">{item.sold || 0}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => toggleAvailability(item.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                  >
                    <RefreshCw size={16} />
                    Toggle
                  </button>
                  <button
                    onClick={() => handleDuplicate(item)}
                    className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    title="Duplicate"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.name)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400 font-semibold">Item</th>
                <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400 font-semibold">Category</th>
                <th className="text-center py-4 px-6 text-gray-600 dark:text-gray-400 font-semibold">Price</th>
                <th className="text-center py-4 px-6 text-gray-600 dark:text-gray-400 font-semibold">Cost</th>
                <th className="text-center py-4 px-6 text-gray-600 dark:text-gray-400 font-semibold">Margin %</th>
                <th className="text-center py-4 px-6 text-gray-600 dark:text-gray-400 font-semibold">Sold</th>
                <th className="text-center py-4 px-6 text-gray-600 dark:text-gray-400 font-semibold">Available</th>
                <th className="text-right py-4 px-6 text-gray-600 dark:text-gray-400 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-gray-200 dark:bg-slate-700 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/64?text=No+Image';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon size={24} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{item.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{item.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded text-xs font-medium">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="font-semibold text-green-600">
                      {item.price} SAR
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="font-semibold text-red-600">{item.cost} SAR</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="font-semibold text-blue-600">
                      {calculateMargin(item.price, item.cost).toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="font-semibold text-purple-600">{item.sold || 0}</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {item.available ? (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold">
                        Available
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-semibold">
                        Unavailable
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDuplicate(item)}
                        className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition"
                        title="Duplicate"
                      >
                        <Copy size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              {/* Image Upload Section */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Item Image
                </label>

                <div className="flex gap-4">
                  {/* Image Preview */}
                  <div className="w-48 h-48 bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={() => setImagePreview('')}
                      />
                    ) : (
                      <ImageIcon size={48} className="text-gray-400" />
                    )}
                  </div>

                  {/* Upload Options */}
                  <div className="flex-1 space-y-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <Upload size={20} />
                      Upload Image
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />

                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Or paste image URL..."
                        value={formData.image}
                        onChange={handleImageUrlChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 transition"
                      />
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Upload an image or paste a URL from Unsplash, Pexels, etc.
                    </p>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 transition"
                    placeholder="e.g., Grilled Salmon"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 transition"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 transition"
                  placeholder="Describe this menu item..."
                />
              </div>

              {/* Pricing and Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price (SAR) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 transition"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cost (SAR) *
                  </label>
                  <input
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 transition"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preparation Time (minutes)
                  </label>
                  <input
                    type="number"
                    name="preparationTime"
                    value={formData.preparationTime}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 transition"
                    placeholder="15"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Calories
                  </label>
                  <input
                    type="number"
                    name="calories"
                    value={formData.calories}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 transition"
                    placeholder="450"
                  />
                </div>
              </div>

              {/* Allergens */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Allergens
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {allergenOptions.map((allergen) => (
                    <label key={allergen} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.allergens.includes(allergen)}
                        onChange={() => toggleAllergen(allergen)}
                        className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{allergen}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Available Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Item is available for ordering
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-700 hover:to-amber-800 transition"
                >
                  <Save size={20} />
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-12 text-center">
          <UtensilsCrossed size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Menu Items Found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm || filterCategory !== 'all' || filterAvailable !== 'all'
              ? 'Try adjusting your filters to see more items.'
              : 'Get started by adding your first menu item.'}
          </p>
          {searchTerm || filterCategory !== 'all' || filterAvailable !== 'all' ? (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('all');
                setFilterAvailable('all');
              }}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Clear Filters
            </button>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-700 hover:to-amber-800 transition"
            >
              Add Your First Item
            </button>
          )}
        </div>
      )}
    </div>
  );
}
