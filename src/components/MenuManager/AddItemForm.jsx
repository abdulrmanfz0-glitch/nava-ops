import { useState } from 'react';
import { Plus, Upload, X, Check } from 'lucide-react';
import { useMenu } from '../../contexts/MenuContext';

export default function AddItemForm({ onAdd, onCancel }) {
  const { categories } = useMenu();

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: categories[0] || 'Main Course',
    price: '',
    cost: '',
    image: '',
    available: true,
    preparationTime: '',
    calories: '',
    allergens: ''
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Item name is required';
    }

    if (!form.price || parseFloat(form.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!form.cost || parseFloat(form.cost) < 0) {
      newErrors.cost = 'Cost must be 0 or greater';
    }

    if (form.cost && form.price && parseFloat(form.cost) > parseFloat(form.price)) {
      newErrors.cost = 'Cost cannot exceed price';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: 'Image size must be less than 5MB' });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, image: 'File must be an image' });
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setForm({ ...form, image: reader.result });
        setErrors({ ...errors, image: null });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image URL input
  const handleImageUrlChange = (url) => {
    setForm({ ...form, image: url });
    if (url.trim()) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  // Clear image
  const clearImage = () => {
    setForm({ ...form, image: '' });
    setImagePreview(null);
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Prepare new item data
    const newItem = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      price: parseFloat(form.price),
      cost: parseFloat(form.cost),
      image: form.image || null,
      available: form.available,
      preparationTime: form.preparationTime ? parseInt(form.preparationTime) : null,
      calories: form.calories ? parseInt(form.calories) : null,
      allergens: form.allergens.trim() || null,
      sold: 0,
      rating: 0,
      popularity: 50
    };

    onAdd(newItem);

    // Reset form
    setForm({
      name: '',
      description: '',
      category: categories[0] || 'Main Course',
      price: '',
      cost: '',
      image: '',
      available: true,
      preparationTime: '',
      calories: '',
      allergens: ''
    });
    setImagePreview(null);
    setErrors({});
  };

  const profitMargin = form.price && form.cost
    ? (((parseFloat(form.price) - parseFloat(form.cost)) / parseFloat(form.price)) * 100).toFixed(1)
    : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-6 rounded-xl border border-emerald-200 dark:border-emerald-800">
        <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
          Add New Menu Item
        </h3>
        <p className="text-sm text-emerald-700 dark:text-emerald-300">
          Fill in the details below to add a new item to your menu
        </p>
      </div>

      {/* Basic Information */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900 dark:text-white">Basic Information</h4>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Item Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={`w-full px-4 py-2 border ${
              errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500`}
            placeholder="e.g., Margherita Pizza"
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            placeholder="Brief description of the item..."
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900 dark:text-white">Pricing</h4>

        <div className="grid grid-cols-2 gap-4">
          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Price (SAR) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className={`w-full px-4 py-2 border ${
                errors.price ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500`}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
          </div>

          {/* Cost */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cost (SAR) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={form.cost}
              onChange={(e) => setForm({ ...form, cost: e.target.value })}
              className={`w-full px-4 py-2 border ${
                errors.cost ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500`}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            {errors.cost && <p className="mt-1 text-sm text-red-500">{errors.cost}</p>}
          </div>
        </div>

        {/* Profit Margin Preview */}
        {form.price && form.cost && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                Profit Margin
              </span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {profitMargin}%
              </span>
            </div>
            <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
              Profit per item: SAR {(parseFloat(form.price) - parseFloat(form.cost)).toFixed(2)}
            </div>
          </div>
        )}
      </div>

      {/* Image Upload */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900 dark:text-white">Image (Optional)</h4>

        <div className="space-y-3">
          {/* Upload or URL */}
          <div className="grid grid-cols-1 gap-3">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload Image
              </label>
              <div className="flex items-center space-x-3">
                <label className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-emerald-500 transition-colors">
                  <Upload className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Choose file or drag here
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">Max size: 5MB • Supported: JPG, PNG, GIF</p>
            </div>

            {/* Or Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Or paste image URL
              </label>
              <input
                type="url"
                value={form.image && !imagePreview ? form.image : ''}
                onChange={(e) => handleImageUrlChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border-2 border-emerald-300 dark:border-emerald-700"
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Additional Details */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900 dark:text-white">Additional Details (Optional)</h4>

        <div className="grid grid-cols-2 gap-4">
          {/* Preparation Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Prep Time (minutes)
            </label>
            <input
              type="number"
              value={form.preparationTime}
              onChange={(e) => setForm({ ...form, preparationTime: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="15"
              min="0"
            />
          </div>

          {/* Calories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Calories
            </label>
            <input
              type="number"
              value={form.calories}
              onChange={(e) => setForm({ ...form, calories: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="350"
              min="0"
            />
          </div>
        </div>

        {/* Allergens */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Allergens
          </label>
          <input
            type="text"
            value={form.allergens}
            onChange={(e) => setForm({ ...form, allergens: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="e.g., Gluten, Dairy, Nuts"
          />
        </div>

        {/* Available Toggle */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="available"
            checked={form.available}
            onChange={(e) => setForm({ ...form, available: e.target.checked })}
            className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
          />
          <label htmlFor="available" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
            Item is available for ordering
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="submit"
          disabled={!form.name || !form.price || !form.cost}
          className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span>Add Menu Item</span>
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-semibold"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
