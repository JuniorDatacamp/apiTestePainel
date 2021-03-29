const Configuracao = require('../config/database');
const format = require('pg-format');

const sqlEspecialidades = 
    ` select esp_id, esp_descricao, esp_finan from especialidade `;

const insertEspecialidades = 
    ` insert into especialidade 
        (esp_id, esp_descricao, esp_finan)
    values
        %L `;

const deleteEspecialidades =
    ` delete from especialidade where esp_id in (%s) `;        

const updateEspecialidades = 
    `   update 
            especialidade set esp_descricao = $2, esp_finan = $3
        where
            esp_id = $1 `;

exports.getEspecialidadesFull = function getEspecialidadesFull(){

    //Utilizar para chamada de get, receber todos os campos.

    const ConexaoBanco = Configuracao.conexao;
    
    return new Promise((resolve, reject) => {

        ConexaoBanco.query(sqlEspecialidades, (error, results) => {
        
            if (error){
                return reject(error);
            }else{              
                const especialidade = results.rows;
                return resolve(especialidade);
            }
        });
    });
};

exports.insert = function insert(ObjEspecialidades){

    return new Promise((resolve, reject) => {
        
        const ConexaoBanco  = Configuracao.conexao;
        var paramsEspecialidade     = [];

        ObjEspecialidades.forEach(especialidade => {
            
            paramsEspecialidade.push([
                especialidade.esp_id, especialidade.esp_descricao, especialidade.esp_finan
            ]);
        });       

        var sql = format(insertEspecialidades, paramsEspecialidade);
       
        ConexaoBanco.query(sql, (error, results) => {
            
            if (error){
                console.log('Erro ao inserir especialidade(s). '+ error);
                return reject(error);
            }
            else{
                console.log('Especialidade(s) inserido com sucesso! Quantidade registros:', results.rowCount);
                var resultCliente = results.rows;
                return resolve(resultCliente);
            }
        });
    });     
};

exports.delete = function(idEspecialidades){

    const sqlDeleteEspecialidade = format(deleteEspecialidades, idEspecialidades);
   
    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlDeleteEspecialidade, function(error, results){
            if(error){
                return reject(error);
            }
            else{
                return resolve({
                    mensagem: 'Delete especialidade(s) efetuado com sucesso.',
                    registros: results.rowCount
                });
            }
        });
    });
};

exports.update = async function update(ObjEspecialidades){

    const client = await Configuracao.conexao.connect();

    try {        
        let docAtualizados = [];
        
        await client.query('BEGIN')
        
        for (var i = 0; i < ObjEspecialidades.length; ++i){
                
            docAtualizados.push(ObjEspecialidades[i].esp_id);

            const res = await client.query(updateEspecialidades, [
                ObjEspecialidades[i].esp_id, ObjEspecialidades[i].esp_descricao, ObjEspecialidades[i].esp_finan
            ]);
        };

        console.log('Especialidade(s) atualizado com sucesso! ID:', docAtualizados);
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