// const objItemVenda = require('../controllers/itemVendasController').itemVenda;
const objItemVenda = require('../models/itemVendas').itemVenda;
const itemVendaModel = require('../models/itemVendas');
const format = require('pg-format');
/*
    "recebimento" é confirmação da retaguarda quando o pedido foi importado com sucesso.    
    
    coluna "enviado" vai ficar sempre 'S' no select, pois se existe o registro no banco de dados é sinal que ele já foi enviado.
    coluna "recebimento" por ser 'S' quando ven_id = null ou ven_situacao = 'P'
*/

//Vendas para App
class venda {
        
    constructor(obj) {
        this.ven_uuid       = obj.ven_uuid,
        this.ped_id         = obj.ped_id,
        this.vdd_id         = obj.vdd_id, 
        this.tpg_id         = obj.tpg_id,
        this.ven_data       = obj.ven_data,
        this.ven_total      = obj.ven_total, 
        this.ven_tipo       = obj.ven_tipo, 
        this.ven_situacao   = obj.ven_situacao, 
        this.ven_observacao = obj.ven_observacao, 
        this.ven_tipo_venda = obj.ven_tipo_venda, 
        this.ven_urgente    = obj.ven_urgente, 
        this.ven_dt_entrega = obj.ven_dt_entrega,
        this.tpp_id         = obj.tpp_id, 
        this.tpp_nome       = obj.tpp_nome,
        this.recebimento    = obj.recebimento,
        this.enviado        = obj.enviado,
        this.cli_uuid       = obj.cli_uuid, 
        this.cli_id         = obj.cli_id,
        this.itemvendas     = []
    }
};

const Configuracao = require('../config/database');

const sqlSituacaoVendaApp = 
    `  select
            ven_uuid, ped_id, ven_situacao,
            case
                when ven_id isnull then 'N'
            else 'S'
            end as recebimento,
            'S' as enviado
        from
            venda
        where
            ven_uuid in (%s)
    `;

const sqlVendasApp = 
    `   select
            x.ven_uuid, ped_id, x.vdd_id, tpg_id, x.ven_data,
            ven_total, ven_tipo, ven_situacao, ven_observacao, 
            ven_tipo_venda, ven_urgente, ven_dt_entrega,
            x.tpp_id, tpp_nome,
            case
                when ven_id isnull then 'N'
            else 'S'
            end as recebimento,
            'S' as enviado,
            --(select json_agg(ValorJson) from vw_agruparitemvendaJSON where ven_uuid = x.ven_uuid group by ven_uuid) as itemvendas,
            cli_uuid, cli_id,
            itv_id, itv_descricao, itv_id, itv_uuid, pro_id, itv_refer, itv_descricao, itv_qtde,
            itv_desconto, itv_precovenda, itv_valortotal, itv_data_inclusao, i.ven_data, itv_promocao            
        from 
            (select
                row_number() over (partition by cli_uuid order by ped_id desc) as r,
                v.*
                from
            venda v) x
        inner join
            item_venda i on i.ven_uuid = x.ven_uuid
        left join
            tipos_pedido t on x.tpp_id = t.tpp_id
        where
            x.r <= 10 and (cast(x.vdd_id as varchar(10)) ilike $1)
    `;

const sqlVendaDuplicada =
    `   select
            ven_uuid, cli_id, cli_uuid, ped_id, vdd_id, tpg_id, ven_data,
            ven_total, ven_tipo, ven_situacao, ven_observacao, 
            ven_tipo_venda, ven_urgente, ven_dt_entrega,
            v.tpp_id, tpp_nome,
            case
                when ven_id isnull then 'N'
            else 'S'
            end as recebimento,
            'S' as enviado,
            ven_cod_verificador,
            (select json_agg(ValorJson) from vw_agruparitemvendaJSON where ven_uuid = v.ven_uuid group by ven_uuid) as itemvendas           
        from 
            venda v
        left join
            tipos_pedido t on v.tpp_id = t.tpp_id    
        where
            ven_cod_verificador = $1 `;

const textQueryInsertApp =
    "   INSERT INTO venda(  "+
    "       cli_uuid, cli_id, vdd_id, tpg_id, ven_data,   "+
    "       ven_total, ven_observacao, ven_tipo, ven_tipo_venda, ven_urgente,  "+
    "       ven_dt_entrega, ven_desconto, ven_situacao, ven_cod_verificador, tpp_id "+
    "   )       "+
    "   VALUES      "+
    "   (       "+ 
    "       $1, $2, $3, $4, $5, "+
    "       $6, $7, $8, $9, $10, "+
    "       $11, $12, $13, $14, $15  "+
    "   ) RETURNING ven_uuid, ped_id; "

