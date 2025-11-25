# 📊 NAVA OPS - Refunds & Adjustments System
## AI-Powered Revenue Leakage Analysis

---

## 🎯 Overview

The Refunds & Adjustments System is NAVA OPS's solution to the **biggest gap** in restaurant financial analytics: tracking revenue leakage from delivery platforms.

### The Problem

- **Blind Spot**: POS systems (Foodics) track sales, but delivery platforms (Jahez, HungerStation) don't provide public APIs for refunds/adjustments
- **Inflated Revenue**: Reports show inaccurate profits because refunded amounts aren't deducted
- **No Root Cause Analysis**: Restaurants don't know *why* they're losing money

### The Solution

**AI-Powered File Ingestion Pipeline** that:
1. ✅ Accepts settlement reports (PDF/Excel/CSV) from delivery platforms
2. 🤖 Uses LLM (GPT-4o or Claude 3.5) to extract structured refund data
3. 🎯 Performs fuzzy matching to reconcile refunds with POS orders
4. 📊 Provides actionable insights on revenue leakage causes

---

## 🏗️ System Architecture

```
┌─────────────────┐
│  User Uploads   │
│  Settlement     │──┐
│  File           │  │
└─────────────────┘  │
                     ▼
         ┌───────────────────────┐
         │  File Parser          │
         │  (PDF/Excel → Text)   │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  AI Extraction Engine │
         │  (GPT-4o/Claude 3.5)  │
         │  → Structured JSON    │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Fuzzy Matcher        │
         │  (Match to Orders)    │
         │  - Exact Order ID     │
         │  - Levenshtein        │
         │  - Date+Amount        │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Database Storage     │
         │  (Supabase)           │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Analytics Dashboard  │
         │  (Insights & Reports) │
         └───────────────────────┘
```

---

## 📦 Database Schema

### Tables

#### 1. `settlement_files`
Tracks uploaded files and processing status.

```sql
CREATE TABLE settlement_files (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id),
  branch_id UUID REFERENCES branches(id),

  -- File metadata
  file_name TEXT NOT NULL,
  file_type TEXT CHECK (file_type IN ('pdf', 'excel', 'csv')),
  file_hash TEXT UNIQUE NOT NULL, -- SHA-256 for idempotency

  -- Platform info
  platform_source TEXT, -- 'jahez', 'hungerstation', etc.
  platform_report_date DATE,

  -- Processing status
  upload_status TEXT CHECK (upload_status IN (
    'pending', 'processing', 'completed', 'failed', 'duplicate'
  )),

  -- AI extraction metadata
  ai_model_used TEXT,
  ai_tokens_used INTEGER,
  extraction_duration_ms INTEGER,

  -- Results
  total_refunds_found INTEGER,
  total_amount_deducted DECIMAL(15, 2),
  matched_orders_count INTEGER,

  raw_text TEXT, -- For reprocessing
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2. `refunds_adjustments`
Core refund/adjustment records.

```sql
CREATE TABLE refunds_adjustments (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id),
  settlement_file_id UUID REFERENCES settlement_files(id),

  -- Order matching
  matched_order_id UUID REFERENCES orders(id),
  order_ref_id TEXT, -- Raw order ID from file
  match_confidence DECIMAL(3, 2), -- 0.00 to 1.00
  match_method TEXT CHECK (match_method IN (
    'exact_order_id',     -- Perfect match
    'fuzzy_order_id',     -- Levenshtein distance
    'date_amount_match',  -- Fallback mechanism
    'manual',             -- User-linked
    'unmatched'           -- Could not match
  )),

  -- Platform and transaction
  platform_source TEXT NOT NULL,
  transaction_date DATE NOT NULL,

  -- Financial
  amount_deducted DECIMAL(15, 2) NOT NULL,
  currency TEXT DEFAULT 'SAR',

  -- Categorization (from AI)
  reason_raw TEXT NOT NULL, -- Original language
  reason_category TEXT CHECK (reason_category IN (
    'quality',      -- Food quality issues
    'operations',   -- Restaurant ops (late, missing)
    'driver',       -- Driver issues
    'customer',     -- Customer-initiated
    'platform',     -- Platform penalties
    'other'
  )),

  -- AI confidence
  ai_confidence_score DECIMAL(3, 2),

  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'confirmed', 'disputed', 'resolved'
  )),

  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3. `refund_matching_log`
