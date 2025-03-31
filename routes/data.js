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
router.post("/database", (req, res) => {
    console.log(`===================== (/data/database) ${now} ==========================`);
    const { botId } = req.body;
    console.log(req.body);
    console.log("botId : ", botId);
    // const botId = "cd1a1db4-7326-45a1-be9c-ff8937ade982";
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

        console.log("response : ", response);
        
        let databases = response.results.map((db) => {
            let id = db.id;
            // let title = db.title[0].plain_text;
            let title = db.title.length != 0 ? db.title[0].plain_text : "제목 없음";
            return { id, title };
        });
        console.log("databaseNames : ", databases);
        res.send(databases);
      })();
}); // /database


router.post("/nodes", (req, res) => {
    console.log(`===================== (/data/nodes) ${new Date()} ==========================`);
    const { botId, nodes } = req.body;
    
    console.log("botId : ", botId);
    console.log("nodes : ", nodes); 

    const accessToken = getData(botId);
    if (!botId) {
        return res.status(400).json({ error: 'Bot ID not found' });
    }

    const notion = new Client({ auth: accessToken });

    (async () => {
        try {
            const response = await notion.search({
                filter: {
                    value: 'page',
                    property: 'object'
                },
            });

            let deleteIdsArr = [];
            let editNodesArr = [];
            let newNodesArr = [];

            console.log("response length : ", response.results.length);

            nodes.forEach((node) => {
                const exists = response.results.some(page => page.id === node.id);
                if (!exists) deleteIdsArr.push(node.id);
            });

            nodes.forEach((node) => {
                response.results.forEach((page) => {
                    if (node.id === page.id && node.lastEdit !== page.last_edited_time.split('.')[0] + 'Z') {
                        const restructPage = restructurePage(page);
                        if (!editNodesArr.some(editNode => editNode.id === restructPage.id)) {
                            editNodesArr.push(restructPage);
                        }
                    }
                });
            });

            response.results.forEach((page) => {
                const exists = nodes.some(node => node.id === page.id);
                if (!exists && !newNodesArr.some(newNode => newNode.id === page.id)) {
                    const restructPage = restructurePage(page);
                    newNodesArr.push(restructPage);
                }
            });

            const result = {
                deleteIds: deleteIdsArr,
                editNodes: editNodesArr,
                newNodes: newNodesArr
            };

            console.log("result : ", result);
            res.send(result);

        } catch (err) {
            console.error("서버 오류:", err);
            res.status(500).json({ error: "서버 처리 중 오류 발생" });
        }
    })();
});




module.exports = router;