const Configuracao = require('../config/database');
const format = require('pg-format');

const sqlPromocao =
    `   select 
	        prm_id, prm_descricao, prm_dt_lancamento, prm_dt_inicial, prm_dt_final
        from 
	        promocao `;

const insertPromocao =
    `   insert into promocao
            (prm_id, prm_descricao, prm_dt_lancamento, prm_dt_inicial, prm_dt_final)
        values
            %L `;

const deletePromocao =
    `   delete from promocao where prm_id in (%s) `;

const updatePromocao =
    `   update promocao 
            set prm_descricao = $2, prm_dt_lancamento = $3, prm_dt_inicial = $4, prm_dt_final = $5, 
            prm_dt_ultima_atualizacao = now() AT TIME ZONE 'America/Sao_Paulo'
        where
            prm_id = $1 `;

exports.getPromocao = function getPromocao(parametro){

    const ConexaoBanco = Configuracao.conexao;
    
    return new Promise((resolve, reject) => {

        ConexaoBanco.query(sqlPromocao+parametro+' order by prm_id', (error, results) => {
        
            if (error){
                return reject(error);
            }else{              
                const promocao = results.rows;
                return resolve(promocao);
            }
        });
    });
};

exports.insert = function insert(ObjPromocao){

    return new Promise((resolve, reject) => {
        
        const ConexaoBanco  = Configuracao.conexao;
        var paramsPromocao  = [];

        ObjPromocao.forEach(promocao => {
            
            paramsPromocao.push([
                promocao.prm_id, promocao.prm_descricao, promocao.prm_dt_lancamento, promocao.prm_dt_inicial, 
                promocao.prm_dt_final
            ]);
        });       

        var sql = format(insertPromocao, paramsPromocao);
       
        ConexaoBanco.query(sql, (error, results) => {
            
            if (error){
                console.log('Erro ao inserir promoção. '+ error);
                return reject(error);
            }
            else{
                console.log('Promoção inserido com sucesso! Quantidade registros:', results.rowCount);
                var marca = results.rows;
                return resolve(marca);
            }
        });
    });
};

exports.delete = function(idPromocao){

    const sqlDeletePromocao = format(deletePromocao, idPromocao);
   
    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlDeletePromocao, function(error, results){
            if(error){
                return reject(error);
            }
            else{
                return resolve({
                    mensagem: 'Delete promoção efetuado com sucesso.',
                    registros: results.rowCount
                });
            }
        });
    });
};

exports.update = async function update(ObjPromocao){

    const client = await Configuracao.conexao.connect();

    try {        
        let docAtualizados = [];
        
        await client.query('BEGIN')
        
        for (var i = 0; i < ObjPromocao.length; ++i){                            
                
            docAtualizados.push(ObjPromocao[i].prm_id);

                const res = await client.query(updatePromocao, [
                    ObjPromocao[i].prm_id, ObjPromocao[i].prm_descricao, ObjPromocao[i].prm_dt_lancamento, ObjPromocao[i].prm_dt_inicial, 
                    ObjPromocao[i].prm_dt_final
                ]);
        };                

        console.log('Promoção atualizado com sucesso! ID:', docAtualizados);
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