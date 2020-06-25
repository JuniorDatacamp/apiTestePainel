function criptografar(texto){

    var emBase64 = new Buffer.from(texto).toString("base64")
        
    return emBase64;
}

function descriptografar(texto){
   
    var deBase64 = new Buffer.from(texto, "base64").toString("ascii")

    return deBase64;
}

const funcUtils = {
    cripto: (texto) => criptografar(texto),
    descripto: (texto) => descriptografar(texto)
}

export default funcUtils;