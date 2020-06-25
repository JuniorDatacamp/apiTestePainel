import React, { Fragment, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, Grid, FormControlLabel, Switch, TextField } from '@material-ui/core';

import BtnSalvar from '../../Components/Botao/salvar';
import BtnVoltar from '../../Components/Botao/voltar';
import Dialog from '../../Components/Dialog/Dialog';

import { useSnackbar } from 'notistack';

import './Empresas.css';
import Schema from './SchemaEmpresas';
import api from '../../Services/api';
import Token from '../../Services/token';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      padding: theme.spacing(2),
      backgroundColor: '#f6f7f9',
    }
}));

export default function ViewEmpresas(){

    const classes = useStyles();
    const history = useHistory();
    const [id, setId] = useState(null);
    const [tipo, setTipo] = useState({
        checkedAdmin : false
    });
    const [situacao, setSituacao] = useState({
        checkedSituacao : true
    });
    const [nome, setNome] = useState(null);
    const [cpf, setCpf] = useState(null);
    const [cnpj, setCnpj] = useState(null);
    const [qtdeAcesso, setQtdeAcesso] = useState(1);
    const [url, setUrl] = useState('');
    const [senha, setSenha] = useState('');

    const handleChangeTipo = (event) => {
        setTipo({ ...tipo, [event.target.name]: event.target.checked });
    };
    const handleChangeSituacao = (event) => {
        setSituacao({ ...situacao, [event.target.name]: event.target.checked });
    };
    const { enqueueSnackbar } = useSnackbar();

    const exibirMensagem = (msg, tipo) => {
        enqueueSnackbar(msg, {variant: tipo, anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
        }});
    };

    function editCadastro(){
        //Se true é para editar o cadastro.
        return (history.location.state !== undefined);
    }

    function setEmpresas (){
        
        const empresas = history.location.state.detail;

        const situacao = (empresas.ativo === 'A') ? true : false;
        const tipo     = (empresas.nivel === 0) ? true : false;

        setId(empresas.id);
        setNome(empresas.nome);
        setCpf(empresas.cpf);
        setCnpj(empresas.cnpj);
        setSenha(empresas.senha);
        
        setSituacao({checkedSituacao: situacao});
        setTipo({checkedAdmin: tipo})

        setQtdeAcesso(empresas.qtdeacesso);
        setUrl(empresas.url);        
    }

    const [open, setOpen] = useState(false);
 
    const handleCancelar = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    function editar(){
         
        const dadosEmpresa = {
            id: id,
            nome: nome,
            cpf: cpf,
            cnpj: cnpj,
            senha: senha,
            ativo: (situacao.checkedSituacao) ? 'A' : 'I',
            qtdeacesso: qtdeAcesso,
            url: url,
            nivel: (tipo.checkedAdmin) ? 0 : 1
        }

        Schema.validate(dadosEmpresa)
            .then(resolve => {

                api.put(`api/empresas/`, dadosEmpresa, {
                        headers: {
                            authorization: Token.GetToken(),
                        }
                    })
                    .then(
                        response => {   
                            exibirMensagem('Empresa alterada com sucesso!', 'success')                    
                            history.push('/empresas/');
                        },
                        error => {                   

                            if (error.response.status === 401){
                                exibirMensagem('Não foi possível alterar empresa! ' + error.response.data.mensagem, 'error')  
                                localStorage.clear();
                                history.push('/');
                            }else{
                                exibirMensagem('Não foi possível alterar empresa! ' + error.response.data.error, 'error')
                            }
                        }
                    )
                    .catch(error => {
                        exibirMensagem('Erro desconhecido. Não foi possível alterar empresa! ', 'error')
                        history.push('/home');
                })
            })
            .catch(err => {
                exibirMensagem(err.errors, 'error')
            }
        );        
    }

    function salvar (){        
           
        const dadosEmpresa = {
            nome: nome,
            cpf: cpf,
            cnpj: cnpj,
            senha: senha,
            ativo: (situacao.checkedSituacao) ? 'A' : 'I',
            qtdeacesso: qtdeAcesso,
            url: url,
            nivel: (tipo.checkedAdmin) ? 0 : 1
        }

        Schema.validate(dadosEmpresa)
            .then(resolve => {

                api.post(`api/empresas/`, dadosEmpresa, {
                    headers: {
                        authorization: Token.GetToken(),
                    }
                })
                .then(
                    response => {  
                        exibirMensagem('Empresa cadastrada com sucesso!', 'success')
                        history.goBack();
                    },
                    error => {                   

                        if (error.response.status === 401){
                            exibirMensagem('Não foi possível cadastrar empresa! ' + error.response.data.mensagem, 'error')
                            localStorage.clear();
                            history.push('/');
                        }else{
                            exibirMensagem('Não foi possível cadastrar empresa! ' + error.response.data.error, 'error')
                        }
                    }
                )
                .catch(error => {
                    exibirMensagem('Erro desconhecido. Não foi possível cadastrar empresa! ', 'error')
                    history.push('/home');
                })
            })
            .catch(err => {
                exibirMensagem(err.errors, 'error')
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
            setEmpresas();
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
                                    checked={tipo.checkedAdmin}
                                    onChange={handleChangeTipo}
                                    name="checkedAdmin"
                                    color="primary"
                                />
                            }
                            label="Administrador?"
                        />

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

                    <Grid item xs={8} sm={9}>
                        <TextField
                            label="Nome"
                            variant="outlined"
                            size="small"    
                            fullWidth
                            value={nome} onChange={e => setNome(e.target.value)}
                        />   
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <TextField
                            label="CPF"
                            variant="outlined"
                            size="small"            
                            value={cpf} onChange={e => setCpf(e.target.value)}
                        />                          
                    </Grid>



                    <Grid item xs={12} sm={3} >                        
                        <TextField
                            label="CNPJ"
                            variant="outlined"
                            size="small"              
                            value={cnpj} onChange={e => setCnpj(e.target.value)}
                        />  
                    </Grid>

                    <Grid item xs={12} sm={3} >
                        <TextField
                            label="Quant. de acesso"
                            variant="outlined"
                            size="small"
                            type="number"
                            value={qtdeAcesso} onChange={e => setQtdeAcesso(e.target.value)}
                        />                          
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Url API"
                            variant="outlined"
                            size="small"                
                            fullWidth
                            value={url} onChange={e => setUrl(e.target.value)}
                        />                          
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <TextField
                            label="Senha"
                            variant="outlined"
                            size="small"
                            type="password"
                            value={senha} onChange={e => setSenha(e.target.value)}
                        />                           
                    </Grid>                    
                </Grid>
            </form>
        </Fragment>
    );
};