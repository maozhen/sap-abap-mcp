/**
 * Copy assets to dist folder after TypeScript compilation
 * This script copies non-TypeScript files needed at runtime
 */

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const distDir = path.join(__dirname, '..', 'dist');

/**
 * Copy a file from src to dist
 * @param {string} relativePath - Path relative to src directory
 */
function copyFile(relativePath) {
  const srcPath = path.join(srcDir, relativePath);
  const destPath = path.join(distDir, relativePath);

  if (fs.existsSync(srcPath)) {
    // Ensure destination directory exists
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied: ${relativePath}`);
  }
}

/**
 * Copy directory recursively
 * @param {string} relativePath - Path relative to src directory
 * @param {string[]} extensions - File extensions to copy
 */
function copyDirectory(relativePath, extensions = ['.json', '.xml', '.txt']) {
  const srcPath = path.join(srcDir, relativePath);
  const destPath = path.join(distDir, relativePath);

  if (!fs.existsSync(srcPath)) {
    return;
  }

  if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destPath, { recursive: true });
  }

  const entries = fs.readdirSync(srcPath, { withFileTypes: true });

  for (const entry of entries) {
    const srcEntryPath = path.join(srcPath, entry.name);
    const destEntryPath = path.join(destPath, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(path.join(relativePath, entry.name), extensions);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (extensions.includes(ext)) {
        fs.copyFileSync(srcEntryPath, destEntryPath);
        console.log(`Copied: ${path.join(relativePath, entry.name)}`);
      }
    }
  }
}

// Main execution
console.log('Copying assets to dist folder...');

// Copy any JSON configuration files if they exist in src
copyDirectory('config', ['.json']);
copyDirectory('templates', ['.json', '.xml', '.txt']);

// Copy package.json fields needed at runtime (if any specific assets exist)
// Add more copy operations as needed

console.log('Asset copy complete.');