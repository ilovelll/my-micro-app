const { send } = require('micro')
require('dotenv').config()
const { errWrap } = require('./utils/errWrap')
const { UploadService, ApolloService, UserServices} = require('./services/')
const notfound = (req, res) => send(res, 404, 'Not found route')

const router = require('find-my-way')()
router.get('/v1', ApolloService)
router.post('/register', errWrap(UserServices.newuser))
router.post('/login',  errWrap(UserServices.login))
router.post('/decode',  errWrap(UserServices.decode))
router.get('/find/:id',  errWrap(UserServices.findById))
router.get('/find2/:username',  errWrap(UserServices.findByName))
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