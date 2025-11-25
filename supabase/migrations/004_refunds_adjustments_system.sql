-- NAVA OPS - Refunds & Adjustments System
-- Migration 004: AI-Powered Revenue Leakage Analysis
-- Purpose: Track refunds, adjustments, and penalties from delivery platforms

-- ============================================================================
-- SETTLEMENT FILES (File Ingestion Tracking)
-- ============================================================================

CREATE TABLE IF NOT EXISTS settlement_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,

  -- File metadata
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'excel', 'csv')),
  file_size_bytes INTEGER,
  file_hash TEXT UNIQUE NOT NULL, -- SHA-256 hash for idempotency

  -- Platform info
  platform_source TEXT NOT NULL, -- 'jahez', 'hungerststation', 'toyo', 'chefz'
  platform_report_date DATE,

  -- Processing status
  upload_status TEXT DEFAULT 'pending' CHECK (upload_status IN (
    'pending',      -- File uploaded, waiting to be processed
    'processing',   -- AI is parsing the file
    'completed',    -- Successfully processed
    'failed',       -- Processing failed
    'duplicate'     -- File already processed (based on hash)
  )),

  -- AI extraction metadata
  extraction_started_at TIMESTAMPTZ,
  extraction_completed_at TIMESTAMPTZ,
  extraction_duration_ms INTEGER,
  ai_model_used TEXT, -- e.g., 'gpt-4o', 'claude-3.5-sonnet'
  ai_tokens_used INTEGER,

  -- Processing results
  total_refunds_found INTEGER DEFAULT 0,
  total_amount_deducted DECIMAL(15, 2) DEFAULT 0,
  matched_orders_count INTEGER DEFAULT 0, -- How many refunds matched with orders
  unmatched_refunds_count INTEGER DEFAULT 0, -- How many couldn't be matched

  -- Error handling
  error_message TEXT,
  error_details JSONB,

  -- Raw file data (for re-processing if needed)
  raw_text TEXT, -- Extracted text from PDF/Excel

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_settlement_files_user_id ON settlement_files(user_id);
CREATE INDEX idx_settlement_files_branch_id ON settlement_files(branch_id);
CREATE INDEX idx_settlement_files_platform ON settlement_files(platform_source);
CREATE INDEX idx_settlement_files_status ON settlement_files(upload_status);
CREATE INDEX idx_settlement_files_hash ON settlement_files(file_hash);
CREATE INDEX idx_settlement_files_created ON settlement_files(created_at DESC);

-- ============================================================================
-- REFUNDS & ADJUSTMENTS (The Core Data)
-- ============================================================================

CREATE TABLE IF NOT EXISTS refunds_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  settlement_file_id UUID REFERENCES settlement_files(id) ON DELETE SET NULL,

  -- Order matching (Fuzzy Match Results)
  matched_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  order_ref_id TEXT, -- The raw order ID from the settlement file
  match_confidence DECIMAL(3, 2), -- 0.00 to 1.00 (1.00 = 100% match)
  match_method TEXT CHECK (match_method IN (
    'exact_order_id',     -- Perfect match on order_number
    'fuzzy_order_id',     -- Close match on order_number (Levenshtein)
    'date_amount_match',  -- Matched via date + amount fallback
    'manual',             -- Manually linked by user
    'unmatched'           -- Could not be matched
  )),

  -- Platform info
  platform_source TEXT NOT NULL,
  transaction_date DATE NOT NULL,
  transaction_time TIME,

  -- Financial details
  amount_deducted DECIMAL(15, 2) NOT NULL, -- Always POSITIVE (e.g., 45.50 not -45.50)
  currency TEXT DEFAULT 'SAR',

  -- Categorization (From AI)
  reason_raw TEXT NOT NULL, -- Original text from settlement (Arabic/English)
  reason_category TEXT CHECK (reason_category IN (
    'quality',      -- Food quality issues (spilled, cold, wrong item)
    'operations',   -- Restaurant operations (late prep, missing items)
    'driver',       -- Driver issues (late delivery, poor service)
    'customer',     -- Customer-initiated (changed mind, wrong address)
    'platform',     -- Platform penalties/fees
    'other'         -- Uncategorized
  )),

  -- AI confidence
  ai_confidence_score DECIMAL(3, 2), -- 0.00 to 1.00

  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending',      -- Needs review
    'confirmed',    -- User confirmed the refund
    'disputed',     -- User is disputing this
    'resolved'      -- Issue resolved
  )),

  -- User actions
  user_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES user_profiles(id),

  -- Metadata
  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_refunds_user_id ON refunds_adjustments(user_id);
