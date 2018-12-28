const { errWrap } = require('../utils/errWrap')

module.exports.UploadService = errWrap(require('./upload-services'))
module.exports.ApolloService = require('./apollo-service').createHandler()