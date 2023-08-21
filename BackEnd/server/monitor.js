const https = require('https');
const { WebhookClient } = require('discord.js');
require('dotenv').config();

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const serverUrl = `https://13.211.10.154/`;
const checkInterval = 180000;

function performHealthCheck() {
  https
    .get(serverUrl, async (res) => {
      const statusCode = res.statusCode;
      const webhook = new WebhookClient({
        url: process.env.DISCORD_WEBHOOK_URL,
      });
      if (statusCode !== 200) {
        try {
          await webhook.send(
            `Server is not responding. Status Code: ${statusCode}`,
          );
        } catch (sendError) {
          console.error('Error sending notification:', sendError.message);
        }
      } else {
        console.log('Server is healthy.');
      }
    })
    .on('error', (err) => {
      console.error(`Error performing health check: ${err.message}`);
    });
}

setInterval(performHealthCheck, checkInterval);
