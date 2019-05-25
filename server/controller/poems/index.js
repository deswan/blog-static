const express = require('express')
const { wrap } = require('../../util')
const Model = require('../../model')

const router = express.Router()

router.use((req, res, next) => {
    req.$model = new Model('poems')
    next()
})

//文章列表
router.get('/list', wrap(require('./list')))

//文章详情
router.get('/get', wrap(require('./article')))

//所有文章详情 不带分页
router.get('/all', wrap(require('./all')))

module.exports = router