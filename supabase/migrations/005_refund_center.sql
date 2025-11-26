-- =====================================================
-- Migration 005: Refund Center - Inspection & Messaging System
-- Purpose: Add inspection, evidence, and message template functionality
-- =====================================================

-- =====================================================
-- 1. REFUND INSPECTIONS TABLE
-- Stores automated inspection results for refunds
-- =====================================================
CREATE TABLE IF NOT EXISTS refund_inspections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  refund_id UUID NOT NULL REFERENCES refunds(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Inspection checklist (JSONB structure)
  checklist JSONB NOT NULL DEFAULT '{
    "has_order_id": false,
    "has_amount": false,
    "has_reason": false,
    "has_receipt_evidence": false,
    "has_photo_evidence": false,
    "has_time_evidence": false,
    "claim_matches_evidence": "unknown",
    "repeated_customer_pattern": false,
    "internal_possible_fault": "unknown",
    "missing_required_info": []
  }',

  -- Inspection results
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100), -- 0-100 dispute worthiness
  decision TEXT NOT NULL CHECK (decision IN ('DISPUTE', 'ACCEPT', 'NEED_INFO')),

  -- Justification (bullet points stored as array)
  justification JSONB NOT NULL DEFAULT '[]', -- Array of bullet points

  -- Additional recommendations
  recommended_actions JSONB DEFAULT '[]',

  -- AI metadata
  ai_confidence DECIMAL(5, 2) DEFAULT 0, -- 0-100

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for refund_inspections
CREATE INDEX IF NOT EXISTS idx_refund_inspections_refund_id ON refund_inspections(refund_id);
CREATE INDEX IF NOT EXISTS idx_refund_inspections_user_id ON refund_inspections(user_id);
CREATE INDEX IF NOT EXISTS idx_refund_inspections_decision ON refund_inspections(decision);
CREATE INDEX IF NOT EXISTS idx_refund_inspections_score ON refund_inspections(score DESC);
CREATE INDEX IF NOT EXISTS idx_refund_inspections_created_at ON refund_inspections(created_at DESC);

-- =====================================================
-- 2. REFUND EVIDENCE TABLE
-- Stores evidence files and documentation for refunds
-- =====================================================
CREATE TABLE IF NOT EXISTS refund_evidence (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  refund_id UUID NOT NULL REFERENCES refunds(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Evidence type
  type TEXT NOT NULL CHECK (type IN (
    'RECEIPT',
    'PREP_TIME',
    'DELIVERY_TIME',
    'GPS',
    'PHOTO',
    'PACKAGING',
    'CHAT',
    'VIDEO',
    'AUDIO',
    'OTHER'
  )),

  -- File information
  file_url TEXT, -- Supabase Storage URL or external URL
  file_name TEXT,
  file_size_bytes INTEGER,
  file_type TEXT, -- mime type: image/jpeg, application/pdf, etc.

  -- Evidence details
  notes TEXT,
  metadata JSONB DEFAULT '{}', -- Additional structured data

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for refund_evidence
CREATE INDEX IF NOT EXISTS idx_refund_evidence_refund_id ON refund_evidence(refund_id);
CREATE INDEX IF NOT EXISTS idx_refund_evidence_user_id ON refund_evidence(user_id);
CREATE INDEX IF NOT EXISTS idx_refund_evidence_type ON refund_evidence(type);
CREATE INDEX IF NOT EXISTS idx_refund_evidence_created_at ON refund_evidence(created_at DESC);

-- =====================================================
-- 3. REFUND MESSAGE TEMPLATES TABLE
-- Stores customizable message templates for disputes
-- =====================================================
CREATE TABLE IF NOT EXISTS refund_message_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL = system template

  -- Template matching criteria
  platform TEXT DEFAULT 'ANY', -- Platform code or 'ANY' for all
  reason_code TEXT DEFAULT 'ANY', -- Reason code or 'ANY' for all
  language TEXT NOT NULL CHECK (language IN ('ar', 'en', 'ar_formal', 'en_formal')),

  -- Template content
  template_name TEXT NOT NULL,
  subject_template TEXT NOT NULL,
  body_template TEXT NOT NULL, -- Supports placeholders: {{order_id}}, {{amount}}, {{date}}, {{currency}}, {{bullets}}, {{ask}}

  -- Template metadata
  is_active BOOLEAN DEFAULT true,
  is_system BOOLEAN DEFAULT false, -- System templates can't be deleted
  usage_count INTEGER DEFAULT 0,

  -- Priority (for template selection)
  priority INTEGER DEFAULT 50, -- Higher priority templates are selected first

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for refund_message_templates
CREATE INDEX IF NOT EXISTS idx_refund_templates_user_id ON refund_message_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_refund_templates_platform ON refund_message_templates(platform);
CREATE INDEX IF NOT EXISTS idx_refund_templates_reason_code ON refund_message_templates(reason_code);
CREATE INDEX IF NOT EXISTS idx_refund_templates_language ON refund_message_templates(language);
CREATE INDEX IF NOT EXISTS idx_refund_templates_active ON refund_message_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_refund_templates_priority ON refund_message_templates(priority DESC);

-- =====================================================
-- 4. ADD MISSING COLUMNS TO EXISTING REFUNDS TABLE
-- (Only if they don't exist)
-- =====================================================

-- Add currency column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='refunds' AND column_name='currency') THEN
    ALTER TABLE refunds ADD COLUMN currency TEXT DEFAULT 'SAR';
  END IF;
END $$;

-- Add reason_code column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='refunds' AND column_name='reason_code') THEN
    ALTER TABLE refunds ADD COLUMN reason_code TEXT;

    -- Create index
    CREATE INDEX IF NOT EXISTS idx_refunds_reason_code ON refunds(reason_code);
  END IF;
END $$;

-- Add reason_text column if it doesn't exist (alias for refund_reason)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='refunds' AND column_name='reason_text') THEN
    ALTER TABLE refunds ADD COLUMN reason_text TEXT;
  END IF;
END $$;

-- Add customer_claim column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='refunds' AND column_name='customer_claim') THEN
    ALTER TABLE refunds ADD COLUMN customer_claim TEXT;
  END IF;
