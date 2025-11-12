// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// التحقق من وجود متغيرات البيئة مع معالجة أكثر مرونة
const hasValidCredentials = !!(supabaseUrl && supabaseAnonKey)

if (!hasValidCredentials) {
  console.warn('[SUPABASE] ⚠️ Missing Supabase environment variables!')
  console.warn('[SUPABASE] Please check your .env.local file and ensure:')
  console.warn('[SUPABASE] - VITE_SUPABASE_URL is set')
  console.warn('[SUPABASE] - VITE_SUPABASE_ANON_KEY is set')
  console.warn('[SUPABASE] Running with limited functionality (DEV_BYPASS_AUTH mode recommended)')
}

// إعدادات متقدمة لـ Supabase
const supabaseOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage,
    flowType: 'pkce',
    debug: import.meta.env.DEV, // تفعيل وضع التصحيح في التطوير فقط
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    headers: {
      'x-application-name': 'NAVA-RMS',
      'x-application-version': '1.0.0',
    },
  },
  db: {
    schema: 'public',
  },
}

// إنشاء العميل - مع معالجة الحالات الخاصة
export const supabase = hasValidCredentials
  ? createClient(supabaseUrl, supabaseAnonKey, supabaseOptions)
  : createClient('https://placeholder.supabase.co', 'placeholder-key', supabaseOptions)

// تصدير حالة الاتصال
export const isSupabaseConfigured = hasValidCredentials

// 🔧 نظام متقدم للتعامل مع الأخطاء
export class SupabaseError extends Error {
  constructor(message, code, details) {
    super(message)
    this.name = 'SupabaseError'
    this.code = code
    this.details = details
    this.timestamp = new Date().toISOString()
  }
}

// 📊 خريطة رموز الأخطاء
const ERROR_CODES = {
  'PGRST116': 'البيانات المطلوبة غير موجودة',
  '23505': 'هذا السجل موجود مسبقاً',
  '42501': 'ليس لديك صلاحية للقيام بهذا الإجراء',
  '42703': 'حقل غير موجود في الجدول',
  '42P01': 'الجدول غير موجود',
  'network_error': 'خطأ في الاتصال بالخادم',
  'auth/invalid-email': 'البريد الإلكتروني غير صالح',
  'auth/invalid-password': 'كلمة المرور غير صحيحة',
  'auth/email-not-confirmed': 'البريد الإلكتروني غير مفعل',
  'auth/user-not-found': 'المستخدم غير موجود',
  'auth/weak-password': 'كلمة المرور ضعيفة',
}

// 🛠️ دوال مساعدة متقدمة
export const checkSupabaseConnection = async () => {
  // إذا لم تكن بيانات الاعتماد موجودة، إرجاع حالة غير متصل مباشرة
  if (!hasValidCredentials) {
    return {
      connected: false,
      error: 'Supabase credentials not configured',
      responseTime: null,
      timestamp: new Date().toISOString(),
      requiresConfiguration: true
    }
  }

  try {
    const startTime = Date.now()
    const { data, error, count } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .limit(1)

    const responseTime = Date.now() - startTime

    if (error) {
      throw new SupabaseError(
        `فشل الاتصال بقاعدة البيانات: ${error.message}`,
        error.code,
        { responseTime }
      )
    }

    return {
      connected: true,
      error: null,
      responseTime,
      timestamp: new Date().toISOString(),
      requiresConfiguration: false
    }
  } catch (error) {
    console.error('🔴 Supabase connection error:', error)

    return {
      connected: false,
      error: error.message,
      responseTime: null,
      timestamp: new Date().toISOString(),
      requiresConfiguration: false
    }
  }
}

// 🔄 نظام إعادة المحاولة التلقائي
export const retryOperation = async (operation, maxRetries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await operation()
      return result
    } catch (error) {
      if (attempt === maxRetries) {
        throw error
      }
      
      console.warn(`🔄 Retry attempt ${attempt} failed, retrying in ${delay}ms...`)
      await new Promise(resolve => setTimeout(resolve, delay * attempt))
    }
  }
}

