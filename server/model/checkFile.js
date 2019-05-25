const dayjs = require('dayjs')
const _ = require('lodash');

module.exports = {
  blog(result, data) {
    //文件meta检测
    if (!result.meta.title) {
      return `title 未定义`
    }
    if (!result.meta.modified_time) {
      return `modified_time 未定义`
    }
    if (!dayjs(result.meta.modified_time).isValid()) {
      return `modified_time 格式不合法`
    }
    let sameTitleKey;
    if (sameTitleKey = _.findKey(data, v => v.meta.title === result.meta.title)) {
      return `title 重复: ${sameTitleKey}:${result.meta.title}`
    }
  },
  poems(result, data){
    //文件meta检测
    if (!result.meta.created_time) {
      return `created_time 未定义`
    }
    if (!dayjs(result.meta.created_time).isValid()) {
      return `created_time 格式不合法`
    }
    let sameTitleKey;
    if (
      result.meta.title &&
      (sameTitleKey = _.findKey(data, v => v.meta.title === result.meta.title))
    ) {
      return `title 重复: ${sameTitleKey}:${result.meta.title}`
    }
  }
}