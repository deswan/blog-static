const dayjs = require('dayjs');
const config = require('../../config');

module.exports = async function(req, res){
    console.log('/articles request query', req.query)
    let ret = await req.$model.getArticles({
        sort: ['modified_time', 'desc'], 
        page: req.query.page || 1,
        pageSize: config.pageSize
    })
    ret.items = ret.items.map(item => {
        return {
            name: item.name,
            title: item.title,
            modified_date: dayjs(item.modified_time).format('YYYY-MM-DD'),
        }
    })
    res.send(ret);
}