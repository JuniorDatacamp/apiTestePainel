const Configuracao = require('../config/database');
const format = require('pg-format');
const uuidv1 = require('uuid/v1');
const { documentosExistentes } = require('./clientes');

const sqlReceberApp =
    `   select 
            rec_uuid, rec_id, documento, dataemissao, datavencimento, valorareceber, rec_parcela, 
	        juros, baixado, r.cli_uuid, r.cli_id
        from 
            receber r
        inner join 
            clientes c on r.cli_uuid = c.cli_uuid    
        where 
            doctosubstituicao is null and valorareceber > 0 and (cast(c.vdd_id as varchar(10)) ilike $1)
    `;

const sqlReceber =
    `   select 
            rec_uuid, rec_id, documento, clf_id, tip_id, loc_id, cli_id, vdd_id, ven_id, ven_data, sai_numnota, 
            sse_nronota, codigoboleta, tipopagamento, datalancamento, dataemissao, 
            datavencimento, datarecebimento, valorareceber, valororiginal, valorrecebido, 
            valordevolvido, juros, desconto, perccomissao, doctosubstituicao, observacao, 
            baixado, duplicatadescontada, situacao, mes_coo, valorcorrigido, datadevolucao, 
            cheque_pre, tur_id, rec_hora, auxilia, os_id, os_data, rec_banco, rec_agencia, 
            rec_conta, rec_emitente, sai_id, rec_idsubstituicao, devolucao, bol_situacao, dt_primeiro_vencto, 
            rec_numcheque, rec_pedido, correcao, dt_vencto_ini, cre_id, rec_duplicata_impressa, rec_baixa_via_pdv_id, 
            ser_id, rec_data_duplicata, rec_mensagem_consorcio, chc_id, rec_nossonumero, nfs_id, con_id, rec_tx_adesao, 
            ban_id, rec_spc, rec_serasa, tpg_id, rec_parcela, rec_liquidado, mes_data, pdv_id, cli_uuid, ven_uuid
        from 
            receber `;

const sqlOrderby =
    ' order by rec_id ';

const insertReceber =
    `   insert into receber 
            (rec_uuid, rec_id, documento, clf_id, tip_id, loc_id, cli_id, vdd_id, ven_id, ven_data, sai_numnota, 
            sse_nronota, codigoboleta, tipopagamento, datalancamento, dataemissao, 
            datavencimento, datarecebimento, valorareceber, valororiginal, valorrecebido, 
            valordevolvido, juros, desconto, perccomissao, doctosubstituicao, observacao, 
            baixado, duplicatadescontada, situacao, mes_coo, valorcorrigido, datadevolucao, 
            cheque_pre, tur_id, rec_hora, auxilia, os_id, os_data, rec_banco, rec_agencia, 
            rec_conta, rec_emitente, sai_id, rec_idsubstituicao, devolucao, bol_situacao, dt_primeiro_vencto, 
            rec_numcheque, rec_pedido, correcao, dt_vencto_ini, cre_id, rec_duplicata_impressa, rec_baixa_via_pdv_id, 
            ser_id, rec_data_duplicata, rec_mensagem_consorcio, chc_id, rec_nossonumero, nfs_id, con_id, rec_tx_adesao, 
            ban_id, rec_spc, rec_serasa, tpg_id, rec_parcela, rec_liquidado, mes_data, pdv_id, cli_uuid, ven_uuid)
        values 
            %L RETURNING rec_id, rec_uuid `;

const deleteReceber =
    `   WITH retorno AS
            (DELETE FROM receber WHERE rec_uuid in (%s) RETURNING rec_uuid, 'recebers', now())
        INSERT INTO 
            ocorrencias (oco_id_tabela, oco_tabela, oco_dt_ultima_atualizacao) SELECT * FROM retorno; `

