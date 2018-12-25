const { readFileSync  } = require('fs')
const path = require('path')
const { sign, verify } = require('jsonwebtoken');

const secret = {
  private: readFileSync(`${path.resolve(__dirname, '../certs')}/key.pem`, 'utf8'),
  public: readFileSync(`${path.resolve(__dirname, '../certs')}/public.pem`, 'utf8')
}

const defaultOption = {
  sign: {
    algorithm: 'RS256'
  },
  verify: {

  }
}

module.exports.sign = (payload, option = {}) => {
  return sign(payload, secret.private, Object.assign(defaultOption.sign, option))
}

module.exports.verify = (token, option = {}) => {
  return verify(token.replace('Bearer ', ''), secret.public, Object.assign(defaultOption.verify, option))
}
