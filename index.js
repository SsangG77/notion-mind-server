require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const CLIENT_ID = process.env.NOTION_CLIENT_ID;
const CLIENT_SECRET = process.env.NOTION_CLIENT_SECRET;
const REDIRECT_URI = process.env.NOTION_REDIRECT_URI;
const APP_SCHEME = process.env.APP_URL_SCHEME;

let accessToken = null; // DB 또는 메모리 캐시에 저장 가능
let workspaceId = null;


// router
const authRouter = require('./routes/auth');
const dataRouter = require('./routes/data');


app.get('/', (req, res) => {
    res.send('Hello World');
});


// auth router
app.use('/auth', authRouter);
app.use('/data', dataRouter);



app.get('/notion/token', (req, res) => {
    if (!accessToken) {
        return res.status(400).json({ error: 'No access token available' });
    }
    res.json({ access_token: accessToken });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
