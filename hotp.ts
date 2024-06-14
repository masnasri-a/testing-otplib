import { authenticator, hotp } from "otplib";

import { OTP_SECRET } from './constant';

const token = hotp.generate(OTP_SECRET, 0);
console.log(token);
