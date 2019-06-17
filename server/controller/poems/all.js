const dayjs = require('dayjs');
const config = require('../../../config');

module.exports = async function(req, res){

    let { totalPage } = await req.$model.getArticles({
        page: 1,
        pageSize: config.pageSize
    })
    let list = await Promise.all(Array(totalPage).fill().map(async (_, idx) => {
        let ret = await req.$model.getArticles({
            sort: ['meta.created_time', 'desc'],
            page: idx + 1,
            pageSize: config.pageSize
        })
        ret.items = ret.items.map(item => {
            return {
                name: item.meta.name,
                title: item.meta.title,
                created_date: dayjs(item.created_time).format('YYYY-MM-DD'),
            }
        })
        return ret;
    }))
    res.send({
        list
    });
}