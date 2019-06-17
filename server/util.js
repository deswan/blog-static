const path = require('path');

function resolve(...name) {
    return path.resolve(__dirname, ...name)
}

function isEnStrikethrough(text){
    const regExp = /^([a-z0-9]+-)*([a-z0-9]+)$/;
    return regExp.test(text);
}

/**
 * 过滤meta文本
 * @param {String} mdText markdown文本
 * @return {String}
 */
function filterMeta(mdText) {
    return mdText.replace(/<!--\*([\s\S]*)\*-->/, '')
}

//Promise异步中间件错误捕获器
function wrap(fn){
    return (req, res, next) => fn(req, res, next).catch(console.log);
}


module.exports = {
    resolve,
    isEnStrikethrough,
    filterMeta,
    wrap
};