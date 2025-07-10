import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

// Jira Configuration
interface JiraConfig {
  baseUrl: string;
  username: string;
  apiToken: string;
  projectKey: string;
  issueTypeId: string;
  epicKey?: string;
}

// Sprint Data Structure
interface SprintTask {
  id: string;
  name: string;
  description: string;
  assignee: string;
  storyPoints: number;
  priority: 'High' | 'Medium' | 'Low';
  status: 'To Do' | 'In Progress' | 'Done';
  sprint: string;
  acceptanceCriteria: string[];
  technicalImplementation?: string[];
  deliverables?: string[];
  issues?: string[];
  resolution?: string[];
}

interface SprintData {
  sprintNumber: number;
  name: string;
  duration: string;
  team: string[];
  goal: string;
  tasks: SprintTask[];
  carryoverTasks?: SprintTask[];
}

// Jira Issue Creation
interface JiraIssue {
  fields: {
    project: { key: string };
    summary: string;
    description: string;
    issuetype: { id: string };
    assignee?: { name: string };
    priority?: { name: string };
    customfield_10016?: number; // Story Points
    customfield_10014?: string; // Sprint
    customfield_10015?: string[]; // Acceptance Criteria
    customfield_10017?: string; // Technical Implementation
    customfield_10018?: string[]; // Deliverables
    customfield_10019?: string[]; // Issues Encountered
    customfield_10020?: string[]; // Resolution
  };
}

class JiraImporter {
  private config: JiraConfig;
  private sprintData: SprintData[] = [];

  constructor(config: JiraConfig) {
    this.config = config;
  }

