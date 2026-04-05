const fs = require('fs');
const path = require('path');

const startLineRegex = /^\d{2}\/\d{2}\s+\d{2}:\d{2}/;

function processFileContent(content) {
  const lines = content.split(/\r?\n/);
  const records = [];
  let currentRecordLines = [];

  for (const line of lines) {
    if (startLineRegex.test(line)) {
      if (currentRecordLines.length > 0) {
        records.push([...currentRecordLines]);
      }
      currentRecordLines = [line];
    } else {
      if (currentRecordLines.length > 0) {
        currentRecordLines.push(line);
      }
    }
  }
  if (currentRecordLines.length > 0) {
    records.push(currentRecordLines);
  }

  const outputRows = [];

  for (const recordLines of records) {
    const fullRecord = recordLines.join('\n');
    let fields = fullRecord.split('\t');

    // Нормализуем количество полей до 13 (индексы 0-12)
    // Если полей больше 13, отбрасываем лишние (начиная с 13)
    // Если меньше 13, дополняем пустыми строками
    while (fields.length < 13) {
      fields.push('');
    }
    if (fields.length > 13) {
      fields = fields.slice(0, 13);
    }

    // Извлекаем нужные поля
    const date = fields[0]?.trim() || '';
    const time = fields[1]?.trim() || '';
    const dateTime = `${date} ${time}`;

    const attackerId = fields[2]?.trim() || '';
    const attName = fields[3]?.trim() || '';
    const attPower = fields[4]?.trim() || '';
    const attTeam = fields[5]?.trim() || '';
    const defenderId = fields[6]?.trim() || '';
    const defName = fields[7]?.trim() || '';
    const defPower = fields[8]?.trim() || '';
    const team = fields[9]?.trim() || '';
    // Поля с индексами 10 (points) и 13+ (комментарии) игнорируем
    const attackerPets = fields[11]?.trim() || '';
    const defenderPets = fields[12]?.trim() || '';

    // Формируем выходные поля
    const outputFields = [
      dateTime,
      attackerId,
      attName,
      attPower,
      attTeam,
      defenderId,
      defName,
      defPower,
      team,
      attackerPets,
      defenderPets
    ];

    // Заменяем undefined на пустую строку
    const safeOutputFields = outputFields.map(f => f === undefined ? '' : f);
    const outputLine = safeOutputFields.join('\t');

    outputRows.push(outputLine);
  }

  return outputRows;
}

const targetDir = process.argv[2] || path.join(__dirname, 'public', 'editFiles');

if (!fs.existsSync(targetDir)) {
  console.error(`Папка не найдена: ${targetDir}`);
  process.exit(1);
}

const files = fs.readdirSync(targetDir).filter(f => f.endsWith('.txt'));

if (files.length === 0) {
  console.log('Нет файлов .txt в указанной папке');
  process.exit(0);
}

files.forEach(file => {
  const filePath = path.join(targetDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const processed = processFileContent(content);

  if (processed.length === 0) {
    console.warn(`Файл ${file} не содержит валидных записей, пропускаем`);
    return;
  }

  const parsedPath = path.parse(filePath);
  const outputFileName = path.join(
    parsedPath.dir,
    `${parsedPath.name} герои${parsedPath.ext}`
  );

  fs.writeFileSync(outputFileName, processed.join('\n'), 'utf8');
  console.log(`Обработан: ${file} → ${path.basename(outputFileName)}`);
});
