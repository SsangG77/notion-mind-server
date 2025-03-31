
//라이브러리
require('dotenv').config();
const express = require('express');
const axios = require('axios');

const router = express.Router();

//모듈
const { saveData } = require('../etc/saveData');


// env
const CLIENT_ID = process.env.NOTION_CLIENT_ID;
const CLIENT_SECRET = process.env.NOTION_CLIENT_SECRET;
const REDIRECT_URI = process.env.NOTION_REDIRECT_URI;
const APP_SCHEME = process.env.APP_URL_SCHEME;

//현재 시간
const now = new Date();

//변수
let botId = null;
let auth_result = null;


router.get("/notion", (req, res) => {
    const notionAuthUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}/callback&response_type=code&owner=user`;
    res.redirect(notionAuthUrl);
});


router.get("/callback", async (req, res) => {
    const { code } = req.query;


    if (!code) {
        return res.status(400).json({ error: 'Authorization code not found' });
    }

    try {
        
        const response = await axios.post('https://api.notion.com/v1/oauth/token', {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI+ "/callback"
        }, {
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
                'Content-Type': 'application/json'
            }
        });
        console.log(`===================== (/auth/callback) ${now} ==========================`);
        accessToken = response.data.access_token;
        console.log("accessToken : ", accessToken);
        
        botId = response.data.bot_id;
        console.log("bot_id : ", botId);

        saveData(botId, accessToken);

        auth_result = true
        console.log("auth_result : ", auth_result);

        // console.log("data : ", response.data);


        res.redirect(`${APP_SCHEME}result?success=${auth_result}&bot_id=${botId}`);

    } catch (error) {
        auth_result = true
        res.redirect(`${APP_SCHEME}result?success=${auth_result}&bot_id=${botId}`);
        // res.status(500).json({ error: 'Failed to exchange token', details: error.response.data });
    }

});


module.exports = router;