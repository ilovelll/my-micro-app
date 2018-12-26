const Fs = require('fs');
const Http = require('http');
const Path = require('path');
const Stream = require('stream');

const FormData = require('form-data');
const Lab = require('lab');
const Code = require('code');
const Wreck = require('wreck');
const Subtext = require('subtext');
const micro = require('micro')
const listen = require('test-listen')

const { describe, it } = exports.lab = Lab.script();
const expect = Code.expect;


describe('parse()', () => {
    it('peeks at multipart in stream mode', async () => {

        const body =
            '--AaB03x\r\n' +
            'content-disposition: form-data; name="x"\r\n' +
            '\r\n' +
            'First\r\n' +
            '--AaB03x\r\n' +
            'content-disposition: form-data; name="x"\r\n' +
            '\r\n' +
            'Second\r\n' +
            '--AaB03x\r\n' +
            'content-disposition: form-data; name="x"\r\n' +
            '\r\n' +
            'Third\r\n' +
            '--AaB03x\r\n' +
            'content-disposition: form-data; name="field1"\r\n' +
            '\r\n' +
            'Joe Blow\r\nalmost tricked you!\r\n' +
            '--AaB03x\r\n' +
            'content-disposition: form-data; name="field1"\r\n' +
            '\r\n' +
            'Repeated name segment\r\n' +
            '--AaB03x\r\n' +
            'content-disposition: form-data; name="pics"; filename="file1.txt"\r\n' +
            'Content-Type: text/plain\r\n' +
            '\r\n' +
            '... contents of file1.txt ...\r\r\n' +
            '--AaB03x--\r\n';

        const request = Wreck.toReadableStream(body);
        request.headers = {
            'content-type': 'multipart/form-data; boundary=AaB03x'
        };

        let raw = '';
        const tap = new Stream.Transform();
        tap._transform = function (chunk, encoding, callback) {

            raw = raw + chunk.toString();
            this.push(chunk, encoding);
            callback();
        };

        const { payload } = await Subtext.parse(request, tap, { parse: true, output: 'stream' });
        expect(payload.x).to.equal(['First', 'Second', 'Third']);
        expect(payload.field1).to.equal(['Joe Blow\r\nalmost tricked you!', 'Repeated name segment']);
        expect(payload.pics.hapi.filename).to.equal('file1.txt');
        expect(raw).to.equal(body);
    });

    it('parses a multipart file correctly on stream mode', async () => {

        const path = Path.join(__dirname, './file/image.jpg');
        const fileStream = Fs.createReadStream(path);
        const fileContents = Fs.readFileSync(path);

        const form = new FormData();
        form.append('my_file', fileStream);
        form.headers = form.getHeaders();

        const { payload } = await Subtext.parse(form, null, { parse: true, output: 'stream' });

        expect(payload.my_file.hapi).to.equal({
            filename: 'image.jpg',
            headers: {
                'content-disposition': 'form-data; name="my_file"; filename="image.jpg"',
                'content-type': 'image/jpeg'
            }
        });

        const buffer = await Wreck.read(payload.my_file);
        expect(fileContents.length).to.equal(buffer.length);
        expect(fileContents.toString('binary') === buffer.toString('binary')).to.equal(true);
    });
});

describe('services:', () => {
    it('service example', async () => {
        const service = micro(async (req, res) => {
            micro.send(res, 200, {
                test: 'woot'
            })
        })
        
        const url = await listen(service)

        const { res, payload } = await Wreck.get(url);
        expect(JSON.parse(payload).test).to.equal('woot')
        service.close()
    });
})