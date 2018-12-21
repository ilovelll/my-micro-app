const { json, send, createError } = require('micro');
const { compareSync, hash } = require('bcrypt');
const { readFileSync  } = require('fs')
const path = require('path')
const { sign, verify } = require('jsonwebtoken');
const assert = require('assert');

const secret = {
  private: readFileSync(`${path.resolve(__dirname, '../certs')}/key.pem`, 'utf8'),
  public: readFileSync(`${path.resolve(__dirname, '../certs')}/public.pem`, 'utf8')
}
const User = require('../models/user');

/**
 * Attempt to authenticate a user.
 */
const attempt = async (id, password) => {
  const result = await User.findById({id})
  if (result.length === 0) {
    throw createError(401, 'That user does not exist');
  }
  const user = result[0]
  console.log('password: ', password)
  console.log('user: ', JSON.stringify(user))
  if (!compareSync(password, user.password)) {
    throw createError(401, 'Wrong password');
  }
  return user;
};

module.exports.auth = async ({ id, password }) => {
  let user = await attempt(id, password)
  let token = sign(user, secret.private, { algorithm: 'RS256'});
  return { token: token };
}

module.exports.decode = token => verify(token, secret.public);

