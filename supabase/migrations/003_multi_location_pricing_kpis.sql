-- Multi-Location Pricing & Branch KPIs Migration
-- This migration adds support for per-branch pricing ($299 base brand + $99 per branch)
-- and comprehensive KPI tracking at the branch level

-- ============================================================================
-- 1. MULTI-LOCATION PRICING TABLE
-- ============================================================================
-- Stores pricing configuration for multi-location brands
CREATE TABLE IF NOT EXISTS multi_location_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    subscription_id UUID NOT NULL REFERENCES user_subscriptions(id) ON DELETE CASCADE,

    -- Pricing structure
    base_brand_price DECIMAL(10,2) NOT NULL DEFAULT 299.00, -- $299 per brand
    per_branch_price DECIMAL(10,2) NOT NULL DEFAULT 99.00, -- $99 per additional branch

    -- Active branches count
    active_branches_count INTEGER NOT NULL DEFAULT 1,

    -- Calculated totals
    total_monthly_price DECIMAL(10,2) NOT NULL,
    total_yearly_price DECIMAL(10,2) NOT NULL,

    -- Billing cycle
    billing_cycle TEXT NOT NULL DEFAULT 'monthly', -- monthly, yearly

    -- Status
    is_active BOOLEAN NOT NULL DEFAULT true,
    effective_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    effective_to TIMESTAMPTZ,

    -- Metadata
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_multi_location_pricing_user_id ON multi_location_pricing(user_id);
CREATE INDEX idx_multi_location_pricing_subscription_id ON multi_location_pricing(subscription_id);
CREATE INDEX idx_multi_location_pricing_is_active ON multi_location_pricing(is_active);

-- ============================================================================
-- 2. BRANCH KPIs TABLE
-- ============================================================================
-- Stores Key Performance Indicators per branch for comprehensive analytics
CREATE TABLE IF NOT EXISTS branch_kpis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,

    -- Time period
    period_date DATE NOT NULL,
    period_type TEXT NOT NULL DEFAULT 'daily', -- daily, weekly, monthly, yearly

    -- Sales KPIs
    total_revenue DECIMAL(15,2) NOT NULL DEFAULT 0,
    total_orders INTEGER NOT NULL DEFAULT 0,
    average_order_value DECIMAL(10,2) NOT NULL DEFAULT 0,

    -- Customer KPIs
    unique_customers INTEGER NOT NULL DEFAULT 0,
    returning_customers INTEGER NOT NULL DEFAULT 0,
    customer_retention_rate DECIMAL(5,2) NOT NULL DEFAULT 0, -- percentage

    -- Product KPIs
    items_sold INTEGER NOT NULL DEFAULT 0,
    top_product_name TEXT,
    top_product_revenue DECIMAL(15,2) DEFAULT 0,

    -- Performance KPIs
    peak_hour TEXT,
    peak_hour_revenue DECIMAL(15,2) DEFAULT 0,
    avg_transaction_time DECIMAL(5,2) DEFAULT 0, -- in minutes

    -- Operational KPIs
    inventory_turnover DECIMAL(8,2) DEFAULT 0,
    stock_out_incidents INTEGER DEFAULT 0,
    product_variety_sold INTEGER DEFAULT 0,

    -- Profitability KPIs
    total_cost DECIMAL(15,2) DEFAULT 0,
    gross_profit DECIMAL(15,2) NOT NULL DEFAULT 0,
    gross_profit_margin DECIMAL(5,2) NOT NULL DEFAULT 0, -- percentage

    -- Growth KPIs
    revenue_growth_percent DECIMAL(5,2) DEFAULT 0, -- compared to previous period
    order_growth_percent DECIMAL(5,2) DEFAULT 0,
    customer_growth_percent DECIMAL(5,2) DEFAULT 0,

    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(branch_id, period_date, period_type)
);

CREATE INDEX idx_branch_kpis_branch_id ON branch_kpis(branch_id);
CREATE INDEX idx_branch_kpis_user_id ON branch_kpis(user_id);
CREATE INDEX idx_branch_kpis_period_date ON branch_kpis(period_date);
CREATE INDEX idx_branch_kpis_period_type ON branch_kpis(period_type);

