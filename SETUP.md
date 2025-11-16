# NAVA OPS - Ready-to-Run Setup Guide

This guide will help you quickly set up a clean, functional local development environment for NAVA OPS.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (v8 or higher) or **yarn** (v1.22+)
- **Python** (v3.8 or higher) - for backend operations
- **Git** - for version control operations

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies

Choose one of the following methods:

**Using npm (recommended):**
```bash
npm install
```

**Using yarn:**
```bash
yarn install
```

**Note:** If you encounter network issues (403 errors), ensure you have proper internet access and npm registry is accessible. You may need to configure a proxy if behind a corporate firewall.

### Step 2: Environment Configuration

The `.env.local` file has been pre-configured with development defaults. You can start developing immediately!

**For production deployment**, copy `.env.local.example` and configure with your actual credentials:

```bash
cp .env.local.example .env.production.local
```

Then edit `.env.production.local` with your Supabase credentials and production settings.

### Step 3: Start Development Server

```bash
npm run dev
```

The application will start at: **http://localhost:3000**

The development server features:
- ⚡ Hot Module Replacement (HMR)
- 🔄 Auto-reload on file changes
- 🎨 Error overlay in browser
- 📱 Mobile-accessible on your local network

### Step 4: Verify Installation

Open your browser and navigate to `http://localhost:3000`. You should see the NAVA OPS dashboard.

## 🛠️ Available Commands

### Development
```bash
npm run dev          # Start development server (port 3000)
npm run preview      # Preview production build
```

### Building
```bash
npm run build        # Build for production
```

### Code Quality
```bash
npm run lint         # Run ESLint to check code quality
```

### Bundle Analysis
```bash
npm run build -- --mode analyze    # Analyze bundle size and composition
```

## 📂 Project Structure

```
nava-ops/
├── src/
│   ├── components/      # React components
│   │   ├── Dashboard/   # Dashboard components
│   │   ├── Reports/     # Reporting components
│   │   ├── Git/         # Git operations components
│   │   └── ...
│   ├── contexts/        # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility libraries
│   ├── assets/          # Static assets
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Application entry point
├── public/              # Public static files
├── .env.local           # Local environment variables (dev defaults)
├── .env.local.example   # Production environment template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── postcss.config.js    # PostCSS configuration
```

## 🔧 Configuration Details

### Environment Variables

The project uses Vite's environment variable system. All variables must be prefixed with `VITE_`.

**Development defaults (already configured in `.env.local`):**
- `VITE_DEV_BYPASS_AUTH=true` - Bypasses authentication for local development
- `VITE_API_URL=http://localhost:8000` - Backend API endpoint
- `VITE_DEBUG=true` - Enables debug logging

**For production:**
- Set `VITE_DEV_BYPASS_AUTH=false`
- Configure actual Supabase credentials
- Update `VITE_API_URL` to production backend URL

### Backend API (Optional)

The Python backend provides Git operations functionality:

```bash
# Install Python dependencies
pip install -r requirements.txt

# Run the backend API (port 8000)
python -m src.api
```

The frontend will automatically connect to `http://localhost:8000` in development mode.

## 🎯 Features Overview

### Frontend Features
- ✅ Modern React 19 with hooks
- ✅ Vite for ultra-fast development
- ✅ Tailwind CSS for styling
- ✅ React Router for navigation
- ✅ PWA support (Progressive Web App)
- ✅ Code splitting and lazy loading
- ✅ Supabase authentication integration
- ✅ Multi-format report exports (PDF, Excel, JSON)
- ✅ Real-time data visualization with Recharts

### Backend Features (Python)
- ✅ Multi-branch Git operations
- ✅ Repository management
- ✅ Conflict detection and resolution
- ✅ Comprehensive reporting
- ✅ RESTful API with FastAPI

## 🐛 Troubleshooting

### npm install fails with 403 error
**Problem:** Network/firewall blocking npm registry access

**Solutions:**
1. Check your internet connection
2. If behind a corporate firewall, configure npm proxy:
   ```bash
   npm config set proxy http://proxy.company.com:8080
   npm config set https-proxy http://proxy.company.com:8080
   ```
3. Try using a different registry:
   ```bash
   npm config set registry https://registry.npmjs.org/
   ```
4. Clear npm cache and retry:
   ```bash
   npm cache clean --force
   npm install
   ```

### Port 3000 already in use
**Solution:** Change the port in `vite.config.js` or stop the process using port 3000:
```bash
# Find process
lsof -ti:3000

# Kill process
kill -9 <PID>
```

### Build errors
**Solution:** Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Supabase authentication errors
**Solution:** Check your environment variables:
1. Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set correctly
2. For local development, use `VITE_DEV_BYPASS_AUTH=true` to skip authentication

## 📦 Deployment

### Build for Production
```bash
npm run build
```

This creates an optimized production build in the `dist/` directory with:
- Minified JavaScript and CSS
- Optimized images
- Code splitting for faster loading
- Compressed assets

### Preview Production Build Locally
```bash
npm run preview
```

### Deploy to Hosting

**Static hosting (Netlify, Vercel, GitHub Pages):**
1. Build the project: `npm run build`
2. Deploy the `dist/` directory
3. Configure environment variables in hosting platform

**Docker deployment:**
```bash
# Build frontend image
docker build -f Dockerfile.frontend -t nava-ops-frontend .

# Run container
docker run -p 3000:80 nava-ops-frontend
```

**Full stack with Docker Compose:**
```bash
docker-compose up
```

## 🔐 Security Notes

- ✅ `.env.local` is already in `.gitignore` - never commit it
- ✅ Development bypass auth is enabled by default - disable for production
- ✅ Use environment-specific `.env` files for different deployments
- ✅ Keep Supabase keys secure and rotate them regularly
- ✅ Enable CORS only for trusted domains in production

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase Docs](https://supabase.com/docs)

## ✅ Ready to Code!

You're all set! The codebase is in a clean, ready-to-run state. Once you run `npm install`, you can immediately:

1. ✅ Fix open issues
2. ✅ Refactor and cleanup code
3. ✅ Implement new features
4. ✅ Run tests and builds
5. ✅ Deploy to production

## 🆘 Getting Help

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the main [README.md](./README.md)
3. Check the [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details
4. Open an issue on GitHub

---

**Happy Coding! 🚀**

*Last updated: 2025-11-16*
*Project Status: ✅ Ready to Run*
