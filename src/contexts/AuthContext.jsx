// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, checkSupabaseConnection, handleSupabaseError } from '../lib/supabase';
import { useNotification } from './NotificationContext';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [sessionExpiry, setSessionExpiry] = useState(null);
  const { showNotification } = useNotification();

  // التحقق من انتهاء الجلسة
  useEffect(() => {
    const checkSessionExpiry = () => {
      if (sessionExpiry && new Date() > new Date(sessionExpiry)) {
        showNotification('Session expired. Please log in again.', 'warning');
        logout();
      }
    };

    const interval = setInterval(checkSessionExpiry, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [sessionExpiry]);

  // تهيئة المصادقة
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const connection = await checkSupabaseConnection();
        setConnectionStatus(connection.connected ? 'connected' : 'disconnected');

        if (connection.connected) {
          await setupAuthListener();
        } else {
          showNotification('Cannot connect to server', 'error');
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setConnectionStatus('error');
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const setupAuthListener = async () => {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Session error:', sessionError);
      setLoading(false);
      return;
    }

    if (session?.user) {
      await handleUserSession(session.user, session.expires_at);
    } else {
      setLoading(false);
      setConnectionStatus('unauthenticated');
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);

        switch (event) {
          case 'SIGNED_IN':
            if (session?.user) {
              await handleUserSession(session.user, session.expires_at);
              setConnectionStatus('authenticated');
              showNotification('Successfully logged in!', 'success');
            }
            break;

          case 'SIGNED_OUT':
            setUser(null);
            setUserProfile(null);
            setSessionExpiry(null);
            setConnectionStatus('unauthenticated');
            showNotification('Logged out successfully', 'info');
            break;

          case 'TOKEN_REFRESHED':
            if (session?.expires_at) {
              setSessionExpiry(new Date(session.expires_at * 1000));
            }
            break;

          case 'USER_UPDATED':
            if (session?.user) {
              setUser(session.user);
            }
            break;
        }

        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  };

  const handleUserSession = async (user, expiresAt = null) => {
    setUser(user);
    setConnectionStatus('authenticated');

    if (expiresAt) {
      setSessionExpiry(new Date(expiresAt * 1000));
    }

    // Fetch user profile
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create default
        await createDefaultUserProfile(user);
      } else if (error) {
        console.error('Error fetching user profile:', error);
      } else {
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error handling user session:', error);
    }
  };

  const createDefaultUserProfile = async (user) => {
    try {
      const defaultProfile = {
        id: user.id,
        email: user.email,
        role: 'viewer',
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        is_active: true,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .insert([defaultProfile])
        .select()
        .single();

      if (error) throw error;

      setUserProfile(data);
      return data;
    } catch (error) {
      console.error('Error creating default profile:', error);
      const fallbackProfile = {
        id: user.id,
        email: user.email,
        role: 'viewer',
        full_name: 'User',
        is_active: true
      };
      setUserProfile(fallbackProfile);
      return fallbackProfile;
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) throw error;

      return {
        success: true,
        error: null,
        user: data.user
      };
    } catch (error) {
      console.error('Login error:', error);
      const handledError = handleSupabaseError(error);

      return {
        success: false,
        error: handledError.message
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setUserProfile(null);
      setSessionExpiry(null);
      setConnectionStatus('unauthenticated');

    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // نظام الصلاحيات
  const hasPermission = useCallback((permissions) => {
    if (!userProfile) return false;

    if (Array.isArray(permissions)) {
      return permissions.some(permission => checkPermission(permission));
    }

    return checkPermission(permissions);
  }, [userProfile]);

  const checkPermission = (permission) => {
    const rolePermissions = {
      viewer: ['dashboard:view', 'reports:view'],
      ops: ['dashboard:view', 'reports:view', 'restaurants:view', 'restaurants:edit', 'team:view'],
      admin: [
        'dashboard:view', 'reports:view', 'restaurants:view', 'restaurants:edit',
        'restaurants:delete', 'team:view', 'team:manage', 'financial:view',
        'settings:manage', 'users:manage'
      ]
    };

    const userPermissions = rolePermissions[userProfile?.role] || [];
    return userPermissions.includes(permission);
  };

  const value = {
    user,
    userProfile,
    loading,
    connectionStatus,
    sessionExpiry,
    isAuthenticated: !!user,
    isAdmin: userProfile?.role === 'admin',
    isOps: userProfile?.role === 'ops' || userProfile?.role === 'admin',
    isViewer: userProfile?.role === 'viewer',
    login,
    logout,
    hasPermission,
    checkPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
