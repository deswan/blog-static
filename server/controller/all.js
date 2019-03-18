const dayjs = require('dayjs');
const config = require('../../config');

module.exports = async function(req, res){
    let { totalPage } = await req.$model.getArticles({
        page: 1,
        pageSize: config.pageSize
    })
    let list = await Promise.all(Array(totalPage).fill().map(async (_, idx) => {
        let ret = await req.$model.getArticles({
            sort: ['modified_time', 'desc'], 
            page: idx + 1,
            pageSize: config.pageSize
        })
        ret.items = ret.items.map(item => {
            return {
                name: item.name,
                title: item.title,
                modified_date: dayjs(item.modified_time).format('YYYY-MM-DD'),
            }
        })
        return ret;
    }))

    let items = await req.$model.getArticles();
    items = items.map(item => {
        return {
            name: item.name,
            title: item.title,
            modified_date: dayjs(item.modified_time).format('YYYY-MM-DD'),
            document: item.document
        }
    });
    res.send({
        list,
        items,
        totalPage
    });
}