const path = require('path');
module.exports = {
    markdown: {
        dirs: {
            blog: path.resolve('content/blog'),
            poems: path.resolve('content/poems'),
        },
        testFilePattern: /test/
    },
    host: `http://127.0.0.1:3000`,
    pageSize: 10
}