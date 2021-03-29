const Configuracao = require('../config/database');
const format = require('pg-format');

const sqlTiposPedido =
    ` select tpp_id, tpp_nome, tpp_gera_financ, tpp_baixa_estoq, tpp_tipo, tpp_vlr_total_zerado from tipos_pedido `;

const insertTiposPedido =
    ` insert into tipos_pedido
        (tpp_id, tpp_nome, tpp_gera_financ, tpp_baixa_estoq, tpp_tipo, tpp_vlr_total_zerado)
    values
        %L `;

const deleteTiposPedido =
    `   WITH retorno AS 
            (DELETE FROM tipos_pedido WHERE tpp_id in (%s) RETURNING tpp_id, 'tiposPedido', now() AT TIME ZONE 'America/Sao_Paulo')
        INSERT INTO 
            ocorrencias (oco_id_tabela, oco_tabela, oco_dt_ultima_atualizacao) SELECT * FROM retorno; `;

const updateTiposPedido = 
    `   update tipos_pedido set
            tpp_nome = $2, tpp_gera_financ = $3, tpp_baixa_estoq = $4, 
            tpp_tipo = $5, tpp_vlr_total_zerado = $6, tpp_dt_ultima_atualizacao = now() AT TIME ZONE 'America/Sao_Paulo' 
        where 
            tpp_id = $1 `;

exports.retonarTiposPedidoApp = function retonarTiposPedidoApp(package){
    
    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        var params = [];
    
        if (package.pacotefull){
            var addWhere = ' ';
        }else{
            var addWhere = ' where tpp_dt_ultima_atualizacao > $1 ';
            params.push(package.data);
        }

        ConexaoBanco.query(sqlTiposPedido+addWhere, params, (error, results) => {
        
            if (error){
                return reject(error);
            }else{              
                const tiposPedidos = results.rows;
                return resolve(tiposPedidos);
            }
        });
    });
};

exports.getTiposPedido = function getTiposPedido(){

    const ConexaoBanco = Configuracao.conexao;
    
    return new Promise((resolve, reject) => {

        ConexaoBanco.query(sqlTiposPedido, (error, results) => {
        
            if (error){
                return reject(error);
            }else{              
                const tiposPedidos = results.rows;
                return resolve(tiposPedidos);
            }
        });
    });
};

exports.insert = function insert(ObjTiposPedido){

    return new Promise((resolve, reject) => {
        
        const ConexaoBanco  = Configuracao.conexao;
        var paramsTiposPedido     = [];

        ObjTiposPedido.forEach(tiposPedidos => {
            
            paramsTiposPedido.push([
                tiposPedidos.tpp_id, tiposPedidos.tpp_nome, tiposPedidos.tpp_gera_financ, tiposPedidos.tpp_baixa_estoq, 
                tiposPedidos.tpp_tipo, tiposPedidos.tpp_vlr_total_zerado
            ]);
        });       

        var sql = format(insertTiposPedido, paramsTiposPedido);
       
        ConexaoBanco.query(sql, (error, results) => {
            
            if (error){
                console.log('Erro ao inserir tipo(s) de pedido. '+ error);
                return reject(error);
            }
            else{
                console.log('Tipo(s) de pedido inserido com sucesso! Quantidade registros:', results.rowCount);
                var tiposPedidos = results.rows;
                return resolve(tiposPedidos);
            }
        });
    });
};

exports.delete = function(idTiposPedido){

    const sqlDeleteTiposPedido = format(deleteTiposPedido, idTiposPedido);
   
    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlDeleteTiposPedido, function(error, results){
            if(error){
                return reject(error);
            }
            else{
                return resolve({
                    mensagem: 'Delete tipo(s) de pedido efetuado com sucesso.',
                    registros: results.rowCount
                });
            }
        });
    });
};

exports.update = async function update(ObjTiposPedido){

    const client = await Configuracao.conexao.connect();

    try {        
        let docAtualizados = [];
        
        await client.query('BEGIN')
        
        for (var i = 0; i < ObjTiposPedido.length; ++i){                            
                
            docAtualizados.push(ObjTiposPedido[i].tpp_id);

            const res = await client.query(updateTiposPedido, [
                ObjTiposPedido[i].tpp_id, ObjTiposPedido[i].tpp_nome, ObjTiposPedido[i].tpp_gera_financ, 
                ObjTiposPedido[i].tpp_baixa_estoq, ObjTiposPedido[i].tpp_tipo, ObjTiposPedido[i].tpp_vlr_total_zerado
            ]);
        };

        console.log('Tipo(s) de pedido atualizado com sucesso! ID:', docAtualizados);
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