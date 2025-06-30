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
    purpose: '',
    architecture: [],
    functionality: [],
    patterns: [],
    issues: [],
    recommendations: []
  };

  const fileName = path.basename(filePath, '.vue');
  
  // Determine component purpose
  if (fileName.includes('View')) analysis.purpose = 'Page/Route component handling application navigation and layout';
  else if (fileName.includes('Form')) analysis.purpose = 'Form component managing user input and data validation';
  else if (fileName.includes('Modal')) analysis.purpose = 'Modal dialog component for overlay interactions';
  else analysis.purpose = 'Reusable UI component for interface elements';

  // Architecture analysis
  if (content.includes('<script setup>')) {
    analysis.architecture.push('Composition API with <script setup> (modern Vue 3)');
    analysis.patterns.push('Reactive composition pattern');
  } else if (content.includes('export default')) {
    analysis.architecture.push('Options API structure (traditional Vue)');
  }

  // Template analysis
  if (content.includes('<template>')) {
    if (content.includes('v-if') && content.includes('v-else')) {
      analysis.functionality.push('Conditional rendering with fallback states');
      analysis.patterns.push('Defensive UI rendering');
    }
    
    if (content.includes('v-for')) {
      analysis.functionality.push('Dynamic list rendering from data arrays');
      if (!content.includes(':key=')) {
        analysis.issues.push('Missing :key in v-for loops (causes rendering performance issues)');
      }
    }
    
    if (content.includes('v-model')) {
      analysis.functionality.push('Two-way data binding for form controls');
      analysis.patterns.push('Reactive form state management');
    }
    
    if (content.includes('v-card') || content.includes('v-btn')) {
      analysis.functionality.push('Vuetify Material Design components');
      analysis.patterns.push('Consistent UI framework implementation');
    }
  }

  // State management
  if (content.includes('pinia') || content.includes('useStore')) {
    analysis.functionality.push('Centralized state management via Pinia stores');
    analysis.patterns.push('Global state sharing across components');
  }
  
  // Lifecycle management
  if (content.includes('mounted') || content.includes('onMounted')) {
    analysis.functionality.push('Component lifecycle hooks for initialization');
    analysis.patterns.push('Side effect management on component mount');
  }

  // Styling approach
  if (content.includes('<style') && content.includes('scoped')) {
    analysis.patterns.push('Scoped CSS preventing style conflicts');
  } else if (content.includes('<style')) {
    analysis.recommendations.push('Consider scoped styles to prevent CSS leakage');
  }

  // Performance considerations
  if (content.includes('setTimeout') || content.includes('setInterval')) {
    analysis.issues.push('Timer usage detected - ensure cleanup in beforeUnmount');
  }

  return analysis;
}

function analyzeJSFile(filePath, content) {
  const analysis = {
    type: 'JavaScript Module',
    purpose: '',
    architecture: [],
    functionality: [],
    patterns: [],
    issues: [],
    recommendations: []
  };

  if (filePath.includes('router')) {
    analysis.type = 'Vue Router Configuration';
    analysis.purpose = 'Application routing configuration with navigation guards and route protection';
    
    if (content.includes('beforeEnter')) {
      analysis.functionality.push('Route-level guards for access control');
      analysis.patterns.push('Declarative route protection');
    }
    
    if (content.includes('requiresAuth')) {
      analysis.functionality.push('Authentication-based route access control');
      analysis.patterns.push('Meta-driven route security');
    }
    
    if (content.includes('beforeEach')) {
      analysis.functionality.push('Global navigation interceptor');
      analysis.patterns.push('Centralized authentication flow');
    }
  }
  
  else if (filePath.includes('store')) {
    analysis.type = 'Pinia State Store';
    analysis.purpose = 'Centralized state management with reactive data and business logic';
    
    if (content.includes('defineStore')) {
      analysis.functionality.push('Reactive state store with actions and getters');
      analysis.patterns.push('Modern state management architecture');
    }
    
    if (content.includes('localStorage')) {
      analysis.functionality.push('Browser storage integration for state persistence');
      analysis.patterns.push('Client-side data persistence strategy');
    }
  }

  // Error handling analysis
  if (content.includes('try') && content.includes('catch')) {
    analysis.patterns.push('Proper error handling implementation');
  } else if (content.includes('fetch') || content.includes('axios')) {
    analysis.recommendations.push('Add try-catch blocks for API error handling');
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
      default:
        return { type: 'Configuration', purpose: 'Project configuration or asset file' };
    }
  } catch (error) {
    return { type: 'Error', issues: [`Cannot analyze: ${error.message}`] };
  }
}

