const mongoose = require('mongoose');

let connected = false;

exports.connect = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.log('MONGO_URI not set, skipping DB connection.');
    return;
  }

  if (connected) return;

  try {
    await mongoose.connect(uri, {
      // useNewUrlParser/useUnifiedTopology are default in mongoose 6+
      autoIndex: true,
    });
    connected = true;
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};

exports.disconnect = async () => {
  if (!connected) return;
  await mongoose.disconnect();
  connected = false;
};
