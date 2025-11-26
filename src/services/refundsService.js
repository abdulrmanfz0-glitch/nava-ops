/**
 * NAVA OPS - Refunds Service
 * Comprehensive refund management with inspection and dispute generation
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { inspectRefund } from '@/utils/refundInspection';

// ============================================================================
// REFUNDS CRUD OPERATIONS
// ============================================================================

export const refundsService = {
  /**
   * Get all refunds with optional filters
   */
  async getAll(filters = {}) {
    try {
      let query = supabase
        .from('refunds')
        .select(`
          *,
          branch:branches(id, name, location),
          platform:delivery_platforms(id, platform_name, platform_code)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.branch_id) {
        query = query.eq('branch_id', filters.branch_id);
      }
      if (filters.platform_name) {
        query = query.eq('platform_name', filters.platform_name);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.reason_code) {
        query = query.eq('reason_code', filters.reason_code);
      }
      if (filters.date_from) {
        query = query.gte('refund_request_time', filters.date_from);
      }
      if (filters.date_to) {
        query = query.lte('refund_request_time', filters.date_to);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Failed to fetch refunds:', error);
      return { data: null, error };
    }
  },

  /**
   * Get refund by ID with all related data
   */
  async getById(id) {
    try {
      const { data: refund, error: refundError } = await supabase
        .from('refunds')
        .select(`
          *,
          branch:branches(id, name, location),
          platform:delivery_platforms(id, platform_name, platform_code)
        `)
        .eq('id', id)
        .single();

      if (refundError) throw refundError;

      // Get evidence
      const { data: evidence, error: evidenceError } = await supabase
        .from('refund_evidence')
        .select('*')
        .eq('refund_id', id)
        .order('created_at', { ascending: false });

      if (evidenceError) throw evidenceError;

      // Get inspections
      const { data: inspections, error: inspectionsError } = await supabase
        .from('refund_inspections')
        .select('*')
        .eq('refund_id', id)
        .order('created_at', { ascending: false });

      if (inspectionsError) throw inspectionsError;

      return {
        data: {
          ...refund,
          evidence: evidence || [],
          inspections: inspections || []
        },
        error: null
      };
    } catch (error) {
      console.error('Failed to fetch refund:', error);
      return { data: null, error };
    }
  },

  /**
   * Create a new refund (manual entry)
   */
  async create(refundData) {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) throw new Error('User not authenticated');

      const payload = {
        user_id: user.user.id,
        platform_order_id: refundData.order_id || refundData.platform_order_id,
        platform_name: refundData.platform || refundData.platform_name || 'Manual',
        refund_type: refundData.refund_type || 'full',
        refund_reason: refundData.reason || refundData.refund_reason,
        reason_code: refundData.reason_code,
        reason_text: refundData.reason_text,
        refund_amount: parseFloat(refundData.amount || refundData.refund_amount || 0),
        original_order_amount: parseFloat(refundData.original_amount || refundData.refund_amount || 0),
        currency: refundData.currency || 'SAR',
        order_date: refundData.order_date,
        refund_request_time: refundData.refund_date || new Date().toISOString(),
        customer_claim: refundData.customer_claim,
        customer_name: refundData.customer_name,
        customer_phone: refundData.customer_phone,
        status: 'pending',
        branch_id: refundData.branch_id || null,
      };

      const { data, error } = await supabase
        .from('refunds')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Failed to create refund:', error);
      return { data: null, error };
    }
  },

  /**
   * Update refund
   */
  async update(id, updates) {
    try {
      const { data, error } = await supabase
        .from('refunds')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Failed to update refund:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete refund
   */
  async delete(id) {
    try {
      const { error } = await supabase
        .from('refunds')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error('Failed to delete refund:', error);
      return { success: false, error };
    }
  },

  /**
   * Bulk import from CSV data
   */
  async bulkImport(refunds, options = {}) {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) throw new Error('User not authenticated');

      const results = {
        success: 0,
        failed: 0,
        errors: []
      };

      for (const refund of refunds) {
        try {
          const payload = {
            user_id: user.user.id,
            platform_order_id: refund.order_id || refund.platform_order_id || `IMPORT-${Date.now()}`,
            platform_name: refund.platform || refund.platform_name || 'Import',
            refund_type: refund.refund_type || 'full',
            refund_reason: refund.reason || refund.refund_reason || 'Imported',
            reason_code: refund.reason_code,
            refund_amount: parseFloat(refund.amount || refund.refund_amount || 0),
            original_order_amount: parseFloat(refund.original_amount || refund.amount || 0),
            currency: refund.currency || 'SAR',
            refund_request_time: refund.date || refund.refund_date || new Date().toISOString(),
            status: 'pending',
            branch_id: options.branch_id || null,
          };

          const { error } = await supabase
            .from('refunds')
            .insert([payload]);

          if (error) throw error;
          results.success++;
        } catch (error) {
          results.failed++;
          results.errors.push({
            refund,
            error: error.message
          });
        }
      }

      return { data: results, error: null };
    } catch (error) {
      console.error('Failed to bulk import refunds:', error);
      return { data: null, error };
    }
  }
};

// ============================================================================
// EVIDENCE OPERATIONS
// ============================================================================

export const evidenceService = {
  /**
   * Add evidence to a refund
   */
  async add(refundId, evidenceData) {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) throw new Error('User not authenticated');

      const payload = {
        user_id: user.user.id,
        refund_id: refundId,
        type: evidenceData.type,
        file_url: evidenceData.file_url,
        file_name: evidenceData.file_name,
        file_size_bytes: evidenceData.file_size,
        file_type: evidenceData.file_type,
        notes: evidenceData.notes,
        metadata: evidenceData.metadata || {}
      };

      const { data, error } = await supabase
        .from('refund_evidence')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Failed to add evidence:', error);
      return { data: null, error };
    }
  },

  /**
   * Get all evidence for a refund
   */
  async getByRefundId(refundId) {
    try {
      const { data, error } = await supabase
        .from('refund_evidence')
        .select('*')
        .eq('refund_id', refundId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Failed to fetch evidence:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete evidence
   */
  async delete(id) {
    try {
      const { error } = await supabase
        .from('refund_evidence')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error('Failed to delete evidence:', error);
      return { success: false, error };
    }
  },

  /**
   * Upload file to Supabase Storage
   */
  async uploadFile(refundId, file) {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) throw new Error('User not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.user.id}/${refundId}/${Date.now()}.${fileExt}`;
      const filePath = `refund-evidence/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('evidence')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('evidence')
        .getPublicUrl(filePath);

      return {
        data: {
          file_url: publicUrl,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          path: filePath
        },
        error: null
      };
    } catch (error) {
      console.error('Failed to upload file:', error);
      return { data: null, error };
    }
  }
};

// ============================================================================
// INSPECTION OPERATIONS
// ============================================================================

export const inspectionService = {
  /**
   * Run inspection on a refund
   */
  async run(refundId) {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) throw new Error('User not authenticated');

      // Get refund data
      const { data: refund, error: refundError } = await supabase
        .from('refunds')
        .select('*')
        .eq('id', refundId)
        .single();

      if (refundError) throw refundError;

      // Get evidence
      const { data: evidence, error: evidenceError } = await supabase
        .from('refund_evidence')
        .select('*')
        .eq('refund_id', refundId);

      if (evidenceError) throw evidenceError;

      // Run inspection
      const inspection = inspectRefund(refund, evidence || []);

      // Save inspection results
      const payload = {
        user_id: user.user.id,
        refund_id: refundId,
        checklist: inspection.checklist,
        score: inspection.score,
        decision: inspection.decision,
        justification: inspection.bullets,
        ai_confidence: 85 // Placeholder for AI confidence
      };

      const { data, error } = await supabase
        .from('refund_inspections')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;

      // Update refund status based on decision
      await supabase
        .from('refunds')
        .update({ status: inspection.decision === 'DISPUTE' ? 'disputed' : 'pending' })
        .eq('id', refundId);

      return {
        data: {
          ...data,
          ask: inspection.ask
        },
        error: null
      };
    } catch (error) {
      console.error('Failed to run inspection:', error);
      return { data: null, error };
    }
  },

  /**
   * Get latest inspection for a refund
   */
  async getLatest(refundId) {
    try {
      const { data, error } = await supabase
        .from('refund_inspections')
        .select('*')
        .eq('refund_id', refundId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Failed to fetch inspection:', error);
      return { data: null, error };
    }
  }
};

// ============================================================================
// MESSAGE TEMPLATE OPERATIONS
// ============================================================================

export const templateService = {
  /**
   * Get all templates
   */
  async getAll(filters = {}) {
    try {
      let query = supabase
        .from('refund_message_templates')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false });

      if (filters.language) {
        query = query.eq('language', filters.language);
      }
      if (filters.platform) {
        query = query.or(`platform.eq.${filters.platform},platform.eq.ANY`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      return { data: null, error };
    }
  },

  /**
   * Get best matching template
   */
  async getBest(platform, reasonCode, language = 'ar') {
    try {
      const { data: user } = await supabase.auth.getUser();
      const userId = user?.user?.id;

      const { data, error } = await supabase
        .rpc('get_best_message_template', {
          p_user_id: userId,
          p_platform: platform,
          p_reason_code: reasonCode,
          p_language: language
        });

      if (error) throw error;

      // Get the template
      if (data) {
        const { data: template, error: templateError } = await supabase
          .from('refund_message_templates')
          .select('*')
          .eq('id', data)
          .single();

        if (templateError) throw templateError;
        return { data: template, error: null };
      }

      return { data: null, error: null };
    } catch (error) {
      console.error('Failed to fetch best template:', error);
      return { data: null, error };
    }
  },

  /**
   * Generate message from template
   */
  async generateMessage(refund, inspection, templateId, language = 'ar') {
    try {
      // Get template
      let template;
      if (templateId) {
        const { data, error } = await supabase
          .from('refund_message_templates')
          .select('*')
          .eq('id', templateId)
          .single();

        if (error) throw error;
        template = data;
      } else {
        // Auto-select best template
        const { data } = await this.getBest(
          refund.platform_name,
          refund.reason_code || 'ANY',
          language
        );
        template = data;
      }

      if (!template) {
        throw new Error('No template found');
      }

      // Prepare placeholders
      const placeholders = {
        order_id: refund.platform_order_id,
        amount: refund.refund_amount?.toFixed(2) || '0.00',
        currency: refund.currency || 'SAR',
        date: new Date(refund.refund_request_time || refund.created_at).toLocaleDateString('ar-SA'),
        bullets: inspection?.justification?.map(b => `• ${b}`).join('\n') || '',
        ask: inspection?.ask || 'يرجى مراجعة هذه الحالة وإعادة التقييم.'
      };

      // Replace placeholders
      let subject = template.subject_template;
      let body = template.body_template;

      Object.entries(placeholders).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        subject = subject.replace(regex, value);
        body = body.replace(regex, value);
      });

      // Update usage count
      await supabase
        .from('refund_message_templates')
        .update({ usage_count: (template.usage_count || 0) + 1 })
        .eq('id', template.id);

      return {
        data: {
          subject,
          body,
          template_name: template.template_name,
          language: template.language
        },
        error: null
      };
    } catch (error) {
      console.error('Failed to generate message:', error);
      return { data: null, error };
    }
  }
};

// ============================================================================
// ANALYTICS
// ============================================================================

export const analyticsService = {
  /**
   * Get refund statistics
   */
  async getStats(filters = {}) {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) throw new Error('User not authenticated');

      let query = supabase
        .from('refunds')
        .select('refund_amount, status, refund_reason, platform_name, created_at', { count: 'exact' });

      if (filters.branch_id) {
        query = query.eq('branch_id', filters.branch_id);
      }
      if (filters.date_from) {
        query = query.gte('refund_request_time', filters.date_from);
      }
      if (filters.date_to) {
        query = query.lte('refund_request_time', filters.date_to);
      }

      const { data, error, count } = await query;
      if (error) throw error;

      // Calculate statistics
      const total = count || 0;
      const totalAmount = data?.reduce((sum, r) => sum + (parseFloat(r.refund_amount) || 0), 0) || 0;
      const avgAmount = total > 0 ? totalAmount / total : 0;

      const byStatus = {};
      const byPlatform = {};
      const byReason = {};

      data?.forEach(refund => {
        byStatus[refund.status] = (byStatus[refund.status] || 0) + 1;
        byPlatform[refund.platform_name] = (byPlatform[refund.platform_name] || 0) + 1;
        byReason[refund.refund_reason] = (byReason[refund.refund_reason] || 0) + 1;
      });

      return {
        data: {
          total,
          totalAmount,
          avgAmount,
          byStatus,
          byPlatform,
          byReason
        },
        error: null
      };
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      return { data: null, error };
    }
  }
};

export default {
  refunds: refundsService,
  evidence: evidenceService,
  inspection: inspectionService,
  templates: templateService,
  analytics: analyticsService
};
