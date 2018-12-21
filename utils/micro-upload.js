'use strict'

const fileUpload = require('express-fileupload')

exports.upload = function upload (opts, fn) {
  if (!fn) {
    fn = opts
    opts = {}
  }

  const handler = fileUpload(opts)

  return (req, res) => {
    return new Promise(resolve => handler(req, res, resolve))
      .then(() => fn(req, res))
  }
}