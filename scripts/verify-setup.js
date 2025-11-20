#!/usr/bin/env node

/**
 * NAVA-OPS Development Environment Verification Script
 *
 * Purpose: Verify that the development environment is correctly set up
 * Usage: node scripts/verify-setup.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const symbols = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
};

// Logging utilities
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function success(message) {
  log(`${symbols.success} ${message}`, colors.green);
}

function error(message) {
  log(`${symbols.error} ${message}`, colors.red);
}

function warning(message) {
  log(`${symbols.warning} ${message}`, colors.yellow);
}

function info(message) {
  log(`${symbols.info} ${message}`, colors.cyan);
}

function header(message) {
  log(`\n${colors.bright}${colors.blue}${'='.repeat(60)}${colors.reset}`);
  log(`${colors.bright}${colors.blue}  ${message}${colors.reset}`);
  log(`${colors.bright}${colors.blue}${'='.repeat(60)}${colors.reset}\n`);
}

// Check functions
const checks = {
  nodeVersion: () => {
    header('Checking Node.js Version');
    try {
      const version = execSync('node --version', { encoding: 'utf8' }).trim();
      const majorVersion = parseInt(version.replace('v', '').split('.')[0]);

      if (majorVersion >= 18) {
        success(`Node.js ${version} (✓ Required: >= 18.0.0)`);
        return true;
      } else {
        error(`Node.js ${version} (✗ Required: >= 18.0.0)`);
        warning('Please upgrade Node.js to version 18 or higher');
        return false;
      }
    } catch (err) {
      error('Node.js not found');
      return false;
    }
  },

  npmVersion: () => {
    header('Checking npm Version');
    try {
      const version = execSync('npm --version', { encoding: 'utf8' }).trim();
      const majorVersion = parseInt(version.split('.')[0]);

      if (majorVersion >= 9) {
        success(`npm ${version} (✓ Required: >= 9.0.0)`);
        return true;
      } else {
        warning(`npm ${version} (Recommended: >= 9.0.0)`);
        info('Consider upgrading: npm install -g npm@latest');
        return true; // Not critical
      }
    } catch (err) {
      error('npm not found');
      return false;
    }
  },

  gitVersion: () => {
    header('Checking Git Version');
    try {
      const version = execSync('git --version', { encoding: 'utf8' }).trim();
      success(`${version} ✓`);
      return true;
    } catch (err) {
      error('Git not found');
      return false;
    }
  },

  packageJson: () => {
    header('Checking package.json');
    const packagePath = path.join(process.cwd(), 'package.json');

    if (fs.existsSync(packagePath)) {
      success('package.json exists');

      try {
        const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

        // Check essential fields
        if (pkg.name) {
          info(`  Package: ${pkg.name}@${pkg.version || '0.0.0'}`);
        }

        // Count dependencies
        const depCount = Object.keys(pkg.dependencies || {}).length;
        const devDepCount = Object.keys(pkg.devDependencies || {}).length;
        info(`  Dependencies: ${depCount} production, ${devDepCount} dev`);

        return true;
      } catch (err) {
        error('package.json is invalid JSON');
        return false;
      }
    } else {
      error('package.json not found');
      return false;
    }
  },

  nodeModules: () => {
    header('Checking node_modules');
    const nodeModulesPath = path.join(process.cwd(), 'node_modules');

    if (fs.existsSync(nodeModulesPath)) {
      // Count installed packages
      try {
        const packages = fs.readdirSync(nodeModulesPath)
          .filter(name => !name.startsWith('.'));

        success(`node_modules exists (${packages.length} packages installed)`);
        return true;
      } catch (err) {
        warning('node_modules exists but cannot read contents');
        return true;
      }
    } else {
      error('node_modules not found');
      warning('Run: npm install');
      return false;
    }
  },

  viteConfig: () => {
    header('Checking Vite Configuration');
    const vitePath = path.join(process.cwd(), 'vite.config.js');

    if (fs.existsSync(vitePath)) {
      success('vite.config.js exists');

      // Check for essential plugins
      const content = fs.readFileSync(vitePath, 'utf8');
      if (content.includes('@vitejs/plugin-react')) {
        info('  ✓ React plugin configured');
      }
      if (content.includes('vite-plugin-pwa')) {
        info('  ✓ PWA plugin configured');
      }

      return true;
    } else {
      error('vite.config.js not found');
      return false;
    }
  },

  tailwindConfig: () => {
    header('Checking Tailwind CSS Configuration');
    const tailwindPath = path.join(process.cwd(), 'tailwind.config.js');

    if (fs.existsSync(tailwindPath)) {
      success('tailwind.config.js exists');
      return true;
    } else {
      warning('tailwind.config.js not found');
      info('Tailwind CSS may not be configured');
      return true; // Not critical
    }
  },

  sourceDirectory: () => {
    header('Checking Source Directory Structure');
    const srcPath = path.join(process.cwd(), 'src');

    if (!fs.existsSync(srcPath)) {
      error('src/ directory not found');
      return false;
    }

    success('src/ directory exists');

    // Check essential directories
    const requiredDirs = [
      'components',
      'pages',
      'contexts',
      'lib',
      'services',
      'utils',
    ];

    const missingDirs = [];
    requiredDirs.forEach(dir => {
      const dirPath = path.join(srcPath, dir);
      if (fs.existsSync(dirPath)) {
        info(`  ✓ src/${dir}/`);
      } else {
        warning(`  ✗ src/${dir}/ (missing)`);
        missingDirs.push(dir);
      }
    });

    // Check essential files
    const requiredFiles = ['main.jsx', 'App.jsx', 'index.css'];
    requiredFiles.forEach(file => {
      const filePath = path.join(srcPath, file);
      if (fs.existsSync(filePath)) {
        info(`  ✓ src/${file}`);
      } else {
        error(`  ✗ src/${file} (missing)`);
      }
    });

    return missingDirs.length === 0;
  },

  indexHtml: () => {
    header('Checking index.html');
    const indexPath = path.join(process.cwd(), 'index.html');

    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, 'utf8');

      // Check for essential elements
      if (content.includes('<div id="root"')) {
        success('index.html exists with #root element');

        if (content.includes('src/main.jsx')) {
          info('  ✓ Vite entry point configured');
        }

        return true;
      } else {
        error('index.html exists but missing #root element');
        return false;
      }
    } else {
      error('index.html not found');
      return false;
    }
  },

  envFile: () => {
    header('Checking Environment Configuration');
    const envPath = path.join(process.cwd(), '.env.local');
    const envExamplePath = path.join(process.cwd(), '.env.example');

    if (fs.existsSync(envPath)) {
      success('.env.local exists');

      // Check for essential variables
      const content = fs.readFileSync(envPath, 'utf8');
      const requiredVars = [
        'VITE_SUPABASE_URL',
        'VITE_SUPABASE_ANON_KEY',
      ];

      requiredVars.forEach(varName => {
        if (content.includes(varName)) {
          info(`  ✓ ${varName}`);
        } else {
          warning(`  ✗ ${varName} (not set)`);
        }
      });

      return true;
    } else if (fs.existsSync(envExamplePath)) {
      warning('.env.local not found');
      info('Create .env.local from .env.example template');
      return true; // Not critical for build
    } else {
      warning('No environment files found');
      return true; // Not critical for build
    }
  },

  gitStatus: () => {
    header('Checking Git Status');
    try {
      const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
      success(`Current branch: ${branch}`);

      // Check if on the correct feature branch
      if (branch.startsWith('claude/')) {
        info('  ✓ Working on feature branch');
      } else if (branch === 'main' || branch === 'master') {
        warning('  ⚠ Working directly on main branch');
        info('    Consider creating a feature branch');
      }

      return true;
    } catch (err) {
      warning('Not a git repository or git not available');
      return true; // Not critical
    }
  },

  portAvailability: () => {
    header('Checking Port Availability');
    try {
      // Try to check if port 3000 is in use (platform-specific)
      const platform = process.platform;

      if (platform === 'linux' || platform === 'darwin') {
        try {
          execSync('command -v lsof > /dev/null 2>&1');
          const result = execSync('lsof -i :3000', { encoding: 'utf8', stdio: 'pipe' });

          if (result.trim()) {
            warning('Port 3000 is in use');
            info('Kill the process or use a different port: npm run dev -- --port 3001');
          } else {
            success('Port 3000 is available');
          }
        } catch (err) {
          // Port is likely available
          success('Port 3000 appears to be available');
        }
      } else {
        info('Port check not available on this platform');
      }

      return true;
    } catch (err) {
      info('Cannot check port availability');
      return true;
    }
  },
};

// Main execution
async function main() {
  log(`${colors.bright}${colors.cyan}
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   NAVA-OPS Development Environment Verification           ║
║   Ensuring Zero-Friction Developer Experience             ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
${colors.reset}`);

  const results = {};
  let allPassed = true;

  // Run all checks
  for (const [name, check] of Object.entries(checks)) {
    try {
      const result = check();
      results[name] = result;
      if (!result) allPassed = false;
    } catch (err) {
      error(`Check '${name}' failed with error: ${err.message}`);
      results[name] = false;
      allPassed = false;
    }
  }

  // Summary
  header('Verification Summary');

  const passed = Object.values(results).filter(r => r === true).length;
  const total = Object.values(results).length;

  if (allPassed) {
    success(`All checks passed! (${passed}/${total})`);
    log('');
    success('✨ Your development environment is ready!');
    log('');
    info('Next steps:');
    info('  1. Run: npm run dev');
    info('  2. Open: http://localhost:3000');
    info('  3. Start coding!');
    log('');
  } else {
    warning(`${passed}/${total} checks passed`);
    log('');
    error('⚠️  Some issues need attention');
    log('');
    info('Common fixes:');

    if (!results.nodeModules) {
      info('  → Run: npm install');
    }
    if (!results.envFile) {
      info('  → Create: .env.local (copy from .env.example)');
    }

    log('');
    info('See ONBOARDING.md for detailed setup instructions');
    log('');
  }

  process.exit(allPassed ? 0 : 1);
}

// Run the script
main().catch(err => {
  error(`Fatal error: ${err.message}`);
  process.exit(1);
});
