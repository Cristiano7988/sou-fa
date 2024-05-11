const { transforma } = require("./transforma");

const erros = (data) => Object.entries(data).filter(([chave, valor]) => /Invalido/.test(chave) && valor).length;

const camposAusentes = (data, camposObrigatorios) => {
    let campos = camposObrigatorios.filter(campo => !(campo in data));
    campos = campos.length
        ? "Preencha os seguintes campos: " + transforma.arrayEmTexto(campos)
        : ""
    
    return campos;
}

exports.possui = {
    erros,
    camposAusentes
}
