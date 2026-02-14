// scripts/processBattleFiles.js
const fs = require('fs');
const path = require('path');

// Папки
const SOURCE_DIR = path.join(__dirname, './public/smBattle');
const PROCESSED_DIR = path.join(__dirname, './public/smBattle/processed');

// Создаем папку processed, если ее нет
if (!fs.existsSync(PROCESSED_DIR)) {
  fs.mkdirSync(PROCESSED_DIR, { recursive: true });
  console.log(`Создана папка: ${PROCESSED_DIR}`);
}

// Функция для парсинга строки в формате с пробелами
function parseSpacedLine(line) {
  try {
    // Удаляем лишние пробелы
    const cleanLine = line.replace(/\s+/g, ' ').trim();
    const parts = cleanLine.split(' ');
    
    if (parts.length < 20) {
      console.log('Строка слишком короткая:', parts.length);
      return null;
    }
    
    // Извлекаем дату и время (первые 2 части)
    const dateTime = `${parts[0]} ${parts[1]}`;
    
    // Ищем команду атакующего (6 существ в скобках)
    let attackerTeamStart = -1;
    for (let i = 2; i < parts.length - 5; i++) {
      if (parts[i].includes('(') && parts[i+1].includes('(') && parts[i+2].includes('(') &&
          parts[i+3].includes('(') && parts[i+4].includes('(') && parts[i+5].includes('(')) {
        attackerTeamStart = i;
        break;
      }
    }
    
    if (attackerTeamStart === -1) {
      console.log('Не найдена команда атакующего');
      return null;
    }
    
    // Перед командой атакующего: ID, имя, мощь
    const attackerId = parts[attackerTeamStart - 3] || '';
    const attackerName = parts[attackerTeamStart - 2] || '';
    const attackerPower = parts[attackerTeamStart - 1] || '0';
    const attackerTeam = parts.slice(attackerTeamStart, attackerTeamStart + 6).join(' ');
    
    // Ищем команду защитника после команды атакующего
    let defenderTeamStart = -1;
    for (let i = attackerTeamStart + 6; i < parts.length - 5; i++) {
      if (parts[i].includes('(') && parts[i+1].includes('(') && parts[i+2].includes('(') &&
          parts[i+3].includes('(') && parts[i+4].includes('(') && parts[i+5].includes('(')) {
        defenderTeamStart = i;
        break;
      }
    }
    
    if (defenderTeamStart === -1) {
      console.log('Не найдена команда защитника');
      return null;
    }
    
    // Перед командой защитника: ID, имя, мощь
    const defenderId = parts[defenderTeamStart - 3] || '';
    const defenderName = parts[defenderTeamStart - 2] || '';
    const defenderPower = parts[defenderTeamStart - 1] || '0';
    const defenderTeam = parts.slice(defenderTeamStart, defenderTeamStart + 6).join(' ');
    
    // Ищем очки после команды защитника
    let points = '0';
    let petsStart = defenderTeamStart + 6;
    
    // Проверяем, есть ли очки (небольшое число)
    if (petsStart < parts.length && /^\d{1,3}$/.test(parts[petsStart])) {
      points = parts[petsStart];
      petsStart++;
    }
    
    // Ищем питомцев (должно быть 10 значений)
    let petsString = '';
    if (petsStart < parts.length) {
      const remainingParts = parts.slice(petsStart);
      // Берем максимум 20 значений на всякий случай
      const maxPets = Math.min(20, remainingParts.length);
      petsString = remainingParts.slice(0, maxPets).join(' ');
    }
    
    // Разделяем на attackerPets и defenderPets (первые 5 и последние 5)
    const petParts = petsString.split(' ').filter(p => p.trim() !== '');
    let attackerPets = '';
    let defenderPets = '';
    
    if (petParts.length >= 10) {
      attackerPets = petParts.slice(0, 5).join(' ');
      defenderPets = petParts.slice(5, 10).join(' ');
    } else if (petParts.length > 0) {
      // Если меньше 10, предполагаем что это только attackerPets
      attackerPets = petParts.join(' ');
    }
    
    return {
      dateTime,
      attackerId,
      attackerName,
      attackerPower,
      attackerTeam,
      defenderId,
      defenderName,
      defenderPower,
      defenderTeam,
      points,
      attackerPets,
      defenderPets
    };
  } catch (error) {
    console.error('Ошибка парсинга строки:', error.message);
    return null;
  }
}

// Функция для парсинга строки в формате с табуляцией
function parseTabbedLine(line) {
  try {
    const parts = line.split('\t').filter(part => part.trim() !== '');
    
    if (parts.length < 12) {
      console.log('Строка с табуляцией слишком короткая:', parts.length);
      return null;
    }
    
    return {
      dateTime: parts[0]?.trim() || '',
      attackerId: parts[1]?.trim() || '',
      attackerName: parts[2]?.trim() || '',
      attackerPower: parts[3]?.trim() || '',
      attackerTeam: parts[4]?.trim() || '',
      defenderId: parts[5]?.trim() || '',
      defenderName: parts[6]?.trim() || '',
      defenderPower: parts[7]?.trim() || '',
      defenderTeam: parts[8]?.trim() || '',
      points: parts[9]?.trim() || '0',
      attackerPets: parts[10]?.trim() || '',
      defenderPets: parts[11]?.trim() || ''
    };
  } catch (error) {
    console.error('Ошибка парсинга строки с табуляцией:', error.message);
    return null;
  }
}

