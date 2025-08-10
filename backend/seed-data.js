const mongoose = require('mongoose');
const Batch = require('./models/Batch');
const User = require('./models/User');
require('dotenv').config();

// Sample data
const sampleBatches = [
  {
    batchId: 'GE-123-CINC-12252024',
    batchName: 'GE Aviation IT Equipment',
    contactPerson: 'John Smith',
    pickupLocation: 'Cincinnati, OH - Building A',
    department: 'IT Department',
    requestDate: new Date('2024-12-25'),
    status: 'pending',
    notes: 'IT equipment refresh cycle',
    items: []
  },
  {
    batchId: 'UC-456-CINC-12242024',
    batchName: 'University Hospital Medical Equipment',
    contactPerson: 'Dr. Sarah Johnson',
    pickupLocation: 'University of Cincinnati Medical Center',
    department: 'Radiology',
    requestDate: new Date('2024-12-24'),
    status: 'in_progress',
    notes: 'Medical equipment disposal',
    items: [
      {
        itemName: 'X-Ray Machine',
        modelSerial: 'XR-2020-001',
        quantity: 2,
        condition: 'non_working',
        stockType: 'medical',
        estimatedValue: 5000,
        co2Estimate: 150,
        priority: 'high',
        description: 'Old X-ray machines from radiology department'
      },
      {
        itemName: 'Ultrasound Equipment',
        modelSerial: 'US-2018-003',
        quantity: 1,
        condition: 'working',
        stockType: 'medical',
        estimatedValue: 8000,
        co2Estimate: 200,
        priority: 'medium',
        description: 'Functional ultrasound machine for parts'
      }
    ]
  },
  {
    batchId: 'PG-789-CINC-12232024',
    batchName: 'P&G Office Electronics',
    contactPerson: 'Mike Wilson',
    pickupLocation: 'Procter & Gamble Headquarters',
    department: 'Facilities',
    requestDate: new Date('2024-12-23'),
    status: 'completed',
    notes: 'Office equipment refresh',
    items: [
      {
        itemName: 'Desktop Computers',
        modelSerial: 'Dell-Optiplex-7050',
        quantity: 25,
        condition: 'working',
        stockType: 'it',
        estimatedValue: 12500,
        co2Estimate: 500,
        priority: 'medium',
        description: 'Office desktops from recent upgrade'
      },
      {
        itemName: 'Monitors',
        modelSerial: 'Dell-P2419H',
        quantity: 30,
        condition: 'working',
        stockType: 'it',
        estimatedValue: 9000,
        co2Estimate: 300,
        priority: 'medium',
        description: 'LCD monitors in good condition'
      }
    ]
  },
  {
    batchId: 'CHM-321-CINC-12222024',
    batchName: 'Cincinnati Children\'s IT Refresh',
    contactPerson: 'Lisa Brown',
    pickupLocation: 'Cincinnati Children\'s Hospital',
    department: 'Information Services',
    requestDate: new Date('2024-12-22'),
    status: 'pending',
    notes: 'IT infrastructure upgrade',
    items: []
  }
];

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ewaste-management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Create a test admin user if it doesn't exist
    let adminUser = await User.findOne({ email: 'admin@ewaste.com' });
    if (!adminUser) {
      adminUser = new User({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@ewaste.com',
        password: 'admin123',
        role: 'admin',
        organizationName: 'E-Waste Management',
        permissions: ['manage_batches', 'manage_items', 'manage_users']
      });
      await adminUser.save();
      console.log('✅ Created admin user');
    }

    // Create a test partner user if it doesn't exist
    let partnerUser = await User.findOne({ email: 'partner@ge.com' });
    if (!partnerUser) {
      partnerUser = new User({
        firstName: 'John',
        lastName: 'Smith',
        email: 'partner@ge.com',
        password: 'partner123',
        role: 'partner',
        organizationName: 'GE Aviation'
      });
      await partnerUser.save();
      console.log('✅ Created partner user');
    }

    // Clear existing batches
    await Batch.deleteMany({});
    console.log('✅ Cleared existing batches');

    // Create sample batches
    const createdBatches = [];
    for (const batchData of sampleBatches) {
      const batch = new Batch({
        ...batchData,
        createdBy: batchData.batchName.includes('GE') ? partnerUser._id : adminUser._id,
        items: batchData.items.map(item => ({
          ...item,
          addedBy: batchData.batchName.includes('GE') ? partnerUser._id : adminUser._id
        }))
      });
      await batch.save();
      createdBatches.push(batch);
    }

    console.log(`✅ Created ${createdBatches.length} sample batches`);
    console.log('🎉 Database seeded successfully!');

    // Display created batches
    console.log('\n📋 Created Batches:');
    createdBatches.forEach(batch => {
      console.log(`- ${batch.batchId}: ${batch.batchName} (${batch.status})`);
    });

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the seed function
seedData();
