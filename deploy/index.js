const fs = require('fs-extra');
const path = require('path');
const shelljs = require('shelljs');

let commitMsg = process.argv[2] || 'deploy';

const configPath = path.resolve(__dirname, 'config.js')
let config;
try {
  config = require(configPath);
} catch (err) {
  console.error('config.js不合法', err);
  process.exit(1)
}

console.log('目标文件夹：', config.dest);

shelljs.cd(config.dest);

if (shelljs.exec('git rev-parse --git-dir', { silent: true }).code !== 0) {
  console.error(`${config.dest} 不是 git 目录`);
  process.exit(1)
}

console.log('拉取代码...')
shelljs.exec('git pull origin master');

console.log('拷贝发布文件...')
fs.copySync(path.resolve(__dirname, '..', 'dist'), config.dest);

shelljs.exec('git add .');

if (!shelljs.exec('git diff --cached', { silent: true }).stdout) {
  console.error('发布文件未变动');
  process.exit(0)
}

shelljs.exec(`git commit -m ${commitMsg}`);

console.log('推送代码...')
shelljs.exec('git push origin master');

console.log('部署成功！')
