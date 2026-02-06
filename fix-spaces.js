// fix-spaces.js
const fs = require('fs');
const path = require('path');

// Функция для обработки файла
function fixSpacesInFile(filePath) {
  try {
    // Проверяем существование файла
    if (!fs.existsSync(filePath)) {
      console.error(`Ошибка: Файл "${filePath}" не найден.`);
      return;
    }

    // Читаем содержимое файла
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Заменяем все табуляции на пробелы
    let result = content.replace(/\t/g, ' ');
    
    // Заменяем множественные пробелы (2 и более) на одинарные пробелы
    // Используем регулярное выражение, которое ищет 2+ пробелов и заменяет на один
    result = result.replace(/ {2,}/g, ' ');
    
    // Также заменяем комбинации пробелов, которые могут включать табуляции
    // (на случай, если предыдущие замены оставили лишние пробелы)
    result = result.replace(/\s{2,}/g, ' ');
    
    // Записываем обратно в файл
    fs.writeFileSync(filePath, result, 'utf-8');
    
    console.log(`Файл "${filePath}" успешно обработан.`);
    console.log(`Заменено: табуляции → пробелы, двойные пробелы → одинарные пробелы.`);
    
  } catch (error) {
    console.error(`Ошибка при обработке файла "${filePath}":`, error.message);
  }
}

// Функция для обработки всех файлов в папке
function fixSpacesInFolder(folderPath, fileExtensions = ['.txt']) {
  try {
    if (!fs.existsSync(folderPath)) {
      console.error(`Ошибка: Папка "${folderPath}" не найдена.`);
      return;
    }

    const files = fs.readdirSync(folderPath);
    let processedCount = 0;

    files.forEach(file => {
      const filePath = path.join(folderPath, file);
      const ext = path.extname(file).toLowerCase();
      
      // Проверяем расширение файла
      if (fileExtensions.includes(ext) && fs.statSync(filePath).isFile()) {
        fixSpacesInFile(filePath);
        processedCount++;
      }
    });

    console.log(`\nОбработано файлов: ${processedCount}`);
    
  } catch (error) {
    console.error(`Ошибка при обработке папки "${folderPath}":`, error.message);
  }
}

// Основная функция
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
Использование:
  node fix-spaces.js <путь_к_файлу>       - Обработать один файл
  node fix-spaces.js <путь_к_папке>       - Обработать все .txt файлы в папке
  node fix-spaces.js <файл1> <файл2> ...  - Обработать несколько файлов
  
Примеры:
  node fix-spaces.js data.txt
  node fix-spaces.js ./myfolder
  node fix-spaces.js file1.txt file2.txt file3.txt
    `);
    return;
  }

  // Обработка всех переданных аргументов
  args.forEach(arg => {
    try {
      const stats = fs.statSync(arg);
      
      if (stats.isFile()) {
        // Обработка одного файла
        fixSpacesInFile(arg);
      } else if (stats.isDirectory()) {
        // Обработка всех файлов в папке
        fixSpacesInFolder(arg);
      } else {
        console.error(`Ошибка: "${arg}" не является файлом или папкой.`);
      }
    } catch (error) {
      console.error(`Ошибка при доступе к "${arg}":`, error.message);
    }
  });
}

// Запускаем скрипт
if (require.main === module) {
  main();
}

// Экспортируем функции для использования в других модулях
module.exports = {
  fixSpacesInFile,
  fixSpacesInFolder
};
