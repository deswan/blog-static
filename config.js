const path = require('path');
module.exports = {
    markdown: {
        dir: path.resolve('server', 'md'),
        testFileName: 'test'
    },
    host: `http://${process.env.API_SERVICE_HOST || '127.0.0.1'}:3000`
}