import { authenticator } from "otplib";

import { OTP_SECRET } from "../constant";

const otp_code = authenticator.generate(OTP_SECRET);
console.log(otp_code);
