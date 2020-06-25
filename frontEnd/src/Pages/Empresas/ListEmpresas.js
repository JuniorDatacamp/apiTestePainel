import React, { Fragment, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Tabela from '../../Components/Tabela/Tabela';
import BtnAdd from '../../Components/Botao/addAbsolut';
import Pesquisa from '../../Components/Pesquisa/Pesquisa';
import { useSnackbar } from 'notistack';

import api from '../../Services/api';
import Token from '../../Services/token';

export default function Empresas(){

    const history = useHistory();

    const [empresas, setEmpresas] = useState([]);
    const [pesquisa, setPesquisa] = useState('');

    const { enqueueSnackbar } = useSnackbar();

    const exibirMensagem = (msg, tipo) => {
        enqueueSnackbar(msg, {variant: tipo, anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
        }});
    };    

    function buscar(){       
        
        api.get('api/empresas', {
                headers: {
                    authorization: Token.GetToken(),
                }
            }).then(
                response => {                    
                    setEmpresas(response.data);
                    exibirMensagem('Lista de empresa(s) carregada com sucesso!', 'success');
                },
                error => {                   

                    if (error.response.status === 401){
                        exibirMensagem('Não foi possível carregar lista de empresa(s)! ' + error.response.data.mensagem, 'error')
                        localStorage.clear();
                        history.push('/');
                    }else{
                        exibirMensagem('Não foi possível carregar lista de empresa(s)! ' + error.response.data.mensagem, 'error');
                    }
                }
        )
    }

    const campos = [
        {
            titulo: 'Cod.',
            dado: 'id'
        },
        {
            titulo: 'Nome',
            dado: 'nome'
        },
        {
            titulo: 'Quantidade de acesso',
            dado: 'qtdeacesso'
        }
    ]
   
    return (
        <Fragment>
        
            <Pesquisa
                onBlur={ ()=> {  
                    if (pesquisa !== '') {
                        buscar()
                    }
                }}
                value={pesquisa} onChange={e => setPesquisa(e.target.value)}
            />
            
            <div align="right">
                <BtnAdd form="/empresas/form" />                
            </div>

            <Tabela dados={empresas} campos={campos} form="/empresas/info" />

        </Fragment>
    );
};