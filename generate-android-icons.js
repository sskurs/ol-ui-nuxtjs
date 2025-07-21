// generate-android-icons.js
// -----------------------------------------------------------
// Script to generate Android Chrome icons from existing favicon
// -----------------------------------------------------------

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const androidIconSizes = [
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 }
];

console.log('🤖 Generating Android Chrome icons...');
console.log('=====================================');

const sourcePath = path.join(__dirname, 'public', 'favicon-32x32.png');
const publicDir = path.join(__dirname, 'public');

// Check if source PNG exists
if (!fs.existsSync(sourcePath)) {
  console.error('❌ favicon-32x32.png not found in public directory');
  process.exit(1);
}

async function generateAndroidIcons() {
  try {
    for (const { name, size } of androidIconSizes) {
      const outputPath = path.join(publicDir, name);
      
      console.log(`📱 Generating ${name} (${size}x${size})...`);
      
      await sharp(sourcePath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 } // Transparent background
        })
        .png()
        .toFile(outputPath);
      
      const stats = fs.statSync(outputPath);
      console.log(`   ✅ Created ${name} (${(stats.size / 1024).toFixed(1)}KB)`);
    }
    
    console.log('\n🎉 Android Chrome icons generated successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Update your site.webmanifest to include the new icons');
    console.log('   2. Test your PWA on Android devices');
    console.log('   3. Your favicon setup is now complete!');
    
  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
    process.exit(1);
  }
}

generateAndroidIcons(); 