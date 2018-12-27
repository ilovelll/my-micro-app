const { send } = require('micro')
const Boom = require('boom')

module.exports.errWrap = (fn, dump = false) => {
  return async (req, res) => {
    try {
      return await fn(req, res)
    } catch (err) {
      if (dump) console.error(err.stack)

      // Determine status code in determined order
      let statusCode = res.statusCode || 500
      if (err.isBoom) {
        statusCode = err.output.statusCode
      } else if (err.statusCode) {
        statusCode = err.statusCode
      }

      // Since it's an error, it's safe to assume <400
      // status codes are a mistake.
      if (statusCode < 400) {
        statusCode = 500
      }
      if (statusCode >= 500 && process.env.NODE_ENV === 'production') {
        //TODO sending err log to log store
      }
      // Wrap the error and generate the response
      const error = err.isBoom ? Boom.boomify(err) : Boom.boomify(err, {statusCode})

      // Add WWW-Authenticate challenge to headers for 401 responses
      if (statusCode === 401 && error.data && error.data.challenge) {
        res.setHeader('WWW-Authenticate', error.data.challenge)
      }

      send(
        res,
        statusCode,
        Object.assign({},
          error.output.payload,
          error.data && { data: error.data }
        )
      )
    }
  }
}