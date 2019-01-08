const {json, send } = require('micro');
const { compare } = require('bcrypt');
const Boom = require('boom');
const Joi = require('joi');
const User = require('./userDAL');
const { sign, verify } = require('../../utils/auth')

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
    throw Boom.unauthorized('That user does not exist')
  }
  const user = result[0]
  const match = await compare(password.toString(), user.password);
  if (!match) throw Boom.unauthorized('Wrong password');
  return user;
}

module.exports.login = async (req, res) => {
  let form = await json(req);
  const {error} = Joi.validate(form, require('./requestSchema').loginSchema);
  if (error) {
    throw Boom.badData(err.details[0].message);
  }
  const user = await attempt(form)
  let token = sign(user)
  send(res, 200, { token })
}

module.exports.decode = (req, res) => {
    const result = verify(req.headers['authorization'])
    send(res, 200, result)
};
