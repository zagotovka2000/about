// scripts/fix-filenames.js
const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, 'build');

function fixFilenames(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixFilenames(filePath);
    } else {
      // Заменяем # на sharp в имени файла
      if (file.includes('#') || file.includes('?')) {
        const newName = file
          .replace(/#/g, 'sharp')
          .replace(/\?/g, 'q');
        const newPath = path.join(dir, newName);
        
        fs.renameSync(filePath, newPath);
        console.log(`Renamed: ${file} -> ${newName}`);
        
        // Обновляем ссылки в HTML, CSS, JS файлах
        updateReferences(dir, file, newName);
      }
    }
  });
}

function updateReferences(dir, oldName, newName) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (!stat.isDirectory()) {
      // Проверяем только текстовые файлы
      if (file.endsWith('.html') || file.endsWith('.css') || 
          file.endsWith('.js') || file.endsWith('.jsx')) {
        
        let content = fs.readFileSync(filePath, 'utf8');
        if (content.includes(oldName)) {
          content = content.replace(
            new RegExp(oldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
            newName
          );
          fs.writeFileSync(filePath, content, 'utf8');
        }
      }
    }
  });
}

if (fs.existsSync(buildDir)) {
  fixFilenames(buildDir);
}
