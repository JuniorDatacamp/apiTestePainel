import React, { Fragment, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Tabela from '../../Components/Tabela/Tabela';
import BtnAdd from '../../Components/Botao/addAbsolut';
import Pesquisa from '../../Components/Pesquisa/Pesquisa';

import { useSnackbar } from 'notistack';

import api from '../../Services/api';
import Token from '../../Services/token';

export default function Configuracoes(){

    const [configuracao, setConfiguracao] = useState([]);
    const [pesquisa, setPesquisa] = useState('');

    const history = useHistory();

    const { enqueueSnackbar } = useSnackbar();

    const exibirMensagem = (msg, tipo) => {
        enqueueSnackbar(msg, {variant: tipo, anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
        }});
    };

    function buscar(){
        api.get('api/configuracoes', {
            headers: {
                authorization: Token.GetToken(),
            }
         }).then(
            response => {
                setConfiguracao(response.data);
                exibirMensagem('Configurações carregada com sucesso!', 'success');
            },
            error => {                   

                if (error.response.status === 401){
                    exibirMensagem('Não foi possível carregar configurações! ' + error.response.data.mensagem, 'error');
                    localStorage.clear();
                    history.push('/');
                }else{
                    exibirMensagem('Não foi possível carregar configurações! ' + error.response.data.mensagem, 'error');
                }
            }
        )
    }

    const campos = [
        {
            titulo: 'Cod.',
            dado: 'con_id'
        },
        {
            titulo: 'Servidor SMTP',
            dado: 'con_email_servidorsmtp'
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
                <BtnAdd form="/configuracoes/form" />
            </div>

            <Tabela dados={configuracao} campos={campos} form="/configuracoes/info" />
        </Fragment>
    );
};