// Mock Data for Development Mode
// Used when Supabase is not configured

export const mockBranches = [
  {
    id: 1,
    name: 'فرع الرياض الرئيسي',
    location: 'الرياض، حي النخيل',
    status: 'active',
    revenue: 125000,
    orders_count: 450,
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    name: 'فرع جدة',
    location: 'جدة، حي الروضة',
    status: 'active',
    revenue: 98000,
    orders_count: 380,
    created_at: '2024-02-20T10:00:00Z'
  },
  {
    id: 3,
    name: 'فرع الدمام',
    location: 'الدمام، الكورنيش',
    status: 'active',
    revenue: 87000,
    orders_count: 320,
    created_at: '2024-03-10T10:00:00Z'
  }
];

export const mockOrders = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));

  return {
    id: i + 1,
    order_date: date.toISOString().split('T')[0],
    total: Math.floor(Math.random() * 500) + 100,
    status: 'completed',
    branch_id: Math.floor(Math.random() * 3) + 1,
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
    title: 'ارتفاع المبيعات',
    description: 'زيادة ملحوظة في المبيعات خلال الأسبوع الماضي بنسبة 15%',
    type: 'positive',
    status: 'new',
    branch: { name: 'فرع الرياض الرئيسي' },
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    title: 'تحسين في التقييمات',
    description: 'تحسن تقييمات العملاء من 4.2 إلى 4.7 نجوم',
    type: 'positive',
    status: 'new',
    branch: { name: 'فرع جدة' },
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    title: 'انخفاض في وقت التسليم',
    description: 'انخفض متوسط وقت التسليم من 35 دقيقة إلى 28 دقيقة',
    type: 'warning',
    status: 'new',
    branch: { name: 'فرع الدمام' },
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
    { name: 'برجر لحم', quantity: 450, revenue: 67500 },
    { name: 'بيتزا مارجريتا', quantity: 380, revenue: 57000 },
    { name: 'مشروبات', quantity: 820, revenue: 16400 }
  ]
};

export const mockNotifications = [
  {
    id: 1,
    title: 'طلب جديد',
    message: 'تم استلام طلب جديد من فرع الرياض',
    type: 'order',
    is_read: false,
    created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    title: 'تحديث الطلب',
    message: 'تم تحديث حالة الطلب #1234',
    type: 'order',
    is_read: false,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    title: 'تنبيه النظام',
    message: 'تحديث جديد متوفر للنظام',
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
    branches: { name: 'فرع الرياض الرئيسي' }
  },
  {
    id: 2,
    report_type: 'weekly',
    status: 'completed',
    file_url: '/reports/weekly-2024-w03.pdf',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    branches: { name: 'فرع جدة' }
  },
  {
    id: 3,
    report_type: 'monthly',
    status: 'pending',
    file_url: null,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    branches: { name: 'فرع الدمام' }
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
      full_name: 'أحمد المدير',
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
      full_name: 'سارة الموظفة',
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
      full_name: 'محمد الموظف',
      role: 'staff',
      avatar_url: null
    }
  }
];
