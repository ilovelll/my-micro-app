const { send } = require('micro')
const Minio = require("minio")
const { upload } = require('../utils/micro-upload')
const { randomBytes } = require('crypto')
const Busboy = require("busboy")
const inspect = require('util').inspect;

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

module.exports = upload(async (req, res) => {
  if (!req.files) {
    return send(res, 400, 'no file uploaded')
  }
  let file = req.files.file
  const key = `${generateUUID()}.${file.mimetype.split('/').pop()}` // this works for png, jpg, pdf, ...

  const result = await minioClient.putObject('microuploads', key, file.data)
  send(res, 200, result)
})