Debug trail for matching attempts.

```sql
CREATE TABLE refund_matching_log (
  id UUID PRIMARY KEY,
  refund_id UUID REFERENCES refunds_adjustments(id),
  attempted_order_id UUID REFERENCES orders(id),
  match_score DECIMAL(5, 4),
  match_algorithm TEXT,
  reasoning TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🧠 AI Extraction System

### System Prompt

The AI uses a **deterministic prompt** designed to extract only refund events:

**Key Instructions:**
1. **Filter**: Ignore successful deliveries, target only negative transactions
2. **Keywords**: "Refund", "Adjustment", "Penalty", "استرجاع", "تعديل", "غرامة"
3. **Extract**:
   - Order ID (normalized)
   - Amount (convert negative to positive)
   - Reason (preserve original language)
   - Category (quality, operations, driver, other)
   - Confidence score

**Output Format:**
```json
{
  "refunds": [
    {
      "order_ref_id": "JH12345",
      "platform_source": "jahez",
      "transaction_date": "2025-11-20",
      "amount_deducted": 45.50,
      "currency": "SAR",
      "reason_raw": "طلب متسخ - Spilled Item",
      "reason_category": "quality",
      "confidence_score": 0.95
    }
  ]
}
```

### Supported AI Providers

1. **OpenAI GPT-4o** (Default)
   - Model: `gpt-4o`
   - Cost: ~$0.01 per 1,000 tokens
   - Speed: 2-5 seconds per file

2. **Anthropic Claude 3.5 Sonnet**
   - Model: `claude-3-5-sonnet-20241022`
   - Cost: ~$0.008 per 1,000 tokens
   - Speed: 3-6 seconds per file

---

## 🎯 Fuzzy Matching Algorithm

### Strategy Priority

#### Priority 1: Order ID Matching

**Exact Match (Confidence: 1.0)**
```javascript
normalizeOrderId(orderRefId) === normalizeOrderId(order.order_number)
```

**Fuzzy Match (Confidence: 0.70-0.95)**
Uses Levenshtein distance:
```javascript
similarity = 1 - (levenshteinDistance / maxLength)
// Accept if similarity >= 0.70
```

#### Priority 2: Date + Amount Match (Fallback)

When Order ID is unavailable or doesn't match:

```javascript
// Date range: ±7 days
// Amount tolerance: ±5%

dateScore = 1 - (daysDifference / 7)
amountScore = 1 - (amountDifference / amount) / 0.05

confidence = (dateScore * 0.6 + amountScore * 0.4) * 0.8
// Max confidence: 0.8 for this method
```

### Matching Thresholds

| Threshold | Confidence | Meaning |
|-----------|-----------|---------|
| Exact | 1.0 | Perfect match |
| Strong | ≥0.85 | Very likely same order |
| Moderate | ≥0.70 | Probably same order |
| Weak | ≥0.50 | Possibly same order |
| No Match | <0.50 | Different orders |

---

## 🔧 Implementation Guide

### 1. Database Migration

Run the migration:

```bash
# Using Supabase CLI
supabase db push

# Or manually apply
psql -U postgres -d your_database -f supabase/migrations/004_refunds_adjustments_system.sql
```

### 2. Environment Setup

Copy `.env.local.example` to `.env.local` and configure:

```bash
# AI Services (Required)
VITE_OPENAI_API_KEY=sk-your-openai-api-key
# OR
VITE_ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key

# Choose provider
VITE_AI_PROVIDER=openai  # or 'anthropic'
```

### 3. Install Dependencies

All required packages are already in `package.json`:

```json
{
  "dependencies": {
    "xlsx": "^0.18.5",        // Excel parsing
    "@supabase/supabase-js": "^2.80.0"  // Database
  }
}
```

No additional installs needed!

---

## 🚀 Usage

### For End Users

1. **Navigate** to `/refunds-analytics` in NAVA OPS
2. **Upload** settlement report (PDF/Excel/CSV)
3. **Select** platform (or let AI auto-detect)
4. **Click** "Choose File" or drag & drop
5. **Wait** 5-15 seconds for processing
6. **Review** extracted refunds and insights

### For Developers

#### Process a Settlement File

```javascript
import { createRefundProcessor } from '@/lib/refundProcessingService'

