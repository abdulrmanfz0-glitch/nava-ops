<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
# Nava Ops - Multi-Branch Operations & Reporting System

A powerful, modular Python system for managing Git operations across multiple branches and repositories with comprehensive reporting capabilities.

## 🎯 Features

- **Multi-Branch Operations**: Perform Git operations (fetch, pull, push, merge) across multiple branches simultaneously
- **Multi-Repository Support**: Manage operations across multiple repositories from a single configuration
- **Parallel Execution**: Optimized concurrent operations with configurable thread pooling
- **Retry Logic**: Automatic retry with exponential backoff for network operations
- **Comprehensive Reporting**: Generate detailed reports in JSON, Markdown, and HTML formats
- **Modular Architecture**: Clean separation of concerns for easy maintenance and extension
- **Zero External Dependencies**: Uses only Python standard library
- **Type-Safe**: Full type hints for better IDE support and code quality

## 📁 Project Structure

```
nava-ops/
├── src/
│   ├── __init__.py           # Package initialization
│   ├── config.py             # Configuration management
│   ├── utils.py              # Utility functions and helpers
│   ├── branch_ops.py         # Branch operations
│   ├── reporting.py          # Report generation
│   └── orchestrator.py       # High-level orchestration
├── examples/
│   ├── example_usage.py      # Usage examples
│   └── config.json           # Sample configuration
├── requirements.txt          # Python dependencies
└── README.md                 # This file
```

## 🚀 Quick Start

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nava-ops.git
cd nava-ops
```

2. No external dependencies needed! The project uses only Python standard library.

### Basic Usage

```python
from src import Config, MultibranchOrchestrator
from src.config import RepositoryConfig, BranchConfig

# Create configuration
config = Config(
    repositories=[
        RepositoryConfig(
            path="/path/to/your/repo",
            name="my-project",
            branches=[
                BranchConfig(name="main"),
                BranchConfig(name="develop"),
            ]
        )
    ]
)

# Create orchestrator
orchestrator = MultibranchOrchestrator(config)

# Fetch all branches
report = orchestrator.fetch_all_branches()

# Export report
report_path = orchestrator.report_generator.export(report)
print(f"Report generated: {report_path}")
```

## 📚 Module Documentation

### 1. **config.py** - Configuration Management

Handles all configuration for the system with validation and multiple loading methods.

**Key Classes:**
- `BranchConfig`: Configuration for a single branch
- `RepositoryConfig`: Configuration for a repository
- `ReportingConfig`: Reporting preferences
- `Config`: Main configuration class

**Features:**
- Load from JSON files or dictionaries
- Validation with error reporting
- Default configuration generation
- Type-safe configuration objects

**Example:**
```python
# Load from file
config = Config.from_file("config.json")

# Or create programmatically
config = Config(
    repositories=[...],
    reporting=ReportingConfig(output_format="html"),
    parallel_operations=True,
    max_workers=4
)
```

### 2. **utils.py** - Utility Functions

Provides common utilities used across the system.

**Key Functions:**
- `execute_command()`: Safe command execution with timeout
- `execute_git_command()`: Git-specific command wrapper
- `retry_with_backoff()`: Retry logic with exponential backoff
- `validate_branch_name()`: Branch name validation
- `parse_git_log()`: Parse git log output
- `is_git_repository()`: Check if path is a git repo

**Features:**
- Robust error handling
- Configurable retry logic
- Git-specific utilities
- Command result tracking

### 3. **branch_ops.py** - Branch Operations

Core Git operations for single and multiple branches.

**Key Classes:**
- `BranchOperations`: Single-branch operations
- `MultiBranchOperations`: Optimized multi-branch operations
- `BranchInfo`: Branch metadata
- `OperationResult`: Operation result tracking

**Supported Operations:**
- `create_branch()`: Create new branches
- `switch_branch()`: Switch between branches
- `fetch_branch()`: Fetch from remote
- `pull_branch()`: Pull updates
- `push_branch()`: Push to remote
- `merge_branch()`: Merge branches (supports merge, rebase, squash)
- `list_branches()`: List all branches with metadata
- `get_branch_status()`: Get detailed branch status

**Optimizations:**
- Concurrent fetch for multiple branches
- Retry logic for network operations
- Batch status queries
- Thread pool management

### 4. **reporting.py** - Report Generation

Generates comprehensive reports in multiple formats.

**Key Classes:**
- `ReportGenerator`: Main report generation class
- `Report`: Complete report structure
- `ReportSummary`: Statistical summary
- `BranchReport`: Per-branch report

**Supported Formats:**
- **JSON**: Machine-readable format
- **Markdown**: Human-readable documentation
- **HTML**: Interactive web reports with styling

**Features:**
- Summary statistics (success rate, operation counts)
- Per-branch operation details
- Error tracking and reporting
- Statistical analysis
- Customizable output directory

### 5. **orchestrator.py** - High-Level Orchestration

Coordinates complex multi-branch workflows.

**Key Class:**
- `MultibranchOrchestrator`: Main orchestration class

**Key Methods:**
- `execute_workflow()`: Execute operations across repositories
- `sync_all_branches()`: Fetch and pull all branches
- `fetch_all_branches()`: Fetch all configured branches
- `custom_workflow()`: Execute custom workflow functions

**Features:**
- Parallel repository operations
- Sequential or concurrent execution
- Custom workflow support
- Comprehensive error handling
- Automatic report generation

## 🔧 Configuration

### JSON Configuration Format

```json
{
  "repositories": [
    {
      "path": "/path/to/repo",
      "name": "project-name",
      "default_remote": "origin",
      "branches": [
        {
          "name": "main",
          "remote": "origin",
          "auto_fetch": true,
          "merge_strategy": "merge"
        }
      ]
    }
  ],
  "reporting": {
    "output_format": "html",
    "output_dir": "./reports",
    "include_commits": true,
    "include_diff_stats": true,
    "max_commits": 50
  },
  "parallel_operations": true,
  "max_workers": 4,
  "retry_attempts": 3,
  "retry_delay": 2.0
}
```

## 📊 Optimization Features

### 1. **Concurrent Operations**
- Multiple repositories processed in parallel
- Thread pool for efficient resource utilization
- Configurable worker count

### 2. **Retry Logic**
- Automatic retry for network operations
- Exponential backoff (2s, 4s, 8s, 16s)
- Configurable retry attempts

### 3. **Batch Processing**
- Fetch multiple branches concurrently
- Batch status queries
- Efficient git command execution

### 4. **Error Handling**
- Graceful degradation on errors
- Detailed error tracking
- Continue-on-error support

## 💡 Use Cases

### 1. Syncing Multiple Feature Branches

```python
# Sync all feature branches before deployment
report = orchestrator.execute_workflow(
    operations=["fetch", "pull"],
    branches=["feature-1", "feature-2", "feature-3"]
)
```

### 2. Multi-Repository Monitoring

```python
# Check status across all repositories
report = orchestrator.execute_workflow(
    operations=["fetch"],
    repositories=["frontend", "backend", "api"]
)

