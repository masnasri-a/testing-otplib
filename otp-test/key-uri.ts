import { authenticator } from "otplib";
import { OTP_SECRET } from "../constant";

const secret = OTP_SECRET;
const user = "nasriblog12@gmail.com"
const service = "otp-lib-service"
console.log(secret);


const otpauth = authenticator.keyuri(user, service,secret);
console.log(otpauth);


