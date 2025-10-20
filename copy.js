/* eslint-disable no-undef */
const fs = require('fs');
const path = require('path');

const source = path.resolve(__dirname); // since you're inside nj-library
const destination = path.resolve(__dirname, '../../nj-library'); // go up to project root

function copyRecursive(src, dest) {
  const stats = fs.statSync(src);

  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    fs.readdirSync(src).forEach(item => {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);
      copyRecursive(srcPath, destPath);
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log(`🔁 Copying from ${source} to ${destination}`);
copyRecursive(source, destination);
console.log(`✅ nj-library copied to project root.`);
