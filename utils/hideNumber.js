function encode(number) {
    return Buffer.from(number.toString()).toString('base64');
}

function decode(code) {
    return parseInt(Buffer.from(code, 'base64').toString());
}

module.exports = {
    encode,
    decode
};