const path = require('path');
module.exports = {
    markdownDir: path.resolve('server', 'md'),
    host: `http://${process.env.API_SERVICE_HOST || '127.0.0.1'}:3000`
}