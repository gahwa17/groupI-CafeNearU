const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { updateCommentDashboard } = require('./models/scheduleTask');
const client = require('./util/discord');
const { WebhookClient } = require('discord.js');

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Hello World From Cafe Near U');
});

const homeRoutes = require('./routes/homeRoute');
const customerRoutes = require('./routes/customerRoute');
const shopOwnerRoutes = require('./routes/shopOwnerRoute');
const shopRoutes = require('./routes/shopRoute');
const wishListRoutes = require('./routes/wishListRoute');

app.use('/api/1.0/home', homeRoutes);
app.use('/api/1.0/customers', customerRoutes);
app.use('/api/1.0/wishLists', wishListRoutes);
app.use('/api/1.0/shop-owners', shopOwnerRoutes);
app.use('/api/1.0/shops', shopRoutes);

const intervalTime = 30000; // 30s
updateCommentDashboard();
setInterval(updateCommentDashboard, intervalTime);

client.on('clientError', async (error) => {
  const guild = await client.guilds.fetch(process.env.DISCORD_SERVER_ID);
  const channel = await guild.channels.fetch(process.env.DISCORD_CHANNEL_ID);
  if (channel) {
    channel.send(`Client Error: ${error}`);
  }
});

client.on('serverError', async (error) => {
  const guild = await client.guilds.fetch(process.env.DISCORD_SERVER_ID);
  const channel = await guild.channels.fetch(process.env.DISCORD_CHANNEL_ID);
  if (channel) {
    channel.send(`Server Error: ${error}`);
  }
});

process.on('uncaughtException', async (error) => {
  try {
    const webhook = new WebhookClient({
      url: process.env.DISCORD_WEBHOOK_URL,
    });
    await webhook.send(`Uncaught Exception: ${error.message}`);
    console.log('Notification sent');
  } catch (sendError) {
    console.error('Error sending notification:', sendError.message);
  }
});

process.on('exit', async (error) => {
  try {
    const webhook = new WebhookClient({
      url: process.env.DISCORD_WEBHOOK_URL,
    });
    await webhook.send(`Uncaught Exception: ${error.message}`);
    console.log('Notification sent');
  } catch (sendError) {
    console.error('Error sending notification:', sendError.message);
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