const sqlVendas =
    `   select
            v.*,
            (select json_agg(ValorJson) from vw_agruparitemvendaJSON where ven_uuid = v.ven_uuid group by ven_uuid) as itemvendas
        from
            venda v 
        inner join
            item_venda i on v.ven_uuid = i.ven_uuid `;

const insertVenda =
    `   insert into venda
        (
            ven_id, ven_data, cli_id, cli_uuid, vdd_id, ven_tipo, ven_vecto1, ven_vecto2, ven_vecto3,
            ven_vecto4, ven_vecto5, ven_vecto6, ven_vecto7, ven_vecto8, ven_vecto9, ven_total, ven_desconto,
            ven_situacao, ven_entrada, trp_id, ven_observacao, mes_coo, mes_data, pdv_id, baixado, sai_numnota,
            ven_outras, tpg_id, ven_pedido, ven_vecto10, ven_vecto11, ven_vecto12, ven_quantparcelas,
            ven_diaparcelas, pre_id, ven_credito, sai_id, cag_id, ped_hora, ven_dt_entrega, ven_urgente,
            etg_id, ven_dt_inclusao, ven_tipo_venda, ven_dt_finalizacao, tpp_id, ven_ender_entrega, ven_num_bloco,
            ven_motorista, ven_contato, ven_prazo_entrega, ven_custo_bancario, reg_id, ven_cf_acertado
        )   
        values
            %L RETURNING ven_id, ven_uuid
    `;
const updateVenda =
    `   update venda set
            ven_data = $2, cli_id = $3, cli_uuid = $4, vdd_id = $5, ven_tipo = $6, ven_vecto1 = $7, ven_vecto2 = $8, 
            ven_vecto3 = $9, ven_vecto4 = $10, ven_vecto5 = $11, ven_vecto6 = $12, ven_vecto7 = $13, ven_vecto8 = $14, 
            ven_vecto9 = $15, ven_total = $16, ven_desconto = $17, ven_situacao = $18, ven_entrada = $19, trp_id = $20, 
            ven_observacao = $21, mes_coo = $22, mes_data = $23, pdv_id = $24, baixado = $25, sai_numnota = $26,
            ven_outras = $27, tpg_id = $28, ven_pedido = $29, ven_vecto10 = $30, ven_vecto11 = $31, ven_vecto12 = $32, 
            ven_quantparcelas = $33, ven_diaparcelas = $34, pre_id = $35, ven_credito = $36, sai_id = $37, cag_id = $38, 
            ped_hora = $39, ven_dt_entrega = $40, ven_urgente = $41, etg_id = $42, ven_dt_inclusao = $43, ven_tipo_venda = $44, 
            ven_dt_finalizacao = $45, tpp_id = $46, ven_ender_entrega = $47, ven_num_bloco = $48, ven_motorista = $49, 
            ven_contato = $50, ven_prazo_entrega = $51, ven_custo_bancario = $52, reg_id = $53, ven_cf_acertado = $54,
            ven_id = $55, ven_dt_ultima_atualizacao = now() AT TIME ZONE 'America/Sao_Paulo'
        where
            ven_uuid = $1
    `;

const SqlDeleteVenda = 
    " delete from venda where ven_uuid in (%s) ";

const sqlOrderby =
    ' order by ped_id ';

exports.getSituacaoVendasApp = function(VenUUID){

    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;        

        const sqlVenda = format(sqlSituacaoVendaApp, VenUUID);

        console.log('Verificando situação das vendas...');
        ConexaoBanco.query(sqlVenda, (error, results) => {
        
            if (error){
                console.log('Erro ao verificar situação das vendas...');
                return reject(error);
            }else{  
                let vendas = results.rows;                

                return resolve(vendas);
            };            
        });
    });
};

//utilizar para app
exports.getVendasApp = function(package){
    
    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;
        var params;

        (package.vinculoClientesVendedor) ? params = package.codVendedor : params = '%';

        console.log('Consultando vendas...');
        ConexaoBanco.query(sqlVendasApp+sqlOrderby, [params], (error, results) => {        
        
            if (error){
                console.log('Erro ao consultar vendas app...');
                return reject(error);
            }else{  
                let vendas = results.rows;
                let uuid = null;
                var vendasSemDuplicar = [];
                var itemSemVenda = [];                
                
                vendas.forEach(function (iVendas, indice, arrayVendas) {

                    if (indice === 0){
                        uuid = iVendas.ven_uuid;
                        vendasSemDuplicar.push(new venda(iVendas));
                    }else{
                        
                        if(uuid == iVendas.ven_uuid){
                            uuid = iVendas.ven_uuid                                    
                        }else{
                            uuid = iVendas.ven_uuid;
                            vendasSemDuplicar.push(new venda(iVendas));
                        }                                
                    }                                
                });                

                vendas.forEach(function (iVendas, indice, arrayVendas) {
                    itemSemVenda.push(objItemVenda(iVendas));
                });

                vendasSemDuplicar.forEach(function(VeObj){

                    var itensVendas = itemSemVenda.filter(function(obj){                                                       

                        if (VeObj.ven_uuid == obj.ven_uuid){
                            return obj = objItemVenda(obj);
                        }                         
                    });

                    VeObj.itemvendas = itensVendas;
                });

                return resolve(vendasSemDuplicar);
            };            
        });
    });
};

