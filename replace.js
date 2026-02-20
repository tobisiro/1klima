const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory() && !file.includes('.git') && !file.includes('node_modules')) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.html')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('.');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let newContent = content.replace(/gap-12 mb-20">/g, 'gap-12 mb-10 md:mb-20">');
  if (content !== newContent) {
    fs.writeFileSync(f, newContent, 'utf8');
    console.log('Updated ' + f);
  }
});
