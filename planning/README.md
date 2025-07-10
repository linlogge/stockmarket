# Jira Sprint Importer

This TypeScript script automatically imports sprint data from markdown files into Jira, creating sprints and issues with all the detailed information from our sprint planning.

## Features

- 📊 **Automatic Sprint Creation**: Creates sprints with proper dates and goals
- 🎯 **Issue Creation**: Creates detailed issues with all task information
- 👥 **Team Assignment**: Maps team members to Jira users
- 📝 **Rich Descriptions**: Includes acceptance criteria, technical implementation, and issues encountered
- 🔄 **Carryover Tracking**: Handles tasks that carry over between sprints
- 📈 **Progress Tracking**: Maintains status and story points

## Prerequisites

1. **Jira Instance**: You need access to a Jira instance
2. **API Token**: Generate an API token from your Atlassian account
3. **Project Setup**: Ensure your Jira project has the necessary custom fields
4. **Node.js**: Version 16 or higher

## Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Jira Settings**:
   Edit the `jiraConfig` object in `jira-import-script.ts`:

   ```typescript
   const jiraConfig: JiraConfig = {
     baseUrl: 'https://your-domain.atlassian.net', // Your Jira URL
     username: 'your-email@example.com', // Your Jira username
     apiToken: 'your-api-token', // Your Jira API token
     projectKey: 'STOCK', // Your project key
     issueTypeId: '10001', // Story issue type ID
     epicKey: 'STOCK-1' // Optional: Epic key
   };
   ```

## Jira Setup

### Required Custom Fields

The script uses these custom fields (you may need to adjust the field IDs):

| Field | Purpose | Field ID |
|-------|---------|----------|
| Story Points | Story point estimation | `customfield_10016` |
| Sprint | Sprint assignment | `customfield_10014` |
| Acceptance Criteria | Task acceptance criteria | `customfield_10015` |
| Technical Implementation | Technical details | `customfield_10017` |
| Deliverables | Task deliverables | `customfield_10018` |
| Issues Encountered | Problems during development | `customfield_10019` |
| Resolution | How issues were resolved | `customfield_10020` |

### Finding Custom Field IDs

1. Go to **Administration** → **Issues** → **Custom fields**
2. Find your custom field and note the ID
3. Update the script with the correct field IDs

## Usage

### Basic Import

```bash
npm start
```

### Development Mode

```bash
npm run dev
```

### Build and Run

```bash
npm run build
node dist/jira-import-script.js
```

## What Gets Imported

### Sprint Information
- Sprint name and number
- Start and end dates
- Sprint goals
- Team members

### Task Details
- Task ID and name
- Assignee (mapped to Jira users)
- Story points
- Priority level
- Status (To Do, In Progress, Done)
- Detailed description
- Acceptance criteria
- Technical implementation details
- Deliverables
- Issues encountered (marked in red 🔴)
- Resolution of previous issues (marked in green ✅)

### Team Member Mapping

The script maps team members to Jira usernames:

| Team Member | Jira Username |
|-------------|---------------|
| Noël Sigmunczyk | noel.sigmunczyk |
| Ivan Malakhov | ivan.malakhov |
| Alan Saji | alan.saji |
| All Team Members | alan.saji (default) |

## Sprint Data Structure

The script reads from these markdown files:
- `sprint-1-details.md`
- `sprint-2-details.md`
- `sprint-3-details.md`

### Expected Format

Each task should follow this format:

```markdown
#### S1-001: Task Name
**Assignee**: Team Member Name
**Story Points**: 8
**Priority**: High
**Status**: ✅ COMPLETED
**Description**: Task description

**Acceptance Criteria**:
- [x] Criterion 1
- [x] Criterion 2

**Issues Encountered**:
- **🔴 ISSUE**: Issue description

**Deliverables**:
- Deliverable 1
- Deliverable 2
```

## Output

The script will:

1. **Create Sprints**: 3 sprints with proper dates and goals
2. **Create Issues**: ~39 issues across all sprints
3. **Assign Tasks**: Map team members to Jira users
4. **Set Status**: Mark tasks as completed, in progress, or to do
5. **Add Details**: Include all acceptance criteria, issues, and resolutions

### Console Output

```
🚀 Starting Jira import...

📊 Parsed 3 sprints

📋 Processing Sprint 1...
✅ Created sprint: 123 - Sprint 1
✅ Created issue: STOCK-1 - System Architecture Design
✅ Created issue: STOCK-2 - Database Schema Design
...
✅ Completed Sprint 1 with 8 tasks

📋 Processing Sprint 2...
...

🎉 Jira import completed successfully!

📈 Summary:
- Total Sprints: 3
- Total Tasks: 39
- Total Story Points: 237
```

## Error Handling

The script includes comprehensive error handling:

- **Rate Limiting**: Built-in delays to avoid Jira API limits
- **Validation**: Checks for required fields before creating issues
- **Logging**: Detailed console output for debugging
- **Graceful Failure**: Continues processing even if individual issues fail

## Customization

### Adding New Custom Fields

1. Add the field to the `JiraIssue` interface
2. Update the `createJiraIssue` method
3. Add the field to the `formatDescription` method if needed

### Modifying Team Mapping

Update the `mapAssignee` method:

```typescript
private mapAssignee(assignee: string): string {
  const assigneeMap: { [key: string]: string } = {
    'Your Name': 'your.jira.username',
    // Add more mappings
  };
  return assigneeMap[assignee] || 'default.username';
}
```

### Changing Sprint Dates

Update the date methods:

```typescript
private getSprintStartDate(sprintNumber: number): string {
  const startDates = {
    1: '2024-01-15',
    2: '2024-01-29',
    3: '2024-02-19'
  };
  return startDates[sprintNumber] || '2024-01-15';
}
```

## Troubleshooting

### Common Issues

1. **Authentication Error**: Check your API token and username
2. **Field Not Found**: Verify custom field IDs in your Jira instance
3. **Rate Limiting**: The script includes delays, but you may need to increase them
4. **Permission Error**: Ensure your user has permission to create issues and sprints

### Debug Mode

Add more detailed logging by modifying the script:

```typescript
// Add this to see detailed API responses
console.log('API Response:', JSON.stringify(response.data, null, 2));
```

## Security Notes

- **API Token**: Keep your API token secure and never commit it to version control
- **Environment Variables**: Consider using environment variables for sensitive data
- **Permissions**: Use a dedicated service account with minimal required permissions

## Support

For issues or questions:
1. Check the console output for error messages
2. Verify your Jira configuration
3. Ensure all required custom fields exist
4. Check your Jira user permissions 