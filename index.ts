import express from 'express'
import { authenticator, hotp } from "otplib";
import bodyParser from 'body-parser';
import qrcode from 'qrcode';

import { OTP_SECRET, SERVICE_NAME } from './constant'

const app = express()
app.use(bodyParser.json());

const port = 3000

app.get('/ping', (req, res) => {
  res.send({ message: 'pong' })
})

app.post('/create-qr-totp', async (req, res) => {
    const service = SERVICE_NAME;
    const body = req.body;
    console.log(body);
    const email = body.email;
    const secret = OTP_SECRET;
    const otpauth = authenticator.keyuri(email, service,secret);
    qrcode.toDataURL(otpauth, (err, imageUrls) => {
    if (err) {
        console.log('Error with QR');
        return;
    }
    console.log('Image URL: ', imageUrls);
    let html = `<img src="${imageUrls}" alt="OTP QR Code" />`;
    html += `<p>otpauth: ${otpauth}</p>`;
    res.set('Content-Type', 'text/html');
    res.send(Buffer.from(html));
    });
})


app.post('/create-qr-hotp', async (req, res) => {
    const service = SERVICE_NAME;
    const body = req.body;
    const counter = 0;
    console.log(body);
    const email = body.email;
    const secret = OTP_SECRET;
    const otpauth = hotp.keyuri(email,service,secret, counter)
    qrcode.toDataURL(otpauth, (err, imageUrls) => {
    if (err) {
        console.log('Error with QR');
        return;
    }
    console.log('Image URL: ', imageUrls);
    let html = `<img src="${imageUrls}" alt="OTP QR Code" />`;
    html += `<p>otpauth: ${otpauth}</p>`;
    res.set('Content-Type', 'text/html');
    res.send(Buffer.from(html));
    });
})

app.get('/get-hotp-token', (req, res) => {
    // HOTP token from otplib is not sync with google authenticator
    // idk why but the token is different ( maybe is encoder is differenta)
    const token = hotp.generate(OTP_SECRET, 2);
    console.log(token);
    res.send({ token });
})

app.post('/validate-hotp',async (req, res) => {
    const body = req.body;
    const token = body.token;
    const counter = body.counter;
    const isValid = hotp.verify({ token, secret: OTP_SECRET, counter });
    res.send({ isValid });
})


app.get('/get-token', (req, res) => {
    const otp_code = authenticator.generate(OTP_SECRET);
    res.send({ otp_code });
})

app.post('/validate',async (req, res) => {
    const body = req.body;
    const token = body.token;
    const isValid = authenticator.verify({ token, secret: OTP_SECRET });
    res.send({ isValid });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})