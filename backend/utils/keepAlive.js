const https = require('https');
const http = require('http');

// Keep Render server awake by pinging itself every 14 minutes
const KEEP_ALIVE_INTERVAL = 14 * 60 * 1000; // 14 minutes in milliseconds

const keepAlive = () => {
  // Get server URL from environment or use hardcoded production URL
  const getServerUrl = () => {
    if (process.env.RENDER_EXTERNAL_URL) {
      return process.env.RENDER_EXTERNAL_URL;
    }
    if (process.env.SERVER_URL) {
      return process.env.SERVER_URL;
    }
    // Fallback to production URL
    return 'https://loan-management-system-pxkz.onrender.com';
  };

  const serverUrl = getServerUrl();
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

  // Start pinging after 2 minutes (to let server fully start and get RENDER_EXTERNAL_URL)
  setTimeout(() => {
    const finalUrl = getServerUrl();
    console.log(`[Keep-Alive] Starting with URL: ${finalUrl}`);
    makeRequest();
    // Then ping every 14 minutes
    setInterval(makeRequest, KEEP_ALIVE_INTERVAL);
    console.log(`[Keep-Alive] Active. Pinging server every ${KEEP_ALIVE_INTERVAL / 60000} minutes`);
  }, 120000); // Wait 2 minutes before first ping to ensure RENDER_EXTERNAL_URL is available
};

module.exports = keepAlive;

