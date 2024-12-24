const mongoose = require('mongoose');

const connectToDatabase = async () => {
  try {
      await mongoose.connect('mongodb://127.0.0.1:27017/winneraddaa');
      console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit the application if unable to connect to MongoDB
  }
};

module.exports = connectToDatabase;