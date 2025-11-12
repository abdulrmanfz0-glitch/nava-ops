// src/Dashboard.jsx
import React, { useMemo, useState, useEffect } from 'react';
import { supabase } from '@lib/supabase';
import { useAuth } from '@contexts/AuthContext';
import { useNotification } from '@contexts/NotificationContext';
import { exportUtils } from '@utils/exportUtils';
import { 
  Plus, Edit2, Trash2, AlertTriangle, CheckCircle, Clock, Filter, 
  Download, BarChart3, Calendar, TrendingUp, Users, DollarSign, 
  Package, Star, Eye, MoreVertical, Search, RefreshCw, Target,
  ArrowUpRight, ArrowDownRight, Crown, Zap, Activity, Shield
} from 'lucide-react';

/* ========= نظام الأيقونات المحسن ========= */
const Icons = {
  Edit: Edit2,
  Delete: Trash2,
  Alert: AlertTriangle,
  Check: CheckCircle,
  Clock: Clock,
  Filter: Filter,
  Download: Download,
  BarChart: BarChart3,
  Calendar: Calendar,
  TrendingUp: TrendingUp,
  Users: Users,
  DollarSign: DollarSign,
  Package: Package,
  Star: Star,
  Eye: Eye,
  MoreVertical: MoreVertical,
  Search: Search,
  RefreshCw: RefreshCw,
  Target: Target,
  Crown: Crown,
  Zap: Zap,
  Activity: Activity,
  Shield: Shield
};

