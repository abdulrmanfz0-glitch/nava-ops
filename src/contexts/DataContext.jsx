// src/contexts/DataContext.jsx - SaaS Data Management Context (NO FOOD/RESTAURANT FIELDS)
import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  // SIMPLE DATA MODEL - NO FOOD, NO RESTAURANT FIELDS
  const [dataEntries, setDataEntries] = useState([
    {
      id: 1,
      name: 'Analytics Platform Alpha',
      description: 'Enterprise-grade analytics solution with real-time insights',
      category: 'Analytics',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
      status: 'active',
      branchId: 1,
      performance: 95,
      usage: 245,
      rating: 4.8,
      tags: ['analytics', 'enterprise', 'real-time'],
      createdAt: '2024-01-15',
      updatedAt: '2025-01-10'
    },
    {
      id: 2,
      name: 'Data Integration Service',
      description: 'Cloud-based data integration and ETL platform',
      category: 'Services',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
      status: 'active',
      branchId: 1,
      performance: 88,
      usage: 450,
      rating: 4.6,
      tags: ['integration', 'cloud', 'ETL'],
      createdAt: '2024-02-01',
      updatedAt: '2025-01-11'
    },
    {
      id: 3,
      name: 'AI Prediction Engine',
      description: 'Machine learning platform for business forecasting',
      category: 'AI/ML',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400',
      status: 'active',
      branchId: 1,
      performance: 98,
      usage: 380,
      rating: 4.9,
      tags: ['AI', 'ML', 'forecasting'],
      createdAt: '2024-01-20',
      updatedAt: '2025-01-12'
    },
    {
      id: 4,
      name: 'Dashboard Builder Pro',
      description: 'Visual dashboard creation and customization tool',
      category: 'Tools',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
      status: 'active',
      branchId: 2,
      performance: 92,
      usage: 290,
      rating: 4.7,
      tags: ['dashboard', 'visualization', 'builder'],
      createdAt: '2024-03-01',
      updatedAt: '2025-01-09'
    },
    {
      id: 5,
      name: 'Workflow Automation Suite',
      description: 'Business process automation and orchestration',
      category: 'Automation',
      image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400',
      status: 'active',
      branchId: 2,
      performance: 75,
      usage: 320,
      rating: 4.5,
      tags: ['automation', 'workflow', 'orchestration'],
      createdAt: '2024-02-15',
      updatedAt: '2025-01-08'
    },
    {
      id: 6,
      name: 'Data Sync Module',
      description: 'Real-time data synchronization across systems',
      category: 'Integration',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
      status: 'active',
      branchId: 2,
      performance: 85,
      usage: 520,
      rating: 4.4,
      tags: ['sync', 'real-time', 'integration'],
      createdAt: '2024-01-10',
      updatedAt: '2025-01-13'
    },
    {
      id: 7,
      name: 'API Gateway Pro',
      description: 'Enterprise API management and security gateway',
      category: 'Infrastructure',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400',
      status: 'active',
      branchId: 3,
      performance: 90,
      usage: 680,
      rating: 4.7,
      tags: ['API', 'gateway', 'security'],
      createdAt: '2024-01-05',
      updatedAt: '2025-01-13'
    },
    {
      id: 8,
      name: 'Reporting Framework',
      description: 'Comprehensive reporting and data export framework',
      category: 'Reporting',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400',
      status: 'active',
      branchId: 3,
      performance: 82,
      usage: 210,
      rating: 4.6,
      tags: ['reporting', 'export', 'analytics'],
      createdAt: '2024-02-20',
      updatedAt: '2025-01-07'
    }
  ]);

  const [categories, setCategories] = useState([
    'Analytics',
    'Services',
    'AI/ML',
    'Tools',
    'Automation',
    'Integration',
    'Infrastructure',
    'Reporting'
  ]);

  const [branches, setBranches] = useState([
    {
      id: 1,
      name: 'North Region Hub',
      location: 'Riyadh, Saudi Arabia',
      manager: 'Ahmed Al-Salem',
      performanceScore: 92,
      status: 'active',
      createdAt: '2024-01-01'
    },
    {
      id: 2,
      name: 'West Region Hub',
      location: 'Jeddah, Saudi Arabia',
      manager: 'Fatima Al-Zahrani',
      performanceScore: 88,
      status: 'active',
      createdAt: '2024-01-15'
    },
    {
      id: 3,
      name: 'East Region Hub',
      location: 'Dammam, Saudi Arabia',
      manager: 'Mohammed Al-Qahtani',
      performanceScore: 85,
      status: 'active',
      createdAt: '2024-02-01'
    }
  ]);

  // Load from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem('nava_data_entries');
    const savedCategories = localStorage.getItem('nava_categories');
    const savedBranches = localStorage.getItem('nava_branches');

    if (savedEntries) {
      try {
        setDataEntries(JSON.parse(savedEntries));
      } catch (error) {
        console.error('Error loading data entries:', error);
      }
    }

    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories));
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    }

    if (savedBranches) {
      try {
        setBranches(JSON.parse(savedBranches));
      } catch (error) {
        console.error('Error loading branches:', error);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('nava_data_entries', JSON.stringify(dataEntries));
  }, [dataEntries]);

  useEffect(() => {
    localStorage.setItem('nava_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('nava_branches', JSON.stringify(branches));
  }, [branches]);

  // Data Entry Management
  const addDataEntry = (entry) => {
    const newEntry = {
      ...entry,
      id: Date.now(),
      performance: 0,
      usage: 0,
      rating: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setDataEntries(prev => [...prev, newEntry]);
    return newEntry;
  };

  const updateDataEntry = (id, updates) => {
    setDataEntries(prev => prev.map(entry =>
      entry.id === id
        ? { ...entry, ...updates, updatedAt: new Date().toISOString().split('T')[0] }
        : entry
    ));
  };

  const deleteDataEntry = (id) => {
    setDataEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const toggleStatus = (id) => {
    setDataEntries(prev => prev.map(entry =>
      entry.id === id
        ? {
            ...entry,
            status: entry.status === 'active' ? 'inactive' : 'active',
            updatedAt: new Date().toISOString().split('T')[0]
          }
        : entry
    ));
  };

  const getDataEntry = (id) => {
    return dataEntries.find(entry => entry.id === id);
  };

  const getEntriesByCategory = (category) => {
    return dataEntries.filter(entry => entry.category === category);
  };

  const getEntriesByBranch = (branchId) => {
    return dataEntries.filter(entry => entry.branchId === branchId);
  };

  // Statistics
  const getStatistics = () => {
    const totalUsage = dataEntries.reduce((sum, entry) => sum + (entry.usage || 0), 0);
    const avgRating = dataEntries.length > 0
      ? dataEntries.reduce((sum, entry) => sum + (entry.rating || 0), 0) / dataEntries.length
      : 0;
    const avgPerformance = dataEntries.length > 0
      ? dataEntries.reduce((sum, entry) => sum + (entry.performance || 0), 0) / dataEntries.length
      : 0;

    return {
      totalEntries: dataEntries.length,
      totalUsage,
      avgRating,
      avgPerformance,
      activeEntries: dataEntries.filter(e => e.status === 'active').length
    };
  };

  const getBranchStatistics = (branchId) => {
    const branchEntries = getEntriesByBranch(branchId);
    const totalUsage = branchEntries.reduce((sum, entry) => sum + (entry.usage || 0), 0);
    const avgRating = branchEntries.length > 0
      ? branchEntries.reduce((sum, entry) => sum + (entry.rating || 0), 0) / branchEntries.length
      : 0;

    return {
      totalEntries: branchEntries.length,
      totalUsage,
      avgRating,
      activeEntries: branchEntries.filter(e => e.status === 'active').length
    };
  };

  // Category Management
  const addCategory = (category) => {
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category]);
    }
  };

  const deleteCategory = (category, reassignTo) => {
    setCategories(prev => prev.filter(cat => cat !== category));
    if (reassignTo) {
      setDataEntries(prev => prev.map(entry =>
        entry.category === category
          ? { ...entry, category: reassignTo, updatedAt: new Date().toISOString().split('T')[0] }
          : entry
      ));
    }
  };

  // Branch Management
  const addBranch = (branch) => {
    const newBranch = {
      ...branch,
      id: Date.now(),
      performanceScore: branch.performanceScore || 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setBranches(prev => [...prev, newBranch]);
    return newBranch;
  };

  const updateBranch = (id, updates) => {
    setBranches(prev => prev.map(branch =>
      branch.id === id ? { ...branch, ...updates } : branch
    ));
  };

  const deleteBranch = (id) => {
    setBranches(prev => prev.filter(branch => branch.id !== id));
  };

  const getBranch = (id) => {
    return branches.find(branch => branch.id === id);
  };

  const value = {
    dataEntries,
    categories,
    branches,
    addDataEntry,
    updateDataEntry,
    deleteDataEntry,
    toggleStatus,
    getDataEntry,
    getEntriesByCategory,
    getEntriesByBranch,
    getStatistics,
    getBranchStatistics,
    addCategory,
    deleteCategory,
    addBranch,
    updateBranch,
    deleteBranch,
    getBranch
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
