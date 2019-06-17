const path = require('path');
module.exports = {
    markdown: {
        dirs: {
            blog: path.resolve('server/articles/blog'),
            poems: path.resolve('server/articles/poems'),
        },
        testFilePattern: /test/
    },
    host: `http://${process.env.API_SERVICE_HOST || '127.0.0.1'}:3000`,
    pageSize: 10
}