// 🎯 معالجة أخطاء Supabase بشكل مركزي
export const handleSupabaseError = (error) => {
  if (!error) {
    return {
      message: 'خطأ غير معروف',
      code: 'UNKNOWN_ERROR',
      userMessage: 'حدث خطأ غير متوقع'
    }
  }

  // تسجيل الخطأ للتصحيح
  console.error('🔴 Supabase Error:', {
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint,
    stack: error.stack
  })

  // تحويل رمز الخطأ إلى رسالة مفهومة للمستخدم
  const userMessage = ERROR_CODES[error.code] || 
                     ERROR_CODES[error.message] || 
                     'حدث خطأ أثناء المعالجة، يرجى المحاولة مرة أخرى'

  return {
    message: error.message,
    code: error.code,
    details: error.details,
    userMessage,
    timestamp: new Date().toISOString()
  }
}

// 📝 دوال مساعدة للاستعلامات
export const queryHelpers = {
  // استعلام آمن مع معالجة الأخطاء
  async safeQuery(queryPromise) {
    try {
      const { data, error, count, status, statusText } = await queryPromise
      
      if (error) {
        throw error
      }
      
      return {
        success: true,
        data,
        count,
        status,
        statusText,
        error: null
      }
    } catch (error) {
      const handledError = handleSupabaseError(error)
      return {
        success: false,
        data: null,
        count: 0,
        error: handledError
      }
    }
  },

  // Pagination helper
  paginate(page = 1, pageSize = 10) {
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    return { from, to }
  },

  // Filter helper
  buildFilter(filters = {}) {
    let query = supabase
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          query = query.in(key, value)
        } else if (typeof value === 'boolean') {
          query = query.eq(key, value)
        } else if (typeof value === 'string') {
          query = query.ilike(key, `%${value}%`)
        } else {
          query = query.eq(key, value)
        }
      }
    })
    return query
  }
}

// 📊 مراقبة أداء Supabase
export const performanceMonitor = {
  queries: new Map(),
  
  startQuery(name) {
    const id = `${name}_${Date.now()}`
    this.queries.set(id, {
      name,
      startTime: Date.now(),
      status: 'running'
    })
    return id
  },
  
  endQuery(id, success = true) {
    const query = this.queries.get(id)
    if (query) {
      query.endTime = Date.now()
      query.duration = query.endTime - query.startTime
      query.status = success ? 'success' : 'failed'
      query.timestamp = new Date().toISOString()
      
      // تسجيل الاستعلامات البطيئة
      if (query.duration > 1000) {
        console.warn(`🐌 Slow query detected: ${query.name} took ${query.duration}ms`)
      }
    }
  },
  
  getStats() {
    const queries = Array.from(this.queries.values())
    const successfulQueries = queries.filter(q => q.status === 'success')
    const failedQueries = queries.filter(q => q.status === 'failed')
    
    return {
      totalQueries: queries.length,
      successfulQueries: successfulQueries.length,
      failedQueries: failedQueries.length,
      averageDuration: queries.reduce((acc, q) => acc + (q.duration || 0), 0) / queries.length,
      slowQueries: queries.filter(q => q.duration > 1000)
    }
  }
}

// 🔔 نظام مراقبة الحالة في الوقت الحقيقي
export const setupRealtimeMonitor = () => {
  const channel = supabase
    .channel('system-monitor')
    .on('system', { event: '*' }, (payload) => {
      console.log('🔔 System event:', payload)
    })
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('✅ Realtime monitor connected')
      }
      if (status === 'CHANNEL_ERROR') {
        console.error('❌ Realtime monitor connection failed')
      }
    })

  return channel
}

// 🧹 أداة تنظيف الجلسات
export const cleanupSessions = async () => {
  try {
    // تنظيف التخزين المحلي من الجلسات القديمة
    const sessions = JSON.parse(localStorage.getItem('supabase.auth.token') || '[]')
    const validSessions = sessions.filter(session => {
      if (!session.expires_at) return false
      return new Date(session.expires_at) > new Date()
    })
    
    localStorage.setItem('supabase.auth.token', JSON.stringify(validSessions))
    return { success: true, cleaned: sessions.length - validSessions.length }
  } catch (error) {
    console.error('Session cleanup error:', error)
    return { success: false, error: error.message }
  }
}

// التصدير الافتراضي
export default supabase

// التصدير للاستخدام العالمي (للتطوير فقط)
if (import.meta.env.DEV) {
  window.supabase = supabase
  window.supabaseHelpers = {
    checkSupabaseConnection,
    handleSupabaseError,
    queryHelpers,
    performanceMonitor
  }
}