-- ============================================================================
-- 3. BRANCH KPI TARGETS TABLE
-- ============================================================================
-- Stores target KPIs for branches to track performance against goals
CREATE TABLE IF NOT EXISTS branch_kpi_targets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,

    -- Target period
    fiscal_year INTEGER NOT NULL,
    fiscal_quarter TEXT,

    -- Sales targets
    target_revenue DECIMAL(15,2),
    target_orders INTEGER,
    target_avg_order_value DECIMAL(10,2),

    -- Customer targets
    target_unique_customers INTEGER,
    target_retention_rate DECIMAL(5,2),

    -- Profitability targets
    target_gross_profit_margin DECIMAL(5,2),
    target_items_sold INTEGER,

    -- Growth targets
    target_revenue_growth_percent DECIMAL(5,2),
    target_order_growth_percent DECIMAL(5,2),

    -- Status
    is_active BOOLEAN NOT NULL DEFAULT true,

    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_branch_kpi_targets_branch_id ON branch_kpi_targets(branch_id);
CREATE INDEX idx_branch_kpi_targets_user_id ON branch_kpi_targets(user_id);
CREATE INDEX idx_branch_kpi_targets_fiscal_year ON branch_kpi_targets(fiscal_year);

-- ============================================================================
-- 4. BRANCH KPI COMPARISONS TABLE
-- ============================================================================
-- Stores aggregated KPI data for cross-branch comparisons
CREATE TABLE IF NOT EXISTS branch_kpi_comparisons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,

    -- Branches being compared
    branch_ids UUID[] NOT NULL, -- Array of branch IDs
    branch_count INTEGER NOT NULL,

    -- Comparison period
    period_date DATE NOT NULL,
    period_type TEXT NOT NULL DEFAULT 'monthly',

    -- Aggregated metrics
    total_revenue_all_branches DECIMAL(15,2) NOT NULL DEFAULT 0,
    avg_revenue_per_branch DECIMAL(15,2) NOT NULL DEFAULT 0,
    highest_revenue_branch_id UUID,
    lowest_revenue_branch_id UUID,

    total_orders_all_branches INTEGER NOT NULL DEFAULT 0,
    avg_orders_per_branch INTEGER NOT NULL DEFAULT 0,

    total_customers_all_branches INTEGER NOT NULL DEFAULT 0,
    avg_customers_per_branch INTEGER NOT NULL DEFAULT 0,

    -- Performance metrics
    best_performing_branch_id UUID,
    underperforming_branch_id UUID,

    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_branch_kpi_comparisons_user_id ON branch_kpi_comparisons(user_id);
CREATE INDEX idx_branch_kpi_comparisons_period_date ON branch_kpi_comparisons(period_date);

-- ============================================================================
-- 5. BRANCH SUBSCRIPTION ADDONS TABLE
-- ============================================================================
-- Tracks additional addons/services per branch
CREATE TABLE IF NOT EXISTS branch_subscription_addons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    subscription_id UUID NOT NULL REFERENCES user_subscriptions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,

    -- Addon details
    addon_type TEXT NOT NULL, -- e.g., 'premium_analytics', 'dedicated_support', 'custom_integrations'
    addon_name TEXT NOT NULL,

    -- Pricing
    price_monthly DECIMAL(10,2) NOT NULL,
    price_yearly DECIMAL(10,2),

    -- Status
    is_active BOOLEAN NOT NULL DEFAULT true,
    activated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deactivated_at TIMESTAMPTZ,

    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_branch_subscription_addons_branch_id ON branch_subscription_addons(branch_id);
CREATE INDEX idx_branch_subscription_addons_subscription_id ON branch_subscription_addons(subscription_id);

