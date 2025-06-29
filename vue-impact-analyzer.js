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

function analyzeChangeImpact(filePath, fromBranch, toBranch) {
  try {
    const diffOutput = executeGitCommand(`git diff ${fromBranch}..${toBranch} -- "${filePath}"`);
    if (!diffOutput) return null;

    const content = fs.readFileSync(path.resolve(filePath), 'utf8');
    const fileName = path.basename(filePath, '.vue');
    
    const impact = {
      file: filePath,
      component: fileName,
      changeType: '',
      functionalImpact: [],
      uiImpact: [],
      dataImpact: [],
      riskLevel: 'LOW'
    };

    // Analyze what changed
    const addedLines = (diffOutput.match(/^\+[^+]/gm) || []).length;
    const removedLines = (diffOutput.match(/^-[^-]/gm) || []).length;
    
    // Determine change type
    if (addedLines > removedLines * 2) {
      impact.changeType = 'Feature Addition';
    } else if (removedLines > addedLines * 2) {
      impact.changeType = 'Code Removal/Cleanup';
    } else {
      impact.changeType = 'Modification/Refactor';
    }

    // Analyze functional impact
    if (diffOutput.includes('v-if') || diffOutput.includes('v-show')) {
      impact.functionalImpact.push('Conditional rendering logic modified - UI behavior changes');
    }
    
    if (diffOutput.includes('v-for')) {
      impact.functionalImpact.push('List rendering updated - data display changes');
    }
    
    if (diffOutput.includes('mounted') || diffOutput.includes('onMounted')) {
      impact.functionalImpact.push('Component initialization logic changed');
    }
    
    if (diffOutput.includes('computed') || diffOutput.includes('watch')) {
      impact.functionalImpact.push('Reactive data computation modified');
    }

    if (diffOutput.includes('method') || diffOutput.includes('function')) {
      impact.functionalImpact.push('Component methods/functions updated');
    }

    // Analyze UI impact
    if (diffOutput.includes('<template>') || diffOutput.includes('v-')) {
      impact.uiImpact.push('Template structure or directives modified');
    }
    
    if (diffOutput.includes('<style>') || diffOutput.includes('class=')) {
      impact.uiImpact.push('Styling or CSS classes changed');
    }
    
    if (diffOutput.includes('v-card') || diffOutput.includes('v-btn')) {
      impact.uiImpact.push('Vuetify components modified - visual changes expected');
    }

    // Analyze data impact
    if (diffOutput.includes('data()') || diffOutput.includes('ref(')) {
      impact.dataImpact.push('Component state structure changed');
    }
    
    if (diffOutput.includes('props') || diffOutput.includes('defineProps')) {
      impact.dataImpact.push('Component props interface modified - parent components may be affected');
    }
    
    if (diffOutput.includes('emit') || diffOutput.includes('defineEmits')) {
      impact.dataImpact.push('Event emission changed - parent component listeners may be affected');
    }
    
    if (diffOutput.includes('store') || diffOutput.includes('pinia')) {
      impact.dataImpact.push('State management integration modified');
    }

    // Determine risk level
    const totalChanges = addedLines + removedLines;
    const hasPropsChanges = impact.dataImpact.some(i => i.includes('props'));
    const hasEmitChanges = impact.dataImpact.some(i => i.includes('emit'));
    
    if (totalChanges > 50 || hasPropsChanges || hasEmitChanges) {
      impact.riskLevel = 'HIGH';
    } else if (totalChanges > 20 || impact.functionalImpact.length > 2) {
      impact.riskLevel = 'MEDIUM';
    }

    return impact;
  } catch (error) {
    return null;
  }
}

function generateImpactReport(fromBranch = 'main', toBranch = 'HEAD') {
  const changedFiles = executeGitCommand(`git diff --name-only ${fromBranch}..${toBranch}`);
  if (!changedFiles) {
    console.log('## 🔍 Component Impact Analysis\n\n❌ No changes detected between branches');
    return;
  }

  const vueFiles = changedFiles.split('\n').filter(f => f.trim() && f.includes('.vue'));
  
  if (vueFiles.length === 0) {
    console.log('## 🔍 Component Impact Analysis\n\n❌ No Vue component changes detected');
    return;
  }

  console.log('## 🔍 Component Impact Analysis\n');
  console.log(`**Vue Components Modified:** ${vueFiles.length}\n`);

  vueFiles.forEach(file => {
    const impact = analyzeChangeImpact(file, fromBranch, toBranch);
    if (!impact) return;

    const riskEmoji = impact.riskLevel === 'HIGH' ? '🔴' : impact.riskLevel === 'MEDIUM' ? '🟡' : '🟢';
    
    console.log(`### ${riskEmoji} ${impact.component}`);
    console.log(`**File:** \`${impact.file}\``);
    console.log(`**Change Type:** ${impact.changeType}`);
    console.log(`**Risk Level:** ${impact.riskLevel}\n`);

    if (impact.functionalImpact.length > 0) {
      console.log('**Functional Impact:**');
      impact.functionalImpact.forEach(item => console.log(`- ${item}`));
      console.log('');
    }

    if (impact.uiImpact.length > 0) {
      console.log('**UI Impact:**');
      impact.uiImpact.forEach(item => console.log(`- ${item}`));
      console.log('');
    }

    if (impact.dataImpact.length > 0) {
      console.log('**Data Impact:**');
      impact.dataImpact.forEach(item => console.log(`- ${item}`));
      console.log('');
    }

    console.log('---\n');
  });

  // Overall assessment
  const highRisk = vueFiles.filter(f => {
    const impact = analyzeChangeImpact(f, fromBranch, toBranch);
    return impact && impact.riskLevel === 'HIGH';
  }).length;

  console.log('### 📋 Overall Assessment\n');
  if (highRisk > 0) {
    console.log(`🔴 **${highRisk} high-risk component(s)** - Thorough testing required`);
  } else {
    console.log('🟢 **Low to medium risk changes** - Standard testing recommended');
  }
}

const args = process.argv.slice(2);
const fromBranch = args[0] || 'main';
const toBranch = args[1] || 'HEAD';

generateImpactReport(fromBranch, toBranch);