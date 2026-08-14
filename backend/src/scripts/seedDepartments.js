require('dotenv').config();
const mongoose = require('mongoose');
const Department = require('../models/Department');

const DEPARTMENTS = [
  {
    name: 'Roads & Infrastructure Department',
    code: 'DEPT_ROADS',
    category: 'ROADS',
    description: 'Handles potholes, road maintenance, asphalt paving, and traffic signals.',
    isActive: true
  },
  {
    name: 'Sanitation & Waste Management Department',
    code: 'DEPT_SANITATION',
    category: 'SANITATION',
    description: 'Handles garbage collection, street sweeping, and public waste disposal.',
    isActive: true
  },
  {
    name: 'Electricity & Power Department',
    code: 'DEPT_ELECTRICITY',
    category: 'ELECTRICITY',
    description: 'Handles streetlights, electrical wires, power outages, and grid infrastructure.',
    isActive: true
  },
  {
    name: 'Water Supply Department',
    code: 'DEPT_WATER',
    category: 'WATER',
    description: 'Handles water pipelines, supply disruptions, leakages, and water quality issues.',
    isActive: true
  },
  {
    name: 'Public Property & Parks Department',
    code: 'DEPT_PUBLIC_PROPERTY',
    category: 'PUBLIC_PROPERTY',
    description: 'Handles public benches, community parks, municipal buildings, and public fixtures.',
    isActive: true
  },
  {
    name: 'Drainage & Sewage Department',
    code: 'DEPT_DRAINAGE',
    category: 'DRAINAGE',
    description: 'Handles storm drains, sewage overflows, clogs, and waterlogging prevention.',
    isActive: true
  },
  {
    name: 'General & Civic Services Department',
    code: 'DEPT_OTHER',
    category: 'OTHER',
    description: 'Handles miscellaneous civic issues, general municipal inquiries, and uncategorized matters.',
    isActive: true
  }
];

const seedDepartments = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('Configuration Error: MONGODB_URI environment variable is missing.');
    process.exitCode = 1;
    return;
  }

  let isConnected = false;

  try {
    await mongoose.connect(mongoUri);
    isConnected = true;
    console.log('Database connected for department seeding.');

    for (const deptData of DEPARTMENTS) {
      const existing = await Department.findOne({ code: deptData.code });
      if (existing) {
        // Ensure active and sync category
        existing.name = deptData.name;
        existing.category = deptData.category;
        existing.description = deptData.description;
        existing.isActive = deptData.isActive;
        await existing.save();
        console.log(`Department '${deptData.name}' (${deptData.category}) synchronized.`);
      } else {
        await Department.create(deptData);
        console.log(`Department '${deptData.name}' (${deptData.category}) created.`);
      }
    }

    console.log('Department seeding completed successfully.');
    process.exitCode = 0;
  } catch (error) {
    console.error('Error during department seeding:', error.message);
    process.exitCode = 1;
  } finally {
    if (isConnected || mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('Database connection closed cleanly.');
    }
  }
};

seedDepartments();
