const Joi = require('joi')

module.exports.loginSchema = {
  id: Joi.string().guid().required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
}
