const dayjs = require('dayjs');

module.exports = async function(req, res){
    let item = req.$model.getArticleByName(req.query.id);
    let ret = {
        name: item.name,
        title: item.meta.title,
        modified_date: dayjs(item.meta.modified_time).format('YYYY-MM-DD'),
        document: item.document
    }
    res.send(ret);
}