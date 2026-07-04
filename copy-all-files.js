// copy-all-files-advanced.js
// Запуск: node copy-all-files-advanced.js [папка]

const fs = require('fs');
const path = require('path');

// Получаем папку из аргументов командной строки
const rootDir = process.argv[2] || '.';
const timestamp = Date.now();

// Настройки
const config = {
    excludeFolders: ['node_modules', '.git', 'dist', 'build', 'out', '.next', 'coverage', '.vscode', '.idea'],
    excludeFiles: ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', '.DS_Store', 'Thumbs.db'],
    includeExtensions: ['.js', '.html', '.css', '.json', '.md', '.txt', '.vue', '.jsx', '.tsx', '.ts', '.xml', '.yaml', '.yml', '.sql', '.sh', '.bat'],
    maxFileSize: 1024 * 1024 * 5, // 5MB
    showProgress: true,
    addLineNumbers: false,
    separatorStyle: 'double', // 'double' или 'simple'
    partsCount: 3, // Количество частей для разбивки
    partSizeLimit: 100 * 1024, // 100KB на часть (можно настроить)
};

function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            if (config.excludeFolders.includes(file)) return;
            getAllFiles(fullPath, arrayOfFiles);
        } else {
            const ext = path.extname(file).toLowerCase();
            if (config.includeExtensions.includes(ext) && !config.excludeFiles.includes(file)) {
                arrayOfFiles.push(fullPath);
            }
        }
    });
    
    return arrayOfFiles;
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function getFileContent(file, relativePath) {
    try {
        const stats = fs.statSync(file);
        const fileContent = fs.readFileSync(file, 'utf8');
        const separator = config.separatorStyle === 'double' 
            ? '='.repeat(80) 
            : '-'.repeat(60);
        
        let content = `\n${separator}\n`;
        content += `📁 Файл: ${relativePath}\n`;
        content += `📏 Размер: ${formatFileSize(stats.size)}\n`;
        content += `📅 Изменен: ${stats.mtime.toLocaleString()}\n`;
        content += `${separator}\n\n`;
        
        if (config.addLineNumbers) {
            const lines = fileContent.split('\n');
            lines.forEach((line, i) => {
                content += `${String(i + 1).padStart(4, ' ')} | ${line}\n`;
            });
        } else {
            content += fileContent;
        }
        content += '\n';
        
        return content;
    } catch (error) {
        console.warn(`⚠️ Не удалось прочитать ${relativePath}:`, error.message);
        return null;
    }
}

function splitIntoParts(files) {
    const parts = Array.from({ length: config.partsCount }, () => []);
    const totalFiles = files.length;
    const filesPerPart = Math.ceil(totalFiles / config.partsCount);
    
    // Простое разбиение по количеству файлов
    files.forEach((file, index) => {
        const partIndex = Math.floor(index / filesPerPart);
        if (partIndex < config.partsCount) {
            parts[partIndex].push(file);
        } else {
            // Если файлов больше, добавляем в последнюю часть
            parts[config.partsCount - 1].push(file);
        }
    });
    
    return parts;
}

function splitBySize(files) {
    const parts = Array.from({ length: config.partsCount }, () => []);
    const totalFiles = files.length;
    let currentSize = 0;
    let currentPart = 0;
    
    // Сортируем файлы по размеру (от больших к маленьким) для лучшего баланса
    const sortedFiles = files
        .map(file => ({
            path: file,
            size: fs.statSync(file).size
        }))
        .sort((a, b) => b.size - a.size);
    
    // Распределяем файлы по частям
    sortedFiles.forEach((fileInfo, index) => {
        // Если текущая часть переполнена или это последний файл для распределения
        if (currentSize + fileInfo.size > config.partSizeLimit * 2 && currentPart < config.partsCount - 1) {
            // Ищем самую маленькую часть для добавления
            let minPart = 0;
            let minSize = Infinity;
            for (let i = 0; i < config.partsCount; i++) {
                const partSize = parts[i].reduce((sum, f) => sum + fs.statSync(f).size, 0);
                if (partSize < minSize) {
                    minSize = partSize;
                    minPart = i;
                }
            }
            parts[minPart].push(fileInfo.path);
        } else {
            parts[currentPart].push(fileInfo.path);
            currentSize += fileInfo.size;
        }
    });
    
    return parts;
}

