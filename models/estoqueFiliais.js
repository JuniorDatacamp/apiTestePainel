const Configuracao = require('../config/database');
const format = require('pg-format');

const sqlEstoqueFiliais =
    ` select estfil_id, fil_id, pro_referencia, estfil_estoque from estoque_filiais `;

const insertEstoqueFiliais =
    ` insert into estoque_filiais
        (fil_id, pro_referencia, estfil_estoque)
    values
        %L `;

const deleteEstoqueFiliais =
    ` delete from estoque_filiais where fil_id = $1 and pro_referencia in (%s) `; 

const updateEstoqueFiliais = 
    `   update estoque_filiais set estfil_estoque = $3, estfil_dt_ultima_atualizacao = now() AT TIME ZONE 'America/Sao_Paulo' where fil_id = $1 and pro_referencia = $2 `;

exports.getEstoqueFiliais = function getEstoqueFiliais(){    
    
    return new Promise((resolve, reject) => {        

        const ConexaoBanco = Configuracao.conexao;
        ConexaoBanco.query(sqlEstoqueFiliais, (error, results) => {

            if (error){
                return reject(error);
            }else{
                const estoqueFiliais = results.rows;
                return resolve(estoqueFiliais);
            }                
        });
    }); 
};

exports.insert = function insert(ObjEstoqueFiliais){

    return new Promise((resolve, reject) => {
        
        const ConexaoBanco  = Configuracao.conexao;

        var paramsEstoqueFiliais      = [];

        ObjEstoqueFiliais.forEach(EstoqueFiliais => {
            
            paramsEstoqueFiliais.push([
                EstoqueFiliais.fil_id, EstoqueFiliais.pro_referencia, EstoqueFiliais.estfil_estoque
            ]);
        });       

        var sql = format(insertEstoqueFiliais, paramsEstoqueFiliais);
       
        ConexaoBanco.query(sql, (error, results) => {            
           
            if (error){
                console.log('Erro ao inserir Estoque da Filial. '+ error);
                return reject(error);
            }
            else{
                console.log('Estoque Filial inserido com sucesso! Quantidade registros:', results.rowCount);
                var EstoqueFiliais = results.rows;
                return resolve(EstoqueFiliais);
            }
        });
    });
};

exports.delete = function(filId, arrayProReferencia){

    const sqlDeleteEstoqueFiliais = format(deleteEstoqueFiliais, arrayProReferencia);
   
    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlDeleteEstoqueFiliais, [filId], function(error, results){
            if(error){
                return reject(error);
            }
            else{
                return resolve({         
                    mensagem: 'Delete Estoque Filial efetuado com sucesso.',
                    registros: results.rowCount
                });
            }
        });
    });
};

exports.update = async function update(ObjEstoqueFiliais){

    const client = await Configuracao.conexao.connect();

    try {        
        let docAtualizados = [];
        
        await client.query('BEGIN')
        
        for (var i = 0; i < ObjEstoqueFiliais.length; ++i){                            
                
            docAtualizados.push(ObjEstoqueFiliais[i].fil_id, ObjEstoqueFiliais[i].pro_referencia);

            const res = await client.query(updateEstoqueFiliais, [
                    ObjEstoqueFiliais[i].fil_id, ObjEstoqueFiliais[i].pro_referencia, ObjEstoqueFiliais[i].estfil_estoque
                ]);
            };

            console.log('Estoque Filial atualizado com sucesso! Filial_ID e REF', docAtualizados);
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