# Generate HTML report for dashboard
report_path = orchestrator.report_generator.export_html(report)
```

### 3. Automated Branch Management

```python
def deploy_workflow(branch_ops, branch_config):
    """Custom deployment workflow"""
    results = []

    # Fetch latest
    results.append(branch_ops.fetch_branch(branch_config.name))

    # Pull updates
    results.append(branch_ops.pull_branch(branch_config.name))

    # Push to deployment remote
    results.append(branch_ops.push_branch(
        branch_config.name,
        remote="deploy"
    ))

    return results

report = orchestrator.custom_workflow(deploy_workflow)
```

## 🧪 Examples

See the `examples/` directory for comprehensive examples:

- `example_1_basic_fetch()`: Simple fetch operation
- `example_2_sync_workflow()`: Sync multiple repositories
- `example_3_custom_workflow()`: Custom operation sequence
- `example_4_advanced_custom_workflow()`: Advanced custom functions
- `example_5_load_from_file()`: Configuration from file
- `example_6_error_handling()`: Error handling patterns

## 🎨 Report Formats

### JSON Report
```json
{
  "summary": {
    "total_operations": 6,
    "successful_operations": 5,
    "success_rate": "83.33%",
    "duration": "12.5s"
  },
  "branch_reports": [...]
}
```

### Markdown Report
```markdown
# Multi-Branch Operations Report

## Summary
- **Total Operations:** 6
- **Success Rate:** 83.33%
- **Duration:** 12.5s

## Branch Operations
### Repository: my-project
#### ✅ Branch: `main`
...
```

### HTML Report
Interactive HTML report with:
- Color-coded status indicators
- Responsive design
- Summary cards
- Detailed operation logs

## 📈 Performance

- **Concurrent Execution**: Up to 4x faster with parallel operations
- **Retry Logic**: Resilient to temporary network failures
- **Efficient Git Commands**: Minimal overhead per operation
- **Memory Efficient**: Streaming output for large repositories

## 🔒 Security

- No external dependencies = reduced attack surface
- Safe command execution with timeout
- Input validation for branch names
- No credential storage (uses git's credential manager)

## 🛠️ Development

### Running Examples

```bash
cd examples
python example_usage.py
```

### Code Structure

The codebase follows clean architecture principles:
- **Separation of Concerns**: Each module has a single responsibility
- **Dependency Injection**: Configuration passed to components
- **Type Safety**: Full type hints throughout
- **Error Handling**: Comprehensive error handling at all levels

## 📄 License

See LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! The modular architecture makes it easy to:
- Add new Git operations
- Support new report formats
- Implement custom workflows
- Extend configuration options

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Made with ❤️ for efficient multi-branch Git operations**
>>>>>>> 550c25533c11428a193145e2bac6edd7609c13ba
