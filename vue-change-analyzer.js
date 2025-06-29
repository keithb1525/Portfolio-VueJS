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

function analyzeComponentOverview(filePath, content) {
  const analysis = {
    purpose: '',
    architecture: '',
    keyFeatures: [],
    dataFlow: [],
    uiPatterns: [],
    integrations: []
  };

  const fileName = path.basename(filePath, '.vue');
  
  // Determine component purpose
  if (fileName.includes('View')) {
    analysis.purpose = `${fileName} - Main page component handling route-level functionality and layout`;
  } else if (fileName.includes('Form')) {
    analysis.purpose = `${fileName} - Form component managing user input, validation, and submission`;
  } else if (fileName.includes('Modal')) {
    analysis.purpose = `${fileName} - Modal dialog component for overlay interactions and user prompts`;
  } else {
    analysis.purpose = `${fileName} - Reusable component for specific UI functionality`;
  }

  // Architecture analysis
  if (content.includes('<script setup>')) {
    analysis.architecture = 'Composition API with <script setup> (modern Vue 3 approach)';
  } else if (content.includes('export default')) {
    analysis.architecture = 'Options API structure (traditional Vue component pattern)';
  }

  // Key features detection
  if (content.includes('v-for')) {
    const loops = content.match(/v-for="[^"]*"/g) || [];
    analysis.keyFeatures.push(`Dynamic list rendering (${loops.length} loops detected)`);
  }

  if (content.includes('v-if') || content.includes('v-show')) {
    analysis.keyFeatures.push('Conditional rendering for dynamic UI states');
  }

  if (content.includes('v-model')) {
    analysis.keyFeatures.push('Two-way data binding for form controls');
  }

  if (content.includes('loading') || content.includes('Loading')) {
    analysis.keyFeatures.push('Loading state management for async operations');
  }

  // Data flow analysis
  if (content.includes('pinia') || content.includes('useStore')) {
    analysis.dataFlow.push('Pinia store integration for centralized state management');
  }

  if (content.includes('props') || content.includes('defineProps')) {
    analysis.dataFlow.push('Props-based data flow from parent components');
  }

  if (content.includes('emit') || content.includes('defineEmits')) {
    analysis.dataFlow.push('Event emission to parent components');
  }

  if (content.includes('mounted') || content.includes('onMounted')) {
    analysis.dataFlow.push('Lifecycle-based data initialization');
  }

  // UI patterns
  if (content.includes('v-card') || content.includes('v-btn')) {
    analysis.uiPatterns.push('Vuetify Material Design components');
  }

  if (content.includes('v-row') && content.includes('v-col')) {
    analysis.uiPatterns.push('Responsive grid layout system');
  }

  if (content.includes('scoped')) {
    analysis.uiPatterns.push('Scoped CSS for component-isolated styling');
  }

  // Integration analysis
  if (content.includes('router') || content.includes('$router')) {
    analysis.integrations.push('Vue Router for navigation');
  }

  if (content.includes('axios') || content.includes('fetch')) {
    analysis.integrations.push('HTTP API integration');
  }

  if (content.includes('aws') || content.includes('AWS')) {
    analysis.integrations.push('AWS services integration');
  }

  return analysis;
}

function getFileChanges(filePath, fromBranch, toBranch) {
  try {
    const diffOutput = executeGitCommand(`git diff ${fromBranch}..${toBranch} -- "${filePath}"`);
    const stats = executeGitCommand(`git diff --stat ${fromBranch}..${toBranch} -- "${filePath}"`);
    
    const changes = {
      hasChanges: diffOutput.length > 0,
      stats: stats,
      addedLines: (diffOutput.match(/^\+[^+]/gm) || []).length,
      removedLines: (diffOutput.match(/^-[^-]/gm) || []).length,
      changeType: 'modified'
    };

    // Determine change type
    if (diffOutput.includes('new file mode')) changes.changeType = 'added';
    else if (diffOutput.includes('deleted file mode')) changes.changeType = 'deleted';

    return changes;
  } catch (error) {
    return { hasChanges: false, stats: '', addedLines: 0, removedLines: 0, changeType: 'unknown' };
  }
}

