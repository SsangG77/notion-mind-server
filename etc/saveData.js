const fs = require("fs");
const filePath = "./etc/data.json";

// 데이터 저장 함수
function saveData(key, value) {
    let data = {};
    if (fs.existsSync(filePath)) {
        data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    }
    data[key] = value;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// 데이터 불러오기 함수
function getData(key) {
    if (!fs.existsSync(filePath)) return null;
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return data[key] || null;
}

// // 사용 예시
// saveData("username", "JohnDoe");
// console.log(getData("username")); // "JohnDoe"

module.exports = { saveData, getData };