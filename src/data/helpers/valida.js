const { transforma } = require("./transforma");

const regras = async (objeto) => {
    let regras = [];
    const [[chave, valor]] = Object.entries(objeto);

    if (!valor) regras = ["campo obrigatório"];

    if (valor) switch (chave) {
        case "email":
            const [nomeDeUsario, dominio] = valor.split("@");

            regras = [
                !/@/.test(valor)  && "inválido",
                valor.length <= 4 && "curto",
                !nomeDeUsario     && "nome de usuário do email não informado",
                !dominio          && "sem domínio",
            ];
            break;

        case "senha":
            regras = [
                (valor.length <= 7) && "deve ter mais que 8 caracteres",
                !/\d/.test(valor)   && "deve conter um número",
                !/\D/.test(valor)   && "deve conter um dígito"
            ];
            break;

        case "midia":
            const [kB, MB] = Array(2).fill(1024);
            const limiteEmMB = 30;
            const formatosDeImagem = ["bmp", "jpg", "png", "gif", "jpeg"];
            const mimeTypesDeImagem = ["image/bmp", "image/jpg", "image/png", "image/gif", "image/jpeg"];
            const [nomeDoArquivo, formatoDoArquivo] = valor.name.split(".");

            const formatoValido = formatosDeImagem.filter(formato => formato === formatoDoArquivo);
            const mimeTypeValido = mimeTypesDeImagem.filter(mime => mime === valor.type);
            const tamanhoInvalido = valor.size / kB / MB > limiteEmMB;

            regras = [
                !formatoValido.length && `o formato deve ser um dos seguintes: ${transforma.arrayEmTexto(formatosDeImagem)}`,
                !mimeTypeValido.length && `o mimeType deve ser um dos seguintes: ${transforma.arrayEmTexto(mimeTypesDeImagem)}`,
                tamanhoInvalido && `não deve ser maior que ${limiteEmMB} MB`
            ];
            break;

        case "valorDoConteudo":
            const limiteDoValorDoConteudo = 999;

            regras = [
                valor < 0 && "deve ser maior ou igual a zero",
                valor > limiteDoValorDoConteudo && `deve ser menor ou igual a ${limiteDoValorDoConteudo}`
            ];
            break;

    }

    return regras.filter(Boolean).map(regra => ["email", "senha"].includes(chave) ? regra : "<br />" + transforma.emCapitalize(regra))
}

exports.valida = {
    regras
}
