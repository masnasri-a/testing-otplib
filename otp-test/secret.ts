import { authenticator } from "otplib";

const secret = authenticator.generateSecret(20);
console.log(secret);