// Функция для обработки одного файла
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
    
    // Определяем формат по первой строке данных (после заголовка)
    const isTabbed = lines[0].includes('\t');
    console.log(`Формат файла: ${isTabbed ? 'табуляция' : 'пробелы'}`);
    
    // Пропускаем заголовок (если есть)
    const dataLines = lines.slice(1);
    
    const parsedBattles = [];
    
    dataLines.forEach((line, index) => {
      try {
        const battle = isTabbed ? parseTabbedLine(line) : parseSpacedLine(line);
        
        if (battle) {
          // Проверяем, что есть хотя бы команда атакующего и защитника
          if (battle.attackerTeam && battle.defenderTeam) {
            parsedBattles.push(battle);
          } else {
            console.log(`Строка ${index + 1}: пропущена - нет команд`);
          }
        } else {
          console.log(`Строка ${index + 1}: не удалось распарсить`);
        }
      } catch (error) {
        console.error(`Ошибка в строке ${index + 1}:`, error.message);
      }
    });
    
    console.log(`Успешно распарсено боев: ${parsedBattles.length}/${dataLines.length}`);
    return parsedBattles;
    
  } catch (error) {
    console.error(`Ошибка обработки файла ${filePath}:`, error.message);
    return [];
  }
}

// Функция для сохранения в CSV формат
function saveToCSV(battles, outputPath) {
  try {
    if (battles.length === 0) {
      console.log('Нет данных для сохранения');
      return false;
    }
    
    // Заголовки CSV
    const headers = [
      'dateTime',
      'attackerId',
      'attackerName',
      'attackerPower',
      'attackerTeam',
      'defenderId',
      'defenderName',
      'defenderPower',
      'defenderTeam',
      'points',
      'attackerPets',
      'defenderPets'
    ];
    
    // Создаем CSV строки
    const csvLines = [];
    csvLines.push(headers.join(','));
    
    battles.forEach(battle => {
      const row = [
        `"${battle.dateTime}"`,
        `"${battle.attackerId}"`,
        `"${battle.attackerName}"`,
        `"${battle.attackerPower}"`,
        `"${battle.attackerTeam}"`,
        `"${battle.defenderId}"`,
        `"${battle.defenderName}"`,
        `"${battle.defenderPower}"`,
        `"${battle.defenderTeam}"`,
        `"${battle.points}"`,
        `"${battle.attackerPets}"`,
        `"${battle.defenderPets}"`
      ];
      csvLines.push(row.join(','));
    });
    
    fs.writeFileSync(outputPath, csvLines.join('\n'), 'utf8');
    console.log(`Сохранено в: ${outputPath}`);
    return true;
    
  } catch (error) {
    console.error('Ошибка сохранения CSV:', error.message);
    return false;
  }
}

// Функция для сохранения в JSON формат (для удобства)
function saveToJSON(battles, outputPath) {
  try {
    fs.writeFileSync(outputPath, JSON.stringify(battles, null, 2), 'utf8');
    console.log(`Сохранено в: ${outputPath}`);
    return true;
  } catch (error) {
    console.error('Ошибка сохранения JSON:', error.message);
    return false;
  }
}

// Основная функция
function main() {
  console.log('Начало обработки файлов боев...');
  console.log(`Исходная папка: ${SOURCE_DIR}`);
  console.log(`Папка для результатов: ${PROCESSED_DIR}`);
  
  // Получаем все .txt файлы
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
  
  // Обрабатываем каждый файл
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
    // Сохраняем все бои в один файл
    const allBattlesOutputPath = path.join(PROCESSED_DIR, 'all_battles.csv');
    const allBattlesJsonPath = path.join(PROCESSED_DIR, 'all_battles.json');
    
    console.log('\nСохранение всех боев в один файл...');
    saveToCSV(allBattles, allBattlesOutputPath);
    saveToJSON(allBattles, allBattlesJsonPath);
    
    // Также сохраняем каждый файл отдельно в обработанном виде
    console.log('\nСохранение отдельных файлов...');
    files.forEach(file => {
      const filePath = path.join(SOURCE_DIR, file);
      const battles = processFile(filePath); // Парсим заново для каждого файла
      
      if (battles.length > 0) {
        const csvPath = path.join(PROCESSED_DIR, `${file.replace('.txt', '')}.csv`);
        saveToCSV(battles, csvPath);
      }
    });
    
    console.log('\n=== ИНСТРУКЦИЯ ДЛЯ КОМПОНЕНТА Territory.js ===');
    console.log('1. В компоненте Territory.js измените массив файлов на:');
    console.log('   const dataArray = [\'all_battles.csv\'];');
    console.log('2. Измените basePath на:');
    console.log('   const basePath = \'/smBattle/processed/\';');
    console.log('3. В функции loadData используйте простой парсинг CSV:');
    console.log(`
Пример парсинга CSV:
const response = await fetch(filePath);
const text = await response.text();
const lines = text.split('\\n').filter(line => line.trim() !== '');
const header = lines[0].split(',');
const dataLines = lines.slice(1);

dataLines.forEach(line => {
  const values = line.split(',').map(v => v.replace(/^"|"$/g, '').trim());
  const battle = {};
  header.forEach((key, index) => {
    battle[key] = values[index] || '';
  });
  // Добавьте battle в массив
});
    `);
    
  } else {
    console.log('Не удалось обработать ни одного боя');
  }
}

// Запуск скрипта
main();
