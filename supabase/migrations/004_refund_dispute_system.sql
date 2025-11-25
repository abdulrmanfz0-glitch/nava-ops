-- =====================================================
-- Migration 004: Refund & Dispute Intelligence System
-- DeliveryOps MAX AI - Refund & Dispute Engine
-- =====================================================

-- =====================================================
-- 1. DELIVERY PLATFORMS TABLE
-- Stores information about food delivery platforms
-- =====================================================
CREATE TABLE IF NOT EXISTS delivery_platforms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Platform information
  platform_name TEXT NOT NULL, -- Jahez, HungerStation, Marsool, Talabat, Careem
  platform_code TEXT NOT NULL, -- jahez, hungerstation, marsool, talabat, careem

  -- Platform configuration
  api_key TEXT,
  api_secret TEXT,
  store_id TEXT,
  is_active BOOLEAN DEFAULT true,

  -- Platform-specific settings
  platform_settings JSONB DEFAULT '{}',

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for delivery_platforms
CREATE INDEX IF NOT EXISTS idx_delivery_platforms_user_id ON delivery_platforms(user_id);
CREATE INDEX IF NOT EXISTS idx_delivery_platforms_platform_code ON delivery_platforms(platform_code);
CREATE INDEX IF NOT EXISTS idx_delivery_platforms_active ON delivery_platforms(is_active);

-- =====================================================
-- 2. REFUNDS TABLE
-- Stores all refund requests from delivery platforms
-- =====================================================
CREATE TABLE IF NOT EXISTS refunds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  platform_id UUID REFERENCES delivery_platforms(id) ON DELETE SET NULL,

  -- Order information
  platform_order_id TEXT NOT NULL, -- Order ID from delivery platform
  platform_name TEXT NOT NULL, -- Jahez, HungerStation, etc.

  -- Refund details
  refund_type TEXT NOT NULL, -- full, partial, item
  refund_reason TEXT NOT NULL, -- late_delivery, wrong_order, missing_items, quality_issue, etc.
  refund_amount DECIMAL(10, 2) NOT NULL,
  original_order_amount DECIMAL(10, 2) NOT NULL,

  -- Items involved in refund
  refunded_items JSONB DEFAULT '[]', -- Array of items with quantities

  -- Customer information
  customer_name TEXT,
  customer_phone TEXT,
  customer_id TEXT, -- Platform customer ID

  -- Driver information
  driver_name TEXT,
  driver_id TEXT,

  -- Timing information
  order_time TIMESTAMPTZ,
  delivery_time TIMESTAMPTZ,
  refund_request_time TIMESTAMPTZ NOT NULL,
  preparation_duration_minutes INTEGER,
  delivery_duration_minutes INTEGER,

  -- Status
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected, disputed, resolved

  -- AI Analysis
  fraud_score DECIMAL(5, 2) DEFAULT 0, -- 0-100 fraud probability
  risk_level TEXT DEFAULT 'low', -- low, medium, high, critical

  -- Root cause analysis
  root_cause TEXT,
  responsible_department TEXT, -- kitchen, packaging, delivery, platform

  -- Financial impact
  estimated_loss DECIMAL(10, 2),
  recovery_potential DECIMAL(10, 2),

  -- Platform response
  platform_response JSONB,
  platform_decision TEXT, -- approved, rejected, partial
  platform_decision_date TIMESTAMPTZ,

  -- Metadata
  additional_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for refunds
CREATE INDEX IF NOT EXISTS idx_refunds_user_id ON refunds(user_id);
CREATE INDEX IF NOT EXISTS idx_refunds_branch_id ON refunds(branch_id);
CREATE INDEX IF NOT EXISTS idx_refunds_platform_id ON refunds(platform_id);
CREATE INDEX IF NOT EXISTS idx_refunds_status ON refunds(status);
CREATE INDEX IF NOT EXISTS idx_refunds_platform_order_id ON refunds(platform_order_id);
CREATE INDEX IF NOT EXISTS idx_refunds_refund_request_time ON refunds(refund_request_time DESC);
CREATE INDEX IF NOT EXISTS idx_refunds_fraud_score ON refunds(fraud_score DESC);
CREATE INDEX IF NOT EXISTS idx_refunds_risk_level ON refunds(risk_level);
CREATE INDEX IF NOT EXISTS idx_refunds_customer_id ON refunds(customer_id);

