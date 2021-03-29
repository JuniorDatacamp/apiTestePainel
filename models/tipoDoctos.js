const Configuracao = require('../config/database');
const format = require('pg-format');

const sqlTipoDocto =
    ` select tip_id, tip_descricao, tip_indicador_de_titulo from tipo_docto `;

const insertTipoDocto =
    ` insert into tipo_docto
        (tip_id, tip_descricao, tip_indicador_de_titulo)
    values
        %L `;

const deleteTipoDocto =
    ` delete from tipo_docto where tip_id in (%s) `;

const updateTipoDocto = 
    `   update tipo_docto set tip_descricao = $2, tip_indicador_de_titulo = $3, tip_dt_ultima_atualizacao = now() AT TIME ZONE 'America/Sao_Paulo' where tip_id = $1 `;

exports.getTipoDocto = function getTipoDocto(){

    //Utilizar para chamada de get, receber todos os campos.

    const ConexaoBanco = Configuracao.conexao;
    
    return new Promise((resolve, reject) => {

        ConexaoBanco.query(sqlTipoDocto, (error, results) => {
        
            if (error){
                return reject(error);
            }else{              
                const tipoDocto = results.rows;
                return resolve(tipoDocto);
            }
        });
    });
};

exports.insert = function insert(ObjTipoDocto){
  
    return new Promise((resolve, reject) => {
        
        const ConexaoBanco  = Configuracao.conexao;
        var paramsTipoDocto     = [];

        ObjTipoDocto.forEach(tipoDocto => {
            
            paramsTipoDocto.push([                
                tipoDocto.tip_id, tipoDocto.tip_descricao, tipoDocto.tip_indicador_de_titulo
            ]);
        });       

        var sql = format(insertTipoDocto, paramsTipoDocto);
       
        ConexaoBanco.query(sql, (error, results) => {
            
            if (error){
                console.log('Erro ao inserir tipos documentos. '+ error);
                return reject(error);
            }
            else{
                console.log('Tipos Documentos inserido com sucesso! Quantidade registros:', results.rowCount);
                var marca = results.rows;
                return resolve(marca);
            }
        });
    });     
};

exports.delete = function(idTipoDocto){

    const sqlDeleteTipoDocto = format(deleteTipoDocto, idTipoDocto);
   
    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlDeleteTipoDocto, function(error, results){
            if(error){
                return reject(error);
            }
            else{
                return resolve({
                    mensagem: 'Delete tipos documentos efetuado com sucesso.',
                    registros: results.rowCount
                });
            }
        });
    });    
};

exports.update = async function update(ObjTipoDocto){

    const client = await Configuracao.conexao.connect();

    try {        
        let docAtualizados = [];
        
        await client.query('BEGIN')
        
        for (var i = 0; i < ObjTipoDocto.length; ++i){                            
                
            docAtualizados.push(ObjTipoDocto[i].tip_id);

            const res = await client.query(updateTipoDocto, [
                ObjTipoDocto[i].tip_id, ObjTipoDocto[i].tip_descricao, 
                ObjTipoDocto[i].tip_indicador_de_titulo
            ]);
        };

        console.log('Tipos Documentos atualizado com sucesso! ID:', docAtualizados);
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