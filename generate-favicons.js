// generate-favicons.js
// -----------------------------------------------------------
// Script to generate favicon files from existing logo
// -----------------------------------------------------------

const fs = require('fs');
const path = require('path');

// Favicon sizes and their purposes
const faviconSizes = [
  { name: 'favicon-16x16.png', size: '16x16', purpose: 'Standard favicon' },
  { name: 'favicon-32x32.png', size: '32x32', purpose: 'High-DPI favicon' },
  { name: 'apple-touch-icon.png', size: '180x180', purpose: 'iOS home screen icon' },
  { name: 'android-chrome-192x192.png', size: '192x192', purpose: 'Android Chrome icon' },
  { name: 'android-chrome-512x512.png', size: '512x512', purpose: 'Android Chrome icon (high-res)' }
];

console.log('🎨 LoyaltyPro Favicon Generator');
console.log('================================');

// Check existing files
console.log('\n📁 Current favicon files:');
const publicDir = path.join(__dirname, 'public');
const existingFiles = fs.readdirSync(publicDir).filter(file => 
  file.includes('favicon') || file.includes('apple-touch') || file.includes('android-chrome')
);

existingFiles.forEach(file => {
  const stats = fs.statSync(path.join(publicDir, file));
  console.log(`   ✅ ${file} (${(stats.size / 1024).toFixed(1)}KB)`);
});

// Check missing files
const missingFiles = faviconSizes.filter(({ name }) => !existingFiles.includes(name));
if (missingFiles.length > 0) {
  console.log('\n❌ Missing favicon files:');
  missingFiles.forEach(({ name, size, purpose }) => {
    console.log(`   - ${name} (${size}) - ${purpose}`);
  });
}

// Create enhanced HTML generator
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LoyaltyPro Favicon Generator</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      padding: 2rem; 
      background: #f8fafc;
      color: #1e293b;
    }
    .container { max-width: 800px; margin: 0 auto; }
    h1 { color: #3b82f6; margin-bottom: 1rem; }
    .description { margin-bottom: 2rem; color: #64748b; }
    .favicon-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
      gap: 1.5rem; 
      margin-bottom: 2rem;
    }
    .favicon-item { 
      background: white; 
      padding: 1.5rem; 
      border-radius: 8px; 
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      text-align: center;
    }
    .favicon-item h3 { margin-bottom: 0.5rem; color: #3b82f6; }
    .favicon-item img { 
      border: 2px solid #e2e8f0; 
      border-radius: 4px;
      margin-bottom: 0.5rem;
    }
    .favicon-item p { font-size: 0.875rem; color: #64748b; }
    .instructions { 
      background: #dbeafe; 
      padding: 1.5rem; 
      border-radius: 8px; 
      border-left: 4px solid #3b82f6;
    }
    .instructions h3 { color: #1e40af; margin-bottom: 1rem; }
    .instructions ol { padding-left: 1.5rem; }
    .instructions li { margin-bottom: 0.5rem; }
    .status { 
      background: #dcfce7; 
      padding: 1rem; 
      border-radius: 8px; 
      border-left: 4px solid #16a34a;
      margin-bottom: 1rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎨 LoyaltyPro Favicon Generator</h1>
    <p class="description">Generate all necessary favicon files for your loyalty management system.</p>
    
    <div class="status">
      <strong>✅ Ready to generate!</strong> Your SVG favicon is available and ready to be converted to various sizes.
    </div>

    <div class="favicon-grid">
      <div class="favicon-item">
        <h3>16×16</h3>
        <img src="/favicon.svg" width="16" height="16" alt="16x16 favicon">
        <p>Standard browser favicon</p>
      </div>
      
      <div class="favicon-item">
        <h3>32×32</h3>
        <img src="/favicon.svg" width="32" height="32" alt="32x32 favicon">
        <p>High-DPI display favicon</p>
      </div>
      
      <div class="favicon-item">
        <h3>180×180</h3>
        <img src="/favicon.svg" width="180" height="180" alt="180x180 Apple Touch Icon">
        <p>iOS home screen icon</p>
      </div>
      
      <div class="favicon-item">
        <h3>192×192</h3>
        <img src="/favicon.svg" width="192" height="192" alt="192x192 Android Chrome">
        <p>Android Chrome icon</p>
      </div>
      
      <div class="favicon-item">
        <h3>512×512</h3>
        <img src="/favicon.svg" width="512" height="512" alt="512x512 Android Chrome">
        <p>Android Chrome icon (high-res)</p>
      </div>
    </div>
    
    <div class="instructions">
      <h3>📋 Generation Instructions</h3>
      <ol>
        <li><strong>Right-click</strong> on each image above</li>
        <li>Select <strong>"Save image as..."</strong></li>
        <li>Save with the exact filename shown in the title</li>
        <li>Place all files in the <code>public/</code> folder</li>
        <li>Your favicon setup will be complete!</li>
      </ol>
      
      <p style="margin-top: 1rem; font-weight: 500;">
        💡 <strong>Pro tip:</strong> Use an online favicon generator like favicon.io or realfavicongenerator.net for professional results.
      </p>
    </div>
  </div>
</body>
</html>
`;

// Create the enhanced HTML file
fs.writeFileSync(path.join(__dirname, 'public', 'favicon-generator.html'), htmlContent);

console.log('\n✅ Enhanced favicon generator created!');
console.log('🌐 Visit /favicon-generator.html to generate missing favicon files');
console.log('\n🎯 Your current favicon setup includes:');
console.log('   - favicon.ico (main favicon)');
console.log('   - favicon.svg (scalable vector)');
console.log('   - favicon-16x16.png');
console.log('   - favicon-32x32.png');
console.log('   - apple-touch-icon.png');
console.log('   - site.webmanifest (PWA support)');

if (missingFiles.length > 0) {
  console.log('\n📝 To complete your favicon setup, generate the missing files listed above.');
} 