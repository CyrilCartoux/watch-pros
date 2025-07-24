const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const src = 'public/watch-pros.png'; // ou 'public/favicon.png' si tu préfères
const outDir = 'public/icons';

const sizes = [192, 512];

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

sizes.forEach(size => {
  sharp(src)
    .resize(size, size)
    .toFile(path.join(outDir, `icon-${size}x${size}.png`), (err, info) => {
      if (err) {
        console.error(`Erreur pour la taille ${size}:`, err);
      } else {
        console.log(`Généré: icon-${size}x${size}.png`);
      }
    });
}); 