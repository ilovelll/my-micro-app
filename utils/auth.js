const { json, send, createError } = require('micro');
const { compareSync, hash } = require('bcrypt');
const { sign, verify } = require('jsonwebtoken');
const assert = require('assert');

const secret = {
  private: readFileSync(`${path.join(__dirname, 'certs')}/key.pem`, 'utf8'),
  public: readFileSync(`${path.join(__dirname, 'certs')}/public.pem`, 'utf8')
},
const User = require('../models/user');

/**
 * Attempt to authenticate a user.
 */
const attempt = (username, password) => {
  return User.find({ username: username }).exec().then((users, err) => {
    if (!users.length) {
      throw createError(401, 'That user does not exist');
    }

    const user = users[0];
    if (!compareSync(password, user.password)) {
      throw createError(401, 'Wrong password');
    }
    return user;
  });
};

/**
 * Authenticate a user and generate a JWT if successful.
 */
const auth = ({ username, password }) =>
  attempt(username, password).then(({ id }) => {
    let token = sign({ id }, secret.private, { algorithm: 'RS256'});;
    return { token: token };
  });

const decode = token => verify(token, secret.public);

module.exports.login = async (req, res) => {
  await auth(await json(req));
}

module.exports.decode = (req, res) => {
  try {
    return decode(req.headers['authorization'])
  } catch(err) {
    throw createError(401, "auth fail")
  }
};