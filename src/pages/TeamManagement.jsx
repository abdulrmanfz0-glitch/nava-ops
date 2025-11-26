// NAVA OPS - Team Management (Ultra Modern UI)
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import {
  ModernCard,
  KPIWidget,
  SectionTitle,
  StatBadge,
  SearchBar,
  NeoButton,
  Modal
} from '@/components/nava-ui';
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
      <div className="flex items-center justify-center min-h-screen bg-[#0A0E1A]">
        <LoadingSpinner size="lg" text="Loading team members..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      {/* Page Content */}
      <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <SectionTitle
              title="Team Management"
              subtitle="Manage your team members and their roles"
              icon={Users}
              accent="cyan"
            />
            <NeoButton
              variant="primary"
              icon={Plus}
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
            >
              Add Team Member
            </NeoButton>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ModernCard variant="glass" glow glowColor="cyan">
              <KPIWidget
                title="Total Team Members"
                value={employees.length}
                icon={Users}
                iconColor="text-cyan-400"
                trend="up"
                trendValue={5}
                animated
              />
            </ModernCard>
            <ModernCard variant="glass" glow glowColor="teal">
              <KPIWidget
                title="Active Members"
                value={employees.filter(e => e.status === 'active').length}
                icon={UserCheck}
                iconColor="text-green-400"
                animated
              />
            </ModernCard>
            <ModernCard variant="glass" glow glowColor="purple">
              <KPIWidget
                title="Inactive Members"
                value={employees.filter(e => e.status === 'inactive').length}
                icon={UserX}
                iconColor="text-red-400"
                animated
              />
            </ModernCard>
          </div>

          {/* Team Members Section */}
          <ModernCard variant="glass">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                Team Members
              </h3>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <SearchBar
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    size="md"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50 backdrop-blur-xl"
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
                    className="px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50 backdrop-blur-xl"
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
                      <ModernCard variant="glass" hoverable className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg shadow-cyan-500/30">
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
                            <NeoButton
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditModal(employee)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </NeoButton>
                            <NeoButton
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(employee.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </NeoButton>
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
                          <StatBadge
                            label={roleConfig[employee.role]?.label || employee.role}
                            variant={
                              employee.role === 'admin' ? 'primary' :
                              employee.role === 'manager' ? 'success' :
                              employee.role === 'ops' ? 'info' :
                              'default'
                            }
                            glow
                          />
                          <StatBadge
                            label={statusConfig[employee.status]?.label || employee.status}
                            variant={employee.status === 'active' ? 'success' : 'danger'}
                            glow
                          />
                        </div>
                      </ModernCard>
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
            </div>
          </ModernCard>
        </div>

        {/* Add/Edit Modal */}
        <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingEmployee ? 'Edit Team Member' : 'Add Team Member'}
        size="xl"
        footer={
          <div className="flex justify-end gap-3">
            <NeoButton
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </NeoButton>
            <NeoButton variant="primary" onClick={handleSubmit}>
              {editingEmployee ? 'Update' : 'Add'} Team Member
            </NeoButton>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Enter full name"
                required
                className="w-full px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 backdrop-blur-xl"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 backdrop-blur-xl"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 backdrop-blur-xl"
                />
              </div>
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Position</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="Enter position"
                className="w-full px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 backdrop-blur-xl"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Role *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-white focus:outline-none focus:border-cyan-500/50 backdrop-blur-xl"
                required
              >
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
                <option value="ops">Operations</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-white focus:outline-none focus:border-cyan-500/50 backdrop-blur-xl"
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
