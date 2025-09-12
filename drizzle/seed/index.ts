import { seedLessons } from './lessons.seed';
import { seedPlatformData } from './platform.seed';

async function runAllSeeds() {
  console.log('🌱 Starting database seeding...');
  
  try {
    // Run lessons seeding
    await seedLessons();
    
    // Run platform data seeding
    await seedPlatformData();
    
    console.log('✅ All seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  runAllSeeds()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { runAllSeeds };