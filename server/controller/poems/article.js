const dayjs = require('dayjs');

module.exports = async function(req, res){
    let item = req.$model.getArticleByName(req.query.id);
    let ret = {
        name: item.name,
        title: item.meta.title,
        created_date: dayjs(item.meta.created_time).format('YYYY-MM-DD'),
        document: item.document
    }
    res.send(ret);
}