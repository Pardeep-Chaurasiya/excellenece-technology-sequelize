const express = require('express');
require('dotenv').config();
require('./config/db');
const bodyParser = require('body-parser');
const sequelize = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(bodyParser.json());
app.use('/', userRoutes);
app.use('/', authRoutes);

const PORT = process.env.PORT || 4000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.info('Server is running on port 4000');
    console.info('Databse Connected successfully');
  });
});
