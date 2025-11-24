// NAVA OPS - Team Management (Ultra Modern UI)
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
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
  Users,
  Plus,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Shield,
  Search,
  Filter,
  UserCheck,
  UserX,
  MoreVertical,
  X
} from 'lucide-react';

export default function TeamManagement() {
  const { user, userProfile, hasPermission } = useAuth();
  const { addNotification } = useNotification();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    role: 'staff',
    department: '',
    status: 'active',
    position: ''
  });

  const roleConfig = {
    admin: {
      label: 'System Admin',
      variant: 'purple',
      icon: Shield
    },
    ops: {
      label: 'Operations',
      variant: 'primary',
      icon: Users
    },
    manager: {
      label: 'Manager',
      variant: 'success',
      icon: UserCheck
    },
    staff: {
      label: 'Staff',
      variant: 'default',
      icon: UserCheck
    }
  };

  const statusConfig = {
    active: { label: 'Active', variant: 'success' },
    inactive: { label: 'Inactive', variant: 'danger' }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('brand_id', userProfile?.brand_id || user?.id);

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      addNotification({
        title: 'Error',
        message: 'Failed to load team members',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingEmployee) {
        const { error } = await supabase
          .from('users')
          .update(formData)
          .eq('id', editingEmployee.id);

        if (error) throw error;

        addNotification({
          title: 'Success',
          message: 'Employee updated successfully',
          type: 'success'
        });
      } else {
        const { error } = await supabase
          .from('users')
          .insert([{ ...formData, brand_id: userProfile?.brand_id || user?.id }]);

        if (error) throw error;

        addNotification({
          title: 'Success',
          message: 'Employee added successfully',
          type: 'success'
        });
      }

      setShowModal(false);
      resetForm();
      fetchEmployees();
    } catch (error) {
      console.error('Error saving employee:', error);
      addNotification({
        title: 'Error',
        message: 'Failed to save employee',
        type: 'error'
      });
    }
  };

  const handleDelete = async (employeeId) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', employeeId);

      if (error) throw error;

      addNotification({
        title: 'Success',
        message: 'Employee deleted successfully',
        type: 'success'
      });

      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      addNotification({
        title: 'Error',
        message: 'Failed to delete employee',
        type: 'error'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      role: 'staff',
      department: '',
      status: 'active',
      position: ''
    });
    setEditingEmployee(null);
  };

  const openEditModal = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      full_name: employee.full_name || '',
      email: employee.email || '',
      phone: employee.phone || '',
      role: employee.role || 'staff',
      department: employee.department || '',
      status: employee.status || 'active',
      position: employee.position || ''
    });
    setShowModal(true);
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || emp.role === filterRole;
    const matchesStatus = filterStatus === 'all' || emp.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = [
    {
      label: 'Total Team Members',
      value: employees.length,
      icon: Users,
      change: 5
    },
    {
      label: 'Active',
      value: employees.filter(e => e.status === 'active').length,
      icon: UserCheck
    },
    {
      label: 'Inactive',
      value: employees.filter(e => e.status === 'inactive').length,
      icon: UserX
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading team members..." />
      </div>
    );
  }

  return (
    <ModernPageWrapper>
      <ModernPageHeader
        title="Team Management"
        subtitle="Manage your team members and their roles"
        icon={Users}
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
            Add Team Member
          </ModernButton>
        }
      />

      <ModernSection title="Team Members" icon={Users}>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <ModernInput
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2.5 bg-white/[0.03] rounded-xl border border-white/[0.08] text-white text-sm focus:outline-none focus:border-cyan-500/50"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="ops">Operations</option>
              <option value="manager">Manager</option>
              <option value="staff">Staff</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 bg-white/[0.03] rounded-xl border border-white/[0.08] text-white text-sm focus:outline-none focus:border-cyan-500/50"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredEmployees.map((employee, index) => (
              <motion.div
                key={employee.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard hover className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                        {employee.full_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-white">
                          {employee.full_name || 'Unknown'}
                        </h3>
                        <p className="text-xs text-gray-400">
                          {employee.position || 'No position'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <ModernButton
                        variant="ghost"
                        size="sm"
                        icon={Edit2}
                        onClick={() => openEditModal(employee)}
                      />
                      <ModernButton
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDelete(employee.id)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{employee.email || 'No email'}</span>
                    </div>
                    {employee.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Phone className="w-4 h-4" />
                        <span>{employee.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <ModernBadge variant={roleConfig[employee.role]?.variant || 'default'}>
                      {roleConfig[employee.role]?.label || employee.role}
                    </ModernBadge>
                    <ModernBadge variant={statusConfig[employee.status]?.variant || 'default'}>
                      {statusConfig[employee.status]?.label || employee.status}
                    </ModernBadge>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No team members found</p>
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
              className="w-full max-w-2xl bg-gray-900/95 backdrop-blur-2xl border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/[0.08]">
                <h2 className="text-xl font-semibold text-white">
                  {editingEmployee ? 'Edit Team Member' : 'Add Team Member'}
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
                    label="Full Name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Enter full name"
                    required
                  />
                  <ModernInput
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email"
                    icon={Mail}
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
                    label="Position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="Enter position"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/[0.03] rounded-xl border border-white/[0.08] text-white focus:outline-none focus:border-cyan-500/50"
                      required
                    >
                      <option value="staff">Staff</option>
                      <option value="manager">Manager</option>
                      <option value="ops">Operations</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
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
                    {editingEmployee ? 'Update' : 'Add'} Team Member
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
