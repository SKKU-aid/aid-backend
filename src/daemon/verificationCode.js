require('dotenv').config()

// 인증번호 생성 함수
function generateVerificationCode(length = 6) {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let authCode = '';
    
    // 주어진 길이만큼 인증번호 생성
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        authCode += characters[randomIndex];
    }
    
    return authCode;
}

module.exports = generateVerificationCode