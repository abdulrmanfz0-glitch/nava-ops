# Nava Ops REST API Documentation

## Overview

The Nava Ops REST API provides a comprehensive interface for managing Git operations across multiple repositories and branches. Built with FastAPI, it offers high performance, automatic API documentation, and full async support.

## Table of Contents

- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
  - [Configuration](#configuration)
  - [Branch Operations](#branch-operations)
  - [Workflow Execution](#workflow-execution)
  - [Merge Operations](#merge-operations)
  - [Reports](#reports)
  - [Notifications](#notifications)
  - [Health Check](#health-check)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Examples](#examples)

## Getting Started

### Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure environment variables (optional):
```bash
cp .env.example .env
# Edit .env with your settings
```

3. Start the API server:
```bash
# Option 1: Using uvicorn directly
uvicorn src.api:app --reload --host 0.0.0.0 --port 8000

# Option 2: Using Python module
python -m uvicorn src.api:app --reload

# Option 3: Run the api.py directly
python -m src.api
```

4. Access the interactive API documentation:
- Swagger UI: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

### Base URL

```
http://localhost:8000
```

## Authentication

Currently, the API does not require authentication. For production deployments, consider adding:
- API key authentication
- OAuth2 integration
- JWT tokens

## API Endpoints

### Configuration

#### Configure Orchestrator

Configure the Git orchestrator with repository and branch settings.

**Endpoint:** `POST /api/config`

**Request Body:**
```json
{
  "repositories": [
    {
      "path": "/path/to/repo",
      "name": "my-project",
      "branches": [
        {
          "name": "main",
          "remote": "origin",
          "auto_fetch": true,
          "auto_pull": false,
          "merge_strategy": "merge"
        }
      ]
    }
  ],
  "reporting": {
    "output_format": "html",
    "output_dir": "./reports",
    "include_commits": false,
    "max_commits": 10
  },
  "parallel_operations": true,
  "max_workers": 4,
  "retry_attempts": 3,
  "retry_delay": 2
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Configuration applied successfully",
  "repositories": 1,
  "total_branches": 2
}
```

#### Get Current Configuration

Retrieve the current orchestrator configuration.

**Endpoint:** `GET /api/config`

**Response:**
```json
{
  "status": "configured",
  "repositories": [
    {
      "name": "my-project",
      "path": "/path/to/repo",
      "branches": ["main", "develop"]
    }
  ],
  "parallel_operations": true,
  "max_workers": 4
}
```

### Branch Operations

#### List All Branches

List branches across all configured repositories with detailed information.

**Endpoint:** `GET /api/branches`

**Response:**
```json
[
  {
    "repository": "my-project",
    "branches": [
      {
        "name": "main",
        "remote": "origin",
        "is_current": true,
        "last_commit": "abc123",
        "last_commit_author": "John Doe",
        "last_commit_date": "2025-01-15T10:30:00"
      }
    ],
    "current_branch": "main",
    "has_uncommitted_changes": false
  }
]
```

#### List Repository Branches

List branches for a specific repository.

**Endpoint:** `GET /api/branches/{repository_name}`

**Response:**
```json
{
  "repository": "my-project",
  "branches": [
    {
      "name": "main",
      "remote": "origin",
      "is_current": true,
      "last_commit": "abc123",
      "last_commit_author": "John Doe",
      "last_commit_date": "2025-01-15T10:30:00"
    }
  ]
}
```

### Workflow Execution

#### Execute Workflow

Execute a workflow with specified Git operations.

**Endpoint:** `POST /api/workflow`

**Request Body:**
```json
{
  "operations": ["fetch", "pull"],
  "repositories": ["my-project"],  // optional
  "branches": ["main", "develop"]  // optional
}
```

**Supported Operations:**
- `fetch` - Fetch latest changes from remote
- `pull` - Pull changes into local branch
- `push` - Push local changes to remote
- `merge` - Merge branches
- `create` - Create new branch
- `switch` - Switch to different branch

**Response:**
```json
{
  "status": "success",
  "summary": {
    "total_operations": 4,
    "successful_operations": 4,
    "failed_operations": 0,
    "success_rate": 100.0,
    "duration_seconds": 2.5
  },
  "operations": [
    {
      "repository": "my-project",
      "branch": "main",
      "operation": "fetch",
      "status": "success",
      "message": "Fetched successfully"
    }
  ],
  "errors": []
}
```

#### Sync All Branches

Convenience endpoint to synchronize all branches (fetch + pull).

**Endpoint:** `POST /api/workflow/sync`

**Response:**
```json
{
  "status": "success",
  "summary": {
    "total_operations": 8,
    "successful_operations": 8,
    "failed_operations": 0,
    "success_rate": 100.0,
    "duration_seconds": 5.2
  }
}
```

### Merge Operations

#### Merge Branches

Merge one branch into another.

**Endpoint:** `POST /api/merge`

**Request Body:**
```json
{
  "repository_path": "/path/to/repo",
  "source_branch": "feature-branch",
  "target_branch": "main",
  "strategy": "merge",
  "commit_message": "Merge feature into main"  // optional
}
```

**Merge Strategies:**
- `merge` - Standard merge with merge commit
- `rebase` - Rebase source onto target
- `squash` - Squash all commits into one

**Response (Success):**
```json
{
  "status": "success",
  "message": "Successfully merged feature-branch into main",
  "output": "..."
}
```

**Response (Conflict):**
```json
{
  "status": "conflict",
  "message": "Merge conflict detected",
  "conflicts": "CONFLICT (content): Merge conflict in file.txt"
}
```

### Reports

#### List Available Reports

List all generated reports.

**Endpoint:** `GET /api/reports`

**Response:**
```json
{
  "reports": [
    {
      "name": "report_20250115_103000.html",
      "size": 15234,
      "created": "2025-01-15T10:30:00",
      "format": "html"
    }
  ]
}
```

#### Download Report

Download a specific report.

**Endpoint:** `GET /api/reports/{report_name}`

**Response:** File download

#### Generate Report

Generate a report from the last workflow execution.

**Endpoint:** `POST /api/reports/generate`

**Query Parameters:**
- `format` - Report format: `json`, `markdown`, or `html` (default: `json`)
- `include_stats` - Include statistics (default: `true`)

**Response:**
```json
{
  "status": "success",
  "message": "Report would be generated in html format",
  "note": "Execute a workflow first to generate a real report"
}
```

### Notifications

#### Configure Notifications

Configure notification channels (console, Slack, email).

**Endpoint:** `POST /api/notifications/config`

**Request Body:**
```json
{
  "console_enabled": true,
  "slack_enabled": true,
  "email_enabled": false,
  "slack_webhook_url": "https://hooks.slack.com/services/...",
  "email_smtp_host": "smtp.gmail.com",
  "email_smtp_port": 587,
  "email_from": "nava-ops@example.com",
  "email_to": ["admin@example.com"],
  "email_username": "nava-ops@example.com",
  "email_password": "app-password"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Notification settings configured",
  "enabled_channels": {
    "console": true,
    "slack": true,
    "email": false
  }
}
```

#### Send Test Notification

Send a test notification to verify configuration.

**Endpoint:** `POST /api/notifications/test`

**Query Parameters:**
- `message` - Test message (default: "Test notification from Nava Ops")

**Response:**
```json
{
  "status": "success",
  "message": "Test notification sent"
}
```

### Health Check

#### API Health Check

Check the health and status of the API.

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00",
  "orchestrator_configured": true,
  "notifications_configured": true
}
```

## Data Models

### BranchConfig

```json
{
  "name": "string",
  "remote": "string (default: 'origin')",
  "auto_fetch": "boolean (default: true)",
  "auto_pull": "boolean (default: false)",
  "merge_strategy": "string (default: 'merge')"
}
```

### RepositoryConfig

```json
{
  "path": "string (required)",
  "name": "string (optional)",
  "branches": "BranchConfig[] (required)"
}
```

### WorkflowRequest

```json
{
  "operations": "string[] (required)",
  "repositories": "string[] (optional)",
  "branches": "string[] (optional)"
}
```

### MergeRequest

```json
{
  "repository_path": "string (required)",
  "source_branch": "string (required)",
  "target_branch": "string (required)",
  "strategy": "string (default: 'merge')",
  "commit_message": "string (optional)"
}
```

## Error Handling

The API uses standard HTTP status codes:

- `200 OK` - Request successful
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

**Error Response Format:**
```json
{
  "detail": "Error message describing what went wrong"
}
```

## Examples

### Python Example

```python
import requests

# Configure orchestrator
config = {
    "repositories": [{
        "path": "/path/to/repo",
        "name": "my-project",
        "branches": [{"name": "main", "remote": "origin"}]
    }],
    "parallel_operations": True,
    "max_workers": 4
}

response = requests.post("http://localhost:8000/api/config", json=config)
print(response.json())

# Execute workflow
workflow = {
    "operations": ["fetch", "pull"]
}

response = requests.post("http://localhost:8000/api/workflow", json=workflow)
print(response.json())
```

### cURL Examples

**Configure Orchestrator:**
```bash
curl -X POST http://localhost:8000/api/config \
  -H "Content-Type: application/json" \
  -d '{
    "repositories": [{
      "path": "/path/to/repo",
      "name": "my-project",
      "branches": [{"name": "main"}]
    }],
    "parallel_operations": true,
    "max_workers": 4
  }'
```

**List Branches:**
```bash
curl http://localhost:8000/api/branches
```

**Execute Workflow:**
```bash
curl -X POST http://localhost:8000/api/workflow \
  -H "Content-Type: application/json" \
  -d '{
    "operations": ["fetch", "pull"]
  }'
```

**Sync All:**
```bash
curl -X POST http://localhost:8000/api/workflow/sync
```

### JavaScript/Fetch Example

```javascript
// Configure orchestrator
const config = {
  repositories: [{
    path: '/path/to/repo',
    name: 'my-project',
    branches: [{ name: 'main', remote: 'origin' }]
  }],
  parallel_operations: true,
  max_workers: 4
};

const response = await fetch('http://localhost:8000/api/config', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(config)
});

const result = await response.json();
console.log(result);

// List branches
const branchesResponse = await fetch('http://localhost:8000/api/branches');
const branches = await branchesResponse.json();
console.log(branches);
```

## Frontend Integration

The React frontend component (`GitOperations.jsx`) demonstrates full integration with the API:

**Access the Git Operations Dashboard:**
```
http://localhost:5173/git-ops
```

**Features:**
- Visual branch management
- One-click workflow execution
- Merge operation interface
- Notification configuration
- Real-time status updates

## CORS Configuration

The API is configured to allow cross-origin requests from any origin (`*`). For production, update the CORS middleware in `src/api.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Rate Limiting

Currently, there is no rate limiting. For production, consider adding:
- slowapi for rate limiting
- API key quotas
- IP-based throttling

## Production Deployment

### Using Gunicorn (Recommended)

```bash
pip install gunicorn
gunicorn src.api:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Using Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "src.api:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables

Set these in production:
- `API_HOST` - API host (default: 0.0.0.0)
- `API_PORT` - API port (default: 8000)
- `CORS_ORIGINS` - Allowed origins
- `LOG_LEVEL` - Logging level

## Support

For issues, questions, or contributions:
- GitHub Issues: [nava-ops/issues](https://github.com/yourusername/nava-ops/issues)
- Documentation: This file and `/api/docs` endpoint

## License

[Your License Here]

---

**Version:** 2.1.0
**Last Updated:** 2025-01-15
