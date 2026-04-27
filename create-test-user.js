const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = 'mongodb://localhost:27017/inventory-system';

// Define User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  isEnabled: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function createTestUser() {
  try {
    console.log('Attempting to connect to MongoDB at:', MONGO_URI);
    
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Hash the password with bcrypt (10 rounds)
    const plainPassword = 'password123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    console.log('\n✓ Password hashed with bcrypt (10 rounds)');
    console.log('  Hashed Password:', hashedPassword);

    // Create the test user
    const testUser = {
      username: 'admin',
      email: 'admin@test.com',
      password: hashedPassword,
      role: 'Admin',
      isEnabled: true
    };

    // Insert user into database
    const user = await User.create(testUser);
    console.log('\n✓ Test user created successfully!');
    console.log('\nUser Details:');
    console.log('  ID:', user._id);
    console.log('  Username:', user.username);
    console.log('  Email:', user.email);
    console.log('  Role:', user.role);
    console.log('  Enabled:', user.isEnabled);
    console.log('  Created At:', user.createdAt);

    // Verify the password hash works
    const isPasswordValid = await bcrypt.compare(plainPassword, hashedPassword);
    console.log('\n✓ Password verification:', isPasswordValid ? 'PASSED' : 'FAILED');

    console.log('\n=== SUMMARY ===');
    console.log('Hashed Password:', hashedPassword);
    console.log('User successfully created and ready to use!');

    await mongoose.disconnect();
  } catch (error) {
    console.error('✗ Error:', error.message);
    if (error.message.includes('connect ECONNREFUSED')) {
      console.error('\n⚠ MongoDB is not running. Please ensure MongoDB server is running on localhost:27017');
    }
    process.exit(1);
  }
}

createTestUser();
