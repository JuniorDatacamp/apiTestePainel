const Configuracao = require('../config/database');
const format = require('pg-format');

const sqlItemPromocao =
    `   select
            ipr_id, prm_id, pro_id, ipr_vlr_promocao, pgr_id
        from
	        item_promocao `;

const insertItemPromocao =
    `   insert into item_promocao
            (ipr_id, prm_id, pro_id, ipr_vlr_promocao, pgr_id)
        values
            %L `;

const deleteItemPromocao =
    `   delete from item_promocao where ipr_id in (%s) `;

const updateItemPromocao =
    `   update item_promocao
            set prm_id = $2, pro_id = $3, ipr_vlr_promocao = $4, pgr_id = $5, ipr_dt_ultima_atualizacao = now() AT TIME ZONE 'America/Sao_Paulo'
        where
            ipr_id = $1 `;

exports.getItemPromocao = function getItemPromocao(parametro){

    const ConexaoBanco = Configuracao.conexao;
    
    return new Promise((resolve, reject) => {

        ConexaoBanco.query(sqlItemPromocao+parametro+' order by ipr_id', (error, results) => {
        
            if (error){
                return reject(error);
            }else{              
                const itemPromocao = results.rows;
                return resolve(itemPromocao);
            }
        });
    });
};

exports.insert = function insert(ObjItemPromocao){

    return new Promise((resolve, reject) => {
        
        const ConexaoBanco  = Configuracao.conexao;
        var paramsItemPromocao     = [];

        ObjItemPromocao.forEach(itemPromocao => {

            paramsItemPromocao.push([
                itemPromocao.ipr_id, itemPromocao.prm_id, itemPromocao.pro_id, itemPromocao.ipr_vlr_promocao,
                itemPromocao.pgr_id
            ]);
        });       

        var sql = format(insertItemPromocao, paramsItemPromocao);
       
        ConexaoBanco.query(sql, (error, results) => {
            
            if (error){
                console.log('Erro ao inserir item de promoção. '+ error);
                return reject(error);
            }
            else{
                console.log('Item de promoção inserido com sucesso! Quantidade registros:', results.rowCount);
                var marca = results.rows;
                return resolve(marca);
            }
        });
    });
};

exports.delete = function(idItemPromocao){

    const sqlDeleteItemPromocao = format(deleteItemPromocao, idItemPromocao);
   
    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlDeleteItemPromocao, function(error, results){
            if(error){
                return reject(error);
            }
            else{
                return resolve({
                    mensagem: 'Delete item de promoção efetuado com sucesso.',
                    registros: results.rowCount
                });
            }
        });
    });
};

exports.update = async function update(ObjItemPromocao){

    const client = await Configuracao.conexao.connect();

    try {        
        let docAtualizados = [];
        
        await client.query('BEGIN')
        
        for (var i = 0; i < ObjItemPromocao.length; ++i){                            
                
            docAtualizados.push(ObjItemPromocao[i].ipr_id);

            const res = await client.query(updateItemPromocao, [
                ObjItemPromocao[i].ipr_id, ObjItemPromocao[i].prm_id, ObjItemPromocao[i].pro_id, 
                ObjItemPromocao[i].ipr_vlr_promocao, ObjItemPromocao[i].pgr_id                    
            ]);

        };

        console.log('Item de promoção atualizado com sucesso! ID_itemPromocao:', docAtualizados);
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