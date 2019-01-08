const { errWrap } = require('../utils/errWrap')

module.exports.UploadService = errWrap(require('./upload-services'))
module.exports.ApolloService = require('./apollo-service').createHandler()

module.exports.UserServices = {
  newuser: errWrap(require('./user/userService').newuser),
  findById: errWrap(require('./user/userService').findById),
  findByName: errWrap(require('./user/userService').findByName),
  login: errWrap(require('./user/userService').login),
  decode: errWrap(require('./user/userService').decode),
}