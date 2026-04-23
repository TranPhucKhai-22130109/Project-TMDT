const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      if (fullPath.includes('layout.jsx')) continue;
      
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      // Fix duplicate useEffect
      const useEffectRegex = /import\s+\{\s*useEffect\s*\}\s+from\s+['"]react['"];\s*/g;
      const useStateRegex = /import\s+\{\s*useState\s*\}\s+from\s+['"]react['"];/g;
      
      const useEffectMatches = [...content.matchAll(useEffectRegex)];
      if (useEffectMatches.length >= 1) {
        if (content.match(useStateRegex)) {
          // Replace useState with useState, useEffect
          content = content.replace(useStateRegex, "import { useState, useEffect } from 'react';");
          // Remove all standalone useEffect imports
          content = content.replace(useEffectRegex, '');
          changed = true;
        } else if (useEffectMatches.length > 1) {
          // Leave the first one, remove the rest
          let count = 0;
          content = content.replace(useEffectRegex, (match) => {
            count++;
            return count === 1 ? match : '';
          });
          changed = true;
        }
      }

      // Fix metadata export in use client files
      if (content.includes('use client')) {
        const metadataRegex = /export\s+const\s+metadata\s*=\s*\{[^}]+\};\s*/g;
        if (metadataRegex.test(content)) {
          content = content.replace(metadataRegex, '');
          changed = true;
        }
      }

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Fixed ${fullPath}`);
      }
    }
  }
}

processDir(path.join(__dirname, 'src/app'));
console.log('Done fixing.');