function copyAllFilesToBuffer() {
    console.log(`📂 Сканирование папки: ${path.resolve(rootDir)}`);
    console.log('⏳ Подождите...');
    
    const files = getAllFiles(rootDir);
    console.log(`📄 Найдено ${files.length} файлов`);
    
    const separator = config.separatorStyle === 'double' 
        ? '='.repeat(80) 
        : '-'.repeat(60);
    
    // Подготавливаем файлы для разбиения
    const validFiles = [];
    let skippedFiles = 0;
    let totalSize = 0;
    
    files.forEach((file) => {
        try {
            const stats = fs.statSync(file);
            const relativePath = path.relative(rootDir, file);
            
            if (stats.size > config.maxFileSize) {
                skippedFiles++;
                if (config.showProgress) {
                    console.warn(`⚠️ Пропущен (слишком большой): ${relativePath} (${formatFileSize(stats.size)})`);
                }
                return;
            }
            
            validFiles.push(file);
            totalSize += stats.size;
        } catch (error) {
            console.warn(`⚠️ Ошибка при проверке файла: ${file}`, error.message);
        }
    });
    
    console.log(`📊 Размер всех файлов: ${formatFileSize(totalSize)}`);
    
    // Разбиваем файлы на части
    let parts;
    if (totalSize > config.partSizeLimit * config.partsCount) {
        console.log('📦 Разбиение по размеру...');
        parts = splitBySize(validFiles);
    } else {
        console.log('📦 Разбиение по количеству файлов...');
        parts = splitIntoParts(validFiles);
    }
    
    // Создаем файлы для каждой части
    const outputFiles = [];
    let fileCount = 0;
    
    parts.forEach((partFiles, partIndex) => {
        if (partFiles.length === 0) {
            // Если часть пуста, создаем пустой файл с информацией
            const outputFile = `all-files-part${partIndex + 1}-${timestamp}.txt`;
            const header = `Часть ${partIndex + 1} из ${config.partsCount}\n`;
            const info = `Всего файлов в части: 0\n`;
            const separatorLine = `${separator}\n\n`;
            fs.writeFileSync(outputFile, header + info + separatorLine, 'utf8');
            outputFiles.push(outputFile);
            return;
        }
        
        const outputFile = `all-files-part${partIndex + 1}-${timestamp}.txt`;
        let content = '';
        let partSize = 0;
        let partFileCount = 0;
        
        // Добавляем заголовок части
        content += `${'*'.repeat(80)}\n`;
        content += `📦 ЧАСТЬ ${partIndex + 1} ИЗ ${config.partsCount}\n`;
        content += `${'*'.repeat(80)}\n`;
        content += `📁 Папка: ${path.resolve(rootDir)}\n`;
        content += `📊 Количество файлов в части: ${partFiles.length}\n`;
        content += `📅 Создано: ${new Date().toLocaleString()}\n`;
        content += `${'*'.repeat(80)}\n\n`;
        
        // Обрабатываем файлы в этой части
        partFiles.forEach((file, index) => {
            const relativePath = path.relative(rootDir, file);
            const fileContent = getFileContent(file, relativePath);
            
            if (fileContent) {
                content += fileContent;
                partSize += fileContent.length;
                partFileCount++;
                fileCount++;
                
                if (config.showProgress && index % 10 === 0) {
                    process.stdout.write(`\r📄 Часть ${partIndex + 1}: ${index + 1}/${partFiles.length}`);
                }
            }
        });
        
        // Сохраняем часть
        fs.writeFileSync(outputFile, content, 'utf8');
        outputFiles.push(outputFile);
        
        if (config.showProgress) {
            process.stdout.write(`\r✅ Часть ${partIndex + 1} завершена!      \n`);
            console.log(`   📄 Файлов: ${partFileCount}`);
            console.log(`   💾 Размер: ${formatFileSize(partSize)}`);
        }
    });
    
    // Сохраняем общий файл-индекс
    const indexFile = `all-files-index-${timestamp}.txt`;
    let indexContent = `📋 ИНДЕКС ВСЕХ ФАЙЛОВ\n`;
    indexContent += `${'='.repeat(80)}\n`;
    indexContent += `📁 Папка: ${path.resolve(rootDir)}\n`;
    indexContent += `📅 Создано: ${new Date().toLocaleString()}\n`;
    indexContent += `📊 Всего файлов обработано: ${fileCount}\n`;
    indexContent += `⚠️ Пропущено: ${skippedFiles}\n`;
    indexContent += `${'='.repeat(80)}\n\n`;
    
    // Список всех файлов с указанием части
    parts.forEach((partFiles, partIndex) => {
        indexContent += `📦 ЧАСТЬ ${partIndex + 1}: ${outputFiles[partIndex]}\n`;
        indexContent += `   📄 Файлов: ${partFiles.length}\n`;
        indexContent += `   📂 Файлы:\n`;
        partFiles.forEach(file => {
            const relativePath = path.relative(rootDir, file);
            indexContent += `      - ${relativePath}\n`;
        });
        indexContent += `\n`;
    });
    
    // Информация о всех созданных файлах
    indexContent += `${'='.repeat(80)}\n`;
    indexContent += `📁 СОЗДАННЫЕ ФАЙЛЫ:\n`;
    outputFiles.forEach((file, index) => {
        const stats = fs.statSync(file);
        indexContent += `   ${index + 1}. ${file} (${formatFileSize(stats.size)})\n`;
    });
    
    fs.writeFileSync(indexFile, indexContent, 'utf8');
    
    console.log('\n' + '='.repeat(80));
    console.log('📊 ИТОГОВАЯ СТАТИСТИКА:');
    console.log(`   📄 Файлов обработано: ${fileCount}`);
    console.log(`   ⚠️ Пропущено: ${skippedFiles}`);
    console.log(`   📁 Создано файлов: ${outputFiles.length + 1}`);
    console.log(`   📋 Индекс: ${indexFile}`);
    
    outputFiles.forEach((file, index) => {
        const stats = fs.statSync(file);
        console.log(`   📄 Часть ${index + 1}: ${file} (${formatFileSize(stats.size)})`);
    });
    
    // Копируем все файлы в буфер обмена (по очереди)
    console.log('\n📋 Копирование в буфер обмена:');
    outputFiles.forEach((file, index) => {
        console.log(`   Копирование части ${index + 1}...`);
        copyToClipboard(file);
    });
}

