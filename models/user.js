const pg = require('./db.js')
const { hashSync } = require('bcrypt')

module.exports.newuser = async ({username, password}) => {
  return await pg('user')
  .returning('id')
  .insert({username, password: hashSync(password, 10)})
}

module.exports.findById = async ({id}) => {
  return await pg('user').where({
    id
  }).select('id', 'username', 'password')
}