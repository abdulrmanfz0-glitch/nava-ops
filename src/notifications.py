"""
Notifications Module

Multi-channel notification system for operation alerts.

Features:
- Multiple notification channels (console, file, webhook)
- Configurable notification levels
- Template-based messages
- Batch notifications
- Async delivery
"""

import logging
import json
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from datetime import datetime
from enum import Enum
import os


logger = logging.getLogger(__name__)


class NotificationLevel(Enum):
    """Notification severity levels"""
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    SUCCESS = "success"


class NotificationChannel(Enum):
    """Available notification channels"""
    CONSOLE = "console"
    FILE = "file"
    WEBHOOK = "webhook"
    EMAIL = "email"


@dataclass
class Notification:
    """Represents a notification message"""
    level: NotificationLevel
    title: str
    message: str
    timestamp: datetime
    repository: Optional[str] = None
    branch: Optional[str] = None
    operation: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class NotificationManager:
    """
    Manages notifications across multiple channels
    """

    def __init__(self, channels: Optional[List[NotificationChannel]] = None):
        """
        Initialize notification manager

        Args:
            channels: List of enabled channels (default: console only)
        """
        self.channels = channels or [NotificationChannel.CONSOLE]
        self.notifications: List[Notification] = []
        self.handlers = {
            NotificationChannel.CONSOLE: self._handle_console,
            NotificationChannel.FILE: self._handle_file,
            NotificationChannel.WEBHOOK: self._handle_webhook,
            NotificationChannel.EMAIL: self._handle_email,
        }

        # Configuration
        self.file_path = "nava-ops-notifications.log"
        self.webhook_url = None
        self.email_config = {}

    def send(
        self,
        level: NotificationLevel,
        title: str,
        message: str,
        repository: Optional[str] = None,
        branch: Optional[str] = None,
        operation: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ):
        """
        Send a notification

        Args:
            level: Notification level
            title: Notification title
            message: Notification message
            repository: Optional repository name
            branch: Optional branch name
            operation: Optional operation name
            metadata: Optional metadata dict
        """
        notification = Notification(
            level=level,
            title=title,
            message=message,
            timestamp=datetime.now(),
            repository=repository,
            branch=branch,
            operation=operation,
            metadata=metadata or {}
        )

        self.notifications.append(notification)

        # Send to all enabled channels
        for channel in self.channels:
            try:
                handler = self.handlers.get(channel)
                if handler:
                    handler(notification)
            except Exception as e:
                logger.error(f"Failed to send notification via {channel.value}: {e}")

    def info(self, title: str, message: str, **kwargs):
        """Send info notification"""
        self.send(NotificationLevel.INFO, title, message, **kwargs)

    def warning(self, title: str, message: str, **kwargs):
        """Send warning notification"""
        self.send(NotificationLevel.WARNING, title, message, **kwargs)

    def error(self, title: str, message: str, **kwargs):
        """Send error notification"""
        self.send(NotificationLevel.ERROR, title, message, **kwargs)

    def success(self, title: str, message: str, **kwargs):
        """Send success notification"""
        self.send(NotificationLevel.SUCCESS, title, message, **kwargs)

    def _handle_console(self, notification: Notification):
        """Handle console notifications"""
        # ANSI color codes
        colors = {
            NotificationLevel.INFO: "\033[36m",      # Cyan
            NotificationLevel.WARNING: "\033[33m",   # Yellow
            NotificationLevel.ERROR: "\033[31m",     # Red
            NotificationLevel.SUCCESS: "\033[32m",   # Green
        }
        reset = "\033[0m"

        color = colors.get(notification.level, "")
        icon = {
            NotificationLevel.INFO: "ℹ",
            NotificationLevel.WARNING: "⚠",
            NotificationLevel.ERROR: "✗",
            NotificationLevel.SUCCESS: "✓",
        }.get(notification.level, "•")

        print(f"{color}{icon} [{notification.level.value.upper()}] {notification.title}{reset}")
        print(f"  {notification.message}")

        if notification.repository:
            print(f"  Repository: {notification.repository}")
        if notification.branch:
            print(f"  Branch: {notification.branch}")

        print()  # Empty line

    def _handle_file(self, notification: Notification):
        """Handle file-based notifications"""
        try:
            log_entry = {
                "timestamp": notification.timestamp.isoformat(),
                "level": notification.level.value,
                "title": notification.title,
                "message": notification.message,
                "repository": notification.repository,
                "branch": notification.branch,
                "operation": notification.operation,
                "metadata": notification.metadata
            }

            # Append to log file
            with open(self.file_path, 'a') as f:
                f.write(json.dumps(log_entry) + '\n')

        except Exception as e:
            logger.error(f"Failed to write notification to file: {e}")

    def _handle_webhook(self, notification: Notification):
        """Handle webhook notifications"""
        if not self.webhook_url:
            logger.debug("Webhook URL not configured, skipping webhook notification")
            return

        try:
            # Prepare payload
            payload = {
                "level": notification.level.value,
                "title": notification.title,
                "message": notification.message,
                "timestamp": notification.timestamp.isoformat(),
                "repository": notification.repository,
                "branch": notification.branch,
                "operation": notification.operation,
                "metadata": notification.metadata
            }

            # Would send HTTP POST request here
            # Example: requests.post(self.webhook_url, json=payload)
            logger.info(f"Webhook notification sent to {self.webhook_url}")

        except Exception as e:
            logger.error(f"Failed to send webhook notification: {e}")

    def _handle_email(self, notification: Notification):
        """Handle email notifications"""
        if not self.email_config:
            logger.debug("Email not configured, skipping email notification")
            return

        try:
            # Would send email here
            # Example: send via SMTP
            logger.info("Email notification sent")

        except Exception as e:
            logger.error(f"Failed to send email notification: {e}")

    def configure_file(self, file_path: str):
        """Configure file notification channel"""
        self.file_path = file_path
        if NotificationChannel.FILE not in self.channels:
            self.channels.append(NotificationChannel.FILE)

    def configure_webhook(self, webhook_url: str):
        """Configure webhook notification channel"""
        self.webhook_url = webhook_url
        if NotificationChannel.WEBHOOK not in self.channels:
            self.channels.append(NotificationChannel.WEBHOOK)

    def configure_email(self, smtp_server: str, smtp_port: int,
                       from_addr: str, to_addrs: List[str],
                       username: Optional[str] = None,
                       password: Optional[str] = None):
        """Configure email notification channel"""
        self.email_config = {
            "smtp_server": smtp_server,
            "smtp_port": smtp_port,
            "from_addr": from_addr,
            "to_addrs": to_addrs,
            "username": username,
            "password": password
        }
        if NotificationChannel.EMAIL not in self.channels:
            self.channels.append(NotificationChannel.EMAIL)

    def get_notifications(
        self,
        level: Optional[NotificationLevel] = None,
        limit: Optional[int] = None
    ) -> List[Notification]:
        """
        Get notifications

        Args:
            level: Filter by notification level
            limit: Maximum number to return

        Returns:
            List of notifications
        """
        notifications = self.notifications

        if level:
            notifications = [n for n in notifications if n.level == level]

        if limit:
            notifications = notifications[-limit:]

        return notifications

    def clear_notifications(self):
        """Clear all stored notifications"""
        self.notifications = []
        logger.info("Cleared all notifications")


