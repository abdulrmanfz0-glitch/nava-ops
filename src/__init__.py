"""
Nava Ops - Multi-Branch Operations and Reporting System

A powerful, modular Python system for managing Git operations across
multiple branches and repositories with comprehensive reporting capabilities.
"""

__version__ = "2.0.0"

# Core modules
from .config import Config
from .branch_ops import BranchOperations
from .reporting import ReportGenerator
from .orchestrator import MultibranchOrchestrator

# Advanced modules
from .cli import NavaOpsCLI
from .conflict_resolution import (
    ConflictDetector,
    ConflictResolver,
    ResolutionStrategy,
    preview_merge_conflicts,
    resolve_merge_conflicts
)
from .branch_comparison import (
    BranchAnalyzer,
    BranchComparison,
    BranchDivergence,
    compare_branches,
    analyze_branch_divergence
)
from .advanced_ops import AdvancedGitOperations
from .hooks import (
    HookManager,
    HookEvent,
    register_hook,
    trigger_hook,
    get_hook_manager
)
from .notifications import (
    NotificationManager,
    NotificationLevel,
    NotificationChannel,
    send_notification,
    get_notifier
)

__all__ = [
    # Core
    "Config",
    "BranchOperations",
    "ReportGenerator",
    "MultibranchOrchestrator",
    # CLI
    "NavaOpsCLI",
    # Conflict Resolution
    "ConflictDetector",
    "ConflictResolver",
    "ResolutionStrategy",
    "preview_merge_conflicts",
    "resolve_merge_conflicts",
    # Branch Comparison
    "BranchAnalyzer",
    "BranchComparison",
    "BranchDivergence",
    "compare_branches",
    "analyze_branch_divergence",
    # Advanced Operations
    "AdvancedGitOperations",
    # Hooks
    "HookManager",
    "HookEvent",
    "register_hook",
    "trigger_hook",
    "get_hook_manager",
    # Notifications
    "NotificationManager",
    "NotificationLevel",
    "NotificationChannel",
    "send_notification",
    "get_notifier",
]
