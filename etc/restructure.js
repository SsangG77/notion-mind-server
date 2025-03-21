
function restructurePage(page) {

    // const prop = page.properties
     const propArr = Object.entries(page.properties) // [속성 이름, 속성 값]의 배열로 변환

    const pageTitle = propArr
                    .filter(([_, value]) => value.type === 'title') //매개 변수로 [키, 값]을 받아서 값이 'title'인 것만 필터링]
                    .flatMap(([_, value]) => value.title.map(item => item.plain_text)) // [키, 값] 배열을 [값] 배열로 변환)
                    .find(_ => true)

    const id = page.id
    const icon = page.icon.type == 'emoji' ? page.icon.emoji : ""
    const cover = page.cover != null ? page.cover.type == 'external' ? page.cover.external.url : page.cover.file.url : null
    const parent = page.parent.database_id
    const properties = [];

    const excluedeTypes = ['title', 'file', 'rollup'];
    propArr
    .filter(([_, value]) => !excluedeTypes.includes(value.type)) //매개 변수로 [키, 값]을 받아서 값이 'title'인 것만 필터링]
    .map(([name, value]) => {
        let propValue = Object.entries(value)[2][1]
        let result = null;
        switch(value.type) {
            case 'relation': // 문자열 배열
                result = propValue.map((item) => {
                    return {
                        id: value.id,
                        name: item.id,
                        color: "clear"
                    }
                })
                break
           
            case 'rich_text': // 단일 문자열 배열
                result = [{
                    id: value.id,
                    name: propValue[0].text.content,
                    color: "clear" 
                }]
                break

            case 'select': // 단일 객체 배열
                result = [propValue]
                break

            case 'multi_select': // 객체 배열
                result = propValue
                break

            case 'date': // 문자열 배열
                result = [{
                    id: value.id,
                    name: propValue.start + (propValue.end != null ? " -> "+propValue.end : ""),
                    color: "clear"
                }]
                break

            case 'people': // 문자열 배열
                result = propValue.map((item) => {
                    return {
                        id: item.id,
                        name: item.name,
                        color: "clear"
                    }
                })
                break

            case 'formula': //
                result = [{
                    id: value.id,
                    name: restructureFormula(propValue),
                    color: "clear"
                }]
                break

            case 'status': // 단일 객체 배열
                result = [{
                    id: propValue.id,
                    name: propValue.name,
                    color: propValue.color
                }]
                break

            default:
                result = [{
                    id: value.id,
                    name: propValue.toString(),
                    color: "clear"
                }]
                break
        };
        let propResult = {
            type: value.type,
            name: name.toString(),
            value: result
        }         

        properties.push(propResult);
    });


    return {
        id: id,
        parentId: parent,
        icon: icon,
        cover: cover,
        title: pageTitle,
        property: properties,
        rect: null
    }

}


function restructureFormula(formulaValue) {

    let result = null;
    switch(formulaValue.type) {
        case 'date':
            result = Object.values(formulaValue)[1].start
             + (Object.values(formulaValue)[1].end != null ? " -> "+Object.values(formulaValue)[1].end : "");
            break

        default:
        result = Object.values(formulaValue)[1];
    };
    return result.toString();
}

module.exports = { restructurePage };