# SaaS Subscription System Documentation

## Overview

The NAVA OPS platform now includes a comprehensive SaaS subscription system with multiple tiers, usage-based limits, billing management, and payment integration (Stripe/Paddle ready).

## Table of Contents

- [Features](#features)
- [Subscription Tiers](#subscription-tiers)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [API Services](#api-services)
- [Frontend Components](#frontend-components)
- [Payment Integration](#payment-integration)
- [Usage Tracking](#usage-tracking)
- [License Keys](#license-keys)
- [Setup Instructions](#setup-instructions)
- [Testing](#testing)

## Features

### ✨ Core Features

- **4 Subscription Tiers**: Free, Starter, Pro, and Enterprise
- **Usage-Based Limits**: Track and enforce limits on branches, team members, data points, reports, API calls, and more
- **Feature Flags**: Enable/disable features based on subscription plan
- **Billing Management**: View invoices, payment history, and manage payment methods
- **Plan Upgrades/Downgrades**: Seamless plan changes with prorated billing
- **Trial Periods**: 14-30 day trial periods for paid plans
- **Grace Period**: 7-day grace period for failed payments
- **Seat Management**: Add/remove team member seats
- **License Keys**: Offline mode support with license key validation
- **Email Notifications**: Automated billing event notifications
- **Payment Processors**: Ready for Stripe and Paddle integration

## Subscription Tiers

### Free Tier
- **Price**: $0/month
- **Features**:
  - 1 branch location
  - 1 team member
  - 1,000 orders/month
  - 30 days analytics history
  - 5 reports/month
  - 5 exports/month
  - Community support

### Starter Plan
- **Price**: $29/month or $290/year (17% savings)
- **Features**:
  - 5 branch locations
  - 5 team members
  - 10,000 orders/month
  - 90 days analytics history
  - 50 reports/month
  - 3 custom dashboards
  - Unlimited exports
  - AI-powered insights
  - API access (10K calls/month)
  - Email support

### Pro Plan (Most Popular)
- **Price**: $99/month or $990/year (17% savings)
- **Features**:
  - 25 branch locations
  - 25 team members
  - 100,000 orders/month
  - 1 year analytics history
  - Unlimited reports
  - 15 custom dashboards
  - Unlimited exports
  - Advanced AI insights
  - Predictive analytics
  - Real-time analytics
  - API access (100K calls/month)
  - Webhooks integration
  - Priority support

### Enterprise Plan
- **Price**: $499/month or $4,990/year (custom pricing available)
- **Features**:
  - Unlimited everything
  - White-label options
  - 24/7 priority support
  - Dedicated account manager
  - SSO/SAML authentication
  - Custom integrations
  - On-premise deployment option
  - Service Level Agreement (SLA)
  - Custom training sessions

## Architecture

### File Structure

```
src/
├── contexts/
│   └── SubscriptionContext.jsx       # Global subscription state management
├── hooks/
│   └── useFeatureAccess.js           # Feature gating and limit checking hooks
├── pages/
│   ├── Subscriptions.jsx             # Plan selection and management
│   └── Billing.jsx                   # Billing history and payment methods
├── components/
│   └── UI/
│       └── PricingCard.jsx           # Plan pricing card component
├── services/
│   ├── subscriptionService.js        # Subscription business logic
│   ├── paymentIntegration.js         # Stripe/Paddle integration
│   └── api.js                        # Updated with subscription endpoints
└── utils/
    └── subscriptionPlans.js          # Plan definitions and helpers

supabase/
└── migrations/
    └── 002_subscription_system.sql   # Database schema
```

### Context Providers

The subscription system uses React Context for global state management:

```jsx
<ThemeProvider>
  <AuthProvider>
    <NotificationProvider>
      <SubscriptionProvider>
        {/* Your app */}
      </SubscriptionProvider>
    </NotificationProvider>
  </AuthProvider>
</ThemeProvider>
```

## Database Schema

### Tables

#### `subscription_plans`
Stores all available subscription plans with their limits and pricing.

#### `user_subscriptions`
Tracks active subscriptions for each user.

#### `subscription_invoices`
Stores billing history and invoice details.

#### `payment_methods`
Stores user payment methods (tokenized for security).

#### `feature_usage_logs`
Tracks usage metrics for enforcing limits.

#### `license_keys`
Stores license keys for offline mode.

#### `subscription_events`
Audit log of all subscription-related events.

#### `billing_notifications`
Stores pending and sent billing notifications.

### Running the Migration

```bash
# Apply the migration to your Supabase database
supabase db push

# Or run directly in Supabase Dashboard SQL Editor
# Copy contents of supabase/migrations/002_subscription_system.sql
```

## API Services

### Subscription Service

```javascript
import subscriptionService from '@/services/subscriptionService';

// Get all plans
const plans = await subscriptionService.plans.getAll();

// Get current user subscription
const subscription = await subscriptionService.subscriptions.getCurrent(userId);

// Create subscription
const newSub = await subscriptionService.subscriptions.create({
  userId,
  planId: 'pro',
  billingCycle: 'yearly',
  startTrial: true
});

// Track usage
await subscriptionService.usage.track(userId, 'branches', 1);

// Check limits
const canCreate = await subscriptionService.usage.checkLimit(userId, 'branches');
```

### Payment Service

```javascript
import paymentService from '@/services/paymentIntegration';

// Initialize Stripe
await paymentService.initialize('stripe', {
  stripePublishableKey: 'pk_test_...'
});

// Start checkout
await paymentService.checkout({
  planId: 'pro',
  billingCycle: 'yearly',
  userId: user.id,
  email: user.email
});

// Open billing portal
await paymentService.openManagementPortal({
  customerId: 'cus_...',
  subscriptionId: 'sub_...'
});
```

## Frontend Components

### Using the Subscription Context

```javascript
import { useSubscription } from '@/contexts/SubscriptionContext';

function MyComponent() {
  const {
    subscription,
    plan,
    usage,
    hasFeature,
    isWithinLimit,
    upgradePlan
  } = useSubscription();

  // Check if feature is available
  if (!hasFeature('advanced_analytics')) {
    return <UpgradePrompt />;
  }

  // Check usage limits
  if (!isWithinLimit('branches')) {
    return <LimitReachedMessage />;
  }

  return <YourComponent />;
}
```

### Using Feature Access Hooks

```javascript
import { useFeatureAccess, useUsageLimit } from '@/hooks/useFeatureAccess';

function CreateBranchButton() {
  const { isAccessible } = useFeatureAccess('multi_branch');
  const { checkAndTrack } = useUsageLimit('branches');

  const handleCreate = async () => {
    const result = await checkAndTrack(1);

    if (!result.allowed) {
      // Show upgrade prompt
      return;
    }

    // Create branch
    await createBranch();
  };

  return (
    <button onClick={handleCreate} disabled={!isAccessible}>
      Create Branch
    </button>
  );
}
```

### Feature Gating

```javascript
import { useFeatureGate } from '@/hooks/useFeatureAccess';

function AdvancedAnalytics() {
  const { checkFeature } = useFeatureGate();

  useEffect(() => {
    if (!checkFeature('advanced_analytics')) {
      // User will see upgrade notification automatically
      return;
    }

    loadAdvancedAnalytics();
  }, []);

  // ...
}
```

## Payment Integration

### Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Get your publishable and secret keys
3. Add to environment variables:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

4. Set up webhook endpoint:

```
POST /api/stripe/webhooks
```

5. Configure webhook events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### Paddle Setup

1. Create a Paddle account at https://paddle.com
2. Get your vendor ID
3. Add to environment variables:

```env
VITE_PADDLE_VENDOR_ID=123456
VITE_PADDLE_ENVIRONMENT=sandbox
PADDLE_AUTH_CODE=...
```

4. Set up webhook endpoint:

```
POST /api/paddle/webhooks
```

5. Configure webhook events:
   - `subscription_created`
   - `subscription_updated`
   - `subscription_cancelled`
   - `subscription_payment_succeeded`
   - `subscription_payment_failed`

## Usage Tracking

### Automatic Tracking

Usage is automatically tracked when using the `trackUsage` function:

```javascript
const { trackUsage } = useSubscription();

// Track branch creation
await trackUsage('branches', 1);

// Track data points (orders)
await trackUsage('data_points', orderCount);

// Track API calls
await trackUsage('api_calls', 1);
```

### Limit Checking

Before allowing an action, check if the user is within limits:

```javascript
const { isWithinLimit, getUsage } = useSubscription();

if (!isWithinLimit('team_members')) {
  showUpgradePrompt();
  return;
}

// Proceed with action
inviteTeamMember();
```

### Usage Notifications

Users are automatically notified when they reach:
- **80%** of their limit: Warning notification
- **100%** of their limit: Limit reached notification with upgrade prompt

## License Keys

### Generating License Keys

```javascript
import { licenseKeysAPI } from '@/services/subscriptionService';

// Generate a new license key
const license = await licenseKeysAPI.create(
  userId,
  subscriptionId,
  planId,
  validUntil
);

// Returns: { key: 'XXXXX-XXXXX-XXXXX-XXXXX', ...license data }
```

### Validating License Keys

```javascript
// Validate a license key
const validation = await licenseKeysAPI.validate(licenseKey);

if (validation.valid) {
  // Activate offline mode with license features
  const features = validation.license.allowed_features;
}
```

### Activating License Keys

```javascript
// Activate license on a device
const activated = await licenseKeysAPI.activate(licenseKey, {
  device_id: 'device-123',
  device_name: 'MacBook Pro',
  os: 'macOS 14.0'
});
```

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file:

```env
# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Paddle
VITE_PADDLE_VENDOR_ID=123456
VITE_PADDLE_ENVIRONMENT=sandbox

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### 2. Run Database Migration

```bash
# Using Supabase CLI
supabase db push

# Or manually in Supabase Dashboard
# Run the SQL from supabase/migrations/002_subscription_system.sql
```

### 3. Seed Initial Plans (Optional)

The migration already includes default plans, but you can customize them:

```sql
UPDATE subscription_plans
SET
  stripe_price_id_monthly = 'price_...',
  stripe_price_id_yearly = 'price_...'
WHERE id = 'starter';
```

### 4. Test the System

1. Navigate to `/subscriptions` to view available plans
2. Select a plan and test the checkout flow
3. Navigate to `/billing` to view billing information
4. Test usage tracking by creating branches, inviting team members, etc.

## Testing

### Manual Testing Checklist

- [ ] View subscription plans at `/subscriptions`
- [ ] Select and upgrade to a paid plan
- [ ] Check usage tracking for various features
- [ ] Test reaching usage limits
- [ ] Cancel and reactivate subscription
- [ ] View invoice history at `/billing`
- [ ] Test grace period for failed payments
- [ ] Generate and validate license keys
- [ ] Test trial period expiration

### Test Payment Details

For Stripe test mode:

```
Card Number: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
```

### Mock Data

To test with mock subscriptions, you can manually insert data:

```sql
-- Create a test subscription
INSERT INTO user_subscriptions (
  user_id,
  plan_id,
  status,
  billing_cycle,
  current_period_start,
  current_period_end,
  amount
) VALUES (
  'user-uuid',
  'pro',
  'active',
  'monthly',
  NOW(),
  NOW() + INTERVAL '1 month',
  99.00
);
```

## Backend API Endpoints (To Implement)

You'll need to create these backend endpoints for full functionality:

### Stripe Endpoints

```
POST /api/stripe/create-checkout-session
POST /api/stripe/create-portal-session
POST /api/stripe/webhooks
```

### Paddle Endpoints

```
POST /api/paddle/update-subscription
POST /api/paddle/cancel-subscription
POST /api/paddle/webhooks
```

### Subscription Management

```
POST /api/subscriptions/create
PUT /api/subscriptions/:id/upgrade
PUT /api/subscriptions/:id/cancel
POST /api/subscriptions/:id/reactivate
```

## Security Considerations

1. **Payment Processing**: Never store raw credit card data. Use Stripe/Paddle tokenization.
2. **License Keys**: Keys are hashed (SHA-256) before storage.
3. **Row Level Security**: All tables have RLS policies enabled.
4. **Webhook Validation**: Always verify webhook signatures.
5. **Rate Limiting**: Implement rate limiting on payment endpoints.

## Support and Troubleshooting

### Common Issues

**Issue**: Subscription not loading
- Check if user is authenticated
- Verify Supabase connection
- Check browser console for errors

**Issue**: Payment failing
- Verify Stripe/Paddle keys are correct
- Check webhook configuration
- Review payment processor dashboard for details

**Issue**: Usage limits not enforcing
- Verify usage tracking is called after actions
- Check `feature_usage_logs` table for entries
- Ensure subscription context is properly wrapped

## Future Enhancements

- [ ] Add promotional codes and discounts
- [ ] Implement referral program
- [ ] Add usage alerts and emails
- [ ] Create admin dashboard for managing subscriptions
- [ ] Add custom plan creation for Enterprise customers
- [ ] Implement metered billing for overage charges
- [ ] Add multi-currency support
- [ ] Create self-service plan downgrade flow
- [ ] Add subscription analytics and reporting

## Contributing

When adding new features to the subscription system:

1. Update plan definitions in `subscriptionPlans.js`
2. Add new limits or feature flags
3. Update UI components to respect new limits
4. Add usage tracking where needed
5. Update this documentation

## License

This subscription system is part of the NAVA OPS platform.

---

**Built with**: React, Supabase, Stripe/Paddle, TailwindCSS, Framer Motion
