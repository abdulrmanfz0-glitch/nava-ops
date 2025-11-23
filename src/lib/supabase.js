// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check for environment variables with flexible handling
const hasValidCredentials = !!(supabaseUrl && supabaseAnonKey)

if (!hasValidCredentials && import.meta.env.DEV) {
  // Show a single consolidated warning in development mode only
  console.log(
    '%c[SUPABASE]%c Supabase not configured - running in DEV_BYPASS_AUTH mode',
    'color: #f59e0b; font-weight: bold',
    'color: inherit'
  )
}

// Advanced Supabase settings
const supabaseOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage,
    flowType: 'pkce',
    debug: import.meta.env.DEV, // Enable debug mode in development only
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

// Create client - with special case handling
export const supabase = hasValidCredentials
  ? createClient(supabaseUrl, supabaseAnonKey, supabaseOptions)
  : createClient('https://placeholder.supabase.co', 'placeholder-key', supabaseOptions)

// Export connection status
export const isSupabaseConfigured = hasValidCredentials

// 🔧 Advanced error handling system
export class SupabaseError extends Error {
  constructor(message, code, details) {
    super(message)
    this.name = 'SupabaseError'
    this.code = code
    this.details = details
    this.timestamp = new Date().toISOString()
  }
}

// 📊 Error codes map
const ERROR_CODES = {
  'PGRST116': 'The requested data was not found',
  '23505': 'This record already exists',
  '42501': 'You do not have permission to perform this action',
  '42703': 'Field does not exist in table',
  '42P01': 'Table does not exist',
  'network_error': 'Server connection error',
  'auth/invalid-email': 'Invalid email address',
  'auth/invalid-password': 'Incorrect password',
  'auth/email-not-confirmed': 'Email not verified',
  'auth/user-not-found': 'User not found',
  'auth/weak-password': 'Password is too weak',
}

// 🛠️ Advanced helper functions
export const checkSupabaseConnection = async () => {
  // If credentials are not present, return disconnected status immediately
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
        `Database connection failed: ${error.message}`,
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

// 🔄 Automatic retry system
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

// 🎯 Centralized Supabase error handling
export const handleSupabaseError = (error) => {
  if (!error) {
    return {
      message: 'Unknown error',
      code: 'UNKNOWN_ERROR',
      userMessage: 'An unexpected error occurred'
    }
  }

  // Log error for debugging
  console.error('🔴 Supabase Error:', {
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint,
    stack: error.stack
  })

  // Convert error code to user-friendly message
  const userMessage = ERROR_CODES[error.code] ||
                     ERROR_CODES[error.message] ||
                     'An error occurred during processing. Please try again.'

  return {
    message: error.message,
    code: error.code,
    details: error.details,
    userMessage,
    timestamp: new Date().toISOString()
  }
}

// 📝 Query helper functions
export const queryHelpers = {
  // Safe query with error handling
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

// 📊 Supabase performance monitoring
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
      
      // Log slow queries
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

// 🔔 Real-time status monitoring system
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

// 🧹 Session cleanup tool
export const cleanupSessions = async () => {
  try {
    // Clean local storage from old sessions
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

// Default export
export default supabase

// Export for global use (development only)
if (import.meta.env.DEV) {
  window.supabase = supabase
  window.supabaseHelpers = {
    checkSupabaseConnection,
    handleSupabaseError,
    queryHelpers,
    performanceMonitor
  }
}