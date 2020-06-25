import React, { Fragment, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Tabela from '../../Components/Tabela/Tabela';
import BtnAdd from '../../Components/Botao/addAbsolut';
import Pesquisa from '../../Components/Pesquisa/Pesquisa';

import { useSnackbar } from 'notistack';
import api from '../../Services/api';
import Token from '../../Services/token';

export default function Usuarios(props){

    const [usuarios, setUsuarios] = useState([]);
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
        api.get('api/usuarios', {
            headers: {
                authorization: Token.GetToken(),
            }
        }).then(
            response => {            
                setUsuarios(response.data);
                exibirMensagem('Lista de usuário(s) carregada com sucesso!', 'success');
            },
            error => {                   

                if (error.response.status === 401){
                    exibirMensagem('Não foi possível carregar lista de usuário(s)! ' + error.response.data.mensagem, 'error');
                    localStorage.clear();
                    history.push('/');
                }else{
                    exibirMensagem('Não foi possível carregar lista de usuário(s)! ' + error.response.data.mensagem, 'error');
                }
            }
        )
    }   

    const campos = [
        {
            titulo: 'ID',
            dado: 'id'
        },
        {
            titulo: 'Nome',
            dado: 'nome'
        },
        {
            titulo: 'Cod. Vendedor',
            dado: 'codvendedor'
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
                <BtnAdd form="/usuarios/form" />
            </div>

            <Tabela dados={usuarios} campos={campos} form="/usuarios/info" />
        </Fragment>
    );
};