// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import supabase, {
  checkSupabaseConnection,
  handleSupabaseError
} from "./lib/supabase";
import { useNotification } from './NotificationContext';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
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
  const { addNotification } = useNotification();

  // التحقق من انتهاء الجلسة
  useEffect(() => {
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

    const interval = setInterval(checkSessionExpiry, 60000); // التحقق كل دقيقة
    return () => clearInterval(interval);
  }, [sessionExpiry, addNotification]);

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
          addNotification({
            type: 'error',
            title: 'خطأ في الاتصال',
            message: 'لا يمكن الاتصال بالخادم',
            duration: 3000
          });
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setConnectionStatus('error');
        setLoading(false);
      }
    };

    initializeAuth();
  }, [addNotification]);

  const setupAuthListener = async () => {
    // جلب الجلسة الحالية
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
    }

    // إعداد مستمع لتغيرات المصادقة
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        switch (event) {
          case 'SIGNED_IN':
            if (session?.user) {
              await handleUserSession(session.user, session.expires_at);
              addNotification({
                type: 'success',
                title: 'تم تسجيل الدخول بنجاح',
                message: `مرحباً بعودتك!`,
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
  };

  const handleUserSession = async (user, expiresAt = null) => {
    setUser(user);
    
    if (expiresAt) {
      setSessionExpiry(new Date(expiresAt * 1000));
    }

    // جلب بيانات المستخدم الإضافية
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
        console.warn('User profile not found, creating default...');
        await createDefaultUserProfile(user);
        // إعادة محاولة جلب البيانات بعد الإنشاء
        await handleUserSession(user, expiresAt);
      } else {
        setUserProfile(profile);
        
        // تسجيل نشاط الدخول
        await logUserActivity(user.id, 'login');
      }
    } catch (error) {
      console.error('Error handling user session:', error);
      await createDefaultUserProfile(user);
    }
  };

  const createDefaultUserProfile = async (user) => {
    try {
      const defaultProfile = {
        id: user.id,
        email: user.email,
        role: 'viewer',
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'مستخدم',
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

      setUserProfile(defaultProfile);
      return defaultProfile;
    } catch (error) {
      console.error('Error creating default profile:', error);
      // ملف تعريف افتراضي في حالة الخطأ
      const fallbackProfile = {
        id: user.id,
        email: user.email,
        role: 'viewer',
        full_name: 'مستخدم',
        is_active: true
      };
      setUserProfile(fallbackProfile);
      return fallbackProfile;
    }
  };

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
      console.error('Error logging user activity:', error);
    }
  };

  const login = async (email, password, rememberMe = false) => {
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
        requiresConfirmation: !data.session // إذا كان يحتاج تأكيد البريد
      };
    } catch (error) {
      console.error('Signup error:', error);
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
      if (user) {
        await logUserActivity(user.id, 'logout', {
          ipAddress: await getClientIP()
        });
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // تنظيف الحالة المحلية
      setUser(null);
      setUserProfile(null);
      setSessionExpiry(null);
      
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

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
      console.error('Password reset error:', error);
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
      console.error('Profile update error:', error);
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

  // نظام الصلاحيات المتقدم
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
      admin: ['dashboard:view', 'reports:view', 'restaurants:view', 'restaurants:edit', 'restaurants:delete', 'team:view', 'team:manage', 'financial:view', 'settings:manage', 'users:manage']
    };

    const userPermissions = rolePermissions[userProfile?.role] || [];
    return userPermissions.includes(permission);
  };

  const value = {
    // البيانات
    user,
    userProfile,
    loading,
    connectionStatus,
    sessionExpiry,
    
    // الحالة
    isAuthenticated: !!user,
    isAdmin: userProfile?.role === 'admin',
    isOps: userProfile?.role === 'ops' || userProfile?.role === 'admin',
    isViewer: userProfile?.role === 'viewer',
    
    // الإجراءات
    login,
    signUp,
    logout,
    resetPassword,
    updateProfile,
    
    // الصلاحيات
    hasPermission,
    checkPermission,
    
    // الأدوات
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