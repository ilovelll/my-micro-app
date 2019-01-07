const { errWrap } = require('../utils/errWrap')

module.exports.UploadService = errWrap(require('./upload-services'))
module.exports.ApolloService = require('./apollo-service').createHandler()

module.exports.UserServices = {
  newuser: require('./user/userService').newuser,
  findById: require('./user/userService').findById,
  findByName: require('./user/userService').findByName,
  login: require('./user/userService').login,
  decode: require('./user/userService').decode,
}