const processor = createRefundProcessor(userId, {
  branchId: 'optional-branch-id',
  aiProvider: 'openai', // or 'anthropic'
  skipMatching: false
})

const result = await processor.processSettlementFile(file, {
  platform: 'jahez',  // Optional hint
  reportDate: '2025-11-01'
})

if (result.success) {
  console.log('✅ Processed', result.data.refundsExtracted, 'refunds')
  console.log('Matched:', result.data.matchingSummary.matched)
  console.log('Unmatched:', result.data.matchingSummary.unmatched)
}
```

#### Query Refunds Data

```javascript
import { supabase } from '@/lib/supabase'

// Get all refunds for user
const { data, error } = await supabase
  .from('refunds_adjustments')
  .select('*')
  .eq('user_id', userId)
  .order('transaction_date', { ascending: false })

// Get revenue accuracy
const { data: accuracy } = await supabase
  .rpc('calculate_revenue_accuracy', {
    p_user_id: userId,
    p_start_date: '2025-11-01',
    p_end_date: '2025-11-30'
  })
```

#### Use AI Extractor Standalone

```javascript
import { createRefundExtractor } from '@/lib/aiRefundExtractor'

const extractor = createRefundExtractor('openai')

const result = await extractor.extractRefunds(rawText, 'jahez')

if (result.success) {
  result.data.refunds.forEach(refund => {
    console.log(`Order: ${refund.order_ref_id}`)
    console.log(`Amount: ${refund.amount_deducted} SAR`)
    console.log(`Reason: ${refund.reason_raw}`)
  })
}
```

---

## 📊 Analytics & Views

### Pre-computed Database Views

#### `daily_revenue_leakage`
Daily summary of refunds by platform and category.

```sql
SELECT * FROM daily_revenue_leakage
WHERE user_id = '...'
  AND transaction_date >= '2025-11-01'
ORDER BY transaction_date DESC;
```

#### `platform_refund_stats`
Monthly stats showing which platform costs the most.

```sql
SELECT
  platform_source,
  total_refunds,
  total_loss,
  quality_loss,
  operations_loss,
  driver_loss
FROM platform_refund_stats
WHERE user_id = '...'
ORDER BY total_loss DESC;
```

#### `refund_root_causes`
Top recurring issues causing losses.

```sql
SELECT
  reason_raw,
  occurrence_count,
  total_impact,
  match_rate
FROM refund_root_causes
WHERE user_id = '...'
ORDER BY total_impact DESC
LIMIT 10;
```

---

## 🔒 Security & Idempotency

### Idempotency (Prevents Duplicates)

Files are hashed using SHA-256:

```javascript
const fileHash = await crypto.subtle.digest('SHA-256', fileArrayBuffer)
```

Before processing, system checks if hash exists:
```sql
SELECT id FROM settlement_files
WHERE file_hash = '...' AND user_id = '...'
```

If duplicate → return existing record (no reprocessing).

### Row-Level Security (RLS)

All tables enforce RLS policies:

```sql
-- Users can only see their own data
CREATE POLICY "Users view own refunds"
  ON refunds_adjustments FOR SELECT
  USING (auth.uid() = user_id);
```

---

## 💡 Best Practices

### For Restaurant Owners

1. **Upload Weekly**: Process settlement reports as soon as received
2. **Review Unmatched**: Check refunds with low confidence scores
3. **Track Trends**: Monitor which categories cost you the most
4. **Take Action**: Focus on recurring issues (e.g., "missing items")

### For Developers

1. **Pre-process Files**: Convert PDFs to markdown tables for better AI parsing
2. **Normalize Dates**: Ensure consistent date format before DB insertion
3. **Log Everything**: Use `refund_matching_log` for debugging match issues
4. **Test with Samples**: Create sample settlement files for each platform
5. **Monitor AI Costs**: Track token usage to optimize costs

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "AI extraction failed"

**Cause**: Invalid API key or network error

**Solution**:
```bash
# Check .env.local
echo $VITE_OPENAI_API_KEY  # Should not be empty