CREATE INDEX idx_refunds_branch_id ON refunds_adjustments(branch_id);
CREATE INDEX idx_refunds_settlement_file_id ON refunds_adjustments(settlement_file_id);
CREATE INDEX idx_refunds_order_id ON refunds_adjustments(matched_order_id);
CREATE INDEX idx_refunds_platform ON refunds_adjustments(platform_source);
CREATE INDEX idx_refunds_transaction_date ON refunds_adjustments(transaction_date DESC);
CREATE INDEX idx_refunds_category ON refunds_adjustments(reason_category);
CREATE INDEX idx_refunds_status ON refunds_adjustments(status);
CREATE INDEX idx_refunds_match_method ON refunds_adjustments(match_method);

-- ============================================================================
-- MATCHING ATTEMPTS LOG (Debug & Audit Trail)
-- ============================================================================

CREATE TABLE IF NOT EXISTS refund_matching_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  refund_id UUID NOT NULL REFERENCES refunds_adjustments(id) ON DELETE CASCADE,

  -- Matching attempt details
  attempted_order_id UUID REFERENCES orders(id),
  match_score DECIMAL(5, 4), -- 0.0000 to 1.0000 (detailed score)
  match_algorithm TEXT, -- 'levenshtein', 'date_amount', 'fuzzy_string'

  -- Why this match was considered
  reasoning TEXT,
  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_matching_log_refund_id ON refund_matching_log(refund_id);

-- ============================================================================
-- ANALYTICS VIEWS (Pre-computed for dashboards)
-- ============================================================================

-- View: Daily Revenue Leakage Summary
CREATE OR REPLACE VIEW daily_revenue_leakage AS
SELECT
  user_id,
  branch_id,
  transaction_date,
  platform_source,
  reason_category,
  COUNT(*) as refund_count,
  SUM(amount_deducted) as total_loss,
  AVG(ai_confidence_score) as avg_confidence,
  SUM(CASE WHEN match_method IN ('exact_order_id', 'fuzzy_order_id') THEN 1 ELSE 0 END) as matched_count,
  SUM(CASE WHEN match_method = 'unmatched' THEN 1 ELSE 0 END) as unmatched_count
FROM refunds_adjustments
GROUP BY user_id, branch_id, transaction_date, platform_source, reason_category
ORDER BY transaction_date DESC;

-- View: Platform Performance (Which app is costing us the most)
CREATE OR REPLACE VIEW platform_refund_stats AS
SELECT
  user_id,
  branch_id,
  platform_source,
  DATE_TRUNC('month', transaction_date) as month,
  COUNT(*) as total_refunds,
  SUM(amount_deducted) as total_loss,
  AVG(amount_deducted) as avg_refund_amount,

  -- Category breakdown
  SUM(CASE WHEN reason_category = 'quality' THEN amount_deducted ELSE 0 END) as quality_loss,
  SUM(CASE WHEN reason_category = 'operations' THEN amount_deducted ELSE 0 END) as operations_loss,
  SUM(CASE WHEN reason_category = 'driver' THEN amount_deducted ELSE 0 END) as driver_loss,

  -- Match quality
  AVG(match_confidence) as avg_match_confidence
FROM refunds_adjustments
GROUP BY user_id, branch_id, platform_source, DATE_TRUNC('month', transaction_date)
ORDER BY total_loss DESC;

-- View: Root Cause Analysis (Top reasons for losses)
CREATE OR REPLACE VIEW refund_root_causes AS
SELECT
  user_id,
  branch_id,
  reason_category,
  reason_raw,
  COUNT(*) as occurrence_count,
  SUM(amount_deducted) as total_impact,
  AVG(amount_deducted) as avg_impact,

  -- Time trends
  MIN(transaction_date) as first_occurrence,
  MAX(transaction_date) as last_occurrence,

  -- Match rate
  SUM(CASE WHEN matched_order_id IS NOT NULL THEN 1 ELSE 0 END)::FLOAT / COUNT(*) as match_rate
FROM refunds_adjustments
GROUP BY user_id, branch_id, reason_category, reason_raw
HAVING COUNT(*) >= 2 -- Only show recurring issues
ORDER BY total_impact DESC;

-- ============================================================================
-- FUNCTIONS (Business Logic)
-- ============================================================================

