const { send } = require('micro')
const { router, get, post } = require('micro-fork')
require('dotenv').config()
const upload  =  require('./services/post-minio.js')
const ApolloServer = require('./services/applo-services.js')
const { newuser, findById, findByName, login, decode } = require('./services/user.js')
const notfound = (req, res) => send(res, 404, 'Not found route')

module.exports = router()(
  get('/v1', ApolloServer.createHandler()),
  post('/upload', upload),
  post('/register', newuser),
  post('/login', login),
  get('/find/:id', findById),
  get('/find2/:username', findByName),
  get('/*', notfound)
)
