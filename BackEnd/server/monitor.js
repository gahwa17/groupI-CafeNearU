const https = require('https');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const serverUrl = `https://13.211.10.154/`;
const checkInterval = 10000; // 10 sec

function performHealthCheck() {
  https
    .get(serverUrl, (res) => {
      const statusCode = res.statusCode;
      if (statusCode !== 200) {
        console.error(`Server is not responding. Status Code: ${statusCode}`);
      } else {
        console.log('Server is healthy.');
      }
    })
    .on('error', (err) => {
      console.error(`Error performing health check: ${err.message}`);
    });
}

setInterval(performHealthCheck, checkInterval);