-- =====================================================
-- 3. DISPUTES TABLE
-- Stores dispute responses to refund requests
-- =====================================================
CREATE TABLE IF NOT EXISTS disputes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  refund_id UUID NOT NULL REFERENCES refunds(id) ON DELETE CASCADE,

  -- Dispute information
  dispute_level TEXT NOT NULL, -- light, moderate, strong, hard, aggressive
  objection_text TEXT NOT NULL,

  -- Evidence
  evidence_items JSONB DEFAULT '[]', -- Photos, timestamps, logs
  supporting_data JSONB DEFAULT '{}',

  -- AI Generation metadata
  generated_by_ai BOOLEAN DEFAULT true,
  ai_confidence DECIMAL(5, 2) DEFAULT 0, -- 0-100

  -- Status
  status TEXT NOT NULL DEFAULT 'draft', -- draft, submitted, under_review, accepted, rejected

  -- Platform response
  platform_response TEXT,
  platform_decision TEXT,
  resolution_notes TEXT,

  -- Timestamps
  submitted_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for disputes
CREATE INDEX IF NOT EXISTS idx_disputes_user_id ON disputes(user_id);
CREATE INDEX IF NOT EXISTS idx_disputes_refund_id ON disputes(refund_id);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON disputes(status);
CREATE INDEX IF NOT EXISTS idx_disputes_submitted_at ON disputes(submitted_at DESC);

-- =====================================================
-- 4. CUSTOMER BEHAVIOR TABLE
-- Tracks customer patterns for fraud detection
-- =====================================================
CREATE TABLE IF NOT EXISTS customer_behavior (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Customer identification
  customer_id TEXT NOT NULL, -- Platform customer ID
  platform_name TEXT NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,

  -- Behavior metrics
  total_orders INTEGER DEFAULT 0,
  total_refund_requests INTEGER DEFAULT 0,
  approved_refunds INTEGER DEFAULT 0,
  rejected_refunds INTEGER DEFAULT 0,
  disputed_refunds INTEGER DEFAULT 0,

  -- Financial metrics
  total_spent DECIMAL(10, 2) DEFAULT 0,
  total_refunded DECIMAL(10, 2) DEFAULT 0,
  average_order_value DECIMAL(10, 2) DEFAULT 0,

  -- Refund patterns
  refund_rate DECIMAL(5, 2) DEFAULT 0, -- Percentage
  most_common_refund_reason TEXT,
  refund_frequency_days DECIMAL(5, 1), -- Average days between refunds

  -- Customer classification
  customer_type TEXT DEFAULT 'normal', -- normal, high_value, repeat_offender, fraud_suspect, sensitive, angry
  fraud_indicators JSONB DEFAULT '[]',

  -- Scores
  fraud_score DECIMAL(5, 2) DEFAULT 0, -- 0-100
  trust_score DECIMAL(5, 2) DEFAULT 100, -- 0-100
  lifetime_value_score DECIMAL(10, 2) DEFAULT 0,

  -- Timing patterns
  first_order_date TIMESTAMPTZ,
  last_order_date TIMESTAMPTZ,
  last_refund_date TIMESTAMPTZ,

  -- Recommendations
  recommended_action TEXT, -- approve, reject, investigate, contact
  recommended_objection_level TEXT, -- light, moderate, strong, hard, aggressive

  -- Notes
  notes TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Unique constraint
  UNIQUE(user_id, customer_id, platform_name)
);

