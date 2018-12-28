const { send } = require('micro')
require('dotenv').config()
const { errWrap } = require('./utils/errWrap')
const { UploadService, ApolloService} = require('./services/')
const { newuser, findById, findByName, login, decode } = require('./user')
const notfound = (req, res) => send(res, 404, 'Not found route')

const router = require('find-my-way')()
router.get('/v1', ApolloService)
router.post('/register', errWrap(newuser))
router.post('/login',  errWrap(login))
router.post('/decode',  errWrap(decode))
router.get('/find/:id',  errWrap(findById))
router.get('/find2/:username',  errWrap(findByName))
router.post('/uploadServices', UploadService)

router.all('/*', notfound)

module.exports = async (req, res) => {
    await router.lookup(req, res)
}

process.on('unhandledRejection', (reason, p) => {
  throw reason;
});
process.on('uncaughtException', (error) => {
  console.log('server error ', error)
  process.exit(1)
});