# Test API directly
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $VITE_OPENAI_API_KEY"
```

#### 2. "PDF text extraction failed"

**Cause**: Image-based PDF (scanned document)

**Solution**: Use Excel/CSV export instead, or use server-side PDF parsing with OCR.

#### 3. "No refunds found in file"

**Cause**: File contains only successful transactions

**Solution**: Verify file is a settlement report (not transaction log). Check for keywords like "Refund", "Adjustment".

#### 4. "Low match confidence"

**Cause**: Order IDs differ significantly between platforms

**Solution**:
- Review `refund_matching_log` to see attempted matches
- Manually link refunds via UI (future feature)
- Adjust matching thresholds in `fuzzyOrderMatcher.js`

---

## 📈 Performance Metrics

### Expected Processing Times

| File Size | Format | Processing Time | AI Tokens |
|-----------|--------|----------------|-----------|
| 1-2 MB | PDF | 10-15 sec | 1,000-2,000 |
| 500 KB | Excel | 5-8 sec | 500-1,000 |
| 100 KB | CSV | 3-5 sec | 200-500 |

### Cost Estimates (OpenAI GPT-4o)

- **Per File**: $0.01 - $0.05
- **Per Month** (20 files): $0.20 - $1.00
- **Per Year** (240 files): $2.40 - $12.00

**Extremely affordable** for the value provided!

---

## 🚧 Future Enhancements

### Planned Features

- [ ] **Manual Matching UI**: Allow users to manually link unmatched refunds
- [ ] **Recurring Issue Alerts**: Notify when same issue occurs 3+ times
- [ ] **Platform Comparison**: Compare refund rates across delivery apps
- [ ] **Predictive Analytics**: Forecast expected refunds based on history
- [ ] **Integration with Slack**: Send alerts for high-value refunds
- [ ] **Multi-language Support**: Better handling of Arabic settlement reports
- [ ] **Bulk Upload**: Process multiple files at once
- [ ] **Dispute Management**: Track and manage refund disputes with platforms

---

## 📚 API Reference

### `RefundProcessingService`

```typescript
class RefundProcessingService {
  constructor(userId: string, options?: {
    branchId?: string
    aiProvider?: 'openai' | 'anthropic'
    skipMatching?: boolean
  })

  processSettlementFile(
    file: File,
    metadata?: {
      platform?: string
      reportDate?: string
    }
  ): Promise<ProcessingResult>

  checkDuplicate(fileHash: string): Promise<DuplicateResult | null>

  reprocessSettlementFile(settlementFileId: string): Promise<Result>
}
```

### `AIRefundExtractor`

```typescript
class AIRefundExtractor {
  constructor(config: {
    provider: 'openai' | 'anthropic'
    apiKey: string
    model?: string
  })

  extractRefunds(
    rawText: string,
    platformHint?: string
  ): Promise<ExtractionResult>

  extractBatch(
    files: Array<{ id: string, rawText: string }>,
    platformHint?: string
  ): Promise<ExtractionResult[]>
}
```

### `FuzzyOrderMatcher`

```typescript
class FuzzyOrderMatcher {
  constructor(userId: string, branchId?: string)

  matchRefund(refundData: RefundData): Promise<MatchResult>

  matchBatch(
    refunds: RefundData[],
    options?: { logAllAttempts: boolean }
  ): Promise<BatchMatchResult>

  findExactMatch(orderRefId: string): Promise<Order | null>

  findFuzzyMatch(orderRefId: string): Promise<FuzzyMatchResult | null>

  findDateAmountMatch(
    date: string,
    amount: number
  ): Promise<DateAmountMatchResult | null>
}
```

---

## 🤝 Contributing

Want to improve the system? Here's how:

1. **Test Edge Cases**: Upload settlement files from different platforms
2. **Improve AI Prompt**: Suggest better extraction instructions
3. **Enhance Matching**: Propose new matching algorithms
4. **Add Platform Support**: Create parsers for new delivery apps

---

## 📞 Support

For issues or questions:

- **GitHub Issues**: [Open an issue](https://github.com/your-repo/nava-ops/issues)
- **Documentation**: This file
- **Code**: Check inline comments in source files

---

## 📝 License

Part of NAVA OPS - Restaurant Management System

---

**Built with ❤️ by the NAVA team**

*Making restaurant financial analytics accurate, actionable, and automated.*
