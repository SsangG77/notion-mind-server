//라이브러리
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { Client } = require('@notionhq/client');

//라우터
const router = express.Router();

///현재
const now = new Date();

//다른 파일 모듈
const { getData } = require('../etc/saveData');
const { restructurePage } = require('../etc/restructure');


// 요청객체에 있는 bot_id로 notion에 데이터를 요청한다.
router.get("/database", (req, res) => {
    console.log(`===================== (/data/database) ${now} ==========================`);
    // const { bot_id } = req.query;
    const botId = "cd1a1db4-7326-45a1-be9c-ff8937ade982";
    const accessToken = getData(botId);
    if (!botId) {
        return res.status(400).json({ error: 'Bot ID not found' });
    }

    const notion = new Client({ auth: accessToken });

    (async () => {
        const response = await notion.search({
            filter: {
                value: 'database',
                property: 'object'
              },
        });
        // console.log(response);
        response.results.map((db) => {
            console.log("title : ", db.title[0].plain_text);
        });
      })();
}); // /database


router.get("/page", (req, res) => {
    console.log(`===================== (/data/page) ${now} ==========================`);
    // const { bot_id } = req.query;
    const botId = "cd1a1db4-7326-45a1-be9c-ff8937ade982";
    const accessToken = getData(botId);
    if (!botId) {
        return res.status(400).json({ error: 'Bot ID not found' });
    }

    const notion = new Client({ auth: accessToken });

    (async () => {
        const response = await notion.search({
            filter: {
                value: 'page',
                property: 'object'
              },
        });

        const results = [];
        response.results.map((page) => {
            let result = restructurePage(page);
            results.push(result);
        });
        // console.log(results);
       res.send(results);
    })();
    
});






module.exports = router;