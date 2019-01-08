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
const { UserServices } = require('../services/')

const getUrl = fn => listen(micro(fn));



describe('user services:', () => {
  it('err login: bad request data', async () => {
    expect.assertions(2);

    const url = await getUrl(UserServices.login)
    const res = await request.post(url, {
      json: { a: "ffff", b: "ffff"},
      headers: {'content-type': 'application/json'}
    }).response
    await expect(res.status).toBe(422);
    await expect(res.json()).resolves.toEqual({ 
      statusCode: 422,
      error: 'Unprocessable Entity',
      message: '\"id\" is required'})
  });

  it('err login: bad request data', async () => {
    expect.assertions(2);

    const url = await getUrl(UserServices.login)
    const res = await request.post(url, {
      json: { id: "ffff", password: "aaaaaa"},
      headers: {'content-type': 'application/json'}
    }).response
    await expect(res.status).toBe(422);
    await expect(res.json()).resolves.toEqual({ 
      statusCode: 422,
      error: 'Unprocessable Entity',
      message: '\"id\" must be a valid GUID'})
  });
})
