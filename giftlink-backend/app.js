// app.js
require('dotenv').config();
const connectToDatabase = require('./models/db');
const { MongoClient } = require('mongodb');
const searchRoutes = require('./routes/searchRoutes');
const pinoLogger = require('./logger')
const express = require('express');
const cors = require('cors');
const path = require('path');

const {loadData} = require("./util/import-mongo/index");

const app = express();
app.use("*",cors());
const port = 3060;

app.use(express.static(path.join(__dirname, 'public')));

app.use('/app', express.static(path.join(__dirname, 'public', 'react-app')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/app/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'react-app', 'index.html'));
});

connectToDatabase().then(() => {
    pinoLogger.info('Connected to DB');
})
    .catch((e) => console.error('Failed to connect to DB', e));


app.use(express.json());

const giftRoutes = require('./routes/giftRoutes');
const authRoutes = require('./routes/authRoutes');
const pinoHttp = require('pino-http');
const logger = require('./logger');

app.use(pinoHttp({ logger }));

app.use('/api/gifts', giftRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);

app.get('/app/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'react-app', 'index.html'));
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});