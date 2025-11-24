// src/components/team/TeamManagement.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { exportUtils } from '@/utils/exportUtils';
import logger from '@/lib/logger';
import { 
  Plus, Edit2, Trash2, Mail, Phone, Calendar, UserPlus, Search, Filter, 
  Download, FileText, Eye, MoreVertical, UserCheck, UserX, Shield,
  BarChart3, Users, Target, TrendingUp, Send, Key, Clock
} from 'lucide-react';

export default function TeamManagement() {
  const { user, userProfile, hasPermission } = useAuth();
  const { addNotification } = useNotification();
  const [employees, setEmployees] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(null);
  
  // Advanced filters
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    status: 'all',
    brand: 'all',
    department: 'all'
  });

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    role: 'staff',
    department: '',
    status: 'active',
    join_date: '',
    salary: '',
    notes: '',
    brand_id: userProfile?.brand_id || '',
    permissions: [],
    address: '',
    emergency_contact: '',
    position: ''
  });

  const roleConfig = {
    admin: {
      label: 'System Admin',
      color: 'bg-purple-100 text-purple-700 border-purple-300',
      level: 5,
      icon: Shield,
      permissions: ['all']
    },
    ops: {
      label: 'Operations Supervisor',
      color: 'bg-blue-100 text-blue-700 border-blue-300',
      level: 4,
      icon: Target,
      permissions: ['restaurants:manage', 'team:view', 'reports:view', 'tasks:manage']
    },
    manager: {
      label: 'Branch Manager',
      color: 'bg-green-100 text-green-700 border-green-300',
      level: 3,
      icon: Users,
      permissions: ['restaurants:view', 'team:view', 'reports:view', 'tasks:manage']
    },
    accountant: {
      label: 'Accountant',
      color: 'bg-amber-100 text-amber-700 border-amber-300',
      level: 2,
      icon: BarChart3,
      permissions: ['financial:view', 'reports:view']
    },
    analyst: {
      label: 'Data Analyst',
      color: 'bg-indigo-100 text-indigo-700 border-indigo-300',
      level: 2,
      icon: TrendingUp,
      permissions: ['reports:view', 'analytics:view']
    },
    staff: {
      label: 'Staff',
      color: 'bg-gray-100 text-gray-700 border-gray-300',
      level: 1,
      icon: UserCheck,
      permissions: ['dashboard:view']
    }
  };

  const departmentConfig = {
    management: 'Management',
    operations: 'Operations',
    finance: 'Finance',
    marketing: 'Marketing',
    hr: 'Human Resources',
    it: 'Information Technology',
    sales: 'Sales',
    support: 'Support'
  };

  // Fetch employee data with live updates
  useEffect(() => {
    fetchEmployees();
    fetchBrands();
    setupRealtimeSubscription();
  }, []);

  const fetchEmployees = async () => {
    try {
      let query = supabase
        .from('user_profiles')
        .select(`
          *,
          auth_user:auth.users(email, last_sign_in_at, email_confirmed_at),
          brand:brands(id, name, logo_url),
          tasks:tasks(count),
          completed_tasks:tasks!completed(count)
        `);

      // Apply user permissions
      if (userProfile?.role === 'ops' && userProfile?.brand_id) {
        query = query.eq('brand_id', userProfile.brand_id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      logger.error('Error fetching employees', { error: error.message });
      addNotification({
        type: 'error',
        title: 'Data Fetch Error',
        message: 'Failed to load employee list'
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
      logger.error('Error fetching brands', { error: error.message });
    }
  };

  // Live updates for employees
  const setupRealtimeSubscription = () => {
    const subscription = supabase
      .channel('employees-changes')
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'user_profiles'
        },
        (payload) => {
          logger.debug('Employee change received', { payload });
          fetchEmployees();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  // Create or update employee
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingEmployee) {
        // Update existing employee
        const { error } = await supabase
          .from('user_profiles')
          .update({
            ...form,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingEmployee.id);

        if (error) throw error;

        addNotification({
          type: 'success',
          title: 'Updated Successfully',
          message: 'Employee data has been updated successfully'
        });
      } else {
        // Create new employee
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: form.email,
          password: generateTemporaryPassword(),
          options: {
            data: {
              full_name: form.full_name,
              role: form.role,
              brand_id: form.brand_id
            }
          }
        });

        if (authError) throw authError;

        // Update profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .update({
            full_name: form.full_name,
            phone: form.phone,
            role: form.role,
            department: form.department,
            status: form.status,
            join_date: form.join_date,
            salary: form.salary ? Number(form.salary) : null,
            notes: form.notes,
            brand_id: form.brand_id,
            address: form.address,
            emergency_contact: form.emergency_contact,
            position: form.position,
            permissions: form.permissions
          })
          .eq('id', authData.user.id);

        if (profileError) throw profileError;

        addNotification({
          type: 'success',
          title: 'Created Successfully',
          message: 'Employee account has been created successfully'
        });
      }

      await fetchEmployees();
      resetForm();
    } catch (error) {
      logger.error('Error saving employee', { error: error.message });
      addNotification({
        type: 'error',
        title: 'Save Error',
        message: 'Failed to save employee data'
      });
    }
  };

  // Generate temporary password
  const generateTemporaryPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // Reset password
  const resetPassword = async (employeeId, employeeEmail) => {
    if (!confirm(`Do you want to reset the password for ${employeeEmail}?`)) return;

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(employeeEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Reset Link Sent',
        message: 'Password reset link has been sent to the email address'
      });
    } catch (error) {
      logger.error('Error resetting password', { error: error.message });
      addNotification({
        type: 'error',
        title: 'Reset Error',
        message: 'Failed to send password reset link'
      });
    }
  };

  // Toggle employee status
  const toggleEmployeeStatus = async (employeeId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', employeeId);

      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Status Changed',
        message: `Employee account has been ${newStatus === 'active' ? 'activated' : 'deactivated'}`
      });

      await fetchEmployees();
    } catch (error) {
      logger.error('Error updating employee status', { error: error.message });
      addNotification({
        type: 'error',
        title: 'Update Error',
        message: 'Failed to change employee status'
      });
    }
  };

  // Edit employee
  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setForm({
      full_name: employee.full_name || '',
      email: employee.auth_user?.email || '',
      phone: employee.phone || '',
      role: employee.role || 'staff',
      department: employee.department || '',
      status: employee.status || 'active',
      join_date: employee.join_date || '',
      salary: employee.salary || '',
      notes: employee.notes || '',
      brand_id: employee.brand_id || userProfile?.brand_id || '',
      permissions: employee.permissions || [],
      address: employee.address || '',
      emergency_contact: employee.emergency_contact || '',
      position: employee.position || ''
    });
    setShowEmployeeForm(true);
  };

  const resetForm = () => {
    setForm({
      full_name: '',
      email: '',
      phone: '',
      role: 'staff',
      department: '',
      status: 'active',
      join_date: '',
      salary: '',
      notes: '',
      brand_id: userProfile?.brand_id || '',
      permissions: [],
      address: '',
      emergency_contact: '',
      position: ''
    });
    setEditingEmployee(null);
    setShowEmployeeForm(false);
  };

  // Export data
  const handleExportCSV = () => {
    const rows = filteredEmployees.map(employee => ({
      'ID': employee.id,
      'Name': employee.full_name,
      'Email': employee.auth_user?.email,
      'Phone': employee.phone,
      'Role': roleConfig[employee.role]?.label,
      'Department': departmentConfig[employee.department] || employee.department,
      'Branch': employee.brand?.name,
      'Status': employee.status === 'active' ? 'Active' : 'Inactive',
      'Join Date': employee.join_date ? formatDate(employee.join_date) : '',
      'Last Login': employee.auth_user?.last_sign_in_at ? formatDateTime(employee.auth_user.last_sign_in_at) : '',
      'Tasks Count': employee.tasks?.[0]?.count || 0
    }));

    exportUtils.exportToCSV(rows, `nava_employees_${formatDate(new Date())}`);
  };

  const handleExportPDF = () => {
    exportUtils.exportToPDF("#team-root", `employees_report_${formatDate(new Date())}`);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate work duration
  const getWorkDuration = (joinDate) => {
    if (!joinDate) return '-';

    const join = new Date(joinDate);
    const now = new Date();
    const diffTime = Math.abs(now - join);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);

    if (years > 0) {
      return `${years} year(s) and ${months} month(s)`;
    } else {
      return `${months} month(s)`;
    }
  };

  // Filter data
  const filteredEmployees = useMemo(() => {
    let data = [...employees];

    // Search
    if (filters.search.trim()) {
      const query = filters.search.toLowerCase();
      data = data.filter(employee =>
        employee.full_name?.toLowerCase().includes(query) ||
        employee.auth_user?.email?.toLowerCase().includes(query) ||
        employee.department?.toLowerCase().includes(query) ||
        employee.position?.toLowerCase().includes(query)
      );
    }

    // Filtering
    if (filters.role !== 'all') {
      data = data.filter(employee => employee.role === filters.role);
    }

    if (filters.status !== 'all') {
      data = data.filter(employee => employee.status === filters.status);
    }

    if (filters.brand !== 'all') {
      data = data.filter(employee => employee.brand_id === filters.brand);
    }

    if (filters.department !== 'all') {
      data = data.filter(employee => employee.department === filters.department);
    }

    return data;
  }, [employees, filters]);

  // Team statistics
  const teamStats = useMemo(() => {
    const total = employees.length;
    const active = employees.filter(e => e.status === 'active').length;
    const admins = employees.filter(e => e.role === 'admin' || e.role === 'ops').length;
    const newThisMonth = employees.filter(e => {
      const joinDate = new Date(e.join_date);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return joinDate > monthAgo;
    }).length;

    return { total, active, admins, newThisMonth };
  }, [employees]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading team data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" id="team-root">
      {/* Main card */}
      <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-200">

        {/* Enhanced header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team & Employee Management</h1>
            <p className="text-gray-600 mt-1">Manage team members, permissions, and performance reports</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {hasPermission(['team:create']) && (
              <button
                className="btn-primary flex items-center gap-2"
                onClick={() => setShowEmployeeForm(true)}
              >
                <UserPlus size={18} />
                Add New Employee
              </button>
            )}
            <button
              onClick={handleExportCSV}
              className="btn-success flex items-center gap-2"
            >
              <Download size={18} />
              Export CSV
            </button>
            <button
              onClick={handleExportPDF}
              className="btn-secondary flex items-center gap-2"
            >
              <FileText size={18} />
              Export PDF
            </button>
          </div>
        </div>

        {/* Enhanced statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Employees"
            value={teamStats.total}
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Active Employees"
            value={teamStats.active}
            icon={UserCheck}
            color="green"
            percentage={teamStats.total > 0 ? (teamStats.active / teamStats.total) * 100 : 0}
          />
          <StatCard
            title="Supervisors"
            value={teamStats.admins}
            icon={Shield}
            color="purple"
          />
          <StatCard
            title="New This Month"
            value={teamStats.newThisMonth}
            icon={TrendingUp}
            color="amber"
          />
        </div>

        {/* Advanced filter bar */}
        <AdvancedFilterBar
          filters={filters}
          setFilters={setFilters}
          employees={employees}
          brands={brands}
        />

        {/* Enhanced employee table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title & Branch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role & Permissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status & Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <EmployeeTableRow 
                  key={employee.id}
                  employee={employee}
                  roleConfig={roleConfig}
                  departmentConfig={departmentConfig}
                  formatDate={formatDate}
                  formatDateTime={formatDateTime}
                  getWorkDuration={getWorkDuration}
                  onEdit={handleEdit}
                  onToggleStatus={toggleEmployeeStatus}
                  onResetPassword={resetPassword}
                  onViewDetails={setShowEmployeeDetails}
                  hasPermission={hasPermission}
                  currentUserId={user?.id}
                />
              ))}
              
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Users size={48} className="text-gray-300 mb-4" />
                      <p className="text-lg">No employees match the search criteria</p>
                      <p className="text-sm mt-2">Try adjusting search terms or add a new employee</p>
                      {hasPermission(['team:create']) && (
                        <button
                          className="btn-primary mt-4"
                          onClick={() => setShowEmployeeForm(true)}
                        >
                          Add First Employee
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit employee modal */}
      <EmployeeFormModal
        show={showEmployeeForm}
        onClose={resetForm}
        form={form}
        setForm={setForm}
        editingEmployee={editingEmployee}
        onSubmit={handleSubmit}
        roleConfig={roleConfig}
        departmentConfig={departmentConfig}
        brands={brands}
        userProfile={userProfile}
      />

      {/* Employee details modal */}
      <EmployeeDetailsModal
        show={!!showEmployeeDetails}
        employee={showEmployeeDetails}
        onClose={() => setShowEmployeeDetails(null)}
        roleConfig={roleConfig}
        departmentConfig={departmentConfig}
        formatDate={formatDate}
        formatDateTime={formatDateTime}
        getWorkDuration={getWorkDuration}
      />
    </div>
  );
}

