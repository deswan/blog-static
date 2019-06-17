const dayjs = require('dayjs');

module.exports = async function(req, res){
    console.log('/articles request query', req.query)
    let items = await req.$model.getArticles({
        sort: ['meta.created_time', 'desc'],
    })
    items = items.map(item => {
        return {
            name: item.meta.name,
            title: item.meta.title,
            created_date: dayjs(item.meta.created_time).format('YYYY-MM-DD'),
            document: item.document
        }
    })
    res.send(items);
}