// src/contexts/MenuContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const MenuContext = createContext();

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};

export const MenuProvider = ({ children }) => {
  // Initialize with comprehensive menu data
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: 'Grilled Salmon',
      description: 'Fresh Atlantic salmon grilled to perfection with herbs and lemon butter',
      category: 'Main Course',
      price: 89,
      cost: 50,
      sold: 245,
      rating: 4.8,
      popularity: 95,
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
      available: true,
      preparationTime: 25,
      calories: 450,
      allergens: ['Fish'],
      createdAt: '2024-01-15',
      updatedAt: '2025-01-10'
    },
    {
      id: 2,
      name: 'Caesar Salad',
      description: 'Classic Caesar with romaine lettuce, parmesan, croutons and house dressing',
      category: 'Appetizers',
      price: 35,
      cost: 15,
      sold: 450,
      rating: 4.6,
      popularity: 88,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      available: true,
      preparationTime: 10,
      calories: 280,
      allergens: ['Dairy', 'Gluten'],
      createdAt: '2024-02-01',
      updatedAt: '2025-01-11'
    },
    {
      id: 3,
      name: 'Beef Burger',
      description: 'Premium beef patty with cheese, lettuce, tomato, and special sauce',
      category: 'Main Course',
      price: 65,
      cost: 40,
      sold: 380,
      rating: 4.9,
      popularity: 98,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      available: true,
      preparationTime: 20,
      calories: 650,
      allergens: ['Dairy', 'Gluten'],
      createdAt: '2024-01-20',
      updatedAt: '2025-01-12'
    },
    {
      id: 4,
      name: 'Chocolate Cake',
      description: 'Rich dark chocolate cake with chocolate ganache and fresh berries',
      category: 'Desserts',
      price: 45,
      cost: 20,
      sold: 290,
      rating: 4.7,
      popularity: 92,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
      available: true,
      preparationTime: 15,
      calories: 480,
      allergens: ['Dairy', 'Gluten', 'Eggs'],
      createdAt: '2024-03-01',
      updatedAt: '2025-01-09'
    },
    {
      id: 5,
      name: 'Margherita Pizza',
      description: 'Traditional Italian pizza with tomato sauce, mozzarella, and fresh basil',
      category: 'Main Course',
      price: 55,
      cost: 30,
      sold: 320,
      rating: 4.5,
      popularity: 75,
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
      available: true,
      preparationTime: 22,
      calories: 580,
      allergens: ['Dairy', 'Gluten'],
      createdAt: '2024-02-15',
      updatedAt: '2025-01-08'
    },
    {
      id: 6,
      name: 'Fresh Juice',
      description: 'Freshly squeezed orange juice with no added sugar',
      category: 'Beverages',
      price: 25,
      cost: 10,
      sold: 520,
      rating: 4.4,
      popularity: 85,
      image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
      available: true,
      preparationTime: 5,
      calories: 120,
      allergens: [],
      createdAt: '2024-01-10',
      updatedAt: '2025-01-13'
    },
    {
      id: 7,
      name: 'Spaghetti Carbonara',
      description: 'Creamy Italian pasta with bacon, egg, parmesan and black pepper',
      category: 'Main Course',
      price: 75,
      cost: 40,
      sold: 210,
      rating: 4.6,
      popularity: 82,
      image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
      available: true,
      preparationTime: 18,
      calories: 720,
      allergens: ['Dairy', 'Gluten', 'Eggs'],
      createdAt: '2024-02-20',
      updatedAt: '2025-01-07'
    },
    {
      id: 8,
      name: 'Cappuccino',
      description: 'Espresso with steamed milk and foam, dusted with cocoa',
      category: 'Beverages',
      price: 20,
      cost: 6,
      sold: 680,
      rating: 4.7,
      popularity: 90,
      image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400',
      available: true,
      preparationTime: 8,
      calories: 150,
      allergens: ['Dairy'],
      createdAt: '2024-01-05',
      updatedAt: '2025-01-13'
    }
  ]);

  const [categories, setCategories] = useState([
    'Main Course',
    'Appetizers',
    'Desserts',
    'Beverages',
    'Sides',
    'Specials'
  ]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedItems = localStorage.getItem('restalyze_menu_items');
    const savedCategories = localStorage.getItem('restalyze_menu_categories');

    if (savedItems) {
      try {
        setMenuItems(JSON.parse(savedItems));
      } catch (error) {
        console.error('Error loading menu items:', error);
      }
    }

    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories));
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('restalyze_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('restalyze_menu_categories', JSON.stringify(categories));
  }, [categories]);

  // Add new menu item
  const addMenuItem = (item) => {
    console.log('✅ MenuContext: Adding new item', item);
    const newItem = {
      ...item,
      id: Date.now(),
      sold: 0,
      rating: 0,
      popularity: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setMenuItems(prev => {
      const updated = [...prev, newItem];
      console.log('✅ MenuContext: New menu items count:', updated.length);
      return updated;
    });
    return newItem;
  };

  // Update existing menu item
  const updateMenuItem = (id, updates) => {
    console.log('✏️ MenuContext: Updating item', id, updates);
    setMenuItems(prev => prev.map(item =>
      item.id === id
        ? { ...item, ...updates, updatedAt: new Date().toISOString().split('T')[0] }
        : item
    ));
  };

  // Delete menu item
  const deleteMenuItem = (id) => {
    console.log('🗑️ MenuContext: Deleting item', id);
    setMenuItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      console.log('🗑️ MenuContext: Remaining items:', updated.length);
      return updated;
    });
  };

  // Toggle item availability
  const toggleAvailability = (id) => {
    setMenuItems(prev => prev.map(item =>
      item.id === id
        ? { ...item, available: !item.available, updatedAt: new Date().toISOString().split('T')[0] }
        : item
    ));
  };

  // Get menu item by ID
  const getMenuItem = (id) => {
    return menuItems.find(item => item.id === id);
  };

  // Get items by category
  const getItemsByCategory = (category) => {
    return menuItems.filter(item => item.category === category);
  };

  // Calculate statistics
  const getStatistics = () => {
    const totalRevenue = menuItems.reduce((sum, item) => sum + (item.price * item.sold), 0);
    const totalCost = menuItems.reduce((sum, item) => sum + (item.cost * item.sold), 0);
    const totalProfit = totalRevenue - totalCost;
    const totalSold = menuItems.reduce((sum, item) => sum + item.sold, 0);
    const avgRating = menuItems.length > 0
      ? menuItems.reduce((sum, item) => sum + item.rating, 0) / menuItems.length
      : 0;

    return {
      totalItems: menuItems.length,
      totalRevenue,
      totalCost,
      totalProfit,
      totalSold,
      avgRating,
      profitMargin: totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100) : 0
    };
  };

  // Add new category
  const addCategory = (category) => {
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category]);
    }
  };

  // Delete category (and reassign items)
  const deleteCategory = (category, reassignTo) => {
    setCategories(prev => prev.filter(cat => cat !== category));
    if (reassignTo) {
      setMenuItems(prev => prev.map(item =>
        item.category === category
          ? { ...item, category: reassignTo, updatedAt: new Date().toISOString().split('T')[0] }
          : item
      ));
    }
  };

  const value = {
    menuItems,
    categories,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability,
    getMenuItem,
    getItemsByCategory,
    getStatistics,
    addCategory,
    deleteCategory
  };

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  );
};
