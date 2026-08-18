const app = require('./src/app');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5001;
const API_AUTH_TOKEN = process.env.API_AUTH_TOKEN || 'dev-token-12345';

// Export app for testing/verification scripts
module.exports = app;

if (require.main === module) {
  // Start server
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔑 Admin Secret Auth Token: ${API_AUTH_TOKEN}`);
  });
}
