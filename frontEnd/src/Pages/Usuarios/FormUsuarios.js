import React, { Fragment, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, Grid, FormControlLabel, Switch, TextField } from '@material-ui/core';

import BtnSalvar from '../../Components/Botao/salvar';
import BtnVoltar from '../../Components/Botao/voltar'
import Dialog from '../../Components/Dialog/Dialog';

import { useSnackbar } from 'notistack';
import Schema from './SchemaUsuarios';
import api from '../../Services/api';
import Token from '../../Services/token';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      padding: theme.spacing(2),
      backgroundColor: '#f6f7f9',
    }
  }));

export default function FormUsuarios(){

    const classes = useStyles();
    const history = useHistory();

    const [id, setId] = useState(null);

    const [situacao, setSituacao] = useState({
        checkedSituacao : true
    });    

    const [nome, setNome] = useState(null);
    const [email, setEmail] = useState(null);
    const [telefone, setTelefone] = useState("");
    const [codAcesso, setCodAcesso] = useState(null);
    const [codEmpresa, setCodEmpresa] = useState(null);
    const [codVendedor, setCodVendedor] = useState(null);
    const [token, setToken] = useState("");

    const { enqueueSnackbar } = useSnackbar();

    const exibirMensagem = (msg, tipo) => {
        enqueueSnackbar(msg, {variant: tipo, anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
        }});
    };

    const handleChangeSituacao = (event) => {
        setSituacao({ ...situacao, [event.target.name]: event.target.checked });
    };

    function editCadastro(){
        //Se true é para editar o cadastro.
        return (history.location.state !== undefined);
    }

    function setUsuarios (){
        
        const usuarios = history.location.state.detail;

        const situacao = (usuarios.ativo === 'A') ? true : false;        
        setSituacao({checkedSituacao: situacao});

        setId(usuarios.id);
        setNome(usuarios.nome);
        setEmail(usuarios.email);
        setTelefone(usuarios.telefone);
        setCodAcesso(usuarios.codacesso);
        setCodEmpresa(usuarios.codempresa);
        setCodVendedor(usuarios.codvendedor);
        setToken(usuarios.token);
    }

    const [open, setOpen] = useState(false);
 
    const handleCancelar = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    function editar(){ 
            
        const dadosUsuarios = {
            id: id,
            email: email, 
            telefone: telefone,
            nome: nome,
            codacesso: codAcesso,
            codempresa: codEmpresa,
            codvendedor: codVendedor,
            ativo: (situacao.checkedSituacao) ? 'A' : 'I',
            token: token
        }

        Schema.validate(dadosUsuarios)
            .then(resolve => {

                api.put(`api/usuarios/`, dadosUsuarios, {
                        headers: {
                            authorization: Token.GetToken(),
                        }
                    })
                    .then(
                        response => {
                            exibirMensagem('Usuário alterado com sucesso!', 'success');
                            history.push('/usuarios/'); 
                        },
                        error => {                   

                            if (error.response.status === 401){
                                exibirMensagem('Não foi possível alterar usuário! ' + error.response.data.mensagem, 'error');
                                localStorage.clear();
                                history.push('/');
                            }else{
                                exibirMensagem('Não foi possível alterar usuário! ' + error.response.data.error, 'error');
                            }
                        }                    
                    )
                    .catch(error => {
                        exibirMensagem('Erro desconhecido. Não foi possível alterar usuário! ' + error.response.data.mensagem, 'error');
                        history.push('/home');
                })
            })
            .catch(err => {
                exibirMensagem(err.errors, 'error');
            }
        );          
    }

    function salvar (){        
            
        const dadosUsuarios = {
            email: email,
            telefone: telefone,
            nome: nome,
            codempresa: codEmpresa,
            codvendedor: codVendedor,
            ativo: (situacao.checkedSituacao) ? 'A' : 'I',
            token: token
        }

        Schema.validate(dadosUsuarios)
            .then(resolve => {

                api.post(`api/usuarios/`, dadosUsuarios, {
                    headers: {
                        authorization: Token.GetToken(),
                    }
                })
                .then(
                    response => {
                        exibirMensagem('Usuário cadastrado com sucesso!', 'success');
                        history.goBack();
                    },
                    error => {                   

                        if (error.response.status === 401){
                            exibirMensagem('Não foi possível cadastrar usuário! ' + error.response.data.mensagem, 'error');
                            localStorage.clear();
                            history.push('/');
                        }else{
                            exibirMensagem('Não foi possível cadastrar usuário! ' + error.response.data.error, 'error');
                        }
                    }
                )
                .catch(error => {
                    exibirMensagem('Erro desconhecido. Não foi possível cadastrar usuário! ' + error.response.data.mensagem, 'error');
                    history.push('/home');
                })
            })
            .catch(err => {
                exibirMensagem(err.errors, 'error');
            }
        );                  
    }    

    function acaoBtnSalvar(){
        
        if (editCadastro()){
            return editar
        } 
        else {
            return salvar
        } 
    }    

    useEffect(() => {

        if (editCadastro()){
            setUsuarios();
        }

    }, []);

    return (
        <Fragment>

            <div align="right">
                <BtnSalvar Salvar={handleOpen} />
                <BtnVoltar />
            </div>

            <Dialog
                open={open}
                onClose={handleCancelar}
                title={'Deseja realmente salvar os dados?'}
                cancelar={handleCancelar}
                confirmar={acaoBtnSalvar()}
            >
            </Dialog>            

            <form className={classes.root}>
                <Grid container spacing={3}>  

                    <Grid item xs={12}>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={situacao.checkedSituacao}
                                    onChange={handleChangeSituacao}
                                    name="checkedSituacao"
                                    color="primary"
                                />
                            }
                            label="Ativo?"
                        />
                    </Grid>

                    <Grid item xs={4} sm={3}>
                        <TextField
                            label="Código"
                            variant="outlined"
                            size="small"                        
                            value={id} onChange={e => setId(e.target.value)}
                            disabled
                        />   
                    </Grid>

                    <Grid item xs={12} sm={8} >                      
                        <TextField
                            label="Nome"
                            variant="outlined"
                            size="small"    
                            fullWidth
                            value={nome} onChange={e => setNome(e.target.value)}
                        />  
                    </Grid>

                    <Grid item xs={12} sm={3} >
                        <TextField
                            label="Vendedor"
                            variant="outlined"
                            size="small"
                            type="number"
                            value={codVendedor} onChange={e => setCodVendedor(e.target.value)}
                        />                          
                    </Grid>                    

                    <Grid item xs={12} sm={8}>
                        <TextField
                            label="E-mail"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={email} onChange={e => setEmail(e.target.value)}
                        />                          
                    </Grid>                    

                    <Grid item xs={4} sm={3}>                        
                        <TextField
                            label="Empresa"
                            variant="outlined"
                            size="small"
                            type="number"
                            value={codEmpresa} onChange={e => setCodEmpresa(e.target.value)}
                        />   
                    </Grid>

                    <Grid item xs={4} sm={3}>                        
                        <TextField
                            label="Telefone"
                            variant="outlined"
                            size="small"    
                            value={telefone} onChange={e => setTelefone(e.target.value)}
                        />   
                    </Grid>

                </Grid>
            </form>            
        </Fragment>
    );
};