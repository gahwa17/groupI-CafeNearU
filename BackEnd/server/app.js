const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { updateCommentDashboard } = require('./models/scheduleTask');

const app = express();

app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Hello World From Cafe Near U');
});

const homeRoutes = require('./routes/homeRoute');
const customerRoutes = require('./routes/customerRoute');
const shopOwnerRoutes = require('./routes/shopOwnerRoute');
const shopRoutes = require('./routes/shopRoute');
const wishListRoutes = require('./routes/wishListRoute');
const resetPasswordRoutes = require('./routes/resetPasswordRoute');

app.use('/api/1.0/home', homeRoutes);
app.use('/api/1.0/customers', customerRoutes);
app.use('/api/1.0/customers', resetPasswordRoutes);
app.use('/api/1.0/wishLists', wishListRoutes);
app.use('/api/1.0/shop-owners', shopOwnerRoutes);
app.use('/api/1.0/shops', shopRoutes);

const intervalTime = 12 * 60 * 60 * 1000; // 12 hours
updateCommentDashboard();
setInterval(updateCommentDashboard, intervalTime);

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