exports.verificaVendaDuplicadasApp = function(ven_cod_verificador){
    
    return new Promise((resolve, reject) => {        

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlVendaDuplicada, [ven_cod_verificador], (error, results) => {
        
            if (error){
                console.log('Erro ao consultar venda duplicada...');
                return reject('Erro ao consultar venda duplicada...'+error);
            }else{

                let vendaDup;

                if (results.rowCount > 0){
                    console.log('Retornando venda duplicada...');
                    vendaDup = results.rows[0];
                    return reject(vendaDup);
                }else{
                    vendaDup = 0;
                    return resolve(vendaDup);
                }
            }
        });
    });
};

exports.insertApp = async function insertApp(ObjVendas){

    console.log('Gravando venda do aplicativo...', 'vendedor: ', ObjVendas.vdd_id, ObjVendas);
    
    const client = await Configuracao.conexao.connect();

    try {
        const aVenda        = ObjVendas;
        var arrayItemVenda  = [];
    
        ObjVendas.itemvendas.forEach(valor => {
            arrayItemVenda.push(objItemVenda(valor));
        });
    
        //Gambiarra por causa da retaguarda, trocou o campo por uma tabela.
        aVenda.ven_tipo_venda = 'P';

        await client.query('BEGIN')       
        
        const res = await client.query(textQueryInsertApp, [
            aVenda.cli_uuid, aVenda.cli_id, aVenda.vdd_id, aVenda.tpg_id, 
            aVenda.ven_data, aVenda.ven_total, aVenda.ven_observacao, aVenda.ven_tipo, aVenda.ven_tipo_venda, 
            aVenda.ven_urgente, aVenda.ven_dt_entrega, aVenda.ven_desconto, 'P', aVenda.ven_cod_verificador,
            aVenda.tpp_id
        ]);

        let resultVenda;
        resultVenda = {ven_uuid: res.rows[0].ven_uuid, ped_id: res.rows[0].ped_id};
                
        const sqlItem = itemVendaModel.SQLInsertApp(arrayItemVenda, resultVenda.ven_uuid);
        //Inserindo itens
        await client.query(sqlItem, []);

        console.log('Venda gravada com sucesso!', 'ven_uuid:', res.rows[0].ven_uuid, 'ped_id:', res.rows[0].ped_id, 'ven_cod_verificador:', aVenda.ven_cod_verificador);

        await client.query('COMMIT');
        //retornando para controller as vendas inseridas
        return res.rows[0];
    } catch (e) {
        await client.query('ROLLBACK')
        throw e
    } finally {
        // Certifique-se de liberar o cliente antes de qualquer tratamento de erro,
        // apenas no caso de o próprio tratamento de erros gerar um erro.
        client.release()
    }
};

exports.getVendas = function getVendas(parametro){

    const ConexaoBanco = Configuracao.conexao;
   
    return new Promise((resolve, reject) => {

        ConexaoBanco.query(sqlVendas+parametro, (error, results) => {
        
            if (error){
                return reject(error);
            }else{              
                const venda = results.rows;
                return resolve(venda);
            }
        });
    });
};