function generateDetailedReport(fromBranch = 'main', toBranch = 'HEAD') {
  const currentBranch = executeGitCommand('git branch --show-current');
  const timestamp = new Date().toISOString();
  
  console.log(`\n🔍 DETAILED VUE APP ANALYSIS`);
  console.log(`📅 Generated: ${timestamp}`);
  console.log(`🌿 Current Branch: ${currentBranch}`);
  console.log(`🔄 Comparing: ${fromBranch}..${toBranch}`);
  console.log(`\n💡 This provides in-depth analysis of Vue.js changes, architectural patterns,`);
  console.log(`   potential issues, and optimization recommendations.\n`);

  const changedFiles = executeGitCommand(`git diff --name-only ${fromBranch}..${toBranch}`);
  if (!changedFiles) {
    console.log('❌ No changes detected between branches');
    return;
  }

  const files = changedFiles.split('\n').filter(f => f.trim());
  
  console.log(`📊 CHANGE SUMMARY`);
  console.log(`Files Modified: ${files.length}`);
  console.log(`Commits: ${executeGitCommand(`git rev-list --count ${fromBranch}..${toBranch}`)}\n`);

  // Categorize and analyze files
  const categories = {
    'Vue Components': files.filter(f => f.includes('.vue') && f.includes('components')),
    'Vue Views/Pages': files.filter(f => f.includes('.vue') && f.includes('views')),
    'State Management': files.filter(f => f.includes('store')),
    'Router Configuration': files.filter(f => f.includes('router')),
    'Configuration': files.filter(f => f.includes('.json') || f.includes('config')),
    'Other Files': files.filter(f => !f.includes('.vue') && !f.includes('store') && !f.includes('router') && !f.includes('.json'))
  };

  Object.entries(categories).forEach(([category, categoryFiles]) => {
    if (categoryFiles.length === 0) return;
    
    console.log(`\n📁 ${category.toUpperCase()} (${categoryFiles.length} files)`);
    console.log('═'.repeat(60));
    
    categoryFiles.forEach(file => {
      const analysis = analyzeFile(file);
      if (!analysis) return;
      
      console.log(`\n📄 ${file}`);
      console.log(`   🎯 Purpose: ${analysis.purpose || 'General utility file'}`);
      
      if (analysis.architecture && analysis.architecture.length > 0) {
        console.log(`   🏗️  Architecture: ${analysis.architecture.join(', ')}`);
      }
      
      if (analysis.functionality && analysis.functionality.length > 0) {
        console.log(`   ⚙️  Functionality: ${analysis.functionality.join(', ')}`);
      }
      
      if (analysis.patterns && analysis.patterns.length > 0) {
        console.log(`   🔄 Patterns: ${analysis.patterns.join(', ')}`);
      }
      
      if (analysis.issues && analysis.issues.length > 0) {
        console.log(`   ⚠️  Issues: ${analysis.issues.join(', ')}`);
      }
      
      if (analysis.recommendations && analysis.recommendations.length > 0) {
        console.log(`   💡 Recommendations: ${analysis.recommendations.join(', ')}`);
      }
    });
  });

  console.log(`\n\n📝 COMMIT HISTORY`);
  console.log('═'.repeat(60));
  const commits = executeGitCommand(`git log ${fromBranch}..${toBranch} --pretty=format:"%h - %s (%an, %ar)"`);
  if (commits) {
    commits.split('\n').forEach(commit => {
      console.log(`• ${commit}`);
    });
  }
}

const args = process.argv.slice(2);
const fromBranch = args[0] || 'main';
const toBranch = args[1] || 'HEAD';

generateDetailedReport(fromBranch, toBranch);