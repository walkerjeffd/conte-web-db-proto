module.exports = function (app, passport) {
  app.use('/', require('../routes/index'));
  app.use('/files', require('../routes/files'));
  app.use('/users', require('../routes/users'));
}