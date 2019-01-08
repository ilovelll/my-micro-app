const { send } = require('micro')
require('dotenv').config()
const { UploadService, ApolloService, UserServices} = require('./services/')
const notfound = (req, res) => send(res, 404, 'Not found route')

const router = require('find-my-way')()
router.get('/v1', ApolloService)
router.post('/register', UserServices.newuser)
router.post('/login',  UserServices.login)
router.post('/decode',  UserServices.decode)
router.get('/find/:id',  UserServices.findById)
router.get('/find2/:username',  UserServices.findByName)
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