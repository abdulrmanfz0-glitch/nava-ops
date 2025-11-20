# NAVA-OPS: 5-MINUTE DEVELOPER ONBOARDING

## **THE PROMISE**
From `git clone` to running application in **under 5 minutes**. Zero friction. Zero conflicts. Zero guesswork.

---

## **PREREQUISITES** (One-Time Setup)
Ensure you have installed:
- **Node.js** 18.0.0 or higher → `node --version`
- **npm** 9.0.0 or higher → `npm --version`
- **Git** 2.30.0 or higher → `git --version`

---

## **THE 5-MINUTE WORKFLOW**

### **Step 1: Clone the Repository** (30 seconds)
```bash
git clone https://github.com/abdulrmanfz0-glitch/nava-ops.git
cd nava-ops
```

### **Step 2: Install Dependencies** (2-3 minutes)
```bash
npm install
```

**What this does:**
- Installs all 30 dependencies from package.json
- Creates node_modules/ directory with ~250MB of packages
- Generates package-lock.json for reproducible builds
- Validates peer dependencies

**Expected output:**
```
added 1247 packages, and audited 1248 packages in 2m 15s
```

### **Step 3: Start Development Server** (10 seconds)
```bash
npm run dev
```

**What happens:**
- Vite dev server starts on `http://localhost:3000`
- Hot Module Replacement (HMR) activates
- Browser opens automatically
- React app loads with RTL Arabic support

**Expected output:**
```
  VITE v7.1.7  ready in 1.2s

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.1.x:3000/
  ➜  press h + enter to show help
```

### **Step 4: Verify Everything Works** (30 seconds)
Open browser to `http://localhost:3000` and verify:
- ✅ Login page loads without errors
- ✅ No console errors in DevTools
- ✅ HMR badge shows "Connected"
- ✅ Arabic text renders correctly (RTL)

---

## **ALTERNATIVE COMMANDS**

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Analyze bundle size
npm run build -- --mode=analyze
```

---

## **TROUBLESHOOTING**

### **Problem: `npm install` fails with 403 errors**
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Reset registry to default
npm config set registry https://registry.npmjs.org/

# Try installation again
npm install
```

### **Problem: Port 3000 already in use**
**Solution:**
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use custom port
npm run dev -- --port 3001
```

### **Problem: `node_modules/` missing after git pull**
**Solution:**
```bash
# Always run after pulling changes
npm install
```

### **Problem: Module not found errors**
**Solution:**
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## **GIT WORKFLOW TO PREVENT CONFLICTS**

### **Before Starting Work**
```bash
# 1. Ensure you're on the correct branch
git status

# 2. Pull latest changes
git pull origin claude/improve-dx-build-stability-01H8iQmyTWrfQJE6dVTEu6JH

# 3. Reinstall dependencies (in case package.json changed)
npm install

# 4. Start development
npm run dev
```

### **When Committing Changes**
```bash
# 1. Check what changed
git status

# 2. Stage specific files (NOT entire directories)
git add src/components/MyComponent.jsx
git add src/pages/MyPage.jsx

# 3. Commit with descriptive message
git commit -m "feat: Add user authentication modal"

