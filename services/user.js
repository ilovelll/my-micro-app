const {json, send } = require('micro');
const User = require('../models/user');
const { auth, decode} = require('../utils/auth.js')

module.exports.newuser = async (req, res) => {
  const result = await User.newuser(await json(req))
  send(res, 200, result)
}

module.exports.findById = async (req, res) => {
  const result = await User.findById(req.params)
  send(res, 200, result)
}

module.exports.findByName = async (req, res) => {
  const result = await User.findByName(req.params)
  send(res, 200, result)
}

module.exports.login = async (req, res) => {
  const result = await auth(await json(req));
  send(res, 200, result)
}

module.exports.decode = (req, res) => {
  try {
    const reulst = decode(req.headers['authorization'])
    send(res, 200, result)
  } catch(err) {
    throw createError(401, "auth fail")
  }
};

