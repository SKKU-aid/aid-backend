const generateVerificationCode = require('../../src/daemon/verificationCode');

describe('generateVerificationCode', () => {
  it('should generate a code of default length 6', () => {
    const code = generateVerificationCode();
    expect(code).toHaveLength(6);
  });

  it('should generate a code of specified length', () => {
    const length = 8;
    const code = generateVerificationCode(length);
    expect(code).toHaveLength(length);
  });

  it('should generate a different code each time', () => {
    const code1 = generateVerificationCode();
    const code2 = generateVerificationCode();
    expect(code1).not.toBe(code2);
  });

  it('should contain only allowed characters', () => {
    const code = generateVerificationCode(100);
    const allowedCharacters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    for (let char of code) {
      expect(allowedCharacters).toContain(char);
    }
  });
});
