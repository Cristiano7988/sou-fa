const [nodePath, serverPath, env_file = ".env.local"] = process.argv;
require("dotenv").config({ path: env_file });
const bcrypt = require("bcrypt");

const strToBase64 = (str) => Buffer.from(str).toString("base64");

const urlToBase64 = (url) => fetch([process.env.PUBLIC_URL, url].join("/"))
    .then((res) => res.arrayBuffer())
    .then((res) => strToBase64(res))
    .catch(console.log);


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

exports.makeItBlur = async (url, largura, altura) => {
    const base64str = await urlToBase64("conteudos/imagens/" + url);

    const deviation = largura + altura;
    const casasDecimais = String(deviation).length;
    const stdDeviation = deviation / casasDecimais / 10;

    const blurSvg = `
        <svg xmlns='http://www.w3.org/2000/svg' width='${largura}' height='${altura}' viewBox='0 0 ${largura} ${altura}'>
            <filter id='imageWithBlur' color-interpolation-filters='sRGB'>
                <feGaussianBlur stdDeviation='${stdDeviation}' />
            </filter>
  
            <image
                filter='url(#imageWithBlur)'
                x='0'
                y='0'
                width='${largura}'
                height='${altura}'
                href='data:image/avif;base64,${base64str}'
            />
        </svg>
    `;
  
    return `data:image/svg+xml;base64,${strToBase64(blurSvg)}`;
}

exports.addWaterMark = async (url, largura, altura) => {
    const imagem = await urlToBase64("conteudos/imagens/" + url);
    const marcaDaAgua = await urlToBase64("imagens/marcaDaAgua.png");
    const marcaDaAguaTransparente = await urlToBase64("imagens/marcaDaAguaTransparente.png");

    const larguraDaMarca = "90px";
    const alturaDaMarca = "17px";
    const larguraDaMarcaTransparente = "75px";
    const alturaDaMarcaTransparente = "13px";
    const gap = "10px";
  
    const imagemMarcada = `
        <svg xmlns='http://www.w3.org/2000/svg' width='${largura}' height='${altura}' viewBox='0 0 ${largura} ${altura}' >
            <defs>
                <filter
                    xmlns:xlink='http://www.w3.org/1999/xlink'
                    id='imageWithWaterMarks'
                    color-interpolation-filters='sRGB'
                >
                    <feImage
                        result='first mark'
                        x='calc(100% - ${larguraDaMarca} - ${gap})'
                        y='calc(100% - ${alturaDaMarca} - ${gap})'
                        width='${larguraDaMarca}'
                        height='${alturaDaMarca}'
                        xlink:href='data:image/avif;base64,${marcaDaAgua}'
                    />
                    <feImage
                        result='second mark'
                        x='${gap}'
                        y='${gap}'
                        width='${larguraDaMarcaTransparente}'
                        height='${alturaDaMarcaTransparente}'
                        xlink:href='data:image/avif;base64,${marcaDaAguaTransparente}'
                    />
                    <feImage
                        result='third mark'
                        x='calc(50% - (${larguraDaMarca} / 2))'
                        y='calc(50% - (${alturaDaMarca} / 2))'
                        width='${larguraDaMarcaTransparente}'
                        height='${alturaDaMarcaTransparente}'
                        xlink:href='data:image/avif;base64,${marcaDaAguaTransparente}'
                    />
                    <feBlend
                        in='first mark'
                        in2='second mark'
                        result='both marks'
                    />
                    <feBlend
                        in='both marks'
                        in2='third mark'
                        result='marks'
                    />
                    <feBlend
                        in='marks'
                        in2='SourceGraphic'
                    />
                </filter>
            </defs>
            <image
                filter='url(#imageWithWaterMarks)'
                x='0'
                y='0'
                width='${largura}'
                height='${altura}'
                href='data:image/avif;base64,${imagem}'
            />
        </svg>
    `;
  
    return `data:image/svg+xml;base64,${strToBase64(imagemMarcada)}`;
}
