require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedAdmin = async () => {
  // 1. Explicit bootstrap protection flag check (before DB connection)
  if (process.env.ADMIN_SEED_ENABLED !== 'true') {
    console.error(
      'Security Notice: Admin seeding is disabled.\n' +
      'To run this development seed script, set ADMIN_SEED_ENABLED=true in your .env file.'
    );
    process.exitCode = 1;
    return;
  }

  // 2. Production safety check (before DB connection)
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.ALLOW_PRODUCTION_ADMIN_SEED !== 'true'
  ) {
    console.error(
      'Security Error: Admin seeding is blocked in production by default.\n' +
      'Direct development seeding cannot be executed in production.'
    );
    process.exitCode = 1;
    return;
  }

  // 3. Validate MONGODB_URI
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('Configuration Error: MONGODB_URI environment variable is missing.');
    process.exitCode = 1;
    return;
  }

  // 4. Validate and normalize ADMIN_EMAIL
  const rawEmail = process.env.ADMIN_EMAIL;
  if (!rawEmail || !rawEmail.trim()) {
    console.error('Validation Error: ADMIN_EMAIL environment variable is required.');
    process.exitCode = 1;
    return;
  }

  const normalizedEmail = rawEmail.toLowerCase().trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    console.error('Validation Error: ADMIN_EMAIL has an invalid email format.');
    process.exitCode = 1;
    return;
  }

  // 5. Validate ADMIN_PASSWORD
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error('Validation Error: ADMIN_PASSWORD environment variable is required.');
    process.exitCode = 1;
    return;
  }

  if (adminPassword.length < 8) {
    console.error(
      'Validation Error: ADMIN_PASSWORD is too weak. It must be at least 8 characters long.'
    );
    process.exitCode = 1;
    return;
  }

  // 6. Validate ADMIN_NAME
  const adminName = (process.env.ADMIN_NAME || 'CitySeva Admin').trim();
  if (!adminName) {
    console.error('Validation Error: ADMIN_NAME cannot be empty.');
    process.exitCode = 1;
    return;
  }

  let isConnected = false;

  try {
    // 7. Connect to database
    await mongoose.connect(mongoUri);
    isConnected = true;
    console.log('Database connected for admin seeding check.');

    // 8. Check existing user in MongoDB
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      if (existingUser.role === 'ADMIN') {
        // CASE 2: Already an admin -> safe idempotent no-op
        console.log(`Admin account with email (${normalizedEmail}) already exists. No modification needed.`);
        process.exitCode = 0;
      } else {
        // CASE 3: Account exists but is CITIZEN -> STRICT REJECTION
        console.error(
          `Security Rejection: An existing user with email (${normalizedEmail}) has role '${existingUser.role}'.\n` +
          `Automatic privilege escalation from an existing account to ADMIN is strictly prohibited.`
        );
        process.exitCode = 1;
      }
    } else {
      // CASE 1: Account does not exist -> Create new ADMIN
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      const newAdmin = new User({
        name: adminName,
        email: normalizedEmail,
        password: hashedPassword,
        role: 'ADMIN'
      });

      await newAdmin.save();
      console.log(`Admin account (${normalizedEmail}) created successfully with role ADMIN.`);
      process.exitCode = 0;
    }
  } catch (error) {
    console.error('Database/Seeding Error: An error occurred during admin seeding.', error.message);
    process.exitCode = 1;
  } finally {
    if (isConnected || mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('Database connection closed cleanly.');
    }
  }
};

seedAdmin();
