const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../public/images/products');
fs.mkdirSync(targetDir, { recursive: true });

const products = [
  { file: 'feeder-brush.svg', title: 'Hercules Bear', sub: '16 Pcs Feeder Brush Set', color: '#10b981', type: 'brush' },
  { file: 'sudocrem.svg', title: 'Sudocrem', sub: 'Antiseptic Healing Cream 125g', color: '#94a3b8', type: 'cream' },
  { file: 'lansinoh.svg', title: 'Lansinoh', sub: 'HPA Lanolin Nipple Cream 40g', color: '#8b5cf6', type: 'tube' },
  { file: 'snake-egg.svg', title: 'PlaySense', sub: '3D Printed Articulated Snake', color: '#0ea5e9', type: 'toy' },
  { file: 'snail-toy.svg', title: 'Sensory Slug', sub: 'Rainbow Flexible Fidget Toy', color: '#f59e0b', type: 'toy' },
  { file: 'folding-bottle.svg', title: 'EcoJunior', sub: 'Collapsible Silicone Bottle 600ml', color: '#0d9488', type: 'bottle' },
  { file: 'school-backpack.svg', title: 'Waterproof Backpack', sub: 'Ergonomic Pastel Pink Bag', color: '#f43f5e', type: 'bag' },
  { file: 'samyang-ramen.svg', title: 'Samyang 2X', sub: 'Hot Chicken Flavor Ramen', color: '#dc2626', type: 'food' },
  { file: 'molfix-nb.svg', title: 'Molfix NB', sub: 'Twin Newborn 0-5kg 40 Pcs', color: '#0284c7', type: 'diaper' },
  { file: 'huggies-m.svg', title: 'Huggies Dry', sub: 'Medium Pants 58 Pcs', color: '#dc2626', type: 'diaper' },
  { file: 'mamypoko-xl.svg', title: 'MamyPoko XL', sub: 'Extra Absorb Pants 48 Pcs', color: '#2563eb', type: 'diaper' },
  { file: 'mamypoko-s.svg', title: 'MamyPoko S', sub: 'Small Pants 52 Pcs', color: '#1d4ed8', type: 'diaper' },
  { file: 'smartcare-l.svg', title: 'Smart Care', sub: 'Ultra Thin Pants L 50 Pcs', color: '#059669', type: 'diaper' },
  { file: 'happy-friday.svg', title: 'Happy Friday', sub: 'Pant Diaper XXL 24 Pcs', color: '#d97706', type: 'diaper' },
  { file: 'pampers-l.svg', title: 'Pampers UK', sub: 'Baby Dry Size 5 72 Pcs', color: '#0d9488', type: 'diaper' },
  { file: 'aiwibi-m.svg', title: 'Aiwibi Australia', sub: 'Premium Medium Belt 48 Pcs', color: '#0891b2', type: 'diaper' },
  { file: 'heinz-porridge.svg', title: 'Heinz (6M+)', sub: 'Creamy n Lumpy Fruits & Yogurt', color: '#16a34a', type: 'porridge' },
  { file: 'aptamil.svg', title: 'Aptamil 1', sub: 'Pronutra First Infant Milk 800g', color: '#0284c7', type: 'tin' },
  { file: 'cow-gate.svg', title: 'Cow & Gate 1', sub: 'First Infant Milk Formula 800g', color: '#dc2626', type: 'tin' },
  { file: 'sma.svg', title: 'SMA PRO 2', sub: 'Follow-On Milk 800g', color: '#eab308', type: 'tin' },
  { file: 'eldobaby-1.svg', title: 'ELDOBABY 1', sub: 'Infant Formula 400g Tin', color: '#0369a1', type: 'tin' },
  { file: 'nido-1kg.svg', title: 'Nestle NIDO', sub: 'FortiGrow Full Cream Milk 1kg', color: '#eab308', type: 'tin' },
  { file: 'similac-1.svg', title: 'Similac Advance', sub: 'Infant Milk Stage 1 400g', color: '#0891b2', type: 'tin' },
  { file: 'pediasure.svg', title: 'PediaSure', sub: 'TripleSure Vanilla 400g', color: '#7c3aed', type: 'tin' },
  { file: 'ensure.svg', title: 'Ensure Complete', sub: 'Vanilla Milk Powder 850g', color: '#1e3a8a', type: 'tin' },
  { file: 'koko-krunch.svg', title: 'Koko Krunch', sub: 'Whole Grain Chocolate 70g', color: '#78350f', type: 'pouch' },
  { file: 'milo.svg', title: 'Nestle MILO', sub: 'Activ-Go Energy Drink 250g', color: '#15803d', type: 'pouch' },
  { file: 'almarai-cheese.svg', title: 'Almarai', sub: 'Triangle Cheese 8 Pcs', color: '#2563eb', type: 'box' },
  { file: 'quaker-oats.svg', title: 'Quaker Oats', sub: '100% Wholegrain Oats 450g', color: '#0369a1', type: 'box' },
  { file: 'la-vache.svg', title: 'The Laughing Cow', sub: 'Creamy Triangle Cheese 8pcs', color: '#dc2626', type: 'box' },
  { file: 'lactogen-1.svg', title: 'Lactogen 1', sub: 'Infant Formula 350g', color: '#0284c7', type: 'tin' },
  { file: 'cerelac.svg', title: 'Nestle Cerelac', sub: 'Wheat & Apple Cereal 350g', color: '#ea580c', type: 'box' },
  { file: 'heinz-biscotti.svg', title: 'Heinz Biscotti', sub: 'Strawberry Banana 7M+ 60g', color: '#16a34a', type: 'pouch' },
];

