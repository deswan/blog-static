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


module.exports = {
    resolve,
    isEnStrikethrough,
    filterMeta
};