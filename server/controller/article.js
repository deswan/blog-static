const dayjs = require('dayjs');

module.exports = async function(req, res){
    console.log('request article id', req.query)
    let item = req.$model.getArticleByName(req.query.id);
    let ret = {
        name: item.name,
        title: item.title,
        modified_date: dayjs(item.modified_time).format('YYYY-MM-DD'),
        document: item.document
    }
    res.send(ret);
}