products.forEach(p => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${p.color}" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="${p.color}"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.08"/>
    </filter>
  </defs>

  <rect width="400" height="400" fill="url(#bgGrad)" rx="24"/>
  
  <!-- Subtle circular halo -->
  <circle cx="200" cy="180" r="130" fill="${p.color}" opacity="0.06"/>
  
  <!-- Central Product Packaging Container -->
  <g filter="url(#shadow)">
    <!-- Container Body -->
    <rect x="90" y="65" width="220" height="250" rx="20" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
    
    <!-- Top Cap / Lid / Header -->
    <path d="M 90 85 Q 90 65 110 65 L 290 65 Q 310 65 310 85 L 310 120 L 90 120 Z" fill="url(#accentGrad)"/>
    
    <!-- Category/Badge pill on container -->
    <rect x="135" y="78" width="130" height="26" rx="13" fill="#ffffff" opacity="0.95"/>
    <text x="200" y="95" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="${p.color}" text-anchor="middle" letter-spacing="0.5">ORIGINAL</text>
    
    <!-- Product Graphic Shape inside -->
    <circle cx="200" cy="175" r="42" fill="${p.color}" opacity="0.12"/>
    <circle cx="200" cy="175" r="32" fill="${p.color}" opacity="0.22"/>
    
    <!-- Decorative Icon / Star -->
    <path d="M 200 156 L 204 168 L 217 168 L 206 176 L 210 188 L 200 180 L 190 188 L 194 176 L 183 168 L 196 168 Z" fill="${p.color}"/>
    
    <!-- Product Brand and Title on Card -->
    <text x="200" y="235" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="800" fill="#1e293b" text-anchor="middle">${p.title}</text>
    
    <!-- Subtitle on Packaging -->
    <text x="200" y="260" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="500" fill="#64748b" text-anchor="middle">${p.sub.slice(0, 26)}</text>
    
    <!-- Trust Seal Bottom -->
    <rect x="120" y="282" width="160" height="20" rx="10" fill="#f1f5f9"/>
    <text x="200" y="296" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="600" fill="#475569" text-anchor="middle">★ CLINICALLY TESTED ★</text>
  </g>
  
  <!-- Modern Clean Bottom Reflection -->
  <ellipse cx="200" cy="335" rx="90" ry="10" fill="#000000" opacity="0.05"/>
</svg>`;

  fs.writeFileSync(path.join(targetDir, p.file), svg, 'utf-8');
});

console.log('Successfully generated ' + products.length + ' clean product SVGs.');
