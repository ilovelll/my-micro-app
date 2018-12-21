const User = require('../models/user');
const {json, send } = require('micro');

module.exports.newuser = async (req, res) => {
  const result = await User.newuser(await json(req))
  send(res, 200, result)
}

module.exports.findById = async (req, res) => {
  const result = await User.findById(req.params)
  send(res, 200, result)
}