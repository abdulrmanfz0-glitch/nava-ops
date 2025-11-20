# NAVA-OPS: GIT WORKFLOW FOR CONFLICT-FREE DEVELOPMENT

## **MISSION**
Eliminate merge conflicts, prevent file loss, and ensure smooth collaboration on a 120,000-line codebase.

---

## **THE GOLDEN RULES**

### **Rule 1: NEVER Commit These Files**
```
❌ NEVER COMMIT:
- node_modules/          # Dependencies (use package.json instead)
- .env, .env.local       # Secrets (use .env.example as template)
- dist/                  # Build artifacts
- .vite/                 # Vite cache
- *.log                  # Log files
- .DS_Store              # macOS files
- Thumbs.db              # Windows files

✅ .gitignore handles these automatically
```

### **Rule 2: Pull Before You Push**
```bash
# ALWAYS do this before pushing:
git pull origin <your-branch-name>
npm install  # In case dependencies changed
```

### **Rule 3: Work on Feature Branches**
```bash
# ❌ WRONG: Working on main
git checkout main
# ... make changes ...
git push

# ✅ RIGHT: Feature branch
git checkout -b claude/my-feature-name
# ... make changes ...
git push -u origin claude/my-feature-name
```

### **Rule 4: Commit Small and Often**
```bash
# ❌ BAD: One massive commit
git add .
git commit -m "Fixed everything"

# ✅ GOOD: Focused commits
git add src/components/UserProfile.jsx
git commit -m "feat: Add user profile avatar upload"

git add src/pages/Dashboard.jsx
git commit -m "fix: Correct revenue calculation in dashboard"
```

---

## **THE DAILY WORKFLOW**

### **Morning: Start Your Work**
```bash
# 1. Check current status
git status

# 2. Ensure you're on your feature branch
git branch --show-current

# 3. Pull latest changes
git pull origin claude/improve-dx-build-stability-01H8iQmyTWrfQJE6dVTEu6JH

# 4. Update dependencies (in case package.json changed)
npm install

# 5. Start development
npm run dev
```

### **During Work: Save Progress**
```bash
# Every 30-60 minutes, commit your work:

# 1. Check what changed
git status

# 2. Stage specific files
git add src/components/MyComponent.jsx
git add src/utils/myHelper.js

# 3. Commit with clear message
git commit -m "feat: Add data export functionality"

# 4. Push to remote (backup your work)
git push
```

### **End of Day: Final Push**
```bash
# 1. Commit any remaining work
git add <files>
git commit -m "wip: Partial implementation of feature X"

# 2. Push everything
git push

# 3. Verify on GitHub
# Visit: https://github.com/abdulrmanfz0-glitch/nava-ops
# Check your branch to ensure all commits are there
```

---

## **COMMIT MESSAGE CONVENTIONS**

Use this format: `<type>: <description>`

### **Types:**
- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code restructuring (no behavior change)
- `style:` Formatting, missing semicolons, etc.
- `docs:` Documentation changes
- `test:` Adding or updating tests
- `chore:` Build process, dependencies, etc.
- `perf:` Performance improvement
- `wip:` Work in progress (use sparingly)

### **Examples:**
```bash
git commit -m "feat: Add user authentication modal"
git commit -m "fix: Correct revenue calculation in dashboard"
git commit -m "refactor: Split intelligenceEngine.js into modules"
git commit -m "style: Format code with Prettier"
git commit -m "docs: Update onboarding guide"
git commit -m "chore: Update dependencies to latest versions"
git commit -m "perf: Optimize chart rendering performance"
```

---

## **HANDLING MERGE CONFLICTS**

### **When Conflicts Occur**
```bash
# You'll see this when pulling:
CONFLICT (content): Merge conflict in src/App.jsx
Automatic merge failed; fix conflicts and then commit the result.
```

### **Resolution Steps:**

#### **Step 1: Identify Conflicted Files**
```bash
git status
# Shows files with conflicts
```

#### **Step 2: Open Conflicted File**
Conflicts look like this:
```jsx
<<<<<<< HEAD
// Your changes
const userName = "John Doe";
=======
// Their changes
const userName = "Jane Smith";
>>>>>>> main
```

