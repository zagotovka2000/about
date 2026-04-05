const fs = require('fs');
const path = require('path');

const GA_DIR = path.join(__dirname, './public/images/GA');
const OUTPUT_FILE = path.join(__dirname, './public/data/ga-manifest.json');

function getAllImagesInFolder(folderPath) {
  try {
    const files = fs.readdirSync(folderPath);
    return files
      .filter(file => /\.(png|jpg|jpeg|gif|webp)$/i.test(file))
      .map(file => `/images/GA/${path.basename(folderPath)}/${file}`);
  } catch (err) {
    console.error(`Ошибка чтения папки ${folderPath}:`, err);
    return [];
  }
}

function generateManifest() {
  if (!fs.existsSync(GA_DIR)) {
    console.error(`Папка ${GA_DIR} не существует. Создайте её и добавьте подпапки с изображениями.`);
    process.exit(1);
  }

  const folders = fs.readdirSync(GA_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const manifest = folders.map(folder => ({
    name: folder,
    images: getAllImagesInFolder(path.join(GA_DIR, folder))
  }));

  // Создаём папку public/data, если её нет
  const dataDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));
  console.log(`Манифест сохранён в ${OUTPUT_FILE}`);
  console.log(`Найдено папок: ${manifest.length}`);
  manifest.forEach(f => console.log(` - ${f.name}: ${f.images.length} изображений`));
}

generateManifest();
