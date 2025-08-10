const mongoose = require('mongoose');
require('dotenv').config();

async function checkDatabase() {
  try {
    console.log('🔍 Checking database connection...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ewaste-management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📚 Collections in database:', collections.map(c => c.name));
    
    // Check users collection
    const User = require('./models/User');
    const userCount = await User.countDocuments();
    console.log('👥 Users count:', userCount);
    
    // Check batches collection
    const Batch = require('./models/Batch');
    const batchCount = await Batch.countDocuments();
    console.log('📦 Batches count:', batchCount);
    
    // If no users, database needs seeding
    if (userCount === 0) {
      console.log('⚠️  No users found - database needs seeding');
    }
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Database check failed:', error);
    process.exit(1);
  }
}

checkDatabase();
