const Configuracao = require('../config/database');
const format = require('pg-format');

const sqlMarcas =
    ` select mrc_id, mrc_descricao from marca `;

const insertMarcas =
    ` insert into marca
        (mrc_id, mrc_descricao)
    values
        %L `;

const deleteMarcas =
    ` delete from marca where mrc_id in (%s) `; 

const updateMarcas = 
    `   update marca set mrc_descricao = $2 where mrc_id = $1 `;

exports.getMarcas = function getMarcas(){

    const ConexaoBanco = Configuracao.conexao;
    
    return new Promise((resolve, reject) => {

        ConexaoBanco.query(sqlMarcas, (error, results) => {
        
            if (error){
                return reject(error);
            }else{              
                const marca = results.rows;
                return resolve(marca);
            }
        });
    });
};

exports.insert = function insert(ObjMarcas){

    return new Promise((resolve, reject) => {
        
        const ConexaoBanco  = Configuracao.conexao;
        var paramsMarca     = [];

        ObjMarcas.forEach(marca => {
            
            paramsMarca.push([
                marca.mrc_id, marca.mrc_descricao
            ]);
        });       

        var sql = format(insertMarcas, paramsMarca);
       
        ConexaoBanco.query(sql, (error, results) => {
            
            if (error){
                console.log('Erro ao inserir marca(s). '+ error);
                return reject(error);
            }
            else{
                console.log('Marca(s) inserido com sucesso! Quantidade registros:', results.rowCount);
                var marca = results.rows;
                return resolve(marca);
            }
        });
    });
};

exports.delete = function(idMarcas){

    const sqlDeleteMarca = format(deleteMarcas, idMarcas);
   
    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlDeleteMarca, function(error, results){
            if(error){
                return reject(error);
            }
            else{
                return resolve({
                    mensagem: 'Delete marca(s) efetuado com sucesso.',
                    registros: results.rowCount
                });
            }
        });
    });
};

exports.update = async function update(ObjMarcas){

    const client = await Configuracao.conexao.connect();

    try {        
        let docAtualizados = [];
        
        await client.query('BEGIN')
        
        for (var i = 0; i < ObjMarcas.length; ++i){                            
                
            docAtualizados.push(ObjMarcas[i].mrc_id);

            const res = await client.query(updateMarcas, [
                ObjMarcas[i].mrc_id, ObjMarcas[i].mrc_descricao
            ]);
        };

        console.log('Marca(s) atualizado com sucesso! ID:', docAtualizados);
        await client.query('COMMIT');
        return true;
    } catch (e) {
        await client.query('ROLLBACK')
        throw e
    } finally {
        // Certifique-se de liberar o cliente antes de qualquer tratamento de erro,
        // apenas no caso de o próprio tratamento de erros gerar um erro.
        client.release()
    }
};
// Catch foi passado para o controller resolver e retornar o erro.
// ().catch(err => console.error(err.stack));