// Separate employee row component
function EmployeeTableRow({
  employee, 
  roleConfig, 
  departmentConfig, 
  formatDate, 
  formatDateTime, 
  getWorkDuration,
  onEdit, 
  onToggleStatus, 
  onResetPassword,
  onViewDetails,
  hasPermission,
  currentUserId
}) {
  const [showMenu, setShowMenu] = useState(false);
  const RoleIcon = roleConfig[employee.role]?.icon;

  return (
    <tr key={employee.id} className="hover:bg-gray-50 transition-colors group">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <img
            src={employee.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.full_name || 'User')}&background=1E40AF&color=fff`}
            alt={employee.full_name}
            className="w-12 h-12 rounded-full ml-3"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onViewDetails(employee)}
                className="text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors text-right"
              >
                {employee.full_name}
              </button>
              {employee.auth_user?.email_confirmed_at ? (
                <span className="text-green-500 text-xs" title="Email verified">
                  ✓
                </span>
              ) : (
                <span className="text-yellow-500 text-xs" title="Awaiting email verification">
                  ⏳
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {employee.auth_user?.email}
            </div>
            {employee.phone && (
              <div className="text-xs text-gray-500 flex items-center mt-1">
                <Phone size={12} className="ml-1" />
                {employee.phone}
              </div>
            )}
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {employee.position || 'No title'}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {departmentConfig[employee.department] || employee.department || 'No department'}
        </div>
        {employee.brand && (
          <div className="text-xs text-primary-600 font-medium mt-1">
            {employee.brand.name}
          </div>
        )}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2 mb-2">
          {RoleIcon && <RoleIcon size={16} className="text-gray-400" />}
          <span className={`px-3 py-1 text-xs rounded-full border ${roleConfig[employee.role]?.color || roleConfig.staff.color}`}>
            {roleConfig[employee.role]?.label || employee.role}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          {employee.permissions?.length > 0
            ? `${employee.permissions.length} permission(s)`
            : 'Basic permissions'
          }
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col gap-2">
          <span className={`px-3 py-1 text-xs rounded-full w-fit ${
            employee.status === 'active'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {employee.status === 'active' ? 'Active' : 'Inactive'}
          </span>

          <div className="text-xs text-gray-500">
            <div className="flex items-center">
              <Clock size={12} className="mr-1" />
              {getWorkDuration(employee.join_date)}
            </div>
            {employee.auth_user?.last_sign_in_at && (
              <div className="mt-1">
                Last login: {formatDateTime(employee.auth_user.last_sign_in_at)}
              </div>
            )}
          </div>

          {employee.tasks && (
            <div className="text-xs text-gray-500">
              Tasks: {employee.tasks[0]?.count || 0}
            </div>
          )}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewDetails(employee)}
            className="text-gray-600 hover:text-gray-800 p-2 rounded hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
            title="View details"
          >
            <Eye size={16} />
          </button>

          {/* Actions menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-600 hover:text-gray-800 p-2 rounded hover:bg-gray-100 transition-colors"
              title="More"
            >
              <MoreVertical size={16} />
            </button>
            
            {showMenu && (
              <div className="absolute left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                {hasPermission(['team:edit']) && employee.id !== currentUserId && (
                  <button
                    onClick={() => {
                      onEdit(employee);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
                  >
                    <Edit2 size={14} />
                    Edit Data
                  </button>
                )}

                {hasPermission(['team:edit']) && employee.id !== currentUserId && (
                  <button
                    onClick={() => {
                      onToggleStatus(employee.id, employee.status);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {employee.status === 'active' ? <UserX size={14} /> : <UserCheck size={14} />}
                    {employee.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                )}

                {hasPermission(['auth:manage']) && (
                  <button
                    onClick={() => {
                      onResetPassword(employee.id, employee.auth_user?.email);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Key size={14} />
                    Reset Password
                  </button>
                )}

                {hasPermission(['team:delete']) && employee.id !== currentUserId && (
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${employee.full_name}?`)) {
                        // Deletion will be executed by changing status
                        onToggleStatus(employee.id, 'active');
                      }
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                  >
                    <Trash2 size={14} />
                    Delete Employee
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

// Statistics card component
function StatCard({ title, value, icon: Icon, color, percentage }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700'
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">{title}</div>
          <div className="text-2xl font-bold mt-1">{value}</div>
          {percentage !== undefined && (
            <div className="text-xs mt-1 opacity-75">
              {percentage.toFixed(1)}%
            </div>
          )}
        </div>
        <Icon size={24} className="opacity-50" />
      </div>
    </div>
  );
}

// Advanced filter bar component
function AdvancedFilterBar({ filters, setFilters, employees, brands }) {
  const departments = [...new Set(employees.map(e => e.department).filter(Boolean))];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search for employee..."
          className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
      </div>

      <select
        className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
        value={filters.role}
        onChange={(e) => setFilters({ ...filters, role: e.target.value })}
      >
        <option value="all">All Roles</option>
        <option value="admin">System Admin</option>
        <option value="ops">Operations Supervisor</option>
        <option value="manager">Branch Manager</option>
        <option value="accountant">Accountant</option>
        <option value="analyst">Data Analyst</option>
        <option value="staff">Staff</option>
      </select>

      <select
        className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
      >
        <option value="all">All Statuses</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      <select
        className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
        value={filters.brand}
        onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
      >
        <option value="all">All Branches</option>
        {brands.map(brand => (
          <option key={brand.id} value={brand.id}>
            {brand.name}
          </option>
        ))}
      </select>

      <select
        className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
        value={filters.department}
        onChange={(e) => setFilters({ ...filters, department: e.target.value })}
      >
        <option value="all">All Departments</option>
        {departments.map(dept => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>
    </div>
  );
}

// Enhanced form modal component
function EmployeeFormModal({
  show,
  onClose,
  form,
  setForm,
  editingEmployee,
  onSubmit,
  roleConfig,
  departmentConfig,
  brands,
  userProfile
}) {
  if (!show) return null;

  const isOpsUser = userProfile?.role === 'ops';

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm grid place-items-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingEmployee ? 'Edit Employee Data' : 'Add New Employee'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">
          {/* Basic information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                className="w-full input-field"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                className="w-full input-field"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                disabled={!!editingEmployee}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                className="w-full input-field"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+966 5X XXX XXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
              <input
                type="text"
                className="w-full input-field"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                placeholder="e.g., Sales Manager, Senior Accountant..."
              />
            </div>
          </div>

          {/* Job information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
              <select
                className="w-full input-field"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                required
              >
                <option value="staff">Staff</option>
                <option value="analyst">Data Analyst</option>
                <option value="accountant">Accountant</option>
                <option value="manager">Branch Manager</option>
                {userProfile?.role === 'admin' && (
                  <>
                    <option value="ops">Operations Supervisor</option>
                    <option value="admin">System Admin</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                className="w-full input-field"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
              >
                <option value="">Select Department</option>
                {Object.entries(departmentConfig).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full input-field"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
              <select
                className="w-full input-field"
                value={form.brand_id}
                onChange={(e) => setForm({ ...form, brand_id: e.target.value })}
                disabled={isOpsUser}
              >
                <option value="">Select Branch</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
              {isOpsUser && (
                <p className="text-xs text-gray-500 mt-1">Automatically set based on your branch</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
              <input
                type="date"
                className="w-full input-field"
                value={form.join_date}
                onChange={(e) => setForm({ ...form, join_date: e.target.value })}
              />
            </div>
          </div>

          {/* Financial and additional information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Salary</label>
              <input
                type="number"
                className="w-full input-field"
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
                placeholder="Salary in SAR"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
              <input
                type="text"
                className="w-full input-field"
                value={form.emergency_contact}
                onChange={(e) => setForm({ ...form, emergency_contact: e.target.value })}
                placeholder="Name and phone number"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              className="w-full input-field"
              rows={2}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Detailed address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              className="w-full input-field"
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Additional notes about the employee..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary px-6 py-2"
            >
              {editingEmployee ? 'Update Data' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Employee details component
function EmployeeDetailsModal({ show, employee, onClose, roleConfig, departmentConfig, formatDate, formatDateTime, getWorkDuration }) {
  if (!show || !employee) return null;

  const RoleIcon = roleConfig[employee.role]?.icon;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm grid place-items-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h3 className="text-lg font-semibold text-gray-900">Employee Details</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Photo and basic information */}
          <div className="flex items-center gap-4">
            <img
              src={employee.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.full_name || 'User')}&background=1E40AF&color=fff&size=100`}
              alt={employee.full_name}
              className="w-20 h-20 rounded-full"
            />
            <div className="flex-1">
              <h4 className="text-xl font-bold text-gray-900">{employee.full_name}</h4>
              <div className="flex items-center gap-2 mt-1">
                {RoleIcon && <RoleIcon size={16} className="text-gray-400" />}
                <span className={`px-3 py-1 text-sm rounded-full border ${roleConfig[employee.role]?.color}`}>
                  {roleConfig[employee.role]?.label}
                </span>
                <span className={`px-3 py-1 text-sm rounded-full ${
                  employee.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {employee.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal information */}
            <div className="space-y-4">
              <h5 className="font-semibold text-gray-900 border-b pb-2">Personal Information</h5>

              <div>
                <label className="text-sm text-gray-600">Email</label>
                <p className="text-gray-900">{employee.auth_user?.email}</p>
              </div>

              {employee.phone && (
                <div>
                  <label className="text-sm text-gray-600">Phone Number</label>
                  <p className="text-gray-900">{employee.phone}</p>
                </div>
              )}

              {employee.address && (
                <div>
                  <label className="text-sm text-gray-600">Address</label>
                  <p className="text-gray-900">{employee.address}</p>
                </div>
              )}

              {employee.emergency_contact && (
                <div>
                  <label className="text-sm text-gray-600">Emergency Contact</label>
                  <p className="text-gray-900">{employee.emergency_contact}</p>
                </div>
              )}
            </div>

            {/* Job information */}
            <div className="space-y-4">
              <h5 className="font-semibold text-gray-900 border-b pb-2">Job Information</h5>

              {employee.position && (
                <div>
                  <label className="text-sm text-gray-600">Job Title</label>
                  <p className="text-gray-900">{employee.position}</p>
                </div>
              )}

              {employee.department && (
                <div>
                  <label className="text-sm text-gray-600">Department</label>
                  <p className="text-gray-900">{departmentConfig[employee.department] || employee.department}</p>
                </div>
              )}

              {employee.brand && (
                <div>
                  <label className="text-sm text-gray-600">Branch</label>
                  <p className="text-gray-900">{employee.brand.name}</p>
                </div>
              )}

              <div>
                <label className="text-sm text-gray-600">Work Duration</label>
                <p className="text-gray-900">{getWorkDuration(employee.join_date)}</p>
              </div>

              {employee.join_date && (
                <div>
                  <label className="text-sm text-gray-600">Join Date</label>
                  <p className="text-gray-900">{formatDate(employee.join_date)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Activity and statistics */}
          <div className="space-y-4">
            <h5 className="font-semibold text-gray-900 border-b pb-2">Activity & Statistics</h5>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <label className="text-sm text-gray-600">Last Login</label>
                <p className="text-gray-900 text-sm">
                  {employee.auth_user?.last_sign_in_at
                    ? formatDateTime(employee.auth_user.last_sign_in_at)
                    : 'Not logged in yet'
                  }
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <label className="text-sm text-gray-600">Email Verification</label>
                <p className="text-gray-900 text-sm">
                  {employee.auth_user?.email_confirmed_at ? 'Verified' : 'Awaiting Verification'}
                </p>
              </div>
            </div>

            {employee.tasks && (
              <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
                <h6 className="font-semibold text-primary-700 mb-2">Task Statistics</h6>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-primary-600">Total Tasks:</span>
                    <span className="font-medium ml-2">{employee.tasks[0]?.count || 0}</span>
                  </div>
                  <div>
                    <span className="text-primary-600">Completed Tasks:</span>
                    <span className="font-medium ml-2">{employee.completed_tasks[0]?.count || 0}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {employee.notes && (
            <div className="space-y-2">
              <h5 className="font-semibold text-gray-900 border-b pb-2">Notes</h5>
              <p className="text-gray-700 text-sm leading-relaxed">{employee.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
 
