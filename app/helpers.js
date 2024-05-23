const [nodePath, serverPath, env_file = ".env.local"] = process.argv;
require("dotenv").config({ path: env_file });
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

exports.makeItBlur = async (url) => {        
    const base64str = await fetch(
        `${process.env.PUBLIC_URL}/conteudos/${url}`
    ).then(async (res) =>
        Buffer.from(await res.arrayBuffer()).toString('base64')
    );
  
    const blurSvg = `
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 5'>
            <filter id='b' color-interpolation-filters='sRGB'>
                <feGaussianBlur stdDeviation='.2' />
            </filter>
  
            <image
                filter='url(#b)'
                x='0'
                y='0'
                height='100%'
                width='100%'  
                href='data:image/avif;base64,${base64str}'
            />
        </svg>
    `;
  
    const toBase64 = (str) =>
        typeof window === 'undefined'
            ? Buffer.from(str).toString('base64')
            : window.btoa(str);
  
    return `data:image/svg+xml;base64,${toBase64(blurSvg)}`;
}
