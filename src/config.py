"""
Configuration Module

This module handles all configuration management for the multi-branch operations system.
It provides centralized configuration with validation and defaults.

Key responsibilities:
- Load and validate configuration from various sources (files, environment, defaults)
- Provide configuration access throughout the application
- Support for multiple repository configurations
"""

import os
import json
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field, asdict


@dataclass
class BranchConfig:
    """Configuration for a single branch"""
    name: str
    remote: str = "origin"
    auto_fetch: bool = True
    merge_strategy: str = "merge"  # merge, rebase, or squash
    is_default: bool = False  # whether this is the default branch


@dataclass
class RepositoryConfig:
    """Configuration for a single repository"""
    path: str
    name: str
    branches: List[BranchConfig] = field(default_factory=list)
    default_remote: str = "origin"


@dataclass
class ReportingConfig:
    """Configuration for reporting"""
    output_format: str = "json"  # json, markdown, html
    output_dir: str = "./reports"
    include_commits: bool = True
    include_diff_stats: bool = True
    max_commits: int = 50


@dataclass
class Config:
    """
    Main configuration class for the entire system

    This centralizes all configuration needs and provides a single source of truth.
    """
    repositories: List[RepositoryConfig] = field(default_factory=list)
    reporting: ReportingConfig = field(default_factory=ReportingConfig)
    parallel_operations: bool = True
    max_workers: int = 4
    retry_attempts: int = 3
    retry_delay: float = 2.0

    @classmethod
    def from_file(cls, config_path: str) -> 'Config':
        """
        Load configuration from a JSON file

        Args:
            config_path: Path to the configuration file

        Returns:
            Config instance
        """
        if not os.path.exists(config_path):
            raise FileNotFoundError(f"Configuration file not found: {config_path}")

        # Check if file is empty
        if os.path.getsize(config_path) == 0:
            raise ValueError(
                f"Configuration file is empty: {config_path}\n"
                f"The file exists but contains no data. This may happen if:\n"
                f"  1. The file wasn't properly pulled from git\n"
                f"  2. The file got corrupted\n"
                f"To fix this:\n"
                f"  - Try: git checkout HEAD -- {config_path}\n"
                f"  - Or pull the latest changes: git pull\n"
                f"  - Or create a sample config with Config.create_sample_config('{config_path}')"
            )

        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                content = f.read().strip()
                if not content:
                    raise ValueError(f"Configuration file is empty: {config_path}")
                data = json.loads(content)
        except json.JSONDecodeError as e:
            raise ValueError(
                f"Invalid JSON in configuration file: {config_path}\n"
                f"Error: {str(e)}\n"
                f"Please ensure the file contains valid JSON or restore it from git:\n"
                f"  git checkout HEAD -- {config_path}"
            ) from e

        return cls.from_dict(data)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Config':
        """
        Create Config from dictionary

        Args:
            data: Dictionary with configuration data

        Returns:
            Config instance
        """
        # Define valid fields for BranchConfig to filter out unknown fields
        valid_branch_fields = {'name', 'remote', 'auto_fetch', 'merge_strategy', 'is_default'}

        # Parse repositories
        repos = []
        for repo_data in data.get('repositories', []):
            branches = []
            for branch_data in repo_data.get('branches', []):
                # Filter out unknown fields from branch config
                filtered_branch_data = {
                    k: v for k, v in branch_data.items()
                    if k in valid_branch_fields
                }
                branches.append(BranchConfig(**filtered_branch_data))

            repos.append(RepositoryConfig(
                path=repo_data['path'],
                name=repo_data['name'],
                branches=branches,
                default_remote=repo_data.get('default_remote', 'origin')
            ))

        # Parse reporting config
        valid_reporting_fields = {'output_format', 'output_dir', 'include_commits', 'include_diff_stats', 'max_commits'}
        reporting_data = data.get('reporting', {})
        if reporting_data:
            # Filter out unknown fields from reporting config
            filtered_reporting_data = {
                k: v for k, v in reporting_data.items()
                if k in valid_reporting_fields
            }
            reporting = ReportingConfig(**filtered_reporting_data)
        else:
            reporting = ReportingConfig()

        return cls(
            repositories=repos,
            reporting=reporting,
            parallel_operations=data.get('parallel_operations', True),
            max_workers=data.get('max_workers', 4),
            retry_attempts=data.get('retry_attempts', 3),
            retry_delay=data.get('retry_delay', 2.0)
        )

    def to_dict(self) -> Dict[str, Any]:
        """Convert configuration to dictionary"""
        return asdict(self)

    def to_file(self, config_path: str) -> None:
        """
        Save configuration to a JSON file

        Args:
            config_path: Path where to save the configuration
        """
        with open(config_path, 'w') as f:
            json.dump(self.to_dict(), f, indent=2)

    def validate(self) -> List[str]:
        """
        Validate configuration

        Returns:
            List of validation errors (empty if valid)
        """
        errors = []

        if not self.repositories:
            errors.append("At least one repository must be configured")

        for repo in self.repositories:
            if not os.path.exists(repo.path):
                errors.append(f"Repository path does not exist: {repo.path}")

        if self.max_workers < 1:
            errors.append("max_workers must be at least 1")

        if self.retry_attempts < 0:
            errors.append("retry_attempts cannot be negative")

        return errors

    @classmethod
    def create_sample_config(cls, output_path: str) -> 'Config':
        """
        Create a sample configuration file

        Args:
            output_path: Path where to save the sample configuration

        Returns:
            The created Config instance
        """
        sample_config = cls(
            repositories=[
                RepositoryConfig(
                    path="/path/to/your/repository",
                    name="my-project",
                    default_remote="origin",
                    branches=[
                        BranchConfig(name="main", remote="origin", auto_fetch=True, merge_strategy="merge"),
                        BranchConfig(name="develop", remote="origin", auto_fetch=True, merge_strategy="merge"),
                        BranchConfig(name="staging", remote="origin", auto_fetch=True, merge_strategy="rebase"),
                    ]
                ),
                RepositoryConfig(
                    path="/path/to/another/repository",
                    name="another-project",
                    default_remote="origin",
                    branches=[
                        BranchConfig(name="main", remote="origin", auto_fetch=True, merge_strategy="merge"),
                    ]
                )
            ],
            reporting=ReportingConfig(
                output_format="html",
                output_dir="./reports",
                include_commits=True,
                include_diff_stats=True,
                max_commits=50
            ),
            parallel_operations=True,
            max_workers=4,
            retry_attempts=3,
            retry_delay=2.0
        )

        sample_config.to_file(output_path)
        return sample_config


def create_default_config(repo_path: str = ".") -> Config:
    """
    Create a default configuration

    Args:
        repo_path: Path to the repository

    Returns:
        Default Config instance
    """
    return Config(
        repositories=[
            RepositoryConfig(
                path=repo_path,
                name=os.path.basename(os.path.abspath(repo_path)),
                branches=[
                    BranchConfig(name="main"),
                    BranchConfig(name="develop"),
                ]
            )
        ]
    )
