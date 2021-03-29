const itemVendasModel = require('../models/itemVendas');
const itemVenda = itemVendasModel.itemVenda;
const funcUtils = require('../utils/funcUtils');

exports.pesquisarTodos = function(req, res){
    
    Promise.all([      
        itemVendasModel.getItemVenda()
    ])
    .then(
        (resultados) => {
 
            res.status(200).json({
                itemvendas: resultados[0]
            });
        },
        (erro) => {
            res.status(500).json({message: `Erro ao consultar todas item venda!! [ ${erro} ]`});
        }
    );
};

exports.inserir = function(req, res){

    var arrayItemVenda = [];
    
    try {
        req.body.itemvendas.forEach(valor => {
            arrayItemVenda.push(new itemVenda(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        });
    }

    itemVendasModel.insert(arrayItemVenda)
        .then(resultados => {
            res.status(200).json({
                itemvendas: resultados
            });            
        })
        .catch(erro => {
            console.error(erro.stack)
            funcUtils.getMensagemErros(erro, res);
        });
};

exports.deletar = function(req, res){

    const paramsId = req.query.itv_uuid;

    Promise.all([      
        itemVendasModel.delete(paramsId)
    ])
    .then(
        (resultados) => {
           
            console.log(resultados[0]);
            
            res.status(200).json(
                resultados[0]
            );
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};

exports.alterar = function(req, res){

    var arrayItemVenda = [];
    
    try {
        req.body.itemvendas.forEach(valor => {
            arrayItemVenda.push(new itemVenda(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        }); 
    }

    var promisesItemVenda;
    promisesItemVenda = itemVendasModel.update(arrayItemVenda);

    promisesItemVenda
        .then(resultados => {
            res.status(200).json({
                mensagem: 'Item venda atualizado com sucesso!'
            });
        })
        .catch(erro => {
            console.error(erro.stack)
            funcUtils.getMensagemErros(erro, res);
        });
};