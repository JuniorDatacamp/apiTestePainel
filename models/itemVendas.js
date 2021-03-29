const Configuracao = require('../config/database');
const format = require('pg-format');

class itemVenda {
        
    constructor(body) {

        this.itv_uuid               = body.itv_uuid,
        this.itv_id                 = body.itv_id,
        this.ven_uuid               = body.ven_uuid,
        this.ven_data               = body.ven_data,
        this.pro_id                 = body.pro_id,
        this.itv_refer              = body.itv_refer,
        this.itv_qtde               = body.itv_qtde,
        this.itv_desconto           = body.itv_desconto,
        this.itv_precovenda         = body.itv_precovenda,
        this.itv_valortotal         = body.itv_valortotal,
        this.itv_data               = body.itv_data,
        this.itv_situacao           = body.itv_situacao,
        this.itv_comissao           = body.itv_comissao,
        this.pro_custoreal          = body.pro_custoreal,
        this.pro_custo              = body.pro_custo,
        this.itv_num_item           = body.itv_num_item,
        this.itv_un                 = body.itv_un,
        this.itv_tipo               = body.itv_tipo,
        this.itv_observacao         = body.itv_observacao,
        this.itv_descricao          = body.itv_descricao,
        this.itv_vlrmedio           = body.itv_vlrmedio,
        this.itv_trocado            = body.itv_trocado,
        this.itd_id                 = body.itd_id,
        this.itv_vlr_rateio_desc    = body.itv_vlr_rateio_desc,
        this.mrc_id                 = body.mrc_id,
        this.itv_num_pneu           = body.itv_num_pneu,
        this.tir_id                 = body.tir_id,
        this.itv_promocao           = body.itv_promocao,
        this.pro_composicao_if      = body.pro_composicao_if,
        this.pro_composicao_st      = body.pro_composicao_st,
        this.pro_composicao_ipi     = body.pro_composicao_ipi,
        this.pro_composicao_frete   = body.pro_composicao_frete,
        this.pro_composicao_lucro   = body.pro_composicao_lucro,
        this.pro_composicao_perc    = body.pro_composicao_perc,
        this.pro_composicao_venda   = body.pro_composicao_venda,
        this.pro_composicao_despfixas     = body.pro_composicao_despfixas,
        this.pro_composicao_com_vend      = body.pro_composicao_com_vend,
        this.pro_composicao_com_entrega   = body.pro_composicao_com_entrega,
        this.pro_composicao_custo         = body.pro_composicao_custo,
        this.itv_vlrfrete                 = body.itv_vlrfrete,
        this.itv_data_inclusao            = body.itv_data_inclusao,
        this.itv_vlr_descarga             = body.itv_vlr_descarga,
        this.vdd_id                       = body.vdd_id
    }
}

exports.itemVenda = function(objItemVenda){
    
    return new itemVenda(objItemVenda)    
}

/*
    "recebimento" é confirmação da retaguarda quando o pedido foi importado com sucesso.    
    
    coluna "enviado" vai ficar sempre 'S' no select, pois se existe o registro no banco de dados é sinal que ele já foi enviado.
    coluna "recebimento" por ser 'S' quando ven_id = null ou ven_situacao = 'P'
*/

const itemVendaApp =
    "   select "+
    "	    itv_id, itv_uuid, ven_id, ven_uuid, pro_id, "+
    "	    itv_refer, itv_descricao, itv_qtde, itv_un, itv_desconto, "+
    "	    itv_precovenda, itv_valortotal, itv_data_inclusao, "+
    "	    ven_data, itv_promocao "+
    "   from "+
    "	    item_venda ";

const insertItemVendaApp =
    `   insert into item_venda
           (ven_uuid, pro_id, itv_refer, itv_descricao, itv_qtde, itv_un,
           itv_desconto, itv_precovenda, itv_valortotal, itv_data_inclusao,
           ven_data, itv_promocao)
       values
           %L `;

const sqlItemVenda =
     `  select 
            itv_uuid, itv_id, ven_uuid, ven_data, pro_id, itv_refer, itv_qtde, itv_desconto,
            itv_precovenda, itv_valortotal, itv_data, itv_situacao, itv_comissao,
            pro_custoreal, pro_custo, itv_num_item, itv_un, itv_tipo, itv_observacao,
            itv_descricao, itv_vlrmedio, itv_trocado, itd_id, itv_vlr_rateio_desc,
            mrc_id, itv_num_pneu, tir_id, itv_promocao, pro_composicao_if, 
            pro_composicao_st, pro_composicao_ipi, pro_composicao_frete, pro_composicao_lucro,
            pro_composicao_perc, pro_composicao_venda, pro_composicao_despfixas, 
            pro_composicao_com_vend, pro_composicao_com_entrega, pro_composicao_custo,
            itv_vlrfrete, itv_data_inclusao, itv_vlr_descarga, vdd_id
        from
            item_venda  `;

