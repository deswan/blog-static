const pool = require('./pool');
const dayjs = require('dayjs');
const _ = require('lodash');

module.exports =  class Model {
    constructor(category){
        this.category = category
    }

    async getArticles(args = {}) {
        let articles = pool.get(this.category);
        if(args.sort) articles = this.sortMD(articles, ...args.sort)
        if(args.page && args.pageSize){
            let {items, totalPage } = this.pagination(articles, args.page, args.pageSize)
            return {
                totalPage,
                page: parseInt(args.page),
                items
            };
        }else{
            return articles
        }
    }

    getArticleByName(name) {
        if(!name) throw new Error('id 缺失')
        let articles = pool.get(this.category);
        let ret = _.find(articles, v => v.name === name)
        if(!ret) throw new Error(`文章 ${name} 找不到`)
        return ret;
    }

    /**
     * 排序器
     * @param {Array<Object>} mdList 数据列表
     * @param {[field, 'desc' | 'asc']} expression 排序方式
     * @return {Array} 排序后的数据列表
     */
    sortMD(mdList, field = 'create_time', order = 'desc'){
        let desc = order === 'desc';
        let isTime = field.endsWith('_time');
        return [...mdList].sort((mdObj_a, mdObj_b) => {
            console.log(mdObj_a, field, _.get(mdObj_a, field))
            let fieldValueA = _.get(mdObj_a, field)
            let fieldValueB = _.get(mdObj_b, field)
            fieldValueA = isTime ? dayjs(fieldValueA) : fieldValueA;
            fieldValueB = isTime ? dayjs(fieldValueB) : fieldValueB;
            if (desc) {
                return fieldValueB - fieldValueA;
            } else {
                return fieldValueA - fieldValueB;
            }
        })
    }

    /**
     * 分页器
     * @param {*} list 数据列表
     * @param {*} page 当前页数
     * @param {*} pageSize 每页多少项数据
     * @return {{items: Array 当页数据列表, totalPage: Number 总页数}}
     */
    pagination(list, page = 1, pageSize = 10){
        return {
            items: list.slice((page - 1) * pageSize, page * pageSize),
            totalPage: list.length ? parseInt((list.length - 1) / pageSize) + 1 : 1
        };
    }
}