# 4. Push to your branch
git push -u origin claude/improve-dx-build-stability-01H8iQmyTWrfQJE6dVTEu6JH
```

### **Avoiding Merge Conflicts**
1. **NEVER commit `node_modules/`** - It's in `.gitignore`
2. **NEVER commit `.env` files** - Use `.env.example` instead
3. **Commit frequently** - Small, focused commits prevent conflicts
4. **Pull before push** - Always `git pull` before `git push`
5. **Work in isolated files** - Avoid editing the same files as teammates

---

## **PROJECT STRUCTURE**

```
nava-ops/
├── src/
│   ├── main.jsx                 # Application entry point
│   ├── App.jsx                  # Root component with routing
│   ├── components/              # Reusable UI components
│   │   ├── Layout/              # App layout components
│   │   ├── UI/                  # Generic UI components
│   │   ├── AIAssistant/         # AI-related components
│   │   ├── DashboardV2/         # Dashboard components
│   │   └── [...]
│   ├── pages/                   # Route-level page components
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── TeamManagement.jsx
│   │   └── [...]
│   ├── contexts/                # React Context providers
│   │   ├── AuthContext.jsx      # Authentication state
│   │   ├── ThemeContext.jsx     # Theme management
│   │   └── [...]
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Core business logic
│   │   ├── logger.js            # Logging utility
│   │   ├── pdfGenerator.js      # PDF export
│   │   └── [...]
│   ├── services/                # API and external services
│   │   ├── api.js               # Main API client
│   │   ├── subscriptionService.js
│   │   └── [...]
│   ├── utils/                   # Helper functions
│   │   ├── formatters.js
│   │   ├── exportUtils.js
│   │   └── [...]
│   ├── config/                  # Configuration files
│   └── styles/                  # Global styles
│       ├── index.css            # Tailwind imports
│       ├── animations.css
│       └── [...]
├── public/                      # Static assets
├── index.html                   # HTML template
├── package.json                 # Dependencies manifest
├── vite.config.js               # Build configuration
├── tailwind.config.js           # Tailwind CSS config
└── .gitignore                   # Git ignore rules
```

---

## **DEVELOPMENT BEST PRACTICES**

### **Component Isolation**
Each component should be self-contained:
```jsx
// ✅ GOOD: Self-contained component
src/components/UserProfile/
  ├── UserProfile.jsx       # Main component
  ├── UserAvatar.jsx        # Sub-component
  ├── userProfile.utils.js  # Component-specific utilities
  └── index.js              # Export barrel

// ❌ BAD: Monolithic component
src/components/UserProfile.jsx  // 2000+ lines
```

### **Import Path Aliases**
Use configured aliases for cleaner imports:
```jsx
// ✅ GOOD: Using aliases
import Button from '@components/UI/Button';
import { useAuth } from '@contexts/AuthContext';
import { formatDate } from '@utils/formatters';

// ❌ BAD: Relative paths
import Button from '../../../components/UI/Button';
import { useAuth } from '../../contexts/AuthContext';
```

### **File Naming Conventions**
- **Components**: PascalCase → `UserProfile.jsx`
- **Utilities**: camelCase → `formatters.js`
- **Constants**: UPPER_CASE → `API_ENDPOINTS.js`
- **Hooks**: camelCase with 'use' prefix → `useAuth.js`

---

## **KEY ENVIRONMENT VARIABLES**

Create `.env.local` file (NOT committed to git):
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# App Configuration
VITE_APP_ENV=development
VITE_APP_VERSION=2.0.0
```

See `.env.example` for complete list.

---

## **SUCCESS METRICS**

You've successfully onboarded when:
- ✅ `npm install` completes without errors
- ✅ `npm run dev` starts server in <10 seconds
- ✅ Application loads at `http://localhost:3000`
- ✅ HMR updates components without page reload
- ✅ `git status` shows clean working tree
- ✅ No console errors in browser DevTools

---

## **THE COMMAND STRING** (What You Asked For)

After cloning and installing dependencies, this single command starts everything:

```bash
npm run dev
```

**That's it.** Vite handles:
- Fast dev server startup
- Hot Module Replacement
- Automatic browser opening
- ESBuild transpilation
- CSS processing
- Asset optimization

---

## **NEXT STEPS**

1. **Read the Architecture**: See `ARCHITECTURE.md`
2. **Understand the codebase**: Explore `src/` directory
3. **Check existing features**: Review `REVOLUTIONARY_FEATURES.md`
4. **Start coding**: Create new components following the structure above

---

## **SUPPORT**

If you encounter issues:
1. Check this guide first
2. Review `TROUBLESHOOTING.md` (if exists)
3. Check git branch: Ensure you're on the correct feature branch
4. Verify Node.js version: `node --version` (must be 18+)

**Remember:** The goal is **ZERO FRICTION**. If something doesn't work as described, it's a bug in our DX setup, not your fault.

---

**Last Updated:** 2025-11-20
**Maintained By:** NAVA-OPS Development Team
