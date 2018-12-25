const {json, createError, send } = require('micro');
const { compareSync } = require('bcrypt');
const User = require('./userDAL');
const { sign, verify } = require('../utils/auth')

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

const attempt = async ({id, password}) => {
  const result = await User.findById({id})
  if (result.length === 0) {
    throw createError(401, 'That user does not exist');
  }
  const user = result[0]
  if (!compareSync(password, user.password)) {
    throw createError(401, 'Wrong password');
  }
  return user;
}

module.exports.login = async (req, res) => {
  try {
    console.log(req.body)
    const user = await attempt(await json(req))
    let token = sign(user)
    send(res, 200, { token })
  } catch (error) {
    throw error;
  }
}

module.exports.decode = (req, res) => {
  try {
    const result = verify(req.headers['authorization'])
    send(res, 200, result)
  } catch(err) {
    throw err
  }
};