#### **Step 3: Resolve the Conflict**
Choose one version or combine both:
```jsx
// Option 1: Keep yours
const userName = "John Doe";

// Option 2: Keep theirs
const userName = "Jane Smith";

// Option 3: Combine (if both are needed)
const userName = "John Doe"; // Primary user
const adminName = "Jane Smith"; // Admin user
```

#### **Step 4: Mark as Resolved**
```bash
# After fixing all conflicts:
git add src/App.jsx
git commit -m "fix: Resolve merge conflict in App.jsx"
git push
```

---

## **AVOIDING CONFLICTS IN THE FIRST PLACE**

### **Strategy 1: File Isolation**
```bash
# ✅ GOOD: Different files = No conflicts
Developer A → src/components/UserProfile.jsx
Developer B → src/components/TeamList.jsx

# ❌ BAD: Same file = Potential conflict
Developer A → src/App.jsx (line 50)
Developer B → src/App.jsx (line 55)
```

### **Strategy 2: Communicate**
Before editing a file someone else is working on:
1. Check recent commits: `git log --oneline --all -- src/components/SomeFile.jsx`
2. Ask in team chat: "Anyone working on SomeFile.jsx?"
3. Coordinate: "I'll work on Section A, you work on Section B"

### **Strategy 3: Small Components**
```bash
# ✅ GOOD: Small, focused components
src/components/UserProfile/
  ├── UserProfile.jsx         # 150 lines
  ├── UserAvatar.jsx          # 50 lines
  ├── UserInfo.jsx            # 80 lines
  └── UserSettings.jsx        # 100 lines

# ❌ BAD: Monolithic component (conflict magnet)
src/components/UserProfile.jsx  # 2000 lines
```

### **Strategy 4: Pull Frequently**
```bash
# Every 2-3 hours:
git pull origin <your-branch>
npm install  # In case dependencies changed
```

---

## **BRANCH NAMING CONVENTIONS**

### **Current Project Branch**
```
claude/improve-dx-build-stability-01H8iQmyTWrfQJE6dVTEu6JH
```

### **Format for Future Branches**
```
<category>/<short-description>-<session-id>

Categories:
- claude/    # AI-assisted development
- feat/      # New feature
- fix/       # Bug fix
- refactor/  # Code restructuring
- docs/      # Documentation updates
```

### **Examples:**
```
claude/add-user-management-01H9xYz...
feat/payment-integration
fix/dashboard-loading-error
refactor/split-large-components
docs/update-api-documentation
```

---

## **WORKING WITH PULL REQUESTS**

### **Creating a PR**
```bash
# 1. Ensure all changes are committed and pushed
git status  # Should be clean

# 2. Push to remote
git push -u origin claude/improve-dx-build-stability-01H8iQmyTWrfQJE6dVTEu6JH

# 3. Create PR on GitHub:
# Visit: https://github.com/abdulrmanfz0-glitch/nava-ops/compare
# Select your branch
# Fill in PR description
# Request reviewers
```

### **PR Description Template**
```markdown
## Summary
Brief description of what this PR does

## Changes
- Added user profile component
- Fixed dashboard revenue calculation
- Refactored intelligenceEngine.js into modules

## Testing
- [ ] Tested locally
- [ ] No console errors
- [ ] All pages load correctly
- [ ] Build succeeds

## Screenshots (if applicable)
[Add screenshots of UI changes]

## Related Issues
Closes #123
```

---

## **EMERGENCY: Undo Changes**

### **Scenario 1: Uncommitted Changes (Want to Discard)**
```bash
# Discard all changes in a file
git checkout -- src/components/MyComponent.jsx

# Discard all uncommitted changes
git reset --hard HEAD
```

### **Scenario 2: Committed (Want to Undo Last Commit)**
```bash
# Undo commit but keep changes
git reset --soft HEAD~1

# Undo commit and discard changes
git reset --hard HEAD~1
```

### **Scenario 3: Already Pushed (Want to Revert)**
```bash
# Create a new commit that undoes the previous one
git revert <commit-hash>
git push
```

