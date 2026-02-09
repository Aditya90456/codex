// Test if bookmarks routes can be loaded
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

console.log('🧪 Testing bookmarks route loading...\n');

try {
  const bookmarksRoutes = require('./backend/routes/bookmarks.js');
  console.log('✅ Bookmarks routes loaded successfully');
  console.log('   Type:', typeof bookmarksRoutes);
  console.log('   Is Router:', bookmarksRoutes.constructor.name);
  
  // Check if it has routes
  if (bookmarksRoutes.stack) {
    console.log(`   Routes defined: ${bookmarksRoutes.stack.length}`);
    bookmarksRoutes.stack.forEach((layer, i) => {
      if (layer.route) {
        const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
        console.log(`   ${i + 1}. ${methods} ${layer.route.path}`);
      }
    });
  }
  
  console.log('\n✅ Bookmarks module is valid!');
} catch (error) {
  console.error('❌ Error loading bookmarks routes:', error.message);
  console.error(error.stack);
}
