const pool = require('./pool')();
const dayjs = require('dayjs');

module.exports = {

    async getArticles(args = {}) {
        let articles = pool.getAllArticles();
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
    },

    getArticleByName(name, args) {
        return pool.getArticle(name);
    },

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
            let field_a = isTime ? dayjs(mdObj_a[field]) : mdObj_a[field];
            let field_b = isTime ? dayjs(mdObj_b[field]) : mdObj_b[field];
            // if(field.endsWith('_time')){
            //     field_a = new Date(field_a).valueOf();
            //     field_b = new Date(field_b).valueOf();
            // }
            if (desc) {
                return field_b - field_a;
            } else {
                return field_a - field_b;
            }
        })
    },

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