-- ============================================================================
-- 6. HELPER FUNCTION: Calculate Multi-Location Pricing
-- ============================================================================
CREATE OR REPLACE FUNCTION calculate_multi_location_price(
    branch_count INTEGER,
    base_price DECIMAL DEFAULT 299.00,
    per_branch_price DECIMAL DEFAULT 99.00,
    is_yearly BOOLEAN DEFAULT false
) RETURNS JSONB AS $$
DECLARE
    total_price DECIMAL;
    result JSONB;
BEGIN
    -- Calculate: base_price + (additional_branches * per_branch_price)
    -- where additional_branches = branch_count - 1
    total_price := base_price + (GREATEST(branch_count - 1, 0) * per_branch_price);

    result := jsonb_build_object(
        'base_price', base_price,
        'per_branch_price', per_branch_price,
        'branch_count', branch_count,
        'total_monthly_price', total_price,
        'total_yearly_price', ROUND(total_price * 12 * 0.92, 2), -- 8% annual discount
        'calculation_breakdown', jsonb_build_object(
            'base_brand', base_price,
            'additional_branches', GREATEST(branch_count - 1, 0),
            'additional_branch_cost', ROUND(GREATEST(branch_count - 1, 0) * per_branch_price, 2)
        )
    );

    RETURN result;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- 7. HELPER FUNCTION: Calculate Branch KPI Summary
-- ============================================================================
CREATE OR REPLACE FUNCTION get_branch_kpi_summary(
    p_branch_id UUID,
    p_period_type TEXT DEFAULT 'monthly'
) RETURNS TABLE(
    branch_id UUID,
    total_revenue DECIMAL,
    total_orders INTEGER,
    avg_order_value DECIMAL,
    gross_profit_margin DECIMAL,
    revenue_growth DECIMAL,
    order_growth DECIMAL,
    customer_retention DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        bk.branch_id,
        bk.total_revenue,
        bk.total_orders,
        bk.average_order_value,
        bk.gross_profit_margin,
        bk.revenue_growth_percent,
        bk.order_growth_percent,
        bk.customer_retention_rate
    FROM branch_kpis bk
    WHERE bk.branch_id = p_branch_id
        AND bk.period_type = p_period_type
    ORDER BY bk.period_date DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 8. TRIGGER: Update Multi-Location Pricing on Branch Creation/Deletion
-- ============================================================================
CREATE OR REPLACE FUNCTION update_multi_location_on_branch_change()
RETURNS TRIGGER AS $$
DECLARE
    v_branch_count INTEGER;
    v_pricing JSONB;
    v_user_id UUID;
BEGIN
    -- Get user_id
    IF TG_OP = 'DELETE' THEN
        v_user_id := OLD.user_id;
    ELSE
        v_user_id := NEW.user_id;
    END IF;

    -- Count active branches
    SELECT COUNT(*) INTO v_branch_count
    FROM branches
    WHERE user_id = v_user_id AND status = 'active';

    -- Update branch count in multi_location_pricing
    UPDATE multi_location_pricing
    SET active_branches_count = v_branch_count,
        total_monthly_price = (SELECT (calculate_multi_location_price(v_branch_count, base_brand_price, per_branch_price, false) -> 'total_monthly_price')::DECIMAL),
        total_yearly_price = (SELECT (calculate_multi_location_price(v_branch_count, base_brand_price, per_branch_price, true) -> 'total_yearly_price')::DECIMAL),
        updated_at = NOW()
    WHERE user_id = v_user_id AND is_active = true;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_pricing_on_branch_change
AFTER INSERT OR DELETE ON branches
FOR EACH ROW
EXECUTE FUNCTION update_multi_location_on_branch_change();

-- ============================================================================
-- 9. GRANT PERMISSIONS
-- ============================================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON multi_location_pricing TO authenticated;
GRANT SELECT, INSERT, UPDATE ON branch_kpis TO authenticated;
GRANT SELECT, INSERT, UPDATE ON branch_kpi_targets TO authenticated;
GRANT SELECT ON branch_kpi_comparisons TO authenticated;
GRANT SELECT, INSERT, UPDATE ON branch_subscription_addons TO authenticated;
