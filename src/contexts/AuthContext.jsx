// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, checkSupabaseConnection, handleSupabaseError } from '../lib/supabase';
import { useNotification } from './NotificationContext';

import logger from '../lib/logger';

/**
 * DEV MODE AUTHENTICATION BYPASS
 *
 * SECURITY WARNING: This bypasses all authentication for local development only.
 * - Automatically disabled in production builds
 * - Requires VITE_DEV_BYPASS_AUTH='true' environment variable
 * - Only works when NODE_ENV !== 'production'
 *
 * Usage: Set VITE_DEV_BYPASS_AUTH=true in .env.local for development
 */
const DEV_BYPASS_AUTH = (
  import.meta.env.DEV && // Must be in development mode
  import.meta.env.MODE !== 'production' && // Not production mode
  import.meta.env.VITE_DEV_BYPASS_AUTH === 'true' // Explicit opt-in required
);
 

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

  const { addNotification } = useNotification();

  // DEV MODE: Skip authentication checks
  useEffect(() => {
    if (DEV_BYPASS_AUTH) {
      // Security warning in console
      console.warn(
        '%c⚠️ SECURITY WARNING: DEV MODE AUTHENTICATION BYPASS ACTIVE',
        'color: #ef4444; font-size: 16px; font-weight: bold; padding: 10px; background: #fee2e2; border: 2px solid #dc2626;'
      );
      console.warn('Authentication is bypassed. This should NEVER happen in production.');
      console.warn('Environment:', {
        DEV: import.meta.env.DEV,
        MODE: import.meta.env.MODE,
        VITE_DEV_BYPASS_AUTH: import.meta.env.VITE_DEV_BYPASS_AUTH
      });

      logger.warn('🚨 DEV MODE: Authentication bypassed - using mock admin user', {
        environment: import.meta.env.MODE,
        devMode: import.meta.env.DEV
      });

      const mockUser = {
        id: 'dev-user-id',
        email: 'dev@nava-ops.local',
        user_metadata: { full_name: 'Dev User (Mock)' }
      };
      const mockProfile = {
        id: 'dev-user-id',
        email: 'dev@nava-ops.local',
        role: 'admin',
        full_name: 'Dev User (Mock)',
        is_active: true,
        __devMode: true // Flag for dev mode detection
      };

      setUser(mockUser);
      setUserProfile(mockProfile);
      setConnectionStatus('connected');
      setLoading(false);

      // Prominent dev mode notification
      addNotification({
        type: 'warning',
        title: '⚠️ Development Mode Active',
        message: 'Authentication bypassed - Using mock admin account',
        duration: 8000 // Longer duration for visibility
      });

      // Add dev mode indicator to document
      if (typeof document !== 'undefined') {
        document.body.setAttribute('data-dev-mode', 'true');
        document.title = '[DEV] ' + document.title;
      }

      return;
    }

    initializeAuth();
  }, []);

  // Check session expiry
  useEffect(() => {
    if (DEV_BYPASS_AUTH) return;

    const checkSessionExpiry = () => {
      if (sessionExpiry && new Date() > new Date(sessionExpiry)) {
        addNotification({
          type: 'warning',
          title: 'انتهت الجلسة',
          message: 'لقد انتهت جلستك، يرجى تسجيل الدخول مرة أخرى',
          duration: 5000
        });
 
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

    const interval = setInterval(checkSessionExpiry, 60000);
    return () => clearInterval(interval);
  }, [sessionExpiry, addNotification]);

  // Initialize authentication
  const initializeAuth = async () => {
    try {
      logger.debug('Initializing authentication');
      setLoading(true);
      const connection = await checkSupabaseConnection();
      logger.debug('Connection status', { connection });
      setConnectionStatus(connection.connected ? 'connected' : 'disconnected');

      if (connection.connected) {
        await setupAuthListener();
      } else {
        // Supabase not configured - this is expected in DEV mode without credentials
        if (import.meta.env.DEV) {
          logger.debug('Supabase not configured - running in DEV_BYPASS_AUTH mode');
        }
        setLoading(false);
      }
    } catch (error) {
      logger.error('Auth initialization error', { error: error.message });
      setConnectionStatus('error');
      setLoading(false);
    }
  };

  const setupAuthListener = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        logger.error('Session error', { error: sessionError.message });
        setLoading(false);
        return;
      }

      if (session?.user) {
        await handleUserSession(session.user, session.expires_at);
      } else {
        setLoading(false);
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          logger.debug('Auth state changed', { event });

          switch (event) {
            case 'SIGNED_IN':
              if (session?.user) {
                await handleUserSession(session.user, session.expires_at);
                addNotification({
                  type: 'success',
                  title: 'تم تسجيل الدخول بنجاح',
                  message: 'مرحباً بعودتك!',
                  duration: 3000
                });
              }
              break;

            case 'SIGNED_OUT':
              setUser(null);
              setUserProfile(null);
              setSessionExpiry(null);
              addNotification({
                type: 'info',
                title: 'تم تسجيل الخروج',
                message: 'تم تسجيل خروجك بنجاح',
                duration: 3000
              });
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
    } catch (error) {
      logger.error('Error setting up auth listener', { error: error.message });
      setLoading(false);
    }
 
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

    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          brand:brands (
            id,
            name,
            logo_url,
            status
          )
        `)
        .eq('id', user.id)
        .single();

      if (error) {
        logger.warn('User profile not found, creating default');
        await createDefaultUserProfile(user);
      } else {
        setUserProfile(profile);
        await logUserActivity(user.id, 'login');
      }
    } catch (error) {
      logger.error('Error handling user session', { error: error.message });
      await createDefaultUserProfile(user);
 
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

        phone: user.user_metadata?.phone || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        is_active: true,
        last_login_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
 
        .from('user_profiles')
        .insert([defaultProfile])
        .select()
        .single();

      if (error) throw error;

      setUserProfile(data);
      return data;
    } catch (error) {
      console.error('Error creating default profile:', error);

      setUserProfile(defaultProfile);
      return defaultProfile;
    } catch (error) {
      logger.error('Error creating default profile', { error: error.message });
 
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

  const logUserActivity = async (userId, activityType, metadata = {}) => {
    try {
      await supabase
        .from('user_activities')
        .insert([
          {
            user_id: userId,
            activity_type: activityType,
            metadata,
            ip_address: metadata.ipAddress || 'unknown',
            user_agent: navigator.userAgent,
            created_at: new Date().toISOString()
          }
        ]);
    } catch (error) {
      logger.error('Error logging user activity', { error: error.message });
    }
  };

  const login = async (email, password, rememberMe = false) => {
    if (DEV_BYPASS_AUTH) {
      return { success: true, error: null, user: user };
    }

 
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) throw error;


      await logUserActivity(data.user.id, 'login', {
        ipAddress: await getClientIP(),
        rememberMe
      });

 
      return {
        success: true,
        error: null,
        user: data.user
      };
    } catch (error) {
      console.error('Login error:', error);

      logger.error('Login error', { error: error.message });
      const handledError = handleSupabaseError(error);

      await logUserActivity(null, 'login_failed', {
        email: email.trim().toLowerCase(),
        error: handledError.message,
        ipAddress: await getClientIP()
      });

      return {
        success: false,
        error: handledError.message
      };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, userData = {}) => {
    if (DEV_BYPASS_AUTH) {
      return { success: true, error: null, user: user };
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            ...userData,
            signup_ip: await getClientIP()
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        await logUserActivity(data.user.id, 'signup', {
          ipAddress: await getClientIP()
        });
      }

      return {
        success: true,
        error: null,
        user: data.user,
        requiresConfirmation: !data.session
      };
    } catch (error) {
      logger.error('Signup error', { error: error.message });
 
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

    if (DEV_BYPASS_AUTH) {
      logger.debug('DEV MODE: Logout skipped');
      return;
    }

    try {
      if (user) {
        await logUserActivity(user.id, 'logout', {
          ipAddress: await getClientIP()
        });
      }

 
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setUserProfile(null);
      setSessionExpiry(null);
      setConnectionStatus('unauthenticated');

    } catch (error) {
      console.error('Logout error:', error);


    } catch (error) {
      logger.error('Logout error', { error: error.message });
 
      throw error;
    }
  };

  // نظام الصلاحيات

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (error) throw error;

      await logUserActivity(user?.id, 'password_reset_requested', {
        email: email.trim().toLowerCase()
      });

      return { success: true, error: null };
    } catch (error) {
      logger.error('Password reset error', { error: error.message });
      const handledError = handleSupabaseError(error);
      return { success: false, error: handledError.message };
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setUserProfile(data);

      addNotification({
        type: 'success',
        title: 'تم التحديث',
        message: 'تم تحديث الملف الشخصي بنجاح',
        duration: 3000
      });

      return { success: true, error: null, profile: data };
    } catch (error) {
      logger.error('Profile update error', { error: error.message });
      const handledError = handleSupabaseError(error);

      addNotification({
        type: 'error',
        title: 'خطأ في التحديث',
        message: handledError.message,
        duration: 5000
      });

      return { success: false, error: handledError.message };
    }
  };

  const getClientIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  };

 
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

      admin: ['dashboard:view', 'reports:view', 'restaurants:view', 'restaurants:edit', 'restaurants:delete', 'team:view', 'team:manage', 'financial:view', 'settings:manage', 'users:manage']
 
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


    isAuthenticated: DEV_BYPASS_AUTH ? true : !!user,
    isAdmin: userProfile?.role === 'admin',
    isOps: userProfile?.role === 'ops' || userProfile?.role === 'admin',
    isViewer: userProfile?.role === 'viewer',

    login,
    signUp,
    logout,
    resetPassword,
    updateProfile,

    hasPermission,
    checkPermission,

    getSessionTimeLeft: () => {
      if (!sessionExpiry) return null;
      return Math.max(0, sessionExpiry - new Date());
    }
 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
