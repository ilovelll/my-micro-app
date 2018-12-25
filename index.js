const { send } = require('micro')
require('dotenv').config()
const upload  =  require('./services/post-minio.js')
const ApolloServer = require('./services/applo-services.js')
const { newuser, findById, findByName, login, decode } = require('./user')
const notfound = (req, res) => send(res, 404, 'Not found route')

const router = require('find-my-way')()
router.get('/v1', ApolloServer.createHandler()),
router.post('/upload', upload),
router.post('/register', newuser),
router.post('/login', login),
router.post('/decode', decode),
router.get('/find/:id', findById),
router.get('/find2/:username', findByName),
router.get('/*', notfound)

module.exports = async (req, res) => {
    await router.lookup(req, res)
}

process.on('unhandledRejection', (reason, p) => {
  throw reason;
});
process.on('uncaughtException', (error) => {
  console.log('server error', error)
});