-- Function: Calculate revenue accuracy
CREATE OR REPLACE FUNCTION calculate_revenue_accuracy(
  p_user_id UUID,
  p_branch_id UUID DEFAULT NULL,
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL
)
RETURNS TABLE(
  reported_revenue DECIMAL,
  actual_revenue DECIMAL,
  total_refunds DECIMAL,
  accuracy_percentage DECIMAL,
  refund_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH order_totals AS (
    SELECT
      SUM(total) as total_revenue
    FROM orders
    WHERE user_id = p_user_id
      AND (p_branch_id IS NULL OR branch_id = p_branch_id)
      AND (p_start_date IS NULL OR order_date >= p_start_date)
      AND (p_end_date IS NULL OR order_date <= p_end_date)
      AND status NOT IN ('cancelled', 'refunded')
  ),
  refund_totals AS (
    SELECT
      SUM(amount_deducted) as total_refunds,
      COUNT(*) as refund_count
    FROM refunds_adjustments
    WHERE user_id = p_user_id
      AND (p_branch_id IS NULL OR branch_id = p_branch_id)
      AND (p_start_date IS NULL OR transaction_date >= p_start_date)
      AND (p_end_date IS NULL OR transaction_date <= p_end_date)
  )
  SELECT
    COALESCE(order_totals.total_revenue, 0) as reported_revenue,
    COALESCE(order_totals.total_revenue, 0) - COALESCE(refund_totals.total_refunds, 0) as actual_revenue,
    COALESCE(refund_totals.total_refunds, 0) as total_refunds,
    CASE
      WHEN COALESCE(order_totals.total_revenue, 0) > 0 THEN
        ((COALESCE(order_totals.total_revenue, 0) - COALESCE(refund_totals.total_refunds, 0)) /
         COALESCE(order_totals.total_revenue, 0)) * 100
      ELSE 0
    END as accuracy_percentage,
    COALESCE(refund_totals.refund_count, 0)::INTEGER as refund_count
  FROM order_totals, refund_totals;
END;
$$ LANGUAGE plpgsql;

-- Function: Update settlement file stats after refund insertion
CREATE OR REPLACE FUNCTION update_settlement_file_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE settlement_files
  SET
    total_refunds_found = (
      SELECT COUNT(*)
      FROM refunds_adjustments
      WHERE settlement_file_id = NEW.settlement_file_id
    ),
    total_amount_deducted = (
      SELECT COALESCE(SUM(amount_deducted), 0)
      FROM refunds_adjustments
      WHERE settlement_file_id = NEW.settlement_file_id
    ),
    matched_orders_count = (
      SELECT COUNT(*)
      FROM refunds_adjustments
      WHERE settlement_file_id = NEW.settlement_file_id
        AND matched_order_id IS NOT NULL
    ),
    unmatched_refunds_count = (
      SELECT COUNT(*)
      FROM refunds_adjustments
      WHERE settlement_file_id = NEW.settlement_file_id
        AND matched_order_id IS NULL
    ),
    updated_at = NOW()
  WHERE id = NEW.settlement_file_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update settlement file stats
CREATE TRIGGER trigger_update_settlement_stats
AFTER INSERT OR UPDATE OR DELETE ON refunds_adjustments
FOR EACH ROW
EXECUTE FUNCTION update_settlement_file_stats();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE settlement_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE refund_matching_log ENABLE ROW LEVEL SECURITY;

-- Settlement Files Policies
CREATE POLICY "Users can view their own settlement files"
  ON settlement_files FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settlement files"
  ON settlement_files FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settlement files"
  ON settlement_files FOR UPDATE
  USING (auth.uid() = user_id);

-- Refunds & Adjustments Policies
CREATE POLICY "Users can view their own refunds"
  ON refunds_adjustments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own refunds"
  ON refunds_adjustments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own refunds"
  ON refunds_adjustments FOR UPDATE
  USING (auth.uid() = user_id);

-- Matching Log Policies
CREATE POLICY "Users can view matching logs for their refunds"
  ON refund_matching_log FOR SELECT
  USING (
    refund_id IN (
      SELECT id FROM refunds_adjustments WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- SAMPLE DATA FOR TESTING
-- ============================================================================

-- Note: Insert sample data only in development environment
-- COMMENT: Uncomment the following for local testing

/*
-- Sample settlement file
INSERT INTO settlement_files (
  user_id,
  branch_id,
  file_name,
  file_type,
  file_hash,
  platform_source,
  platform_report_date,
  upload_status,
  total_refunds_found,
  total_amount_deducted,
  ai_model_used
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- Replace with real user_id
  NULL,
  'jahez_settlement_nov_2025.pdf',
  'pdf',
  'abc123hash',
  'jahez',
  '2025-11-01',
  'completed',
  5,
  250.00,
  'gpt-4o'
);
*/