const updateReceber =
    `   update receber 
            set documento = $2, clf_id = $3, tip_id = $4, loc_id = $5, cli_id = $6, vdd_id = $7, ven_id = $8, ven_data = $9, 
            sai_numnota = $10, sse_nronota = $11, codigoboleta = $12, tipopagamento = $13, datalancamento = $14, 
            dataemissao = $15, datavencimento = $16, datarecebimento = $17, valorareceber = $18, valororiginal = $19, 
            valorrecebido = $20, valordevolvido = $21, juros = $22, desconto = $23, perccomissao = $24, doctosubstituicao = $25, 
            observacao = $26, baixado = $27, duplicatadescontada = $28, situacao = $29, mes_coo = $30, valorcorrigido = $31, 
            datadevolucao = $32, cheque_pre = $33, tur_id = $34, rec_hora = $35, auxilia = $36, os_id = $37, os_data = $38, 
            rec_banco = $39, rec_agencia = $40, rec_conta = $41, rec_emitente = $42, sai_id = $43, rec_idsubstituicao = $44, 
            devolucao = $45, bol_situacao = $46, dt_primeiro_vencto = $47, rec_numcheque = $48, rec_pedido = $49, correcao = $50, 
            dt_vencto_ini = $51, cre_id = $52, rec_duplicata_impressa = $53, rec_baixa_via_pdv_id = $54, ser_id = $55, 
            rec_data_duplicata = $56, rec_mensagem_consorcio = $57, chc_id = $58, rec_nossonumero = $59, nfs_id = $60, 
            con_id = $61, rec_tx_adesao = $62, ban_id = $63, rec_spc = $64, rec_serasa = $65, tpg_id = $66, rec_parcela = $67, 
            rec_liquidado = $68, mes_data = $69, pdv_id = $70, cli_uuid = $71, ven_uuid = $72, rec_dt_ultima_atualizacao = now() AT TIME ZONE 'America/Sao_Paulo'
        where
            rec_uuid = $1 `;

exports.getReceberApp = function(package){

    return new Promise((resolve, reject) => {

        if (package.enviarReceberCliente){
            const ConexaoBanco = Configuracao.conexao;
            var params;
    
            (package.vinculoClientesVendedor) ? params = package.codVendedor : params = '%';
    
            console.log('Consultando receber...');        
            ConexaoBanco.query(sqlReceberApp+sqlOrderby, [params], function(error, results){
                if(error){
                    return reject(error);
                }
                else{
                    const receber = results.rows;
                    return resolve(receber);
                }
            });
        }else{
            return resolve([]);
        }        
    });    
};

exports.getReceberFormat = function(parametro){

    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlReceber+parametro+sqlOrderby, function(error, results){
            if(error){
                return reject(error);
            }
            else{
                const receber = results.rows;
                return resolve(receber);
            }
        });
    });    
};

exports.insert = function (objReceber){
    
    return new Promise((resolve, reject) => {
        
        const ConexaoBanco  = Configuracao.conexao;
        var paramsReceber   = [];
        var colunaUUID;
        var sql;

        objReceber.forEach(receber => {

            if (receber.rec_uuid == null){
                colunaUUID = uuidv1()
            }else{
                colunaUUID = receber.rec_uuid
            }

            paramsReceber.push([
                colunaUUID, receber.rec_id, receber.documento, receber.clf_id, receber.tip_id, receber.loc_id,
                receber.cli_id, receber.vdd_id, receber.ven_id, receber.ven_data, receber.sai_numnota,
                receber.sse_nronota, receber.codigoboleta, receber.tipopagamento, receber.datalancamento, receber.dataemissao,
                receber.datavencimento, receber.datarecebimento, receber.valorareceber, receber.valororiginal,
                receber.valorrecebido, receber.valordevolvido, receber.juros, receber.desconto, receber.perccomissao,
                receber.doctosubstituicao, receber.observacao, receber.baixado, receber.duplicatadescontada,
                receber.situacao, receber.mes_coo, receber.valorcorrigido, receber.datadevolucao, receber.cheque_pre,
                receber.tur_id, receber.rec_hora, receber.auxilia, receber.os_id, receber.os_data, receber.rec_banco,
                receber.rec_agencia, receber.rec_conta, receber.rec_emitente, receber.sai_id, receber.rec_idsubstituicao,
                receber.devolucao, receber.bol_situacao, receber.dt_primeiro_vencto, receber.rec_numcheque,
                receber.rec_pedido, receber.correcao, receber.dt_vencto_ini, receber.cre_id, receber.rec_duplicata_impressa,
                receber.rec_baixa_via_pdv_id, receber.ser_id, receber.rec_data_duplicata, receber.rec_mensagem_consorcio,
                receber.chc_id, receber.rec_nossonumero, receber.nfs_id, receber.con_id, receber.rec_tx_adesao,
                receber.ban_id, receber.rec_spc, receber.rec_serasa, receber.tpg_id, receber.rec_parcela,
                receber.rec_liquidado, receber.mes_data, receber.pdv_id, receber.cli_uuid, receber.ven_uuid                
            ]);
        });

        var sql = format(insertReceber, paramsReceber);
      
        ConexaoBanco.query(sql, (error, results) => {
            
            if (error){
                console.log('Erro ao inserir receber. '+ error);
                return reject(error);
            }
            else{
                console.log('Receber inserido com sucesso! Quantidade registros:', results.rowCount);
                var receber = results.rows;
                return resolve(receber);
            }
        });
    });    
};

