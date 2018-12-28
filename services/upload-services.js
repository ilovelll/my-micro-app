const { send } = require('micro')
const Minio = require("minio")
const Boom = require('boom');
const { randomBytes } = require('crypto')
const Subtext = require('subtext');

const generateUUID = (size = 10) => {
  return randomBytes(Math.ceil(size * 3 / 4))
    .toString('base64')
    .slice(0, size)
    .replace(/\+/g, 'a')
    .replace(/\//g, 'b')
}

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_EndPoint,
  useSSL: true,
  accessKey: process.env.MINIO_AccessKey,
  secretKey: process.env.MINIO_SecretKey
});

module.exports = async (req, res) => {
  const { payload, mime } = await Subtext.parse(req, null, { parse: true, output: 'stream' });
  const file = payload.file
  
  if (!payload||!file) {
    throw Boom.badRequest("no file uploaded")
  }
  const key = `${generateUUID()}.${file.hapi.headers["content-type"].split('/').pop()}` // this works for png, jpg, pdf, ...

  const result = await minioClient.putObject('microuploads', key, file)
  send(res, 200, {result, key})
}