exports.insert = async function insert(ObjVendas){    

    const client = await Configuracao.conexao.connect();

    try {
        let paramsVenda = [];
        let docInclusos = [];

        ObjVendas.forEach(venda => {

            docInclusos.push(venda.ven_id);
            
            paramsVenda.push([                
                venda.ven_id, venda.ven_data, venda.cli_id, venda.cli_uuid, venda.vdd_id, venda.ven_tipo, venda.ven_vecto1, 
                venda.ven_vecto2, venda.ven_vecto3, venda.ven_vecto4, venda.ven_vecto5, venda.ven_vecto6, venda.ven_vecto7, 
                venda.ven_vecto8, venda.ven_vecto9, venda.ven_total, venda.ven_desconto, venda.ven_situacao, venda.ven_entrada,
                venda.trp_id, venda.ven_observacao, venda.mes_coo, venda.mes_data, venda.pdv_id, venda.baixado, venda.sai_numnota,
                venda.ven_outras, venda.tpg_id, venda.ven_pedido, venda.ven_vecto10, venda.ven_vecto11, venda.ven_vecto12, 
                venda.ven_quantparcelas, venda.ven_diaparcelas, venda.pre_id, venda.ven_credito, venda.sai_id, venda.cag_id, 
                venda.ped_hora, venda.ven_dt_entrega, venda.ven_urgente, venda.etg_id, venda.ven_dt_inclusao, venda.ven_tipo_venda, 
                venda.ven_dt_finalizacao, venda.tpp_id, venda.ven_ender_entrega, venda.ven_num_bloco, venda.ven_motorista, 
                venda.ven_contato, venda.ven_prazo_entrega, venda.ven_custo_bancario, venda.reg_id, venda.ven_cf_acertado
            ]);
        });

        var sqlInsertVenda = format(insertVenda, paramsVenda);
        
        await client.query('BEGIN')

        const res = await client.query(sqlInsertVenda, []);

        console.log('Venda(s) inserido com sucesso! Quantidade registros: ', res.rowCount, '\nIDs de venda(s)! VEN_ID:', docInclusos);
        await client.query('COMMIT');
        //retornando para controller as vendas inseridas
        return res.rows;
    } catch (e) {
        await client.query('ROLLBACK')
        throw e
    } finally {
        // Certifique-se de liberar o cliente antes de qualquer tratamento de erro,
        // apenas no caso de o próprio tratamento de erros gerar um erro.
        client.release()
    }
};

exports.delete = function(idVenda){

    const sqlDeleteVenda = format(SqlDeleteVenda, idVenda);
   
    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlDeleteVenda, function(error, results){
            if(error){
                return reject(error);
            }
            else{
                console.log('Delete venda(s) efetuado com sucesso. ven_uui:', idVenda);                
                return resolve({
                    mensagem: 'Delete venda(s) efetuado com sucesso.',
                    registros: results.rowCount
                });
            }
        });
    });
};

exports.update = async function update(ObjVendas){

    const client = await Configuracao.conexao.connect();

    try {        
        let docAtualizados = [];
        
        await client.query('BEGIN')
        
        for (var i = 0; i < ObjVendas.length; ++i){
            
            docAtualizados.push(ObjVendas[i].ven_id);

            const res = await client.query(updateVenda, [
                ObjVendas[i].ven_uuid, ObjVendas[i].ven_data, ObjVendas[i].cli_id, ObjVendas[i].cli_uuid, ObjVendas[i].vdd_id, ObjVendas[i].ven_tipo, 
                ObjVendas[i].ven_vecto1, ObjVendas[i].ven_vecto2, ObjVendas[i].ven_vecto3, ObjVendas[i].ven_vecto4, ObjVendas[i].ven_vecto5, 
                ObjVendas[i].ven_vecto6, ObjVendas[i].ven_vecto7, ObjVendas[i].ven_vecto8, ObjVendas[i].ven_vecto9, ObjVendas[i].ven_total, 
                ObjVendas[i].ven_desconto, ObjVendas[i].ven_situacao, ObjVendas[i].ven_entrada, ObjVendas[i].trp_id, ObjVendas[i].ven_observacao, 
                ObjVendas[i].mes_coo, ObjVendas[i].mes_data, ObjVendas[i].pdv_id, ObjVendas[i].baixado, ObjVendas[i].sai_numnota, ObjVendas[i].ven_outras, 
                ObjVendas[i].tpg_id, ObjVendas[i].ven_pedido, ObjVendas[i].ven_vecto10, ObjVendas[i].ven_vecto11, ObjVendas[i].ven_vecto12, 
                ObjVendas[i].ven_quantparcelas, ObjVendas[i].ven_diaparcelas, ObjVendas[i].pre_id, ObjVendas[i].ven_credito, ObjVendas[i].sai_id, 
                ObjVendas[i].cag_id, ObjVendas[i].ped_hora, ObjVendas[i].ven_dt_entrega, ObjVendas[i].ven_urgente, ObjVendas[i].etg_id, 
                ObjVendas[i].ven_dt_inclusao, ObjVendas[i].ven_tipo_venda, ObjVendas[i].ven_dt_finalizacao, ObjVendas[i].tpp_id, 
                ObjVendas[i].ven_ender_entrega, ObjVendas[i].ven_num_bloco, ObjVendas[i].ven_motorista, ObjVendas[i].ven_contato, 
                ObjVendas[i].ven_prazo_entrega, ObjVendas[i].ven_custo_bancario, ObjVendas[i].reg_id, ObjVendas[i].ven_cf_acertado, 
                ObjVendas[i].ven_id
            ]);
        };

        console.log('Venda atualizada com sucesso! VEN_ID:', docAtualizados);
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