END $$;

-- Add order_date column if it doesn't exist (alias for order_time)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='refunds' AND column_name='order_date') THEN
    ALTER TABLE refunds ADD COLUMN order_date TIMESTAMPTZ;
  END IF;
END $$;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE refund_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE refund_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE refund_message_templates ENABLE ROW LEVEL SECURITY;

-- Policies for refund_inspections
CREATE POLICY "Users can view their own refund inspections"
  ON refund_inspections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own refund inspections"
  ON refund_inspections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own refund inspections"
  ON refund_inspections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own refund inspections"
  ON refund_inspections FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for refund_evidence
CREATE POLICY "Users can view their own refund evidence"
  ON refund_evidence FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own refund evidence"
  ON refund_evidence FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own refund evidence"
  ON refund_evidence FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own refund evidence"
  ON refund_evidence FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for refund_message_templates
-- Users can view system templates + their own templates
CREATE POLICY "Users can view system and own templates"
  ON refund_message_templates FOR SELECT
  USING (is_system = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own templates"
  ON refund_message_templates FOR INSERT
  WITH CHECK (auth.uid() = user_id AND is_system = false);

CREATE POLICY "Users can update their own templates"
  ON refund_message_templates FOR UPDATE
  USING (auth.uid() = user_id AND is_system = false);

CREATE POLICY "Users can delete their own templates"
  ON refund_message_templates FOR DELETE
  USING (auth.uid() = user_id AND is_system = false);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

CREATE TRIGGER update_refund_inspections_updated_at
  BEFORE UPDATE ON refund_inspections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_refund_evidence_updated_at
  BEFORE UPDATE ON refund_evidence
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_refund_message_templates_updated_at
  BEFORE UPDATE ON refund_message_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SEED DATA: DEFAULT MESSAGE TEMPLATES
-- =====================================================

-- Template 1: General Arabic Objection
INSERT INTO refund_message_templates (
  user_id,
  platform,
  reason_code,
  language,
  template_name,
  subject_template,
  body_template,
  is_system,
  priority
) VALUES (
  NULL,
  'ANY',
  'ANY',
  'ar',
  'اعتراض عام - عربي',
  'اعتراض على طلب خصم/Refund — طلب رقم {{order_id}}',
  'مرحبًا فريق الدعم،

نود الاعتراض على خصم/Refund الخاص بالطلب رقم {{order_id}} بتاريخ {{date}} بقيمة {{amount}} {{currency}}.

بعد مراجعة الطلب، توصلنا للنقاط التالية:

{{bullets}}

نرجو إعادة تقييم الحالة ورفع الخصم في حال توافق الأدلة مع ما سبق.

{{ask}}

شكرًا لكم،
فريق العمليات',
  true,
  100
) ON CONFLICT DO NOTHING;

-- Template 2: Missing Item - Arabic
INSERT INTO refund_message_templates (
  user_id,
  platform,
  reason_code,
  language,
  template_name,
  subject_template,
  body_template,
  is_system,
  priority
) VALUES (
  NULL,
  'ANY',
  'MISSING_ITEM',
  'ar',
  'صنف مفقود - عربي',
  'اعتراض على خصم صنف مفقود — طلب رقم {{order_id}}',
  'مرحبًا فريق الدعم،

نود الاعتراض على خصم الصنف المفقود للطلب رقم {{order_id}} بتاريخ {{date}} بقيمة {{amount}} {{currency}}.

بعد مراجعة الطلب والأدلة المتوفرة، نوضح التالي:

{{bullets}}

لدينا إيصال كامل وصور التغليف التي تثبت اكتمال جميع الأصناف قبل التسليم.

{{ask}}

يرجى تزويدنا بتفاصيل الصنف المفقود المحدد وصورة من العميل إن أمكن.

شكرًا لتفهمكم،
فريق العمليات',
  true,
  90
) ON CONFLICT DO NOTHING;

-- Template 3: Late Delivery - Arabic
INSERT INTO refund_message_templates (
  user_id,
  platform,
  reason_code,
  language,
  template_name,
  subject_template,
  body_template,
  is_system,
  priority
) VALUES (
  NULL,
  'ANY',
  'LATE',
  'ar',
  'تأخير التوصيل - عربي',
  'اعتراض على خصم تأخير التوصيل — طلب رقم {{order_id}}',
  'مرحبًا فريق الدعم،

نود الاعتراض على خصم التأخير للطلب رقم {{order_id}} بتاريخ {{date}} بقيمة {{amount}} {{currency}}.

بعد مراجعة سجلات التوقيت، نوضح التالي:

{{bullets}}

جميع التوقيتات الداخلية تؤكد التزامنا بمدة التحضير والتسليم حسب SLA المتفق عليه.

{{ask}}

يرجى تزويدنا بسجل توقيتات السائق والتحديثات من جانبكم للمقارنة.

شكرًا لتعاونكم،
فريق العمليات',
  true,
  90
) ON CONFLICT DO NOTHING;

-- Template 4: Quality Issue - Arabic
INSERT INTO refund_message_templates (
  user_id,
  platform,
  reason_code,
  language,
  template_name,
  subject_template,
  body_template,
  is_system,
  priority
) VALUES (
  NULL,
  'ANY',
  'QUALITY',
  'ar',
  'مشكلة جودة - عربي',
  'اعتراض على خصم مشكلة الجودة — طلب رقم {{order_id}}',
  'مرحبًا فريق الدعم،

نود الاعتراض على خصم الجودة للطلب رقم {{order_id}} بتاريخ {{date}} بقيمة {{amount}} {{currency}}.

بعد مراجعة معايير الجودة والتحضير، نوضح التالي:

{{bullets}}

{{ask}}

يرجى تزويدنا بصور من العميل توضح المشكلة المزعومة للمراجعة والتقييم.

شكرًا لكم،
فريق الجودة',
  true,
  85
) ON CONFLICT DO NOTHING;

-- Template 5: General English Objection
INSERT INTO refund_message_templates (
  user_id,
  platform,
  reason_code,
  language,
  template_name,
  subject_template,
  body_template,
  is_system,
  priority
) VALUES (
  NULL,
  'ANY',
  'ANY',
  'en',
  'General Objection - English',
  'Refund Objection — Order #{{order_id}}',
  'Dear Support Team,

We would like to formally object to the refund deduction for Order #{{order_id}} dated {{date}} amounting to {{amount}} {{currency}}.

After thorough review, we have identified the following points:

{{bullets}}

We kindly request a reassessment of this case and reversal of the deduction if the evidence supports our position.

{{ask}}

Thank you for your consideration,
Operations Team',
  true,
  100
) ON CONFLICT DO NOTHING;

-- Template 6: Wrong Order - Arabic
INSERT INTO refund_message_templates (
  user_id,
  platform,
  reason_code,
  language,
  template_name,
  subject_template,
  body_template,
  is_system,
  priority
) VALUES (
  NULL,
  'ANY',
  'WRONG_ORDER',
  'ar',
  'طلب خاطئ - عربي',
  'اعتراض على خصم طلب خاطئ — طلب رقم {{order_id}}',
  'مرحبًا فريق الدعم،

نود الاعتراض على خصم الطلب الخاطئ للطلب رقم {{order_id}} بتاريخ {{date}} بقيمة {{amount}} {{currency}}.

بعد مراجعة تفاصيل الطلب والتحضير، نوضح التالي:

{{bullets}}

لدينا إيصال كامل يطابق تفاصيل الطلب الأصلي بدقة.

{{ask}}

يرجى تزويدنا بتفاصيل العناصر الخاطئة المزعومة للمقارنة.

شكرًا لكم،
فريق العمليات',
  true,
  88
) ON CONFLICT DO NOTHING;

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to get best matching template
CREATE OR REPLACE FUNCTION get_best_message_template(
  p_user_id UUID,
  p_platform TEXT,
  p_reason_code TEXT,
  p_language TEXT DEFAULT 'ar'
)
RETURNS UUID AS $$
DECLARE
  v_template_id UUID;
BEGIN
  -- Try exact match first (platform + reason + language)
  SELECT id INTO v_template_id
  FROM refund_message_templates
  WHERE is_active = true
    AND (user_id = p_user_id OR is_system = true)
    AND platform = p_platform
    AND reason_code = p_reason_code
    AND language = p_language
  ORDER BY
    CASE WHEN user_id = p_user_id THEN 1 ELSE 2 END, -- User templates first
    priority DESC
  LIMIT 1;

  IF v_template_id IS NOT NULL THEN
    RETURN v_template_id;
  END IF;

  -- Try platform + ANY reason
  SELECT id INTO v_template_id
  FROM refund_message_templates
  WHERE is_active = true
    AND (user_id = p_user_id OR is_system = true)
    AND platform = p_platform
    AND reason_code = 'ANY'
    AND language = p_language
  ORDER BY
    CASE WHEN user_id = p_user_id THEN 1 ELSE 2 END,
    priority DESC
  LIMIT 1;

  IF v_template_id IS NOT NULL THEN
    RETURN v_template_id;
  END IF;

  -- Try ANY platform + specific reason
  SELECT id INTO v_template_id
  FROM refund_message_templates
  WHERE is_active = true
    AND (user_id = p_user_id OR is_system = true)
    AND platform = 'ANY'
    AND reason_code = p_reason_code
    AND language = p_language
  ORDER BY
    CASE WHEN user_id = p_user_id THEN 1 ELSE 2 END,
    priority DESC
  LIMIT 1;

  IF v_template_id IS NOT NULL THEN
    RETURN v_template_id;
  END IF;

  -- Fallback to ANY + ANY (general template)
  SELECT id INTO v_template_id
  FROM refund_message_templates
  WHERE is_active = true
    AND (user_id = p_user_id OR is_system = true)
    AND platform = 'ANY'
    AND reason_code = 'ANY'
    AND language = p_language
  ORDER BY
    CASE WHEN user_id = p_user_id THEN 1 ELSE 2 END,
    priority DESC
  LIMIT 1;

  RETURN v_template_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE refund_inspections IS 'Stores automated inspection results for refunds with scoring and decision logic';
COMMENT ON TABLE refund_evidence IS 'Stores evidence files and documentation supporting refund decisions';
COMMENT ON TABLE refund_message_templates IS 'Customizable message templates for refund dispute communications';
COMMENT ON FUNCTION get_best_message_template IS 'Finds the most appropriate message template based on platform, reason, and language';
