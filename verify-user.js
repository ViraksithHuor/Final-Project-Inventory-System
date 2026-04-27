const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/inventory-system';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  isEnabled: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function verifyUser() {
  try {
    await mongoose.connect(MONGO_URI);
    
    const user = await User.findOne({ username: 'admin' });
    
    if (user) {
      console.log('✓ User found in database!');
      console.log('\nStored User Document:');
      console.log(JSON.stringify(user, null, 2));
    } else {
      console.log('✗ User not found');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

verifyUser();