  // Parse sprint data from markdown files
  private parseSprintData(): void {
    const sprintFiles = [
      { file: 'sprint-1-details.md', number: 1 },
      { file: 'sprint-2-details.md', number: 2 },
      { file: 'sprint-3-details.md', number: 3 }
    ];

    for (const sprintFile of sprintFiles) {
      const filePath = path.join(__dirname, sprintFile.file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const sprintData = this.parseSprintMarkdown(content, sprintFile.number);
      this.sprintData.push(sprintData);
    }
  }

  private parseSprintMarkdown(content: string, sprintNumber: number): SprintData {
    const lines = content.split('\n');
    let currentTask: Partial<SprintTask> = {};
    const tasks: SprintTask[] = [];
    let inTaskSection = false;

    // Extract sprint metadata
    const nameMatch = content.match(/\*\*Sprint Goal\*\*: (.+)/);
    const durationMatch = content.match(/\*\*Duration\*\*: (.+)/);
    const teamMatch = content.match(/\*\*Team\*\*: (.+)/);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Detect task sections
      if (line.startsWith('#### S') && line.includes(':')) {
        inTaskSection = true;
        currentTask = {};
        
        // Parse task header
        const taskMatch = line.match(/#### (S\d+-\d+): (.+)/);
        if (taskMatch) {
          currentTask.id = taskMatch[1];
          currentTask.name = taskMatch[2];
        }
        continue;
      }

      if (inTaskSection) {
        // Parse task details
        if (line.startsWith('**Assignee**:')) {
          currentTask.assignee = line.split(':')[1].trim();
        } else if (line.startsWith('**Story Points**:')) {
          currentTask.storyPoints = parseInt(line.split(':')[1].trim());
        } else if (line.startsWith('**Priority**:')) {
          currentTask.priority = line.split(':')[1].trim() as 'High' | 'Medium' | 'Low';
        } else if (line.startsWith('**Status**:')) {
          const status = line.split(':')[1].trim();
          if (status.includes('COMPLETED')) {
            currentTask.status = 'Done';
          } else if (status.includes('IN PROGRESS')) {
            currentTask.status = 'In Progress';
          } else {
            currentTask.status = 'To Do';
          }
        } else if (line.startsWith('**Description**:')) {
          // Get description from next line
          if (i + 1 < lines.length) {
            currentTask.description = lines[i + 1].trim();
          }
        } else if (line.startsWith('**Acceptance Criteria**:')) {
          const criteria: string[] = [];
          let j = i + 1;
          while (j < lines.length && lines[j].trim().startsWith('- [')) {
            const criterion = lines[j].trim().replace('- [x] ', '').replace('- [ ] ', '');
            criteria.push(criterion);
            j++;
          }
          currentTask.acceptanceCriteria = criteria;
        } else if (line.startsWith('**Issues Encountered**:')) {
          const issues: string[] = [];
          let j = i + 1;
          while (j < lines.length && lines[j].trim().startsWith('- **🔴 ISSUE**:')) {
            const issue = lines[j].trim().replace('- **🔴 ISSUE**: ', '');
            issues.push(issue);
            j++;
          }
          currentTask.issues = issues;
        } else if (line.startsWith('**Resolution of Previous Issues**:')) {
          const resolutions: string[] = [];
          let j = i + 1;
          while (j < lines.length && lines[j].trim().startsWith('- **✅ RESOLVED**:')) {
            const resolution = lines[j].trim().replace('- **✅ RESOLVED**: ', '');
            resolutions.push(resolution);
            j++;
          }
          currentTask.resolution = resolutions;
        } else if (line.startsWith('**Deliverables**:')) {
          const deliverables: string[] = [];
          let j = i + 1;
          while (j < lines.length && lines[j].trim().startsWith('- ')) {
            const deliverable = lines[j].trim().replace('- ', '');
            deliverables.push(deliverable);
            j++;
          }
          currentTask.deliverables = deliverables;
        } else if (line.startsWith('---') && currentTask.id) {
          // End of task section
          if (currentTask.id && currentTask.name) {
            tasks.push(currentTask as SprintTask);
          }
          currentTask = {};
          inTaskSection = false;
        }
      }
    }

    // Add final task if exists
    if (currentTask.id && currentTask.name) {
      tasks.push(currentTask as SprintTask);
    }

    return {
      sprintNumber,
      name: `Sprint ${sprintNumber}`,
      duration: durationMatch?.[1] || '',
      team: teamMatch?.[1].split(', ') || [],
      goal: nameMatch?.[1] || '',
      tasks
    };
  }

  // Create Jira issue
  private async createJiraIssue(task: SprintTask): Promise<string> {
    const issue: JiraIssue = {
      fields: {
        project: { key: this.config.projectKey },
        summary: task.name,
        description: this.formatDescription(task),
        issuetype: { id: this.config.issueTypeId },
        assignee: { name: this.mapAssignee(task.assignee) },
        priority: { name: this.mapPriority(task.priority) },
        customfield_10016: task.storyPoints, // Story Points
        customfield_10014: task.sprint, // Sprint
        customfield_10015: task.acceptanceCriteria, // Acceptance Criteria
        customfield_10017: task.technicalImplementation?.join('\n'), // Technical Implementation
        customfield_10018: task.deliverables, // Deliverables
        customfield_10019: task.issues, // Issues Encountered
        customfield_10020: task.resolution // Resolution
      }
    };

    try {
      const response = await axios.post(
        `${this.config.baseUrl}/rest/api/3/issue`,
        issue,
        {
          auth: {
            username: this.config.username,
            password: this.config.apiToken
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`✅ Created issue: ${response.data.key} - ${task.name}`);
      return response.data.key;
    } catch (error) {
      console.error(`❌ Failed to create issue for ${task.name}:`, error);
      throw error;
    }
  }

  private formatDescription(task: SprintTask): string {
    let description = `*Task ID:* ${task.id}\n`;
    description += `*Sprint:* ${task.sprint}\n`;
    description += `*Story Points:* ${task.storyPoints}\n`;
    description += `*Priority:* ${task.priority}\n`;
    description += `*Status:* ${task.status}\n\n`;
    description += `*Description:*\n${task.description}\n\n`;

    if (task.technicalImplementation && task.technicalImplementation.length > 0) {
      description += `*Technical Implementation:*\n${task.technicalImplementation.join('\n')}\n\n`;
    }

    if (task.issues && task.issues.length > 0) {
      description += `*Issues Encountered:*\n${task.issues.map(issue => `• ${issue}`).join('\n')}\n\n`;
    }

    if (task.resolution && task.resolution.length > 0) {
      description += `*Resolution:*\n${task.resolution.map(res => `• ${res}`).join('\n')}\n\n`;
    }

    return description;
  }

  private mapAssignee(assignee: string): string {
    const assigneeMap: { [key: string]: string } = {
      'Noël Sigmunczyk': 'noel.sigmunczyk',
      'Ivan Malakhov': 'ivan.malakhov',
      'Alan Saji': 'alan.saji',
      'All Team Members': 'alan.saji' // Default assignee for shared tasks
    };
    return assigneeMap[assignee] || 'alan.saji';
  }

  private mapPriority(priority: string): string {
    const priorityMap: { [key: string]: string } = {
      'High': 'High',
      'Medium': 'Medium',
      'Low': 'Low'
    };
    return priorityMap[priority] || 'Medium';
  }

  // Create sprint in Jira
  private async createSprint(sprintData: SprintData): Promise<string> {
    try {
      const response = await axios.post(
        `${this.config.baseUrl}/rest/agile/1.0/sprint`,
        {
          name: sprintData.name,
          startDate: this.getSprintStartDate(sprintData.sprintNumber),
          endDate: this.getSprintEndDate(sprintData.sprintNumber),
          goal: sprintData.goal
        },
        {
          auth: {
            username: this.config.username,
            password: this.config.apiToken
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`✅ Created sprint: ${response.data.id} - ${sprintData.name}`);
      return response.data.id;
    } catch (error) {
      console.error(`❌ Failed to create sprint ${sprintData.name}:`, error);
      throw error;
    }
  }

  private getSprintStartDate(sprintNumber: number): string {
    const startDates = {
      1: '2024-01-15',
      2: '2024-01-29',
      3: '2024-02-19'
    };
    return startDates[sprintNumber as keyof typeof startDates] || '2024-01-15';
  }

  private getSprintEndDate(sprintNumber: number): string {
    const endDates = {
      1: '2024-01-26',
      2: '2024-02-16',
      3: '2024-03-01'
    };
    return endDates[sprintNumber as keyof typeof endDates] || '2024-01-26';
  }

  // Main import function
  public async importToJira(): Promise<void> {
    console.log('🚀 Starting Jira import...\n');

    try {
      // Parse sprint data
      this.parseSprintData();
      console.log(`📊 Parsed ${this.sprintData.length} sprints\n`);

      // Create sprints and issues
      for (const sprintData of this.sprintData) {
        console.log(`📋 Processing ${sprintData.name}...`);
        
        // Create sprint
        const sprintId = await this.createSprint(sprintData);
        
        // Add sprint number to tasks
        const tasksWithSprint = sprintData.tasks.map(task => ({
          ...task,
          sprint: sprintData.name
        }));

        // Create issues for each task
        for (const task of tasksWithSprint) {
          await this.createJiraIssue(task);
          // Add small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log(`✅ Completed ${sprintData.name} with ${sprintData.tasks.length} tasks\n`);
      }

      console.log('🎉 Jira import completed successfully!');
      console.log('\n📈 Summary:');
      const totalTasks = this.sprintData.reduce((sum, sprint) => sum + sprint.tasks.length, 0);
      console.log(`- Total Sprints: ${this.sprintData.length}`);
      console.log(`- Total Tasks: ${totalTasks}`);
      console.log(`- Total Story Points: ${this.sprintData.reduce((sum, sprint) => 
        sum + sprint.tasks.reduce((taskSum, task) => taskSum + task.storyPoints, 0), 0)}`);

    } catch (error) {
      console.error('❌ Jira import failed:', error);
      throw error;
    }
  }
}

// Configuration
const jiraConfig: JiraConfig = {
  baseUrl: 'https://your-domain.atlassian.net', // Replace with your Jira URL
  username: 'your-email@example.com', // Replace with your Jira username
  apiToken: 'your-api-token', // Replace with your Jira API token
  projectKey: 'STOCK', // Replace with your project key
  issueTypeId: '10001', // Story issue type ID
  epicKey: 'STOCK-1' // Optional: Epic key if you want to link issues to an epic
};

// Usage
async function main() {
  const importer = new JiraImporter(jiraConfig);
  
  try {
    await importer.importToJira();
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

export { JiraImporter, JiraConfig, SprintData, SprintTask }; 