const insertItemVenda =
    `   insert into item_venda
            (itv_id, ven_uuid, ven_data, pro_id, itv_refer, itv_qtde, itv_desconto,
            itv_precovenda, itv_valortotal, itv_data, itv_situacao, itv_comissao,
            pro_custoreal, pro_custo, itv_num_item, itv_un, itv_tipo, itv_observacao,
            itv_descricao, itv_vlrmedio, itv_trocado, itd_id, itv_vlr_rateio_desc,
            mrc_id, itv_num_pneu, tir_id, itv_promocao, pro_composicao_if, 
            pro_composicao_st, pro_composicao_ipi, pro_composicao_frete, pro_composicao_lucro,
            pro_composicao_perc, pro_composicao_venda, pro_composicao_despfixas, 
            pro_composicao_com_vend, pro_composicao_com_entrega, pro_composicao_custo,
            itv_vlrfrete, itv_data_inclusao, itv_vlr_descarga, vdd_id)
        values
            %L  RETURNING itv_id, itv_uuid `;

const updateItemVenda =
    `   update item_venda set
            itv_id = $2, ven_uuid = $3, ven_data = $4, pro_id = $5, itv_refer = $6, itv_qtde = $7, itv_desconto = $8,
            itv_precovenda = $9, itv_valortotal = $10, itv_data = $11, itv_situacao = $12, itv_comissao = $13,
            pro_custoreal = $14, pro_custo = $15, itv_num_item = $16, itv_un = $17, itv_tipo = $18, itv_observacao = $19,
            itv_descricao = $20, itv_vlrmedio = $21, itv_trocado = $22, itd_id = $23, itv_vlr_rateio_desc = $24,
            mrc_id = $25, itv_num_pneu = $26, tir_id = $27, itv_promocao = $28, pro_composicao_if = $29, 
            pro_composicao_st = $30, pro_composicao_ipi = $31, pro_composicao_frete = $32, pro_composicao_lucro = $33,
            pro_composicao_perc = $34, pro_composicao_venda = $35, pro_composicao_despfixas = $36, 
            pro_composicao_com_vend = $37, pro_composicao_com_entrega = $38, pro_composicao_custo = $39,
            itv_vlrfrete = $40, itv_data_inclusao = $41, itv_vlr_descarga = $42, vdd_id = $43, itv_dt_ultima_atualizacao = now() AT TIME ZONE 'America/Sao_Paulo'
        where
            itv_uuid = $1 `;            

const deleteItemVenda =
    ` delete from item_venda where itv_uuid in (%s) `;

exports.SQLInsertApp = function (ObjItemVenda, venUUID){

    var paramsItemVenda  = [];

    ObjItemVenda.forEach(itemVenda => {
        
        paramsItemVenda.push([
            venUUID, itemVenda.pro_id, itemVenda.itv_refer, 
            itemVenda.itv_descricao, itemVenda.itv_qtde, itemVenda.itv_un, itemVenda.itv_desconto,
            itemVenda.itv_precovenda, itemVenda.itv_valortotal, itemVenda.itv_data_inclusao, 
            itemVenda.ven_data, itemVenda.itv_promocao
        ]);
    });

    var sql = format(insertItemVendaApp, paramsItemVenda);
    return sql;
};

exports.getItemVenda = function getItemVenda(){

    const ConexaoBanco = Configuracao.conexao;
    
    return new Promise((resolve, reject) => {

        ConexaoBanco.query(sqlItemVenda, (error, results) => {
        
            if (error){
                return reject(error);
            }else{              
                const itemVenda = results.rows;
                return resolve(itemVenda);
            }
        });
    });
};

