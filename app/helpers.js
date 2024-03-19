const bcrypt = require("bcrypt");

exports.generateAccessToken = async () => {
    let characters = "abcdefghijklmnopqrstuvwxyvABCDEFGHIJKLMNOPQRSTUVWXYV0123456789,.;~][!@#$%¨&*()_+{}^><-".split("");
    let rawAccessToken = "";
    const max = characters.length - 1;
    const min = 0;
    for (let i = 0; i < 20; i++) {
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        rawAccessToken += characters[randomNumber];
    }

    const accessToken = await bcrypt.hash(rawAccessToken, 10);

    return { rawAccessToken, accessToken };
}

exports.getExpiration = () => {
    const [milliseconds, seconds, minutes, hours] = [1000, 60, 60, 1];

    let today = new Date().getTime();
    today = new Date(today - (milliseconds * seconds * minutes * 3)).getTime();
    const expiresAt = today + (milliseconds * seconds * minutes * hours);

    return { today, expiresAt };
}
