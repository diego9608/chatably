#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CHANGELOG_FILE = path.join(process.cwd(), 'CHANGELOG.md');
const NEW_VERSION = process.env.NEW_VERSION || `v${Date.now()}`;

// Conventional commit types
const COMMIT_TYPES = {
  feat: '✨ Features',
  fix: '🐛 Bug Fixes',
  docs: '📚 Documentation',
  style: '💎 Styles',
  refactor: '♻️ Code Refactoring',
  perf: '⚡ Performance Improvements',
  test: '✅ Tests',
  build: '📦 Build System',
  ci: '🎡 Continuous Integration',
  chore: '🔧 Chores',
  revert: '⏪ Reverts'
};

// Get the last tag
function getLastTag() {
  try {
    const tags = execSync('git tag -l v* --sort=-version:refname', { encoding: 'utf8' })
      .trim()
      .split('\n')
      .filter(Boolean);
    
    return tags.length > 0 ? tags[0] : null;
  } catch (error) {
    console.log('No previous tags found');
    return null;
  }
}

// Get commits since last tag
function getCommitsSinceTag(lastTag) {
  const range = lastTag ? `${lastTag}..HEAD` : 'HEAD';
  
  try {
    const commits = execSync(
      `git log ${range} --pretty=format:"%H|%s|%b|%an|%ae" --no-merges`,
      { encoding: 'utf8' }
    )
      .trim()
      .split('\n')
      .filter(Boolean)
      .map(line => {
        const [hash, subject, body, authorName, authorEmail] = line.split('|');
        return { hash, subject, body, authorName, authorEmail };
      });
    
    return commits;
  } catch (error) {
    console.error('Error getting commits:', error);
    return [];
  }
}

// Parse conventional commit
function parseCommit(commit) {
  const conventionalRegex = /^(\w+)(?:\(([^)]+)\))?: (.+)$/;
  const match = commit.subject.match(conventionalRegex);
  
  if (match) {
    const [, type, scope, description] = match;
    return {
      type,
      scope,
      description,
      breaking: commit.subject.includes('!') || commit.body.includes('BREAKING CHANGE'),
      hash: commit.hash.substring(0, 7),
      author: commit.authorName
    };
  }
  
  return null;
}

// Group commits by type
function groupCommitsByType(commits) {
  const grouped = {};
  const breaking = [];
  
  commits.forEach(commit => {
    const parsed = parseCommit(commit);
    
    if (parsed) {
      if (parsed.breaking) {
        breaking.push(parsed);
      }
      
      const type = parsed.type;
      if (!grouped[type]) {
        grouped[type] = [];
      }
      
      grouped[type].push(parsed);
    }
  });
  
  return { grouped, breaking };
}

// Generate changelog content
function generateChangelog(version, commits) {
  const { grouped, breaking } = groupCommitsByType(commits);
  const date = new Date().toISOString().split('T')[0];
  
  let content = `## [${version}] - ${date}\n\n`;
  
  // Add breaking changes section
  if (breaking.length > 0) {
    content += `### 💥 BREAKING CHANGES\n\n`;
    breaking.forEach(commit => {
      content += `- ${commit.scope ? `**${commit.scope}:** ` : ''}${commit.description} ([${commit.hash}])\n`;
    });
    content += '\n';
  }
  
  // Add sections for each commit type
  Object.entries(COMMIT_TYPES).forEach(([type, title]) => {
    if (grouped[type] && grouped[type].length > 0) {
      content += `### ${title}\n\n`;
      grouped[type].forEach(commit => {
        content += `- ${commit.scope ? `**${commit.scope}:** ` : ''}${commit.description} ([${commit.hash}])\n`;
      });
      content += '\n';
    }
  });
  
  // Add contributors section
  const contributors = new Set(commits.map(c => c.authorName));
  if (contributors.size > 0) {
    content += `### 👥 Contributors\n\n`;
    content += Array.from(contributors).map(name => `- ${name}`).join('\n');
    content += '\n\n';
  }
  
  return content;
}

// Update CHANGELOG.md
function updateChangelog(newContent) {
  let existingContent = '';
  
  // Read existing changelog
  if (fs.existsSync(CHANGELOG_FILE)) {
    existingContent = fs.readFileSync(CHANGELOG_FILE, 'utf8');
  } else {
    // Create initial changelog structure
    existingContent = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

`;
  }
  
  // Insert new version after the header
  const headerEnd = existingContent.indexOf('\n\n') + 2;
  const updatedContent = 
    existingContent.slice(0, headerEnd) +
    newContent +
    existingContent.slice(headerEnd);
  
  // Write updated changelog
  fs.writeFileSync(CHANGELOG_FILE, updatedContent, 'utf8');
  console.log(`Updated ${CHANGELOG_FILE} with version ${NEW_VERSION}`);
}

// Main function
function main() {
  console.log(`Generating changelog for version ${NEW_VERSION}...`);
  
  const lastTag = getLastTag();
  console.log(`Last tag: ${lastTag || 'none'}`);
  
  const commits = getCommitsSinceTag(lastTag);
  console.log(`Found ${commits.length} commits since last release`);
  
  if (commits.length === 0) {
    console.log('No commits found. Skipping changelog generation.');
    return;
  }
  
  const changelog = generateChangelog(NEW_VERSION, commits);
  updateChangelog(changelog);
  
  console.log('Changelog generation complete!');
}

// Run the script
main();