### **Scenario 4: Accidentally Committed to Wrong Branch**
```bash
# 1. Note the commit hash
git log --oneline

# 2. Switch to correct branch
git checkout correct-branch

# 3. Cherry-pick the commit
git cherry-pick <commit-hash>

# 4. Go back to wrong branch and remove commit
git checkout wrong-branch
git reset --hard HEAD~1
```

---

## **FILE STRUCTURE FOR CONFLICT PREVENTION**

### **Before: Monolithic (Conflict-Prone)**
```
src/
├── App.jsx                      # 2000 lines - HIGH CONFLICT RISK
├── lib/intelligenceEngine.js    # 2158 lines - HIGH CONFLICT RISK
└── pages/TeamManagement.jsx     # 1402 lines - HIGH CONFLICT RISK
```

### **After: Modular (Conflict-Resistant)**
```
src/
├── App.jsx                      # 400 lines - routing only
├── lib/intelligenceEngine/
│   ├── index.js                 # 20 lines - exports
│   ├── predictions.js           # 300 lines
│   ├── forecasting.js           # 250 lines
│   ├── anomalyDetection.js      # 400 lines
│   └── clustering.js            # 350 lines
└── pages/TeamManagement/
    ├── TeamManagement.jsx       # 200 lines - layout
    ├── TeamList.jsx             # 300 lines
    ├── TeamMemberCard.jsx       # 150 lines
    └── TeamSettings.jsx         # 200 lines
```

**Why this prevents conflicts:**
- 10 developers can work on 10 different files simultaneously
- Changes to one module don't affect others
- Git can merge independent file changes automatically

---

## **GIT COMMANDS CHEAT SHEET**

### **Daily Commands**
```bash
git status                   # Check current status
git pull                     # Get latest changes
git add <file>               # Stage file
git commit -m "message"      # Commit changes
git push                     # Upload to remote
git log --oneline            # View commit history
```

### **Branch Commands**
```bash
git branch                   # List branches
git branch <name>            # Create branch
git checkout <branch>        # Switch branch
git checkout -b <branch>     # Create and switch
git branch -d <branch>       # Delete branch
```

### **Inspection Commands**
```bash
git diff                     # Show unstaged changes
git diff --staged            # Show staged changes
git log --oneline --graph    # Visual commit history
git show <commit>            # Show commit details
```

### **Undo Commands**
```bash
git checkout -- <file>       # Discard file changes
git reset HEAD <file>        # Unstage file
git reset --soft HEAD~1      # Undo last commit (keep changes)
git reset --hard HEAD~1      # Undo last commit (discard changes)
git revert <commit>          # Create new commit that undoes changes
```

---

## **TROUBLESHOOTING**

### **Problem: "Your branch is behind"**
```bash
# Solution: Pull latest changes
git pull origin <your-branch>
```

### **Problem: "Your branch has diverged"**
```bash
# Solution: Merge or rebase
git pull --rebase origin <your-branch>
```

### **Problem: "Permission denied (403)"**
```bash
# Solution: Check GitHub authentication
git remote -v  # Verify remote URL
# Update if needed:
git remote set-url origin https://github.com/abdulrmanfz0-glitch/nava-ops.git
```

### **Problem: "Large files blocking push"**
```bash
# Solution: Check file sizes
find . -type f -size +10M

# Remove from git (if accidentally added)
git rm --cached <large-file>
echo "<large-file>" >> .gitignore
```

---

## **BEST PRACTICES SUMMARY**

✅ **DO:**
- Pull before you push
- Commit small and often
- Use feature branches
- Write clear commit messages
- Test before committing
- Run `npm install` after pulling

❌ **DON'T:**
- Commit `node_modules/`
- Commit `.env` files
- Work directly on main
- Make giant commits
- Push untested code
- Ignore merge conflicts

---

## **SUCCESS METRICS**

You're following the workflow correctly when:
- ✅ You haven't had a merge conflict in weeks
- ✅ `git status` is always clean before switching tasks
- ✅ All your commits have descriptive messages
- ✅ You never lose work (regular pushes)
- ✅ You can trace what changed and when via git log
- ✅ The team can work simultaneously without conflicts

---

**Last Updated:** 2025-11-20
**Maintained By:** NAVA-OPS Development Team
