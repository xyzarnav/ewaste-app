const mongoose = require('mongoose');
const Batch = require('./models/Batch');
require('dotenv').config();

async function checkDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ewaste-management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Check if there are any batches
    const batchCount = await Batch.countDocuments();
    console.log(`📊 Total batches in database: ${batchCount}`);

    if (batchCount > 0) {
      const batches = await Batch.find().limit(5);
      console.log('\n📋 Sample batches:');
      batches.forEach(batch => {
        console.log(`- ${batch.batchId}: ${batch.batchName} (${batch.status})`);
      });
    } else {
      console.log('📭 No batches found in database');
    }

  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

checkDatabase();
