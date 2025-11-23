// Mock Data for Development Mode
// Used when Supabase is not configured

export const mockBranches = [
  {
    id: 1,
    name: 'Riyadh Main Branch',
    location: 'Riyadh, Al-Nakheel District',
    status: 'active',
    revenue: 125000,
    orders_count: 450,
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    name: 'Jeddah Branch',
    location: 'Jeddah, Al-Rawdah District',
    status: 'active',
    revenue: 98000,
    orders_count: 380,
    created_at: '2024-02-20T10:00:00Z'
  },
  {
    id: 3,
    name: 'Dammam Branch',
    location: 'Dammam, Corniche',
    status: 'active',
    revenue: 87000,
    orders_count: 320,
    created_at: '2024-03-10T10:00:00Z'
  }
];

export const mockOrders = Array.from({ length: 150 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(i / 5));

  const channels = ['dine_in', 'takeout', 'delivery'];
  const channel = channels[Math.floor(Math.random() * 3)];

  // Channel-specific pricing adjustments
  let baseTotal = 150;
  if (channel === 'dine_in') baseTotal = 180 + Math.floor(Math.random() * 200);
  if (channel === 'takeout') baseTotal = 120 + Math.floor(Math.random() * 180);
  if (channel === 'delivery') baseTotal = 140 + Math.floor(Math.random() * 160);

  const hour = 10 + Math.floor(Math.random() * 12);
  const minute = Math.floor(Math.random() * 60);

  return {
    id: i + 1,
    order_date: date.toISOString().split('T')[0],
    order_time: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
    total: baseTotal,
    status: 'completed',
    branch_id: Math.floor(Math.random() * 3) + 1,
    channel: channel,
    satisfaction_score: 4.0 + Math.random() * 1.0,
    items_count: Math.floor(Math.random() * 10) + 1
  };
});

export const mockRevenueTrends = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));

  return {
    order_date: date.toISOString().split('T')[0],
    total: Math.floor(Math.random() * 15000) + 5000
  };
});

export const mockInsights = [
  {
    id: 1,
    title: 'Sales Increase',
    description: 'Notable increase in sales over the past week by 15%',
    type: 'positive',
    status: 'new',
    branch: { name: 'Riyadh Main Branch' },
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    title: 'Rating Improvement',
    description: 'Customer ratings improved from 4.2 to 4.7 stars',
    type: 'positive',
    status: 'new',
    branch: { name: 'Jeddah Branch' },
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    title: 'Delivery Time Reduction',
    description: 'Average delivery time decreased from 35 minutes to 28 minutes',
    type: 'warning',
    status: 'new',
    branch: { name: 'Dammam Branch' },
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const mockDashboardOverview = {
  overview: {
    totalRevenue: 310000,
    totalOrders: 1150,
    averageOrderValue: 270,
    totalBranches: 3,
    activeBranches: 3
  },
  trends: mockRevenueTrends
};

export const mockOrderStatistics = {
  total: 1150,
  completed: 1050,
  pending: 75,
  cancelled: 25,
  averageValue: 270,
  topSellingItems: [
    { name: 'Beef Burger', quantity: 450, revenue: 67500 },
    { name: 'Margherita Pizza', quantity: 380, revenue: 57000 },
    { name: 'Beverages', quantity: 820, revenue: 16400 }
  ]
};

export const mockNotifications = [
  {
    id: 1,
    title: 'New Order',
    message: 'New order received from Riyadh branch',
    type: 'order',
    is_read: false,
    created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    title: 'Order Update',
    message: 'Order #1234 status has been updated',
    type: 'order',
    is_read: false,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    title: 'System Alert',
    message: 'A new system update is available',
    type: 'system',
    is_read: true,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  }
];

export const mockNotificationsUnreadCount = 2;

export const mockReports = [
  {
    id: 1,
    report_type: 'daily',
    status: 'completed',
    file_url: '/reports/daily-2024-01-15.pdf',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    branches: { name: 'Riyadh Main Branch' }
  },
  {
    id: 2,
    report_type: 'weekly',
    status: 'completed',
    file_url: '/reports/weekly-2024-w03.pdf',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    branches: { name: 'Jeddah Branch' }
  },
  {
    id: 3,
    report_type: 'monthly',
    status: 'pending',
    file_url: null,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    branches: { name: 'Dammam Branch' }
  }
];

export const mockTeamMembers = [
  {
    id: 1,
    member_id: 'member-1',
    role: 'manager',
    permissions: ['all'],
    branch_ids: [1],
    created_at: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    member: {
      email: 'ahmed.manager@nava-ops.com',
      full_name: 'Ahmed Manager',
      role: 'manager',
      avatar_url: null
    }
  },
  {
    id: 2,
    member_id: 'member-2',
    role: 'staff',
    permissions: ['view', 'edit'],
    branch_ids: [1, 2],
    created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    member: {
      email: 'sara.staff@nava-ops.com',
      full_name: 'Sara Staff',
      role: 'staff',
      avatar_url: null
    }
  },
  {
    id: 3,
    member_id: 'member-3',
    role: 'staff',
    permissions: ['view'],
    branch_ids: [3],
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    member: {
      email: 'mohammed.staff@nava-ops.com',
      full_name: 'Mohammed Staff',
      role: 'staff',
      avatar_url: null
    }
  }
];
