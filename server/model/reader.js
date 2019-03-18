const config = require('../../config');
const fs = require('fs-extra');
const path = require('path');
const util = require('../util');
const chokidar = require('chokidar');
const MarkdownIt = require('markdown-it')
const meta = require('markdown-it-meta')
const prism = require('markdown-it-prism');
const _ = require('lodash');
const dayjs = require('dayjs');

const md = new MarkdownIt({
    linkify: true
})
md.use(meta)
md.use(prism, {
    defaultLanguage: 'javascript'
});

const markdownDir = config.markdown.dir;

validate();

function validate(){
    if (!(
        fs.existsSync(markdownDir) &&
        fs.statSync(markdownDir).isDirectory()
    )) {
        throw new Error('markdownDir 配置无效');
    }
}

async function readFile(file) {
    let filePath = path.resolve(markdownDir, file);
    let fileContent = await fs.readFile(filePath, 'utf-8');
    md.meta = null
    let document = md.render(fileContent);
    if(!md.meta) throw new Error(`markdown ${file} 无 meta`)
    return {
        meta: md.meta,
        document
    }
}

function watch(cb) {
    console.log('开始监听 markdown 数据源')
    chokidar.watch(markdownDir, {
        ignored: /(^|[\/\\])\../,
        ignoreInitial: true
    }).on('all', (event, path) => {
        console.log(event, path);
        readData().then(data => cb(null, data)).catch(cb);
    });
}

async function readData() {

    let files = await fs.readdir(markdownDir);

    let data = {};

    await Promise.all(files.map(async (file) => {
        let filePath = path.join(markdownDir, file);

        //忽略文件
        if (file.startsWith('.')) return;
        if (process.env.NODE_ENV === 'production'){
            let testFileName = config.markdown.testFileName;
            if(
                testFileName &&
                (
                    typeof testFileName === 'string' && file.startsWith(testFileName) ||
                    _.isRegExp(testFileName) && testFileName.test(file)
                )
            ){
                return;
            }
        }
        if (!(await fs.stat(filePath)).isFile()) {
            return;
        }

        //文件名检测
        let ext = path.extname(file);
        let fileBaseName = path.basename(file, ext);
        let isValidName = (ext === '.md' || ext === '.markdown') && util.isEnStrikethrough(fileBaseName);
        if (!isValidName) return console.warn(`${file} 文件名不合法`);

        //读取文件
        let result = await readFile(file)

        //文件meta检测
        if(!result.meta.title){
            throw new Error(`markdown title 未定义 \n ${file}`)
        }
        if(!result.meta.modified_time){
            throw new Error(`markdown modified_time 未定义 \n ${file}`)
        }
        if(!dayjs(result.meta.modified_time).isValid()){
            throw new Error(`markdown modified_time 格式不合法 \n ${file}`)
        }
        let sameTitleKey;
        if( sameTitleKey = _.findKey(data, v => v.meta.title === result.meta.title) ){
            throw new Error(`markdown title 重复 \n ${file}:${result.meta.title} \n ${sameTitleKey}:${result.meta.title}`)
        }

        data[fileBaseName] = result;
    
    }))
    return data;
}

module.exports.onData = function(cb){
    readData().then(data => cb(null, data)).catch(cb);
    watch(cb);
}