exports.delete = function(idReceber){

    const sqlDeleteReceber= format(deleteReceber, idReceber);
   
    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlDeleteReceber, function(error, results){
            if(error){
                return reject(error);
            }
            else{
                return resolve({
                    mensagem: 'Delete receber efetuado com sucesso. UUID: '+idReceber,
                    registros: results.rowCount
                });
            }
        });
    });    
};

exports.update = async function(objReceber){    

    const client = await Configuracao.conexao.connect();

    try {        
        let docAtualizados = [];
        
        await client.query('BEGIN')
        
        for (var i = 0; i < objReceber.length; ++i){
            
            docAtualizados.push(objReceber[i].rec_uuid);

            const res = await client.query(updateReceber, [
                objReceber[i].rec_uuid, objReceber[i].documento, objReceber[i].clf_id, objReceber[i].tip_id, objReceber[i].loc_id, objReceber[i].cli_id, 
                objReceber[i].vdd_id, objReceber[i].ven_id, objReceber[i].ven_data, objReceber[i].sai_numnota, objReceber[i].sse_nronota, 
                objReceber[i].codigoboleta, objReceber[i].tipopagamento, objReceber[i].datalancamento, objReceber[i].dataemissao, 
                objReceber[i].datavencimento, objReceber[i].datarecebimento, objReceber[i].valorareceber, objReceber[i].valororiginal, 
                objReceber[i].valorrecebido, objReceber[i].valordevolvido, objReceber[i].juros, objReceber[i].desconto, objReceber[i].perccomissao, 
                objReceber[i].doctosubstituicao, objReceber[i].observacao, objReceber[i].baixado, objReceber[i].duplicatadescontada, 
                objReceber[i].situacao, objReceber[i].mes_coo, objReceber[i].valorcorrigido, objReceber[i].datadevolucao, objReceber[i].cheque_pre, 
                objReceber[i].tur_id, objReceber[i].rec_hora, objReceber[i].auxilia, objReceber[i].os_id, objReceber[i].os_data, objReceber[i].rec_banco,
                objReceber[i].rec_agencia, objReceber[i].rec_conta, objReceber[i].rec_emitente, objReceber[i].sai_id, objReceber[i].rec_idsubstituicao,
                objReceber[i].devolucao, objReceber[i].bol_situacao, objReceber[i].dt_primeiro_vencto, objReceber[i].rec_numcheque, objReceber[i].rec_pedido, 
                objReceber[i].correcao, objReceber[i].dt_vencto_ini, objReceber[i].cre_id, objReceber[i].rec_duplicata_impressa, 
                objReceber[i].rec_baixa_via_pdv_id, objReceber[i].ser_id, objReceber[i].rec_data_duplicata, objReceber[i].rec_mensagem_consorcio, 
                objReceber[i].chc_id, objReceber[i].rec_nossonumero, objReceber[i].nfs_id, objReceber[i].con_id, objReceber[i].rec_tx_adesao, objReceber[i].ban_id, 
                objReceber[i].rec_spc, objReceber[i].rec_serasa, objReceber[i].tpg_id, objReceber[i].rec_parcela, objReceber[i].rec_liquidado, objReceber[i].mes_data, 
                objReceber[i].pdv_id, objReceber[i].cli_uuid, objReceber[i].ven_uuid
            ]);
        };

        console.log('Receber atualizado com sucesso! UUID:', docAtualizados);
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
}
// Catch foi passado para o controller resolver e retornar o erro.
// ().catch(err => console.error(err.stack));