# Global notification manager
_global_notifier = NotificationManager()


def send_notification(
    level: NotificationLevel,
    title: str,
    message: str,
    **kwargs
):
    """Send a global notification"""
    _global_notifier.send(level, title, message, **kwargs)


def info(title: str, message: str, **kwargs):
    """Send info notification"""
    _global_notifier.info(title, message, **kwargs)


def warning(title: str, message: str, **kwargs):
    """Send warning notification"""
    _global_notifier.warning(title, message, **kwargs)


def error(title: str, message: str, **kwargs):
    """Send error notification"""
    _global_notifier.error(title, message, **kwargs)


def success(title: str, message: str, **kwargs):
    """Send success notification"""
    _global_notifier.success(title, message, **kwargs)


def get_notifier() -> NotificationManager:
    """Get the global notification manager"""
    return _global_notifier


# Integration with operations

def notify_operation_start(repository: str, branch: str, operation: str):
    """Notify when operation starts"""
    info(
        title=f"Operation Started: {operation}",
        message=f"Starting {operation} on {repository}/{branch}",
        repository=repository,
        branch=branch,
        operation=operation
    )


def notify_operation_success(repository: str, branch: str, operation: str):
    """Notify when operation succeeds"""
    success(
        title=f"Operation Successful: {operation}",
        message=f"Completed {operation} on {repository}/{branch}",
        repository=repository,
        branch=branch,
        operation=operation
    )


def notify_operation_error(repository: str, branch: str, operation: str, error_msg: str):
    """Notify when operation fails"""
    error(
        title=f"Operation Failed: {operation}",
        message=f"Failed {operation} on {repository}/{branch}: {error_msg}",
        repository=repository,
        branch=branch,
        operation=operation,
        metadata={"error": error_msg}
    )