-- Indexes for customer_behavior
CREATE INDEX IF NOT EXISTS idx_customer_behavior_user_id ON customer_behavior(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_behavior_customer_id ON customer_behavior(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_behavior_platform_name ON customer_behavior(platform_name);
CREATE INDEX IF NOT EXISTS idx_customer_behavior_fraud_score ON customer_behavior(fraud_score DESC);
CREATE INDEX IF NOT EXISTS idx_customer_behavior_customer_type ON customer_behavior(customer_type);
CREATE INDEX IF NOT EXISTS idx_customer_behavior_refund_rate ON customer_behavior(refund_rate DESC);

-- =====================================================
-- 5. REFUND PATTERNS TABLE
-- Stores detected patterns and analytics
-- =====================================================
CREATE TABLE IF NOT EXISTS refund_patterns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,

  -- Pattern information
  pattern_type TEXT NOT NULL, -- peak_time, high_refund_item, problematic_driver, packaging_issue, branch_issue
  pattern_name TEXT NOT NULL,
  pattern_description TEXT,

  -- Detection details
  detection_date TIMESTAMPTZ DEFAULT now(),
  date_range_start TIMESTAMPTZ,
  date_range_end TIMESTAMPTZ,

  -- Pattern metrics
  occurrence_count INTEGER DEFAULT 0,
  affected_orders INTEGER DEFAULT 0,
  total_loss DECIMAL(10, 2) DEFAULT 0,

  -- Pattern data
  pattern_details JSONB DEFAULT '{}',

  -- Root cause
  root_cause TEXT,
  responsible_department TEXT,

  -- Recommendations
  corrective_actions JSONB DEFAULT '[]',
  prevention_steps JSONB DEFAULT '[]',
  expected_improvement_percentage DECIMAL(5, 2),

  -- Priority
  severity TEXT DEFAULT 'medium', -- low, medium, high, critical
  priority_score INTEGER DEFAULT 50, -- 0-100

  -- Status
  status TEXT DEFAULT 'active', -- active, resolved, monitoring, ignored

  -- Resolution
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  actual_improvement_percentage DECIMAL(5, 2),

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for refund_patterns
CREATE INDEX IF NOT EXISTS idx_refund_patterns_user_id ON refund_patterns(user_id);
CREATE INDEX IF NOT EXISTS idx_refund_patterns_branch_id ON refund_patterns(branch_id);
CREATE INDEX IF NOT EXISTS idx_refund_patterns_pattern_type ON refund_patterns(pattern_type);
CREATE INDEX IF NOT EXISTS idx_refund_patterns_severity ON refund_patterns(severity);
CREATE INDEX IF NOT EXISTS idx_refund_patterns_status ON refund_patterns(status);
CREATE INDEX IF NOT EXISTS idx_refund_patterns_detection_date ON refund_patterns(detection_date DESC);

-- =====================================================
-- 6. PLATFORM INTELLIGENCE TABLE
-- Stores platform-specific intelligence and rules
-- =====================================================
CREATE TABLE IF NOT EXISTS platform_intelligence (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Platform information
  platform_code TEXT NOT NULL UNIQUE, -- jahez, hungerstation, marsool, talabat, careem
  platform_name TEXT NOT NULL,

  -- Platform characteristics
  refund_approval_rate DECIMAL(5, 2), -- Historical approval rate
  average_response_time_hours INTEGER,
  dispute_success_rate DECIMAL(5, 2),

  -- Algorithm insights
  algorithm_type TEXT, -- rule_based, ai_assisted, manual_review
  key_factors JSONB DEFAULT '[]', -- Factors that affect approval

  -- Best practices
  objection_guidelines JSONB DEFAULT '{}',
  evidence_requirements JSONB DEFAULT '{}',
  language_preferences JSONB DEFAULT '{}',

  -- Fraud detection
  fraud_detection_level TEXT, -- low, medium, high, very_high
  common_fraud_patterns JSONB DEFAULT '[]',

  -- Compensation rules
  compensation_policies JSONB DEFAULT '{}',
  refund_thresholds JSONB DEFAULT '{}',

  -- Success strategies
  winning_strategies JSONB DEFAULT '[]',
  losing_patterns JSONB DEFAULT '[]',

  -- Metadata
  last_updated TIMESTAMPTZ DEFAULT now(),
  data_source TEXT, -- manual, api, analysis

  -- Statistics
  total_refunds_analyzed INTEGER DEFAULT 0,
  total_disputes_analyzed INTEGER DEFAULT 0
);

-- Insert default platform intelligence
INSERT INTO platform_intelligence (platform_code, platform_name, algorithm_type, fraud_detection_level) VALUES
  ('jahez', 'Jahez', 'ai_assisted', 'high'),
  ('hungerstation', 'HungerStation', 'ai_assisted', 'very_high'),
  ('marsool', 'Marsool', 'rule_based', 'medium'),
  ('talabat', 'Talabat', 'ai_assisted', 'high'),
  ('careem', 'Careem', 'ai_assisted', 'high')
ON CONFLICT (platform_code) DO NOTHING;

-- =====================================================
-- 7. REFUND ANALYTICS CACHE TABLE
-- Stores pre-computed analytics for fast retrieval
-- =====================================================
CREATE TABLE IF NOT EXISTS refund_analytics_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,

  -- Time period
  date DATE NOT NULL,
  period_type TEXT NOT NULL, -- daily, weekly, monthly

  -- Refund metrics
  total_refunds INTEGER DEFAULT 0,
  total_refund_amount DECIMAL(10, 2) DEFAULT 0,
  approved_refunds INTEGER DEFAULT 0,
  rejected_refunds INTEGER DEFAULT 0,
  disputed_refunds INTEGER DEFAULT 0,

  -- Refund rates
  refund_rate DECIMAL(5, 2) DEFAULT 0, -- Percentage of total orders
  approval_rate DECIMAL(5, 2) DEFAULT 0,
  dispute_success_rate DECIMAL(5, 2) DEFAULT 0,

  -- Top issues
  top_refund_reasons JSONB DEFAULT '[]',
  top_refunded_items JSONB DEFAULT '[]',
  problematic_drivers JSONB DEFAULT '[]',

  -- Platform breakdown
  platform_breakdown JSONB DEFAULT '{}',

  -- Fraud metrics
  fraud_cases_detected INTEGER DEFAULT 0,
  fraud_amount_prevented DECIMAL(10, 2) DEFAULT 0,

  -- Peak times
  peak_refund_hours JSONB DEFAULT '[]',

  -- Financial impact
  estimated_loss DECIMAL(10, 2) DEFAULT 0,
  recovered_amount DECIMAL(10, 2) DEFAULT 0,

  -- Metadata
  computed_at TIMESTAMPTZ DEFAULT now(),

  -- Unique constraint
  UNIQUE(user_id, branch_id, date, period_type)
);

-- Indexes for refund_analytics_cache
CREATE INDEX IF NOT EXISTS idx_refund_analytics_cache_user_id ON refund_analytics_cache(user_id);
CREATE INDEX IF NOT EXISTS idx_refund_analytics_cache_branch_id ON refund_analytics_cache(branch_id);
CREATE INDEX IF NOT EXISTS idx_refund_analytics_cache_date ON refund_analytics_cache(date DESC);
CREATE INDEX IF NOT EXISTS idx_refund_analytics_cache_period_type ON refund_analytics_cache(period_type);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE delivery_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_behavior ENABLE ROW LEVEL SECURITY;
ALTER TABLE refund_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE refund_analytics_cache ENABLE ROW LEVEL SECURITY;

-- Platform intelligence is read-only for all authenticated users
ALTER TABLE platform_intelligence ENABLE ROW LEVEL SECURITY;

-- Policies for delivery_platforms
CREATE POLICY "Users can view their own platforms"
  ON delivery_platforms FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own platforms"
  ON delivery_platforms FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own platforms"
  ON delivery_platforms FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own platforms"
  ON delivery_platforms FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for refunds
CREATE POLICY "Users can view their own refunds"
  ON refunds FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own refunds"
  ON refunds FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own refunds"
  ON refunds FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own refunds"
  ON refunds FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for disputes
CREATE POLICY "Users can view their own disputes"
  ON disputes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own disputes"
  ON disputes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own disputes"
  ON disputes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own disputes"
  ON disputes FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for customer_behavior
CREATE POLICY "Users can view their own customer behavior"
  ON customer_behavior FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own customer behavior"
  ON customer_behavior FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own customer behavior"
  ON customer_behavior FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own customer behavior"
  ON customer_behavior FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for refund_patterns
CREATE POLICY "Users can view their own refund patterns"
  ON refund_patterns FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own refund patterns"
  ON refund_patterns FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own refund patterns"
  ON refund_patterns FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own refund patterns"
  ON refund_patterns FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for platform_intelligence (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view platform intelligence"
  ON platform_intelligence FOR SELECT
  TO authenticated
  USING (true);

-- Policies for refund_analytics_cache
CREATE POLICY "Users can view their own analytics cache"
  ON refund_analytics_cache FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics cache"
  ON refund_analytics_cache FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analytics cache"
  ON refund_analytics_cache FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analytics cache"
  ON refund_analytics_cache FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_delivery_platforms_updated_at
  BEFORE UPDATE ON delivery_platforms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_refunds_updated_at
  BEFORE UPDATE ON refunds
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_disputes_updated_at
  BEFORE UPDATE ON disputes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_behavior_updated_at
  BEFORE UPDATE ON customer_behavior
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_refund_patterns_updated_at
  BEFORE UPDATE ON refund_patterns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- STORED PROCEDURES / FUNCTIONS
-- =====================================================

-- Function to calculate customer fraud score
CREATE OR REPLACE FUNCTION calculate_customer_fraud_score(
  p_customer_id TEXT,
  p_platform_name TEXT,
  p_user_id UUID
)
RETURNS DECIMAL AS $$
DECLARE
  v_fraud_score DECIMAL := 0;
  v_refund_rate DECIMAL;
  v_total_orders INTEGER;
  v_total_refunds INTEGER;
  v_avg_refund_days DECIMAL;
BEGIN
  -- Get customer metrics
  SELECT
    total_orders,
    total_refund_requests,
    refund_rate,
    refund_frequency_days
  INTO
    v_total_orders,
    v_total_refunds,
    v_refund_rate,
    v_avg_refund_days
  FROM customer_behavior
  WHERE customer_id = p_customer_id
    AND platform_name = p_platform_name
    AND user_id = p_user_id;

  -- If no data, return 0
  IF v_total_orders IS NULL THEN
    RETURN 0;
  END IF;

  -- Score based on refund rate (0-40 points)
  IF v_refund_rate > 50 THEN
    v_fraud_score := v_fraud_score + 40;
  ELSIF v_refund_rate > 30 THEN
    v_fraud_score := v_fraud_score + 30;
  ELSIF v_refund_rate > 15 THEN
    v_fraud_score := v_fraud_score + 20;
  ELSIF v_refund_rate > 5 THEN
    v_fraud_score := v_fraud_score + 10;
  END IF;

  -- Score based on refund frequency (0-30 points)
  IF v_avg_refund_days IS NOT NULL AND v_avg_refund_days < 3 THEN
    v_fraud_score := v_fraud_score + 30;
  ELSIF v_avg_refund_days < 7 THEN
    v_fraud_score := v_fraud_score + 20;
  ELSIF v_avg_refund_days < 14 THEN
    v_fraud_score := v_fraud_score + 10;
  END IF;

  -- Score based on total refunds (0-30 points)
  IF v_total_refunds > 20 THEN
    v_fraud_score := v_fraud_score + 30;
  ELSIF v_total_refunds > 10 THEN
    v_fraud_score := v_fraud_score + 20;
  ELSIF v_total_refunds > 5 THEN
    v_fraud_score := v_fraud_score + 10;
  END IF;

  RETURN LEAST(v_fraud_score, 100);
END;
$$ LANGUAGE plpgsql;

-- Function to get refund statistics for a branch
CREATE OR REPLACE FUNCTION get_refund_statistics(
  p_user_id UUID,
  p_branch_id UUID DEFAULT NULL,
  p_start_date TIMESTAMPTZ DEFAULT now() - interval '30 days',
  p_end_date TIMESTAMPTZ DEFAULT now()
)
RETURNS JSON AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    'total_refunds', COUNT(*),
    'total_amount', COALESCE(SUM(refund_amount), 0),
    'avg_amount', COALESCE(AVG(refund_amount), 0),
    'approved_count', COUNT(*) FILTER (WHERE status = 'approved'),
    'rejected_count', COUNT(*) FILTER (WHERE status = 'rejected'),
    'disputed_count', COUNT(*) FILTER (WHERE status = 'disputed'),
    'fraud_cases', COUNT(*) FILTER (WHERE fraud_score > 70),
    'high_risk_cases', COUNT(*) FILTER (WHERE risk_level = 'high' OR risk_level = 'critical'),
    'top_reasons', (
      SELECT json_agg(reason_data)
      FROM (
        SELECT
          refund_reason,
          COUNT(*) as count,
          SUM(refund_amount) as total_amount
        FROM refunds
        WHERE user_id = p_user_id
          AND (p_branch_id IS NULL OR branch_id = p_branch_id)
          AND refund_request_time BETWEEN p_start_date AND p_end_date
        GROUP BY refund_reason
        ORDER BY count DESC
        LIMIT 5
      ) reason_data
    )
  )
  INTO v_result
  FROM refunds
  WHERE user_id = p_user_id
    AND (p_branch_id IS NULL OR branch_id = p_branch_id)
    AND refund_request_time BETWEEN p_start_date AND p_end_date;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE delivery_platforms IS 'Stores delivery platform connections and configurations';
COMMENT ON TABLE refunds IS 'Stores all refund requests from delivery platforms with AI analysis';
COMMENT ON TABLE disputes IS 'Stores dispute responses generated by AI or manually';
COMMENT ON TABLE customer_behavior IS 'Tracks customer behavior patterns for fraud detection';
COMMENT ON TABLE refund_patterns IS 'Stores detected patterns and analytics insights';
COMMENT ON TABLE platform_intelligence IS 'Stores platform-specific intelligence and best practices';
COMMENT ON TABLE refund_analytics_cache IS 'Pre-computed analytics for fast dashboard loading';