/* ========= مودال تعديل المطعم المحسن ========= */
function EditRestaurantModal({ restaurant, onSave, onClose, brands }) {
  const [form, setForm] = useState({
    name: restaurant?.name || '',
    type: restaurant?.type || '',
    city: restaurant?.city || '',
    brand_id: restaurant?.brand_id || '',
    status: restaurant?.status || 'active',
    address: restaurant?.address || '',
    phone: restaurant?.phone || '',
    email: restaurant?.email || '',
    description: restaurant?.description || ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave(restaurant.id, form);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">تعديل بيانات المطعم</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="form-label">اسم المطعم *</label>
              <input
                name="name"
                placeholder="أدخل اسم المطعم"
                value={form.name}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="form-label">النوع</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">اختر النوع</option>
                <option value="مطعم">مطعم</option>
                <option value="مقهى">مقهى</option>
                <option value="مخبز">مخبز</option>
                <option value="سوبرماركت">سوبرماركت</option>
                <option value="حلوى">حلوى</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="form-label">المدينة</label>
              <input
                name="city"
                placeholder="المدينة"
                value={form.city}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="space-y-2">
              <label className="form-label">الفرع</label>
              <select
                name="brand_id"
                value={form.brand_id}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">اختر الفرع</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="form-label">العنوان</label>
            <textarea
              name="address"
              placeholder="العنوان التفصيلي"
              value={form.address}
              onChange={handleChange}
              rows="3"
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="form-label">رقم الهاتف</label>
              <input
                name="phone"
                placeholder="رقم الهاتف"
                value={form.phone}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="space-y-2">
              <label className="form-label">البريد الإلكتروني</label>
              <input
                name="email"
                type="email"
                placeholder="البريد الإلكتروني"
                value={form.email}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="form-label">الوصف</label>
            <textarea
              name="description"
              placeholder="وصف المطعم"
              value={form.description}
              onChange={handleChange}
              rows="3"
              className="input-field"
            />
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-ghost text-gray-700"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary"
            >
              {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ========= مودال تفاصيل التنبيه المحسن ========= */
function AlertDetailModal({ alert, onClose, onResolve }) {
  if (!alert) return null;

  const getAlertIcon = (type) => {
    const icons = {
      critical: <AlertTriangle className="text-red-500" size={24} />,
      warning: <AlertTriangle className="text-yellow-500" size={24} />,
      info: <Activity className="text-blue-500" size={24} />,
      success: <CheckCircle className="text-green-500" size={24} />
    };
    return icons[type] || icons.info;
  };

  const getAlertColor = (type) => {
    const colors = {
      critical: 'bg-red-50 border-red-200',
      warning: 'bg-yellow-50 border-yellow-200',
      info: 'bg-blue-50 border-blue-200',
      success: 'bg-green-50 border-green-200'
    };
    return colors[type] || colors.info;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {getAlertIcon(alert.type)}
            <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className={`p-4 rounded-lg border ${getAlertColor(alert.type)} mb-4`}>
          <p className="text-gray-700">{alert.message}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
          <div>
            <span className="font-medium">النوع:</span> {alert.type}
          </div>
          <div>
            <span className="font-medium">الأولوية:</span> {alert.priority}
          </div>
          <div>
            <span className="font-medium">التاريخ:</span> {new Date(alert.created_at).toLocaleDateString('ar-SA')}
          </div>
          <div>
            <span className="font-medium">الحالة:</span> {alert.status === 'resolved' ? 'تم الحل' : 'نشط'}
          </div>
        </div>

        <div className="flex gap-3">
          {alert.status !== 'resolved' && (
            <button 
              onClick={() => onResolve(alert)}
              className="flex-1 btn-success"
            >
              حل التنبيه
            </button>
          )}
          <button 
            onClick={onClose}
            className="flex-1 btn-ghost text-gray-700"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========= 1) إدارة المطاعم المحسنة ========= */
const EnhancedRestaurantManager = () => {
  const { user, userProfile } = useAuth();
  const { addNotification } = useNotification();
  const [restaurants, setRestaurants] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    brand: 'all',
    type: 'all'
  });

  const [quickForm, setQuickForm] = useState({ 
    name: '', 
    type: '', 
    city: '', 
    brand_id: userProfile?.brand_id || '',
    status: 'active'
  });

  useEffect(() => {
    fetchRestaurants();
    fetchBrands();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('restaurants')
        .select(`
          *,
          brand:brands(name, logo_url),
          performance:restaurant_performance(rating, total_orders, total_revenue)
        `);

      if (userProfile?.role === 'ops' && userProfile?.brand_id) {
        query = query.eq('brand_id', userProfile.brand_id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setRestaurants(data || []);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      addNotification({
        type: 'error',
        title: 'خطأ في جلب البيانات',
        message: 'تعذر تحميل قائمة المطاعم'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('id, name, logo_url')
        .order('name');

      if (error) throw error;
      setBrands(data || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const handleAddRestaurant = async (restaurantData) => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .insert([{
          ...restaurantData,
          created_by: user.id,
          status: 'active'
        }])
        .select(`
          *,
          brand:brands(name, logo_url),
          performance:restaurant_performance(rating, total_orders, total_revenue)
        `)
        .single();

      if (error) throw error;

      setRestaurants(prev => [data, ...prev]);
      addNotification({
        type: 'success',
        title: 'تم الإضافة',
        message: 'تم إضافة المطعم بنجاح'
      });
    } catch (error) {
      console.error('Error adding restaurant:', error);
      addNotification({
        type: 'error',
        title: 'خطأ في الإضافة',
        message: 'تعذر إضافة المطعم'
      });
    }
  };

  const handleEditRestaurant = async (id, updates) => {
    try {
      const { error } = await supabase
        .from('restaurants')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setRestaurants(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
      setEditingRestaurant(null);
      addNotification({
        type: 'success',
        title: 'تم التحديث',
        message: 'تم تحديث بيانات المطعم بنجاح'
      });
    } catch (error) {
      console.error('Error updating restaurant:', error);
      addNotification({
        type: 'error',
        title: 'خطأ في التحديث',
        message: 'تعذر تحديث بيانات المطعم'
      });
    }
  };

  const handleDeleteRestaurant = async (id) => {
    try {
      const { error } = await supabase
        .from('restaurants')
        .update({ status: 'inactive' })
        .eq('id', id);

      if (error) throw error;

      setRestaurants(prev => prev.filter(r => r.id !== id));
      setShowDeleteConfirm(false);
      setRestaurantToDelete(null);
      addNotification({
        type: 'success',
        title: 'تم الحذف',
        message: 'تم حذف المطعم بنجاح'
      });
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      addNotification({
        type: 'error',
        title: 'خطأ في الحذف',
        message: 'تعذر حذف المطعم'
      });
    }
  };

  const filteredRestaurants = useMemo(() => {
    let data = [...restaurants];

    if (filters.search) {
      const query = filters.search.toLowerCase();
      data = data.filter(r => 
        r.name?.toLowerCase().includes(query) ||
        r.city?.toLowerCase().includes(query) ||
        r.type?.toLowerCase().includes(query)
      );
    }

    if (filters.status !== 'all') {
      data = data.filter(r => r.status === filters.status);
    }

    if (filters.brand !== 'all') {
      data = data.filter(r => r.brand_id === filters.brand);
    }

    if (filters.type !== 'all') {
      data = data.filter(r => r.type === filters.type);
    }

    return data;
  }, [restaurants, filters]);

  const restaurantStats = useMemo(() => {
    const total = restaurants.length;
    const active = restaurants.filter(r => r.status === 'active').length;
    const cities = [...new Set(restaurants.map(r => r.city).filter(Boolean))];
    const types = [...new Set(restaurants.map(r => r.type).filter(Boolean))];

    return { total, active, cities: cities.length, types: types.length };
  }, [restaurants]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات المطاعم...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">إدارة المطاعم</h2>
            <p className="text-white/70">إدارة وتتبع جميع المطاعم والفروع</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <button className="btn-glass">
              <Download size={18} />
              تصدير
            </button>
            <button className="btn-primary">
              <Plus size={18} />
              إضافة مطعم
            </button>
          </div>
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="stats-card">
            <div className="stats-value">{restaurantStats.total}</div>
            <div className="stats-label">إجمالي المطاعم</div>
          </div>
          <div className="stats-card">
            <div className="stats-value">{restaurantStats.active}</div>
            <div className="stats-label">مطاعم نشطة</div>
          </div>
          <div className="stats-card">
            <div className="stats-value">{restaurantStats.cities}</div>
            <div className="stats-label">مدينة</div>
          </div>
          <div className="stats-card">
            <div className="stats-value">{restaurantStats.types}</div>
            <div className="stats-label">نوع</div>
          </div>
        </div>

        {/* الفلاتر */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
          <div className="relative">
            <Icons.Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
            <input
              type="text"
              placeholder="ابحث في المطاعم..."
              className="input-glass w-full pr-10"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          
          <select
            className="input-glass"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">جميع الحالات</option>
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
          </select>

          <select
            className="input-glass"
            value={filters.brand}
            onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
          >
            <option value="all">جميع الفروع</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>

          <select
            className="input-glass"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="all">جميع الأنواع</option>
            <option value="مطعم">مطعم</option>
            <option value="مقهى">مقهى</option>
            <option value="مخبز">مخبز</option>
            <option value="سوبرماركت">سوبرماركت</option>
          </select>

          <div className="text-white/70 text-sm flex items-center">
            <Icons.Filter size={16} className="ml-1" />
            عرض {filteredRestaurants.length} من {restaurants.length}
          </div>
        </div>

        {/* نموذج الإضافة السريع */}
        <div className="glass rounded-xl p-4 mb-6">
          <h4 className="text-white font-semibold mb-3">إضافة سريعة</h4>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input
              placeholder="اسم المطعم"
              value={quickForm.name}
              onChange={(e) => setQuickForm({ ...quickForm, name: e.target.value })}
              className="input-glass"
            />
            <select
              value={quickForm.type}
              onChange={(e) => setQuickForm({ ...quickForm, type: e.target.value })}
              className="input-glass"
            >
              <option value="">اختر النوع</option>
              <option value="مطعم">مطعم</option>
              <option value="مقهى">مقهى</option>
              <option value="مخبز">مخبز</option>
            </select>
            <input
              placeholder="المدينة"
              value={quickForm.city}
              onChange={(e) => setQuickForm({ ...quickForm, city: e.target.value })}
              className="input-glass"
            />
            <select
              value={quickForm.brand_id}
              onChange={(e) => setQuickForm({ ...quickForm, brand_id: e.target.value })}
              className="input-glass"
              disabled={userProfile?.role === 'ops'}
            >
              <option value="">اختر الفرع</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
            <button
              onClick={() => {
                if (!quickForm.name.trim()) {
                  addNotification({
                    type: 'warning',
                    title: 'بيانات ناقصة',
                    message: 'يرجى إدخال اسم المطعم'
                  });
                  return;
                }
                handleAddRestaurant(quickForm);
                setQuickForm({ 
                  name: '', 
                  type: '', 
                  city: '', 
                  brand_id: userProfile?.brand_id || '',
                  status: 'active'
                });
              }}
              className="btn-primary"
            >
              <Plus size={18} />
              إضافة
            </button>
          </div>
        </div>

        {/* شبكة المطاعم */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard 
              key={restaurant.id}
              restaurant={restaurant}
              onEdit={setEditingRestaurant}
              onDelete={handleDeleteRestaurant}
            />
          ))}
          
          {filteredRestaurants.length === 0 && (
            <div className="col-span-full text-center py-12 text-white/70">
              <Icons.Search size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">لا توجد مطاعم مطابقة للبحث</p>
              <p className="text-sm mt-2">جرب تعديل شروط البحث أو أضف مطعم جديد</p>
            </div>
          )}
        </div>

        {/* المودالات */}
        {editingRestaurant && (
          <EditRestaurantModal
            restaurant={editingRestaurant}
            onSave={handleEditRestaurant}
            onClose={() => setEditingRestaurant(null)}
            brands={brands}
          />
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <div className="flex items-center gap-3 mb-4">
                <Icons.Alert className="text-red-500" size={24} />
                <h3 className="text-lg font-semibold text-gray-900">تأكيد الحذف</h3>
              </div>
              <p className="text-gray-600 mb-6">هل أنت متأكد من حذف هذا المطعم؟ لا يمكن التراجع عن هذا الإجراء.</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleDeleteRestaurant(restaurantToDelete)}
                  className="flex-1 btn-error"
                >
                  حذف
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 btn-ghost text-gray-700"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ========= بطاقة المطعم المنفصلة ========= */
function RestaurantCard({ restaurant, onEdit, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="glass-card rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
            {restaurant.type === 'مقهى' ? '☕' : 
             restaurant.type === 'مخبز' ? '🍞' : '🍽️'}
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">{restaurant.name}</h3>
            <p className="text-white/70 text-sm">{restaurant.type} • {restaurant.city}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`badge badge-glass ${
            restaurant.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
          }`}>
            {restaurant.status === 'active' ? 'نشط' : 'غير نشط'}
          </span>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Icons.MoreVertical size={16} className="text-white/70" />
            </button>
            
            {showMenu && (
              <div className="absolute left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <button
                  onClick={() => {
                    onEdit(restaurant);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
                >
                  <Icons.Edit size={14} />
                  تعديل البيانات
                </button>
                <button
                  onClick={() => {
                    onDelete(restaurant.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                >
                  <Icons.Delete size={14} />
                  حذف المطعم
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {restaurant.brand && (
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <Icons.Shield size={14} />
            <span>{restaurant.brand.name}</span>
          </div>
        )}
        
        {restaurant.phone && (
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <Icons.Users size={14} />
            <span>{restaurant.phone}</span>
          </div>
        )}
        
        {restaurant.address && (
          <div className="text-white/70 text-sm line-clamp-2">
            {restaurant.address}
          </div>
        )}
      </div>

      {restaurant.performance && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-white font-semibold">{restaurant.performance.rating || 0}</div>
              <div className="text-white/50 text-xs">التقييم</div>
            </div>
            <div>
              <div className="text-white font-semibold">{restaurant.performance.total_orders || 0}</div>
              <div className="text-white/50 text-xs">الطلبات</div>
            </div>
            <div>
              <div className="text-white font-semibold">
                {restaurant.performance.total_revenue ? 
                 new Intl.NumberFormat('ar-SA').format(restaurant.performance.total_revenue) : 0}
              </div>
              <div className="text-white/50 text-xs">الإيرادات</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========= 2) نظام التنبيهات المحسن ========= */
const EnhancedAlertsSystem = () => {
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);

  // بيانات تجريبية للتنبيهات
  useEffect(() => {
    const mockAlerts = [
      {
        id: 1,
        title: 'انخفاض في المبيعات',
        message: 'لوحظ انخفاض بنسبة 15% في مبيعات فرع الرياض خلال الأسبوع الماضي',
        type: 'warning',
        priority: 'medium',
        status: 'active',
        created_at: new Date().toISOString(),
        restaurant: 'مطعم الرياض الرئيسي'
      },
      {
        id: 2,
        title: 'مشكلة في المخزون',
        message: 'نفاد مخزون اللحوم في فرع جدة، يرجى التزويد العاجل',
        type: 'critical',
        priority: 'high',
        status: 'active',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        restaurant: 'مطعم جدة الساحلي'
      }
    ];
    setAlerts(mockAlerts);
  }, []);

  const handleResolveAlert = (alert) => {
    setAlerts(prev => prev.map(a => 
      a.id === alert.id ? { ...a, status: 'resolved' } : a
    ));
    setSelectedAlert(null);
  };

  const activeAlerts = alerts.filter(alert => alert.status === 'active');

  return (
    <div className="p-6 space-y-6">
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">نظام التنبيهات</h2>
            <p className="text-white/70">مراقبة وإدارة التنبيهات التشغيلية</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge badge-glass bg-red-500/20 text-red-300">
              {activeAlerts.length} تنبيه نشط
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {activeAlerts.map(alert => (
            <div key={alert.id} className="glass rounded-xl p-4 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icons.Alert className="text-yellow-500" size={20} />
                  <div>
                    <h4 className="text-white font-semibold">{alert.title}</h4>
                    <p className="text-white/70 text-sm">{alert.message}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedAlert(alert)}
                    className="btn-glass text-sm"
                  >
                    <Icons.Eye size={14} />
                    عرض
                  </button>
                  <button
                    onClick={() => handleResolveAlert(alert)}
                    className="btn-success text-sm"
                  >
                    <Icons.Check size={14} />
                    حل
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {activeAlerts.length === 0 && (
            <div className="text-center py-8 text-white/70">
              <Icons.Check className="mx-auto mb-4 opacity-50" size={48} />
              <p>لا توجد تنبيهات نشطة حالياً</p>
            </div>
          )}
        </div>
      </div>

      {selectedAlert && (
        <AlertDetailModal
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onResolve={handleResolveAlert}
        />
      )}
    </div>
  );
};

/* ========= المكوّن الجامع (Dashboard) ========= */
export default function Dashboard() {
  const { userProfile } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800">
      <div className="container-custom py-8">
        {/* رأس الداشبورد */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            لوحة تحكم <span className="gradient-text-nava">NAVA</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            نظام متكامل لإدارة المطاعم والتقارير التشغيلية
          </p>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="space-y-8">
          <EnhancedRestaurantManager />
          <EnhancedAlertsSystem />
          
          {/* عناصر نائبة للمكونات المستقبلية */}
          <div className="glass-card rounded-2xl p-6 text-center">
            <Icons.BarChart className="mx-auto mb-4 text-white/50" size={48} />
            <h3 className="text-xl font-semibold text-white mb-2">التقارير المالية المتقدمة</h3>
            <p className="text-white/70">قريباً... نظام متكامل للتقارير المالية والتحليلات</p>
          </div>
          
          <div className="glass-card rounded-2xl p-6 text-center">
            <Icons.TrendingUp className="mx-auto mb-4 text-white/50" size={48} />
            <h3 className="text-xl font-semibold text-white mb-2">التنبؤ بالإيرادات بالذكاء الاصطناعي</h3>
            <p className="text-white/70">قريباً... نظام تنبؤ ذكي باستخدام تقنيات الذكاء الاصطناعي</p>
          </div>
        </div>
      </div>
    </div>
  );
}