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
const fileChecker = require('./checkFile');

const md = new MarkdownIt({
    linkify: true
})
md.use(meta)
md.use(prism, {
    defaultLanguage: 'javascript'
});

const markdownDir = config.markdown.dirs;

validate();

function validate() {
    let valid = _.every(markdownDir, dir => {
        return fs.existsSync(dir) && fs.statSync(dir).isDirectory()
    })
    if (!valid) throw new Error('markdownDir 配置无效');
}

async function readFile(filePath) {
    let fileContent = await fs.readFile(filePath, 'utf-8');
    md.meta = null
    let document = md.render(fileContent);
    if (!md.meta) throw new Error(`markdown ${file} meta 缺失`)
    return {
        meta: md.meta,
        document
    }
}

function watch(cb) {
    console.log('开始监听 markdown 数据源')
    chokidar.watch(_.values(markdownDir), {
        ignored: /(^|[\/\\])\../,
        ignoreInitial: true
    }).on('all', (event, path) => {
        console.log(event, path);
        readData().then(data => cb(null, data)).catch(cb);
    });
}

async function readData() {

    let data = {};

    _.forEach(markdownDir, async (dir, name) => {

        let category = []
        let checkFile = fileChecker[name]
        let files = await fs.readdir(dir);

        await Promise.all(files.map(async (file) => {
            let filePath = path.join(dir, file);

            //忽略文件
            if (file.startsWith('.')) return;

            //生产环境忽略测试文件
            if (process.env.NODE_ENV === 'production') {
                let testFilePattern = config.markdown.testFilePattern;
                if ( testFilePattern && testFilePattern.test(file) ) {
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
            let result = await readFile(filePath)

            if(checkFile) {
                try{
                    checkFile(result, category)
                }catch(err){
                    throw new Error(`${name} markdown ${file} 错误: ${err.message}`)
                }
            }

            category.push({
                name: fileBaseName,
                ...result,
            })
        }))

        data[name] = category
    })
    return data;
}

module.exports.onData = function (cb) {
    readData().then(data => cb(null, data)).catch(cb);
    watch(cb);
}