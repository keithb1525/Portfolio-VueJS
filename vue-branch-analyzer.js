#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function executeGitCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8' }).trim();
  } catch (error) {
    return '';
  }
}

function analyzeVueFile(filePath, content) {
  const analysis = {
    type: 'Vue Component',
    features: [],
    dependencies: [],
    functionality: []
  };

  // Check for Vue features
  if (content.includes('<template>')) analysis.features.push('Template');
  if (content.includes('<script>')) analysis.features.push('Script');
  if (content.includes('<style>')) analysis.features.push('Styles');
  if (content.includes('scoped')) analysis.features.push('Scoped CSS');
  if (content.includes('setup>')) analysis.features.push('Composition API');
  
  // Check for Vue patterns
  if (content.includes('v-if') || content.includes('v-show')) analysis.functionality.push('Conditional rendering');
  if (content.includes('v-for')) analysis.functionality.push('List rendering');
  if (content.includes('v-model')) analysis.functionality.push('Two-way binding');
  if (content.includes('@click') || content.includes('v-on:')) analysis.functionality.push('Event handling');
  if (content.includes('computed:') || content.includes('computed(')) analysis.functionality.push('Computed properties');
  if (content.includes('watch:') || content.includes('watch(')) analysis.functionality.push('Watchers');
  if (content.includes('mounted') || content.includes('onMounted')) analysis.functionality.push('Lifecycle hooks');
  
  // Check for state management
  if (content.includes('pinia') || content.includes('useStore')) analysis.functionality.push('State management (Pinia)');
  if (content.includes('vuex')) analysis.functionality.push('State management (Vuex)');
  
  // Check for routing
  if (content.includes('vue-router') || content.includes('$router')) analysis.functionality.push('Vue Router');
  
  // Extract imports/dependencies
  const importMatches = content.match(/import.*from ['"`]([^'"`]+)['"`]/g);
  if (importMatches) {
    importMatches.forEach(match => {
      const dep = match.match(/from ['"`]([^'"`]+)['"`]/)[1];
      if (!dep.startsWith('.')) analysis.dependencies.push(dep);
    });
  }

  return analysis;
}

function analyzeJSFile(filePath, content) {
  const analysis = {
    type: 'JavaScript',
    features: [],
    dependencies: [],
    functionality: []
  };

  // Check for common patterns
  if (content.includes('export default')) analysis.features.push('ES6 Modules');
  if (content.includes('async') || content.includes('await')) analysis.functionality.push('Async operations');
  if (content.includes('fetch') || content.includes('axios')) analysis.functionality.push('HTTP requests');
  if (content.includes('localStorage') || content.includes('sessionStorage')) analysis.functionality.push('Browser storage');
  
  // Router specific
  if (filePath.includes('router')) {
    analysis.type = 'Vue Router Configuration';
    if (content.includes('beforeEnter')) analysis.functionality.push('Route guards');
    if (content.includes('meta:')) analysis.functionality.push('Route metadata');
  }
  
  // Store specific
  if (filePath.includes('store')) {
    analysis.type = 'State Store';
    if (content.includes('defineStore')) analysis.functionality.push('Pinia store definition');
    if (content.includes('actions:')) analysis.functionality.push('Store actions');
    if (content.includes('getters:')) analysis.functionality.push('Store getters');
  }

  return analysis;
}

function analyzeFile(filePath) {
  try {
    const fullPath = path.resolve(filePath);
    if (!fs.existsSync(fullPath)) return null;
    
    const content = fs.readFileSync(fullPath, 'utf8');
    const ext = path.extname(filePath);
    
    switch (ext) {
      case '.vue':
        return analyzeVueFile(filePath, content);
      case '.js':
        return analyzeJSFile(filePath, content);
      case '.json':
        return { type: 'Configuration', features: ['JSON'], functionality: ['Project configuration'] };
      case '.css':
      case '.scss':
        return { type: 'Stylesheet', features: ['CSS'], functionality: ['Styling'] };
      default:
        return { type: 'Other', features: [], functionality: [] };
    }
  } catch (error) {
    return { type: 'Error', features: [], functionality: [`Error reading file: ${error.message}`] };
  }
}

function generateVueAnalysisReport(fromBranch = 'main', toBranch = 'HEAD') {
  const currentBranch = executeGitCommand('git branch --show-current');
  const timestamp = new Date().toISOString();
  
  console.log(`\n🔍 VUE APP BRANCH ANALYSIS`);
  console.log(`📅 Generated: ${timestamp}`);
  console.log(`🌿 Current Branch: ${currentBranch}`);
  console.log(`🔄 Comparing: ${fromBranch}..${toBranch}\n`);

  // Get changed files
  const changedFiles = executeGitCommand(`git diff --name-only ${fromBranch}..${toBranch}`);
  if (!changedFiles) {
    console.log('❌ No changes found between branches');
    return;
  }

  const files = changedFiles.split('\n').filter(f => f.trim());
  
  console.log(`📊 SUMMARY`);
  console.log(`Files Changed: ${files.length}`);
  console.log(`Commits: ${executeGitCommand(`git rev-list --count ${fromBranch}..${toBranch}`)}\n`);

  // Categorize files
  const categories = {
    components: files.filter(f => f.includes('.vue') && f.includes('components')),
    views: files.filter(f => f.includes('.vue') && f.includes('views')),
    stores: files.filter(f => f.includes('store')),
    router: files.filter(f => f.includes('router')),
    config: files.filter(f => f.includes('.json') || f.includes('config')),
    styles: files.filter(f => f.includes('.css') || f.includes('.scss')),
    other: files.filter(f => !f.includes('.vue') && !f.includes('store') && !f.includes('router') && !f.includes('.json') && !f.includes('.css') && !f.includes('.scss'))
  };

  // Analyze each category
  Object.entries(categories).forEach(([category, categoryFiles]) => {
    if (categoryFiles.length === 0) return;
    
    console.log(`\n📁 ${category.toUpperCase()} (${categoryFiles.length} files)`);
    console.log('─'.repeat(50));
    
    categoryFiles.forEach(file => {
      const analysis = analyzeFile(file);
      if (!analysis) return;
      
      console.log(`\n📄 ${file}`);
      console.log(`   Type: ${analysis.type}`);
      
      if (analysis.features && analysis.features.length > 0) {
        console.log(`   Features: ${analysis.features.join(', ')}`);
      }
      
      if (analysis.functionality && analysis.functionality.length > 0) {
        console.log(`   Functionality: ${analysis.functionality.join(', ')}`);
      }
      
      if (analysis.dependencies && analysis.dependencies.length > 0) {
        console.log(`   Dependencies: ${analysis.dependencies.slice(0, 3).join(', ')}${analysis.dependencies.length > 3 ? '...' : ''}`);
      }
    });
  });

  // Show recent commits for context
  console.log(`\n\n📝 RECENT COMMITS`);
  console.log('─'.repeat(50));
  const commits = executeGitCommand(`git log ${fromBranch}..${toBranch} --oneline`);
  if (commits) {
    commits.split('\n').forEach(commit => {
      console.log(`• ${commit}`);
    });
  }
}

// Main execution
const args = process.argv.slice(2);
const fromBranch = args[0] || 'main';
const toBranch = args[1] || 'HEAD';

generateVueAnalysisReport(fromBranch, toBranch);