function generateChangeReport(fromBranch = 'main', toBranch = 'HEAD') {
  const currentBranch = executeGitCommand('git branch --show-current');
  const timestamp = new Date().toISOString();
  
  console.log(`\n🔍 VUE COMPONENT CHANGE ANALYSIS`);
  console.log(`📅 Generated: ${timestamp}`);
  console.log(`🌿 Current Branch: ${currentBranch}`);
  console.log(`🔄 Comparing: ${fromBranch}..${toBranch}`);
  console.log(`\n💡 Detailed component analysis with change impact assessment\n`);

  const changedFiles = executeGitCommand(`git diff --name-only ${fromBranch}..${toBranch}`);
  if (!changedFiles) {
    console.log('❌ No changes detected between branches');
    return;
  }

  const files = changedFiles.split('\n').filter(f => f.trim() && f.includes('.vue'));
  
  if (files.length === 0) {
    console.log('❌ No Vue component changes detected');
    return;
  }

  console.log(`📊 CHANGE SUMMARY`);
  console.log(`Vue Components Modified: ${files.length}`);
  console.log(`Total Files Changed: ${changedFiles.split('\n').length}`);
  console.log(`Commits: ${executeGitCommand(`git rev-list --count ${fromBranch}..${toBranch}`)}\n`);

  files.forEach(file => {
    console.log(`\n${'═'.repeat(80)}`);
    console.log(`📄 ${file}`);
    console.log(`${'═'.repeat(80)}`);

    const changes = getFileChanges(file, fromBranch, toBranch);
    
    if (!changes.hasChanges) {
      console.log('   No significant changes detected');
      return;
    }

    console.log(`\n📈 CHANGE METRICS:`);
    console.log(`   Status: ${changes.changeType.toUpperCase()}`);
    console.log(`   Lines Added: +${changes.addedLines}`);
    console.log(`   Lines Removed: -${changes.removedLines}`);
    if (changes.stats) console.log(`   ${changes.stats}`);

    // Analyze current version
    try {
      const content = fs.readFileSync(path.resolve(file), 'utf8');
      const overview = analyzeComponentOverview(file, content);

      console.log(`\n🎯 COMPONENT OVERVIEW:`);
      console.log(`   ${overview.purpose}`);
      console.log(`   Architecture: ${overview.architecture}`);

      if (overview.keyFeatures.length > 0) {
        console.log(`\n⚙️ KEY FEATURES:`);
        overview.keyFeatures.forEach(feature => console.log(`   • ${feature}`));
      }

      if (overview.dataFlow.length > 0) {
        console.log(`\n🔄 DATA FLOW:`);
        overview.dataFlow.forEach(flow => console.log(`   • ${flow}`));
      }

      if (overview.uiPatterns.length > 0) {
        console.log(`\n🎨 UI PATTERNS:`);
        overview.uiPatterns.forEach(pattern => console.log(`   • ${pattern}`));
      }

      if (overview.integrations.length > 0) {
        console.log(`\n🔗 INTEGRATIONS:`);
        overview.integrations.forEach(integration => console.log(`   • ${integration}`));
      }

      // Change impact analysis
      console.log(`\n💥 CHANGE IMPACT:`);
      if (changes.addedLines > changes.removedLines) {
        console.log(`   • Feature enhancement or new functionality added`);
      } else if (changes.removedLines > changes.addedLines) {
        console.log(`   • Code cleanup or feature removal`);
      } else {
        console.log(`   • Refactoring or bug fixes`);
      }

      if (changes.addedLines + changes.removedLines > 50) {
        console.log(`   • Significant changes - thorough testing recommended`);
      } else {
        console.log(`   • Minor changes - standard testing sufficient`);
      }

    } catch (error) {
      console.log(`   ❌ Error analyzing component: ${error.message}`);
    }
  });

  // Overall summary
  console.log(`\n\n📋 OVERALL ASSESSMENT`);
  console.log(`${'═'.repeat(50)}`);
  const totalChanges = files.reduce((sum, file) => {
    const changes = getFileChanges(file, fromBranch, toBranch);
    return sum + changes.addedLines + changes.removedLines;
  }, 0);

  if (totalChanges > 200) {
    console.log(`🔴 Major changes detected (${totalChanges} lines) - comprehensive review needed`);
  } else if (totalChanges > 50) {
    console.log(`🟡 Moderate changes detected (${totalChanges} lines) - standard review process`);
  } else {
    console.log(`🟢 Minor changes detected (${totalChanges} lines) - quick review sufficient`);
  }
}

const args = process.argv.slice(2);
const fromBranch = args[0] || 'main';
const toBranch = args[1] || 'HEAD';

generateChangeReport(fromBranch, toBranch);