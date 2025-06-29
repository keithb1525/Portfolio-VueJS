#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

function executeGitCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8' }).trim();
  } catch (error) {
    return `Error executing: ${command}`;
  }
}

function generateChangeReport(fromBranch = 'main', toBranch = 'HEAD') {
  const currentBranch = executeGitCommand('git branch --show-current');
  const timestamp = new Date().toISOString();
  
  const report = {
    metadata: {
      timestamp,
      currentBranch,
      comparison: `${fromBranch}..${toBranch}`
    },
    summary: {
      filesChanged: executeGitCommand(`git diff --name-only ${fromBranch}..${toBranch} | wc -l`),
      commits: executeGitCommand(`git rev-list --count ${fromBranch}..${toBranch}`),
      insertions: 0,
      deletions: 0
    },
    files: [],
    commits: []
  };

  // Get file changes with stats
  const fileStats = executeGitCommand(`git diff --numstat ${fromBranch}..${toBranch}`);
  if (fileStats) {
    fileStats.split('\n').forEach(line => {
      const [insertions, deletions, file] = line.split('\t');
      if (file) {
        report.files.push({
          file,
          insertions: parseInt(insertions) || 0,
          deletions: parseInt(deletions) || 0,
          status: executeGitCommand(`git diff --name-status ${fromBranch}..${toBranch} -- "${file}"`).split('\t')[0]
        });
        report.summary.insertions += parseInt(insertions) || 0;
        report.summary.deletions += parseInt(deletions) || 0;
      }
    });
  }

  // Get commit history
  const commitLog = executeGitCommand(`git log ${fromBranch}..${toBranch} --pretty=format:"%h|%an|%ad|%s" --date=short`);
  if (commitLog) {
    report.commits = commitLog.split('\n').map(line => {
      const [hash, author, date, message] = line.split('|');
      return { hash, author, date, message };
    });
  }

  return report;
}

function formatReportAsMarkdown(report) {
  let markdown = `# 📋 Git Change Report\n\n`;
  markdown += `**Generated:** ${report.metadata.timestamp}\n`;
  markdown += `**Branch:** ${report.metadata.currentBranch}\n`;
  markdown += `**Comparison:** ${report.metadata.comparison}\n\n`;

  markdown += `## 📊 Summary\n`;
  markdown += `- **Files Changed:** ${report.summary.filesChanged}\n`;
  markdown += `- **Commits:** ${report.summary.commits}\n`;
  markdown += `- **Lines Added:** +${report.summary.insertions}\n`;
  markdown += `- **Lines Removed:** -${report.summary.deletions}\n\n`;

  if (report.files.length > 0) {
    markdown += `## 📁 Files Modified\n\n`;
    markdown += `| File | Status | +Lines | -Lines |\n`;
    markdown += `|------|--------|--------|--------|\n`;
    report.files.forEach(file => {
      markdown += `| ${file.file} | ${file.status} | +${file.insertions} | -${file.deletions} |\n`;
    });
    markdown += `\n`;
  }

  if (report.commits.length > 0) {
    markdown += `## 📝 Commits\n\n`;
    report.commits.forEach(commit => {
      markdown += `- **${commit.hash}** (${commit.date}) by ${commit.author}\n`;
      markdown += `  ${commit.message}\n\n`;
    });
  }

  return markdown;
}

// Main execution
const args = process.argv.slice(2);
const fromBranch = args[0] || 'main';
const toBranch = args[1] || 'HEAD';

console.log(`Generating change report: ${fromBranch}..${toBranch}`);

const report = generateChangeReport(fromBranch, toBranch);
const markdown = formatReportAsMarkdown(report);

// Save to file
const filename = `change-report-${new Date().toISOString().split('T')[0]}.md`;
fs.writeFileSync(filename, markdown);

console.log(`Report saved to: ${filename}`);
console.log('\n' + markdown);