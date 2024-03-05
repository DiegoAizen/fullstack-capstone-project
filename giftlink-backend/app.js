// app.js
require('dotenv').config();
const connectToDatabase = require('./models/db');
const { MongoClient } = require('mongodb');
const searchRoutes = require('./routes/searchRoutes');
const pinoLogger = require('./logger')
const express = require('express');
const path = require('path');
const app = express();
const port = 3050;

app.use('/api/search', searchRoutes);

app.use(express.static(path.join(__dirname, 'public')));

// Serve static files for React App from a subdirectory
app.use('/app', express.static(path.join(__dirname, 'public', 'react-app')));


// Route for Home Page - Serve home.html as the default page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Serve the React app's index.html for any other requests under /app
app.get('/app/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'react-app', 'index.html'));
});


// Connect to MongoDB; we just do this one time
connectToDatabase().then(() => {
    pinoLogger.info('Connected to DB');
})
    .catch((e) => console.error('Failed to connect to DB', e));


app.use(express.json());

// Route files
const giftRoutes = require('./routes/giftRoutes');
const authRoutes = require('./routes/authRoutes');
const searchRoutes = require('./routes/searchRoutes');
const pinoHttp = require('pino-http');
const logger = require('./logger');

app.use(pinoHttp({ logger }));

// Use Routes
app.use('/api/gifts', giftRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);

// Default Route for React App
app.get('/app/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'react-app', 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});