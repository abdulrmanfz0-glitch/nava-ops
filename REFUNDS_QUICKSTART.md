# 🚀 Refunds & Adjustments - Quick Start Guide

## ⚡ 5-Minute Setup

### 1. Run Database Migration

```bash
cd nava-ops
supabase db push
# Or manually: psql -f supabase/migrations/004_refunds_adjustments_system.sql
```

### 2. Configure AI API Keys

Copy and edit `.env.local`:

```bash
cp .env.local.example .env.local
```

Add your API key (choose one):

```bash
# Option A: OpenAI (Recommended)
VITE_OPENAI_API_KEY=sk-your-key-here
VITE_AI_PROVIDER=openai

# Option B: Anthropic Claude
VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
VITE_AI_PROVIDER=anthropic
```

Get keys from:
- OpenAI: https://platform.openai.com/api-keys
- Anthropic: https://console.anthropic.com/settings/keys

### 3. Start the Application

```bash
npm install  # If not already installed
npm run dev
```

### 4. Access the Feature

Navigate to: **http://localhost:5173/refunds-analytics**

### 5. Upload a Settlement File

1. Click "Choose File" or drag & drop
2. Select your settlement report (PDF/Excel/CSV)
3. Optionally select the platform
4. Wait 5-15 seconds
5. Review extracted refunds! ✨

---

## 📁 What Files Were Added?

### Database
- `supabase/migrations/004_refunds_adjustments_system.sql` - Complete schema

### Backend Services
- `src/lib/aiRefundExtractor.js` - AI extraction engine
- `src/lib/settlementFileParser.js` - File parsing (PDF/Excel/CSV)
- `src/lib/fuzzyOrderMatcher.js` - Order matching algorithm
- `src/lib/refundProcessingService.js` - Orchestrator

### Frontend
- `src/pages/RefundsAnalytics.jsx` - Main UI page
- `src/App.jsx` - Added `/refunds-analytics` route

### Configuration
- `.env.local.example` - Added AI API key variables

### Documentation
- `REFUNDS_SYSTEM_DOCUMENTATION.md` - Complete technical docs
- `REFUNDS_QUICKSTART.md` - This file

---

## 🧪 Test with Sample Data

Create a sample CSV file (`test_settlement.csv`):

```csv
Order ID,Date,Amount,Type,Reason
JH12345,2025-11-20,-45.50,Refund,Spilled Item
JH12346,2025-11-21,-30.00,Adjustment,Missing Item
JH12347,2025-11-22,-25.75,Penalty,Late Delivery
```

Upload this file to see the system in action!

---

## 💰 Cost Estimate

- **Per file**: $0.01 - $0.05
- **Monthly** (20 files): $0.20 - $1.00
- **Yearly** (240 files): $2.40 - $12.00

Extremely affordable! 🎉

---

## 🆘 Need Help?

**Read the full documentation**: `REFUNDS_SYSTEM_DOCUMENTATION.md`

**Common Issues**:

1. **"AI extraction failed"**
   - Check your API key in `.env.local`
   - Verify key is valid: `curl https://api.openai.com/v1/models -H "Authorization: Bearer YOUR_KEY"`

2. **"PDF text extraction failed"**
   - Try uploading as Excel or CSV instead
   - Ensure PDF is text-based (not scanned image)

3. **"No refunds found"**
   - Verify file contains refunds (not just successful orders)
   - Check for keywords: "Refund", "Adjustment", "استرجاع"

---

## 🎯 Key Features

✅ **AI-Powered Extraction** - Automatic parsing with GPT-4o or Claude 3.5
✅ **Fuzzy Matching** - Smart order reconciliation (3 matching strategies)
✅ **Idempotency** - Hash-based duplicate detection
✅ **Multi-Platform** - Jahez, HungerStation, ToYou, The Chefz, etc.
✅ **Root Cause Analysis** - Categorizes losses: Quality, Operations, Driver
✅ **Arabic Support** - Preserves original language in reasons
✅ **Real-time Processing** - Results in 5-15 seconds

---

## 📊 Database Schema Summary

**3 Main Tables**:
1. `settlement_files` - Uploaded files tracking
2. `refunds_adjustments` - Core refund records
3. `refund_matching_log` - Debug trail

**3 Analytical Views**:
1. `daily_revenue_leakage` - Daily summaries
2. `platform_refund_stats` - Platform comparison
3. `refund_root_causes` - Top recurring issues

---

## 🔥 What Makes This Special?

1. **Closes the Blind Spot**: First time restaurant sees *actual* revenue (after refunds)
2. **AI-First Design**: No manual CSV mapping - just upload and go
3. **Production-Ready**: Idempotency, RLS, error handling, logging
4. **Cost-Effective**: $0.01 per file - cheaper than manual processing
5. **Actionable Insights**: Not just numbers - tells you *why* you're losing money

---

**Ready to eliminate revenue leakage? Upload your first settlement file now! 🚀**
