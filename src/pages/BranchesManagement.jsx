// NAVA OPS - Branches Management (Ultra Modern UI)
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '@/contexts/NotificationContext';
import api from '@/services/api';
import ModernPageWrapper, {
  ModernPageHeader,
  ModernSection,
  ModernButton,
  ModernInput,
  ModernBadge
} from '@/components/UltraModern/ModernPageWrapper';
import GlassCard from '@/components/UltraModern/GlassCard';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import {
  Store,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Phone,
  Mail,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Activity,
  Search,
  X
} from 'lucide-react';

export default function BranchesManagement() {
  const { addNotification } = useNotification();

  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'retail',
    city: '',
    region: '',
    address: '',
    phone: '',
    email: '',
    manager_name: '',
    status: 'active'
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const data = await api.branches.getAll();
      setBranches(data);
    } catch (error) {
      console.error('Error fetching branches:', error);
      addNotification({
        title: 'Error',
        message: 'Failed to load branches',
        type: 'error'
      });
      // Mock data for demonstration
      setBranches([
        {
          id: 1,
          name: 'Downtown Branch',
          code: 'DT001',
          city: 'Riyadh',
          region: 'Central',
          status: 'active',
          manager_name: 'Ahmed Al-Otaibi'
        },
        {
          id: 2,
          name: 'Mall Branch',
          code: 'ML002',
          city: 'Jeddah',
          region: 'Western',
          status: 'active',
          manager_name: 'Sara Al-Harthi'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedBranch) {
        await api.branches.update(selectedBranch.id, formData);
        addNotification({
          title: 'Success',
          message: 'Branch updated successfully',
          type: 'success'
        });
      } else {
        await api.branches.create(formData);
        addNotification({
          title: 'Success',
          message: 'Branch created successfully',
          type: 'success'
        });
      }

      setShowModal(false);
      resetForm();
      fetchBranches();
    } catch (error) {
      console.error('Error saving branch:', error);
      addNotification({
        title: 'Error',
        message: `Failed to ${selectedBranch ? 'update' : 'create'} branch`,
        type: 'error'
      });
    }
  };

  const handleDelete = async (branchId) => {
    if (!confirm('Are you sure you want to delete this branch?')) return;

    try {
      await api.branches.delete(branchId);
      addNotification({
        title: 'Success',
        message: 'Branch deleted successfully',
        type: 'success'
      });
      fetchBranches();
    } catch (error) {
      console.error('Error deleting branch:', error);
      addNotification({
        title: 'Error',
        message: 'Failed to delete branch',
        type: 'error'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      type: 'retail',
      city: '',
      region: '',
      address: '',
      phone: '',
      email: '',
      manager_name: '',
      status: 'active'
    });
    setSelectedBranch(null);
  };

  const openEditModal = (branch) => {
    setSelectedBranch(branch);
    setFormData({
      name: branch.name || '',
      code: branch.code || '',
      type: branch.type || 'retail',
      city: branch.city || '',
      region: branch.region || '',
      address: branch.address || '',
      phone: branch.phone || '',
      email: branch.email || '',
      manager_name: branch.manager_name || '',
      status: branch.status || 'active'
    });
    setShowModal(true);
  };

  const filteredBranches = branches.filter(branch =>
    branch.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    branch.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    branch.code?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    {
      label: 'Total Branches',
      value: branches.length,
      icon: Store,
      change: 8
    },
    {
      label: 'Active',
      value: branches.filter(b => b.status === 'active').length,
      icon: Activity
    },
    {
      label: 'Total Revenue',
      value: '$125K',
      icon: DollarSign,
      change: 12
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading branches..." />
      </div>
    );
  }

  return (
    <ModernPageWrapper>
      <ModernPageHeader
        title="Branches Management"
        subtitle="Manage all your branch locations and operations"
        icon={Store}
        stats={stats}
        actions={
          <ModernButton
            variant="primary"
            icon={Plus}
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            Add Branch
          </ModernButton>
        }
      />

      <ModernSection title="All Branches" icon={Store}>
        {/* Search */}
        <div className="mb-6">
          <ModernInput
            placeholder="Search branches by name, city, or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
          />
        </div>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredBranches.map((branch, index) => (
              <motion.div
                key={branch.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard hover className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                        <Store className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-white">
                          {branch.name}
                        </h3>
                        <p className="text-xs text-gray-400">
                          {branch.code}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <ModernButton
                        variant="ghost"
                        size="sm"
                        icon={Edit2}
                        onClick={() => openEditModal(branch)}
                      />
                      <ModernButton
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDelete(branch.id)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{branch.city}, {branch.region}</span>
                    </div>
                    {branch.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Phone className="w-4 h-4" />
                        <span>{branch.phone}</span>
                      </div>
                    )}
                    {branch.manager_name && (
                      <div className="text-sm text-gray-400">
                        <span className="font-medium">Manager:</span> {branch.manager_name}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <ModernBadge variant={branch.status === 'active' ? 'success' : 'danger'}>
                      {branch.status}
                    </ModernBadge>
                    <ModernBadge variant="primary">
                      {branch.type || 'Retail'}
                    </ModernBadge>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredBranches.length === 0 && (
          <div className="text-center py-12">
            <Store className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No branches found</p>
          </div>
        )}
      </ModernSection>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="w-full max-w-2xl bg-gray-900/95 backdrop-blur-2xl border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/[0.08] sticky top-0 bg-gray-900/95 backdrop-blur-xl z-10">
                <h2 className="text-xl font-semibold text-white">
                  {selectedBranch ? 'Edit Branch' : 'Add Branch'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-lg hover:bg-white/[0.05] text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ModernInput
                    label="Branch Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter branch name"
                    required
                  />
                  <ModernInput
                    label="Branch Code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g., DT001"
                    required
                  />
                  <ModernInput
                    label="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Enter city"
                    icon={MapPin}
                    required
                  />
                  <ModernInput
                    label="Region"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    placeholder="Enter region"
                    required
                  />
                  <ModernInput
                    label="Phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter phone number"
                    icon={Phone}
                  />
                  <ModernInput
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email"
                    icon={Mail}
                  />
                  <ModernInput
                    label="Manager Name"
                    value={formData.manager_name}
                    onChange={(e) => setFormData({ ...formData, manager_name: e.target.value })}
                    placeholder="Enter manager name"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/[0.03] rounded-xl border border-white/[0.08] text-white focus:outline-none focus:border-cyan-500/50"
                      required
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <ModernInput
                  label="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter full address"
                />

                {/* Modal Footer */}
                <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
                  <ModernButton
                    variant="secondary"
                    onClick={() => setShowModal(false)}
                    type="button"
                  >
                    Cancel
                  </ModernButton>
                  <ModernButton variant="primary" type="submit">
                    {selectedBranch ? 'Update' : 'Add'} Branch
                  </ModernButton>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ModernPageWrapper>
  );
}
