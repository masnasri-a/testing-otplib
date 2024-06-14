import { createHmac, Hmac } from 'crypto';

const HOTP_BLOCK_SIZE = 6;
const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function hotpGenerator(secretBase32: string): (counter: number) => string {
  const secretBytes = decodeBase32(secretBase32);
  const key = Buffer.from(secretBytes);
  const hmac = createHmac('sha1', key);

  return (counter: number) => {
    const counterBuffer = Buffer.alloc(HOTP_BLOCK_SIZE);
    counterBuffer.writeUInt32BE(counter, 0);

    hmac.update(counterBuffer);
    const digest = hmac.digest();

    const truncated = digest.slice(digest.length - HOTP_BLOCK_SIZE);
    const otp = truncated.readUInt32BE(0) % 1000000;

    return otp.toString().padStart(6, '0');
  };
}


function decodeBase32(secretBase32: string): Uint8Array {
    const bytes: Uint8Array = new Uint8Array(secretBase32.length * 5 / 8);
    let index = 0;
  
    for (let i = 0; i < secretBase32.length; i++) {
      const char = secretBase32.charAt(i);
      const digit = BASE32_ALPHABET.indexOf(char);
  
      if (digit === -1) {
        throw new Error('Invalid base32 character: ' + char);
      }
  
      for (let j = 0; j < 5; j++) {
        const mask = 1 << (4 - j);
        if ((digit & mask) === mask) {
          bytes[index++] |= mask;
        }
      }
    }
  
    return bytes;
  }
  
const generateHotp = hotpGenerator('C4UBUFB7CEVAGNC5OAST67QDLYDBYPA7'); // Contoh secret base32

console.log(generateHotp(3)); // 228277