const config = require('../../config');
const fs = require('fs-extra');
const path = require('path');
const util = require('../util');
const chokidar = require('chokidar');
const md_meta = require('markdown-meta')
const prism = require('markdown-it-prism');
var md = require('markdown-it')({
  linkify: true
})
md.use(prism, {
    defaultLanguage: 'javascript'
});

async function readFile(file) {
    let filePath = path.resolve(config.markdownDir, file);
    let fileContent = await fs.readFile(filePath, 'utf-8');
    let meta = md_meta.parse(fileContent);
    let document = md.render(util.filterMeta(fileContent));
    return {
        meta,
        document
    }
}

function watch(cb) {
    console.log('开始监听数据源文件夹')
    chokidar.watch(config.markdownDir, {
        ignored: /(^|[\/\\])\../,
        ignoreInitial: true
    }).on('all', (event, path) => {
        console.log(event, path);
        readData().then(data => cb(null, data)).catch(cb);
    });
}

async function readData() {
    if (!(
            await fs.exists(config.markdownDir) &&
            (await fs.stat(config.markdownDir)).isDirectory()
        )) {
        throw new Error('数据池路径配置错误');
    }

    let files = await fs.readdir(config.markdownDir);

    let newPool = {};

    await Promise.all(files.map(async (file) => {
        if (file.startsWith('.')) return;
        if (process.env.NODE_ENV === 'production' && file.startsWith('test')) return;
        let filePath = path.join(config.markdownDir, file);
        if (!(await fs.stat(filePath)).isFile()) {
            return console.log(`${file} 不是文件！`);
        }
        let ext = path.extname(file);
        let fileBaseName = path.basename(file, ext);
        let isValidName = (ext === '.md' || ext === '.markdown') && util.isEnStrikethrough(fileBaseName);
        if (!isValidName) return console.log(`${file} 文件名不合法！`);

        newPool[fileBaseName] = await readFile(file)
    }))
    return newPool;
}

module.exports.onData = function(cb){
    readData().then(data => cb(null, data)).catch(cb);
    watch(cb);
}

// module.exports.onChange = function(cb){
//     watch(cb);
// }