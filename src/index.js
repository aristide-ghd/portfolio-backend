require('dotenv').config();
const app = require('./app');
const db = require('./db');

const PORT = process.env.PORT || 5001;

(async () => {
  try {
    await db.connect();
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
})();