function copyToClipboard(file) {
    try {
        const { execSync } = require('child_process');
        const fileName = path.basename(file);
        
        if (process.platform === 'darwin') {
            execSync(`cat "${file}" | pbcopy`);
            console.log(`   📋 ${fileName} скопирован в буфер обмена (macOS) ✅`);
        } else if (process.platform === 'linux') {
            try {
                execSync('which xclip', { stdio: 'ignore' });
                execSync(`cat "${file}" | xclip -selection clipboard`);
                console.log(`   📋 ${fileName} скопирован в буфер обмена (Linux) ✅`);
            } catch {
                console.log(`   ℹ️ Установите xclip: sudo apt-get install xclip`);
                console.log(`      Или скопируйте вручную: cat "${file}"`);
            }
        } else if (process.platform === 'win32') {
            execSync(`type "${file}" | clip`);
            console.log(`   📋 ${fileName} скопирован в буфер обмена (Windows) ✅`);
        } else {
            console.log(`   ℹ️ Скопируйте вручную содержимое файла: ${file}`);
        }
    } catch (error) {
        console.log(`   ℹ️ Не удалось скопировать в буфер обмена. Файл сохранен: ${file}`);
    }
}

// Запуск
console.log('🚀 Копирование всех файлов в 3 части\n');
copyAllFilesToBuffer();
console.log('\n✅ Готово!');
