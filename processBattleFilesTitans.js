// scripts/processTitanFiles.js
const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(__dirname, './public/smBattleTitan');
const PROCESSED_DIR = path.join(__dirname, './public/smBattleTitan/processed');

if (!fs.existsSync(PROCESSED_DIR)) {
  fs.mkdirSync(PROCESSED_DIR, { recursive: true });
  console.log(`Создана папка: ${PROCESSED_DIR}`);
}

function processFile(filePath) {
  try {
    const fileName = path.basename(filePath);
    console.log(`\nОбработка файла: ${fileName}`);
    
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length === 0) {
      console.log(`Файл ${fileName} пустой`);
      return [];
    }
    
    // Заголовки
    const headerLine = lines[0];
    let headers;
    if (headerLine.includes('\t')) {
      headers = headerLine.split('\t').map(h => h.trim());
    } else {
      headers = headerLine.split(/\s{2,}/).map(h => h.trim());
    }
    console.log(`  Найдено заголовков: ${headers.length}`);
    
    const dataLines = lines.slice(1);
    if (dataLines.length === 0) {
      console.log('  Нет строк с данными');
      return [];
    }
    
    // Определяем разделитель по первой строке данных
    const firstDataLine = dataLines[0];
    let delimiter;
    if (firstDataLine.includes('\t')) {
      delimiter = '\t';
      console.log('  Разделитель: табуляция');
    } else {
      delimiter = /\s{2,}/;
      console.log('  Разделитель: два и более пробела');
    }
    
    const parsedBattles = [];
    
    dataLines.forEach((line, index) => {
      let parts = line.split(delimiter).map(p => p.trim());
      
      // Особый случай: если полей 14, а заголовков 18, значит не хватает 4 полей (points, attacker pets, defender pets, comment)
      if (parts.length === 14 && headers.length === 18) {
        // Вставляем 4 пустых поля после индекса 8 (9-е поле)
        parts.splice(9, 0, '', '', '', '');
        console.log(`  Строка ${index + 1}: добавлены пропущенные поля (points, attacker pets, defender pets, comment)`);
      }
      
      // Дополняем до нужной длины
      while (parts.length < headers.length) {
        parts.push('');
      }
      parts = parts.slice(0, headers.length);
      
      // Убираем кавычки
      parts = parts.map(p => p.replace(/^"|"$/g, ''));
      
      const battle = {};
      headers.forEach((header, i) => {
        battle[header] = parts[i] || '';
      });
      
      const attTeam = battle['att team'] || '';
      const defTeam = battle['team'] || '';
      const hasTitans = /\([0-9]+\)/.test(attTeam) || /\([0-9]+\)/.test(defTeam);
      
      if (attTeam && defTeam && hasTitans) {
        parsedBattles.push(battle);
      } else {
        const sample = parts.slice(0, 5).join(' | ');
        console.log(`  Строка ${index + 1}: пропущена - нет команд (образец: ${sample})`);
      }
    });
    
    console.log(`  Успешно распарсено боев: ${parsedBattles.length}/${dataLines.length}`);
    return parsedBattles;
    
  } catch (error) {
    console.error(`Ошибка обработки файла ${filePath}:`, error.message);
    return [];
  }
}

function escapeCSVField(field) {
  if (field === null || field === undefined) return '';
  const stringField = String(field);
  if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  return stringField;
}

function saveToCSV(battles, outputPath) {
  try {
    if (battles.length === 0) {
      console.log('  Нет данных для сохранения');
      return false;
    }
    const headers = Object.keys(battles[0]);
    const csvLines = [];
    csvLines.push(headers.map(escapeCSVField).join(','));
    battles.forEach(battle => {
      const row = headers.map(header => escapeCSVField(battle[header] || ''));
      csvLines.push(row.join(','));
    });
    fs.writeFileSync(outputPath, csvLines.join('\n'), 'utf8');
    console.log(`  Сохранено в: ${outputPath}`);
    return true;
  } catch (error) {
    console.error('  Ошибка сохранения CSV:', error.message);
    return false;
  }
}

function saveToJSON(battles, outputPath) {
  try {
    fs.writeFileSync(outputPath, JSON.stringify(battles, null, 2), 'utf8');
    console.log(`  Сохранено в: ${outputPath}`);
    return true;
  } catch (error) {
    console.error('  Ошибка сохранения JSON:', error.message);
    return false;
  }
}

function main() {
  console.log('Начало обработки файлов битв титанов...');
  console.log(`Исходная папка: ${SOURCE_DIR}`);
  console.log(`Папка для результатов: ${PROCESSED_DIR}`);
  
  let files;
  try {
    files = fs.readdirSync(SOURCE_DIR).filter(file => file.endsWith('.txt'));
  } catch (error) {
    console.error(`Ошибка чтения папки ${SOURCE_DIR}:`, error.message);
    return;
  }
  
  console.log(`Найдено файлов: ${files.length}`);
  if (files.length === 0) {
    console.log('Нет .txt файлов для обработки');
    return;
  }
  
  const allBattles = [];
  const stats = {};
  
  files.forEach(file => {
    const filePath = path.join(SOURCE_DIR, file);
    const battles = processFile(filePath);
    stats[file] = battles.length;
    allBattles.push(...battles);
  });
  
  console.log('\n=== Статистика обработки ===');
  Object.entries(stats).forEach(([file, count]) => {
    console.log(`${file}: ${count} боев`);
  });
  console.log(`Всего боев: ${allBattles.length}`);
  
  if (allBattles.length > 0) {
    const allBattlesOutputPath = path.join(PROCESSED_DIR, 'all_titan_battles.csv');
    const allBattlesJsonPath = path.join(PROCESSED_DIR, 'all_titan_battles.json');
    
    console.log('\nСохранение всех боев в один файл...');
    saveToCSV(allBattles, allBattlesOutputPath);
    saveToJSON(allBattles, allBattlesJsonPath);
    
    console.log('\nСохранение отдельных файлов...');
    files.forEach(file => {
      const filePath = path.join(SOURCE_DIR, file);
      const battles = processFile(filePath);
      if (battles.length > 0) {
        const csvPath = path.join(PROCESSED_DIR, `${file.replace('.txt', '')}.csv`);
        saveToCSV(battles, csvPath);
      }
    });
    
    console.log('\n=== ИНСТРУКЦИЯ ДЛЯ КОМПОНЕНТА War.js ===');
    console.log('1. В компоненте War.js измените загрузку данных на один файл:');
    console.log('   const filePath = \'/smBattleTitan/processed/all_titan_battles.csv\';');
    // ... остальная инструкция
  } else {
    console.log('Не удалось обработать ни одного боя');
  }
}

main();
