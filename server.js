const express = require('express');
const app = express();
const connectDB = require('./db/db');
const router = require('./routes/routes.js');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.use(express.json({ extended: false }));

//connection to the database
connectDB();

//Define Routes
app.use(router);

app.listen(PORT, () => console.log(`Server started on Port: ${PORT}`));