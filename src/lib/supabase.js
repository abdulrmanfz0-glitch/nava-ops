// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const devBypassAuth = import.meta.env.VITE_DEV_BYPASS_AUTH === 'true'

// التحقق من صحة URL
const isValidUrl = (url) => {
  if (!url) return false
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

// التحقق من وجود متغيرات البيئة وصحتها
const hasValidConfig = supabaseUrl && supabaseAnonKey &&
                       isValidUrl(supabaseUrl) &&
                       supabaseAnonKey !== 'your-supabase-anon-key'

if (!hasValidConfig) {
  console.warn('[SUPABASE] ⚠️ Invalid or missing Supabase configuration')
  console.warn('[SUPABASE] Current config:', {
    url: supabaseUrl,
    hasKey: !!supabaseAnonKey,
    validUrl: isValidUrl(supabaseUrl)
  })

  if (devBypassAuth) {
    console.warn('[SUPABASE] 🔧 DEV MODE: Running with mock Supabase client')
  } else {
    console.error('[SUPABASE] ❌ Please check your .env file and ensure:')
    console.error('[SUPABASE] - VITE_SUPABASE_URL is a valid HTTPS URL')
    console.error('[SUPABASE] - VITE_SUPABASE_ANON_KEY is set correctly')
    throw new Error('Supabase environment variables are missing or invalid.')
  }
}

// إعدادات متقدمة لـ Supabase
const supabaseOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage,
    flowType: 'pkce',
    debug: import.meta.env.DEV,
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

// عميل Supabase وهمي لوضع التطوير
function createMockSupabaseClient() {
  const mockResponse = { data: null, error: null }

  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => mockResponse,
      signUp: async () => mockResponse,
      signOut: async () => mockResponse,
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => mockResponse,
          limit: async () => mockResponse,
          order: async () => mockResponse
        }),
        single: async () => mockResponse,
        limit: async () => mockResponse,
        order: async () => mockResponse
      }),
      insert: async () => mockResponse,
      update: () => ({
        eq: async () => mockResponse
      }),
      delete: () => ({
        eq: async () => mockResponse
      }),
      upsert: async () => mockResponse
    }),
    channel: () => ({
      on: () => ({ subscribe: () => ({}) })
    })
  }
}

// إنشاء العميل
let supabase

if (hasValidConfig) {
  supabase = createClient(supabaseUrl, supabaseAnonKey, supabaseOptions)
  console.log('[SUPABASE] ✅ Supabase client initialized successfully')
} else if (devBypassAuth) {
  console.warn('[SUPABASE] 🔧 Creating mock Supabase client for development')
  supabase = createMockSupabaseClient()
} else {
  throw new Error('Supabase configuration is invalid and DEV_BYPASS_AUTH is not enabled')
}

// نظام التعامل مع الأخطاء
export class SupabaseError extends Error {
  constructor(message, code, details) {
    super(message)
    this.name = 'SupabaseError'
    this.code = code
    this.details = details
    this.timestamp = new Date().toISOString()
  }
}

// دالة التحقق من الاتصال
export const checkSupabaseConnection = async () => {
  if (devBypassAuth && !hasValidConfig) {
    console.log('[SUPABASE] 🔧 DEV MODE: Bypassing connection check')
    return {
      connected: true,
      error: null,
      responseTime: 0,
      isMock: true
    }
  }

  try {
    const startTime = Date.now()
    const { error } = await supabase
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
      isMock: false
    }
  } catch (error) {
    console.error('🔴 Supabase connection error:', error)

    return {
      connected: false,
      error: error.message,
      responseTime: null
    }
  }
}

// دالة معالجة الأخطاء
export const handleSupabaseError = (error) => {
  if (error instanceof SupabaseError) {
    return {
      success: false,
      error: error.message,
      code: error.code,
      timestamp: error.timestamp
    }
  }

  return {
    success: false,
    error: error?.message || 'حدث خطأ غير متوقع',
    code: error?.code || 'UNKNOWN'
  }
}

export { supabase }
export default supabase
