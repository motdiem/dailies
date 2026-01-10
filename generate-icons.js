#!/usr/bin/env node

const fs = require('fs');

function generateSVG(size) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4f46e5;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#grad)" rx="${size * 0.1}" />
  <text
    x="50%"
    y="50%"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="${size * 0.6}"
    font-weight="bold"
    fill="white"
    text-anchor="middle"
    dominant-baseline="central">D</text>
</svg>`;
}

// Generate SVG files (browsers can use these as fallback)
fs.writeFileSync('icon-192.svg', generateSVG(192));
fs.writeFileSync('icon-512.svg', generateSVG(512));

console.log('SVG icons generated successfully!');
console.log('For best PWA support, please convert these to PNG:');
console.log('  icon-192.svg -> icon-192.png');
console.log('  icon-512.svg -> icon-512.png');
console.log('\nYou can:');
console.log('1. Open generate-icons.html in a browser and download the PNGs');
console.log('2. Or use an online converter like cloudconvert.com');
console.log('3. Or use ImageMagick: convert icon-192.svg icon-192.png');
