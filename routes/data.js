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

        

        // restructurePage(response.results[17]);

        response.results.map((page) => {
            restructurePage(page);
        });
       res.send(response);
      })();
    
});




function restructurePage(page) {

    const prop = page.properties

     
     const propArr = Object.entries(prop) // [속성 이름, 속성 값]의 배열로 변환

    const title = propArr
                    .filter(([_, value]) => value.type === 'title') //매개 변수로 [키, 값]을 받아서 값이 'title'인 것만 필터링]
                    .flatMap(([_, value]) => value.title.map(item => item.plain_text)) // [키, 값] 배열을 [값] 배열로 변환)
                    .find(_ => true)
     
     // title
    console.log(`========================================== ${title} ==========================================`);


    // id
    const id = page.id
    console.log("id: ",id);

    // icon
    const icon = page.icon
    console.log("icon: ",icon);

    // cover
    const cover = page.cover
    console.log("cover: ",cover);

    // parent
    const parent = page.parent.database_id
    console.log("paren_id : ",parent);



    // prop
    // console.log(propArr)


    const excluedeTypes = ['title', 'file', 'rollup'];
    propArr
    .filter(([_, value]) => !excluedeTypes.includes(value.type)) //매개 변수로 [키, 값]을 받아서 값이 'title'인 것만 필터링]
    .map(([name, value]) => {
        console.log(`-------------------------------------------------- ${name} : ${value.type}`);
        console.log("value : ", value);
        let propValue = Object.entries(value)[2][1]
        console.log("propValue : ", propValue);
        switch(value.type) {
            case 'relation': //
                break

            case 'rich_text': //
                break

            case 'select': //
                break

            case 'multi_select': //

                break

            case 'date': //
                break

            case 'people': //
                break

            case 'formula': //
                break

            case 'status': //
                break

            default:
                console.log("propValue : ", propValue);

            // case 'file':
            //     break

        };
    });

    console.log("============================================================================== \n");


    

   

    


}




module.exports = router;