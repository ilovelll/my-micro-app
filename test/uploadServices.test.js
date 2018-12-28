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

const { UploadService } = require('../services/')

const getUrl = fn => listen(micro(fn));

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
})