const Benchmark = require('benchmark')

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
const Boom = require('boom')
const Hoek = require('hoek')

const { upload } = require('./micro-upload')

const getUrl = fn => listen(micro(fn));

const suite = new Benchmark.Suite;

const path = Path.join(__dirname, './file/image.jpg');
const fileStream = fs.createReadStream(path);
const fileContents = fs.readFileSync(path);

const form = new FormData();
form.append('file', fileStream);
form.headers = form.getHeaders();

const body = { body: form }

// const expressUpload = upload(async (req, res) => {
//   console.log(req)
//   if (!req.files) {
//     micro.send(res, 400, 'no file uploaded')
//   }
//   let file = req.files.file
  
//   micro.send(res, 200, {filename: file.name})
// })

// const subtextUpload = async (req, res) => {
//   console.log(req)
//   try {
//     const { payload } = await Subtext.parse(req, null, { parse: true, output: 'stream' });
//     const file = payload.file
    
//     if (!payload||!file) {
//       micro.send(res, 400, 'no file uploaded')
//     }
//     micro.send(res, 200, { filename: file.hapi.filename})
//   } catch (error) {
//     console.error(error)
//     micro.send(res, 400, "Bad data")
//   }
// }
const srv1 = http.createServer(upload(async (req, res) => {
  try {
    if (!req.files) {
      micro.send(res, 400, 'no file uploaded')
    }
    let file = req.files.file
    
    micro.send(res, 200, file.name)
  } catch (error) {
    micro.send(res, 400, 'error')
  }
}))
const srv2 = http.createServer(async (req, res) => {
  try {
    const { payload } = await Subtext.parse(req, null, { parse: true, output: 'stream' });
    const file = payload.file
    micro.send(res, 200, file.hapi.filename)
  } catch (error) {
    console.error(error)
    micro.send(res, 400, 'error')
  }
})

// // add tests
// suite.add('RegExp#test', function() {
//   /o/.test('Hello World!');
// })
// .add('String#indexOf', function() {
//   'Hello World!'.indexOf('o') > -1;
// })
// // add listeners
// .on('cycle', function(event) {
//   console.log(String(event.target));
// })
// .on('complete', function() {
//   console.log('Fastest is ' + this.filter('fastest').map('name'));
// })
// // run async
// .run({ 'async': true });

async function benchTest1 () {
  const _url1 = await listen(srv1);
  let success1 = 0;
  console.log('test1 start ', _url1)

  const timer1 = new Hoek.Bench();
  let res1 = await request.post(_url1, body).response
  if (res1.status === 200) success1++
  let elapsed1 = timer1.elapsed()
  console.log('test1 finish')
  srv1.close()

  console.log([elapsed1, success1])
}

async function benchTest2 () {
  const _url2 = await listen(srv2);
  let success2 = 0;
  console.log('test2 start', _url2)
  const timer2 = new Hoek.Bench();
  let res2 = await request.post(_url2, body).response
  if (res2.status === 200) success2++
  let elapsed2 = timer2.elapsed()
  console.log('test2 finish')
  srv2.close()
  console.log([elapsed2, success2])
}
benchTest1()
// benchTest2()

// suite
// .add('upload#express-upload', async () => {
//   const url = await url1();
//   const res = await request.post(url, body).response
//   console.log('=========', res)
// })
// .add('upload#subtext', async () => {
//   const url = await url2();
//   const res = await request.post(url, body).response
//   console.log('---------', res)
// })
// .on('cycle', function(event) {
//   console.log(String(event.target));
// })
// .on('complete', function() {
//   console.log('Fastest is ' + this.filter('fastest').map('name'));
// })
// // run async
// .run({ 'async': true });