const Configuracao = require('../config/database');
const format = require('pg-format');

const sqlRestricoes =
    ` select res_id, res_descricao, res_figura, res_situacao, res_senha, res_bloq_debitos from restricoes `;

const insertRestricoes =
    ` insert into restricoes
        (res_id, res_descricao, res_figura, res_situacao, res_senha, res_bloq_debitos)
    values
        %L `;

const deleteRestricoes =
    ` delete from restricoes where res_id in (%s) `; 

const updateRestricoes = 
    `   update 
            restricoes set res_descricao = $2, res_figura = $3, res_situacao = $4, res_senha = $5, res_bloq_debitos = $6
        where 
            res_id = $1 `;

exports.getRestricoes = function getRestricoes(){

    const ConexaoBanco = Configuracao.conexao;
    
    return new Promise((resolve, reject) => {

        ConexaoBanco.query(sqlRestricoes, (error, results) => {
        
            if (error){
                return reject(error);
            }else{              
                const restricoes = results.rows;
                return resolve(restricoes);
            }
        });
    });
};

exports.insert = function insert(ObjRestricoes){

    return new Promise((resolve, reject) => {
        
        const ConexaoBanco  = Configuracao.conexao;
        var paramsRestricoes     = [];

        ObjRestricoes.forEach(restricoes => {
            
            paramsRestricoes.push([
                restricoes.res_id, restricoes.res_descricao, restricoes.res_figura, 
                restricoes.res_situacao, restricoes.res_senha, restricoes.res_bloq_debitos
            ]);
        });       

        var sql = format(insertRestricoes, paramsRestricoes);
       
        ConexaoBanco.query(sql, (error, results) => {
            
            if (error){
                console.log('Erro ao inserir restrições. '+ error);
                return reject(error);
            }
            else{
                console.log('Restrições inserido com sucesso! Quantidade registros:', results.rowCount);
                var restricao = results.rows;
                return resolve(restricao);
            }
        });
    });    
};

exports.delete = function(idRestricao){

    const sqlDeleteRestricoes = format(deleteRestricoes, idRestricao);
   
    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlDeleteRestricoes, function(error, results){
            if(error){
                return reject(error);
            }
            else{
                return resolve({
                    mensagem: 'Delete restrições efetuado com sucesso.',
                    registros: results.rowCount
                });
            }
        });
    });
};

exports.update = async function update(ObjRestricoes){

    const client = await Configuracao.conexao.connect();

    try {        
        let docAtualizados = [];
        
        await client.query('BEGIN')
        
        for (var i = 0; i < ObjRestricoes.length; ++i){                            
                
            docAtualizados.push(ObjRestricoes[i].res_id);

            const res = await client.query(updateRestricoes, [
                ObjRestricoes[i].res_id, ObjRestricoes[i].res_descricao, ObjRestricoes[i].res_figura, ObjRestricoes[i].res_situacao, 
                ObjRestricoes[i].res_senha, ObjRestricoes[i].res_bloq_debitos
            ]);

        };

        console.log('Restrições atualizado com sucesso! ID:', docAtualizados);
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