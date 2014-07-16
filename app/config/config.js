var path = require('path')
  , rootPath = path.normalize(__dirname + '/..');

module.exports = {
  development: {
    db: 'mongodb://localhost/dev',
    root: rootPath,
    app: {
      name: 'Conte Web DB'
    }
  },
  test: {
    db: 'mongodb://localhost/test',
    root: rootPath,
    app: {
      name: 'Conte Web DB'
    }
  },
  production: {}
}