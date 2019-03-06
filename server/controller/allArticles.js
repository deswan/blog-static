
module.exports = async function(req, res){
    let ret = await req.$model.getArticles()
    res.send(ret);
}