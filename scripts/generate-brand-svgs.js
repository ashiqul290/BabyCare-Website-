const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../public/images/brands');
fs.mkdirSync(targetDir, { recursive: true });

const brands = [
  { file: 'aptamil.svg', name: 'Aptamil', color: '#0369a1', font: 'sans-serif' },
  { file: 'avonee.svg', name: 'Avonee pants', color: '#9333ea', font: 'sans-serif' },
  { file: 'huggies.svg', name: 'HUGGIES', color: '#dc2626', font: 'sans-serif' },
  { file: 'kodomo.svg', name: 'KODOMO', color: '#059669', font: 'sans-serif' },
  { file: 'molfix.svg', name: 'Molfix', color: '#0284c7', font: 'sans-serif' },
  { file: 'nestle.svg', name: 'Nestlé', color: '#1e3a8a', font: 'serif' },
  { file: 'mothercare.svg', name: 'mothercare', color: '#0f766e', font: 'sans-serif' },
  { file: 'pampers.svg', name: 'Pampers', color: '#0d9488', font: 'sans-serif' },
];

brands.forEach(b => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" width="100%" height="100%">
    <rect width="200" height="80" fill="transparent"/>
    <text x="100" y="48" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, ${b.font}" font-size="24" font-weight="800" fill="${b.color}" text-anchor="middle" letter-spacing="-0.5">${b.name}</text>
  </svg>`;
  fs.writeFileSync(path.join(targetDir, b.file), svg, 'utf-8');
});

console.log('Brand SVGs generated successfully.');
