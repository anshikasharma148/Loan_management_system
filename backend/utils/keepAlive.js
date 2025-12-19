const https = require('https');
const http = require('http');

// Keep Render server awake by pinging itself every 14 minutes
const KEEP_ALIVE_INTERVAL = 14 * 60 * 1000; // 14 minutes in milliseconds

const keepAlive = () => {
  // Get server URL from environment or use default
  const serverUrl = process.env.RENDER_EXTERNAL_URL || 
                    process.env.SERVER_URL || 
                    'https://loan-management-system-xcuu.onrender.com';
  
  const url = `${serverUrl}/api/keep-alive`;
  const isHttps = url.startsWith('https');
  const client = isHttps ? https : http;

  const makeRequest = () => {
    try {
      const req = client.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          console.log(`[Keep-Alive] Server pinged successfully at ${new Date().toISOString()}`);
        });
      });

      req.on('error', (error) => {
        console.error(`[Keep-Alive] Error: ${error.message}`);
      });

      req.setTimeout(10000, () => {
        req.destroy();
        console.error('[Keep-Alive] Request timeout');
      });
    } catch (error) {
      console.error(`[Keep-Alive] Request failed: ${error.message}`);
    }
  };

  // Start pinging after 1 minute (to let server fully start)
  setTimeout(() => {
    makeRequest();
    // Then ping every 14 minutes
    setInterval(makeRequest, KEEP_ALIVE_INTERVAL);
    console.log(`[Keep-Alive] Started. Pinging server every ${KEEP_ALIVE_INTERVAL / 60000} minutes`);
  }, 60000); // Wait 1 minute before first ping
};

module.exports = keepAlive;