exports.insert = async function insert(ObjItemVenda){

    const client = await Configuracao.conexao.connect();

    try {
        let paramsItemVenda = [];
        let docInclusos = [];

        ObjItemVenda.forEach(itemVenda => {
            
            docInclusos.push(itemVenda.itv_id);    
            
            paramsItemVenda.push([
                itemVenda.itv_id, itemVenda.ven_uuid, itemVenda.ven_data, itemVenda.pro_id, itemVenda.itv_refer, 
                itemVenda.itv_qtde, itemVenda.itv_desconto, itemVenda.itv_precovenda, itemVenda.itv_valortotal, 
                itemVenda.itv_data, itemVenda.itv_situacao, itemVenda.itv_comissao, itemVenda.pro_custoreal, 
                itemVenda.pro_custo, itemVenda.itv_num_item, itemVenda.itv_un, itemVenda.itv_tipo, itemVenda.itv_observacao,
                itemVenda.itv_descricao, itemVenda.itv_vlrmedio, itemVenda.itv_trocado, itemVenda.itd_id, 
                itemVenda.itv_vlr_rateio_desc, itemVenda.mrc_id, itemVenda.itv_num_pneu, itemVenda.tir_id, 
                itemVenda.itv_promocao, itemVenda.pro_composicao_if, itemVenda.pro_composicao_st, 
                itemVenda.pro_composicao_ipi, itemVenda.pro_composicao_frete, itemVenda.pro_composicao_lucro,
                itemVenda.pro_composicao_perc, itemVenda.pro_composicao_venda, itemVenda.pro_composicao_despfixas, 
                itemVenda.pro_composicao_com_vend, itemVenda.pro_composicao_com_entrega, itemVenda.pro_composicao_custo,
                itemVenda.itv_vlrfrete, itemVenda.itv_data_inclusao, itemVenda.itv_vlr_descarga, itemVenda.vdd_id
            ]);
        });

        var sqlInsertItemVenda = format(insertItemVenda, paramsItemVenda);
       
        await client.query('BEGIN')

        const res = await client.query(sqlInsertItemVenda, []);

        console.log('Item venda inserido com sucesso! Quantidade registros:', res.rowCount, '\nIDs de item venda(s)! ITV_ID:', docInclusos);
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

exports.delete = function(idItemVenda){

    const sqlDeleteItemVenda = format(deleteItemVenda, idItemVenda);
   
    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlDeleteItemVenda, function(error, results){
            if(error){
                return reject(error);
            }
            else{
                return resolve({
                    mensagem: 'Delete item venda efetuado com sucesso.',
                    registros: results.rowCount
                });
            }
        });
    });
};

exports.update = async function update(ObjItemVenda){

    const client = await Configuracao.conexao.connect();

    try {        
        let docAtualizados = [];
        
        await client.query('BEGIN')
        
        for (var i = 0; i < ObjItemVenda.length; ++i){
            
            docAtualizados.push(ObjItemVenda[i].itv_uuid); 

            const res = await client.query(updateItemVenda, [
                ObjItemVenda[i].itv_uuid, ObjItemVenda[i].itv_id, ObjItemVenda[i].ven_uuid, ObjItemVenda[i].ven_data, ObjItemVenda[i].pro_id, ObjItemVenda[i].itv_refer, 
                ObjItemVenda[i].itv_qtde, ObjItemVenda[i].itv_desconto, ObjItemVenda[i].itv_precovenda, ObjItemVenda[i].itv_valortotal, ObjItemVenda[i].itv_data, 
                ObjItemVenda[i].itv_situacao, ObjItemVenda[i].itv_comissao, ObjItemVenda[i].pro_custoreal, ObjItemVenda[i].pro_custo, ObjItemVenda[i].itv_num_item, 
                ObjItemVenda[i].itv_un, ObjItemVenda[i].itv_tipo, ObjItemVenda[i].itv_observacao, ObjItemVenda[i].itv_descricao, ObjItemVenda[i].itv_vlrmedio, 
                ObjItemVenda[i].itv_trocado, ObjItemVenda[i].itd_id, ObjItemVenda[i].itv_vlr_rateio_desc, ObjItemVenda[i].mrc_id, ObjItemVenda[i].itv_num_pneu, 
                ObjItemVenda[i].tir_id, ObjItemVenda[i].itv_promocao, ObjItemVenda[i].pro_composicao_if, ObjItemVenda[i].pro_composicao_st, 
                ObjItemVenda[i].pro_composicao_ipi, ObjItemVenda[i].pro_composicao_frete, ObjItemVenda[i].pro_composicao_lucro,
                ObjItemVenda[i].pro_composicao_perc, ObjItemVenda[i].pro_composicao_venda, ObjItemVenda[i].pro_composicao_despfixas, 
                ObjItemVenda[i].pro_composicao_com_vend, ObjItemVenda[i].pro_composicao_com_entrega, ObjItemVenda[i].pro_composicao_custo,
                ObjItemVenda[i].itv_vlrfrete, ObjItemVenda[i].itv_data_inclusao, ObjItemVenda[i].itv_vlr_descarga, ObjItemVenda[i].vdd_id
            ]);
        };

        console.log('Item venda atualizado com sucesso! UUID:', docAtualizados);
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