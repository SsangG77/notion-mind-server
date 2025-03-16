require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const CLIENT_ID = process.env.NOTION_CLIENT_ID;
const CLIENT_SECRET = process.env.NOTION_CLIENT_SECRET;
const REDIRECT_URI = process.env.NOTION_REDIRECT_URI;

let accessToken = null; // DB 또는 메모리 캐시에 저장 가능


app.get('/', (req, res) => {
    res.send('Hello World');
});


// ✅ Step 1: Notion OAuth 인증 요청 URL 제공
app.get('/auth/notion', (req, res) => {
    const notionAuthUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&owner=user`;
    res.redirect(notionAuthUrl);
});

// ✅ Step 2: Authorization Code 수신 및 Access Token 요청
app.get('/auth/callback', async (req, res) => {
    const { code } = req.query;
    console.log("Auth code: ", code)


    if (!code) {
        return res.status(400).json({ error: 'Authorization code not found' });
    }

    try {
        
        const response = await axios.post('https://api.notion.com/v1/oauth/token', {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI
        }, {
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
                'Content-Type': 'application/json'
            }
        });

        accessToken = response.data.access_token;
        res.json({ access_token: accessToken });
    } catch (error) {
        res.status(500).json({ error: 'Failed to exchange token', details: error.response.data });
    }
});

// ✅ Step 3: Access Token 제공 (Swift 앱에서 호출)
app.get('/notion/token', (req, res) => {
    if (!accessToken) {
        return res.status(400).json({ error: 'No access token available' });
    }
    res.json({ access_token: accessToken });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
