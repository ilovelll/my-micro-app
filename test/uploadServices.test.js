const fs = require('fs');
const http = require('http');
const Path = require('path');
const Stream = require('stream');
require('dotenv').config()
const FormData = require('form-data');
const request = require('r2');
const Wreck = require('wreck');
const Subtext = require('subtext');
const micro = require('micro')
const listen = require('test-listen')
const { upload } = require('./micro-upload')
const Boom = require('boom')
const { UploadService } = require('../services/')

const getUrl = fn => listen(micro(fn));


const path = Path.join(__dirname, './file/image.jpg');
const fileStream = fs.createReadStream(path);
const fileContents = fs.readFileSync(path);

const form = new FormData();
form.append('file', fileStream);
form.headers = form.getHeaders();

const body = { body: form }

const subtextUpload = async (req, res) => {
  const { payload } = await Subtext.parse(req, null, { parse: true, output: 'stream' });
  const file = payload.file
  
  if (!payload||!file) {
    throw Boom.badRequest("no file uploaded")
  }
  micro.send(res, 200, { filename: file.hapi.filename})
}

describe('upload services:', () => {
  it('no file uploaded', async () => {
    expect.assertions(2);
    const url = await getUrl(UploadService)
    const res = await request.post(url).response
    await expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ 
      statusCode: 400,
      error: 'Bad Request',
      message: 'no file uploaded'})
  });

  it('file uploaded', async () => {
    expect.assertions(2);
    const url = await getUrl(subtextUpload)
    const res = await request.post(url, body).response
    await expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ 
      filename: 'image.jpg'
    })
  });
})
