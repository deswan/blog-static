const express = require('express')
const { wrap } = require('../../util')
const Model = require('../../model')

const blogRouter = express.Router()

blogRouter.use((req, res, next) => {
    req.$model = new Model('blog')
    next()
})

//文章列表
blogRouter.get('/list', wrap(require('./list')))

//文章详情
blogRouter.get('/get', wrap(require('./article')))

//所有文章详情 不带分页
blogRouter.get('/all', wrap(require('./all')))

module.exports = blogRouter