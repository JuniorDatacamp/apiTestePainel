import React, { Fragment, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, Grid, FormControlLabel, Switch, TextField, TextareaAutosize } from '@material-ui/core';

import BtnSalvar from '../../Components/Botao/salvar';
import BtnVoltar from '../../Components/Botao/voltar';
import Dialog from '../../Components/Dialog/Dialog';

import { useSnackbar } from 'notistack';
import Schema from './SchemaConfiguracoes';
import api from '../../Services/api';
import Token from '../../Services/token';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      padding: theme.spacing(2),
      backgroundColor: '#f6f7f9',
    }
}));

export default function FormConfiguracoes(){

    const classes = useStyles();
    const history = useHistory();

    const [conId, setConId] = useState(null);
    const [conEmailServidorSmtp, setConEmailServidorSmtp] = useState(null);
    const [conEmailPorta, setConEmailPorta] = useState(null);
    const [conEmailUsuario, setConEmailUsuario] = useState(null);
    const [conEmailSenha, setConEmailSenha] = useState(null);    
    const [conEmailMensagem, setConEmailMensagem] = useState('');
    
    const [conEmailConexaoSegura, setConEmailConexaoSegura] = useState({
        checkedConSegura : false
    });

    const [conEmailTLS, setConEmailTLS] = useState({
        checkedTLS : false
    });

    const [conEmailConfLeitura, setConEmailConfLeitura] = useState({
        checkedConfLeitura : false
    }); 

    const handleChangeConexaoSegura = (event) => {
        setConEmailConexaoSegura({ ...conEmailConexaoSegura, [event.target.name]: event.target.checked });
    };

    const handleChangeTLS = (event) => {
        setConEmailTLS({ ...conEmailTLS, [event.target.name]: event.target.checked });
    };

    const handleChangeConfLeitura = (event) => {
        setConEmailConfLeitura({ ...conEmailConfLeitura, [event.target.name]: event.target.checked });
    };

    function editCadastro(){
        //Se true é para editar o cadastro.
        return (history.location.state !== undefined);
    }

    const { enqueueSnackbar } = useSnackbar();

    const exibirMensagem = (msg, tipo) => {
        enqueueSnackbar(msg, {variant: tipo, anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
        }});
    };

    function setconfiguracoes (){
        
        const configuracoes = history.location.state.detail;

        const conSegura   = (configuracoes.con_email_conexao_segura === 'S') ? true : false;
        const conEmailTls = (configuracoes.con_email_tls === 'S') ? true : false;
        const conConfirmLeitura = (configuracoes.con_email_conf_leitura === 'S') ? true : false;

        setConId(configuracoes.con_id);
        setConEmailServidorSmtp(configuracoes.con_email_servidorsmtp);
        setConEmailPorta(configuracoes.con_email_porta);
        setConEmailUsuario(configuracoes.con_email_usuario);
        setConEmailSenha(configuracoes.con_email_senha);
        setConEmailMensagem(configuracoes.con_email_mensagem);

        setConEmailConexaoSegura({checkedConSegura: conSegura});    
        setConEmailTLS({checkedTLS: conEmailTls});    
        setConEmailConfLeitura({checkedConfLeitura: conConfirmLeitura});
    }

    const [open, setOpen] = useState(false);
 
    const handleCancelar = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    function editar(){
            
        const dadosConfiguracoes = {
            con_id: conId,
            con_email_servidorsmtp: conEmailServidorSmtp,
            con_email_porta: conEmailPorta,
            con_email_usuario: conEmailUsuario,
            con_email_senha: conEmailSenha,            
            con_email_mensagem: conEmailMensagem,
            con_email_conexao_segura: (conEmailConexaoSegura.checkedConSegura) ? 'S' : 'N',
            con_email_tls: (conEmailTLS.checkedTLS) ? 'S' : 'N',
            con_email_conf_leitura: (conEmailConfLeitura.checkedConfLeitura) ? 'S' : 'N'
        }

        Schema.validate(dadosConfiguracoes)
            .then(resolve => {

                api.put(`api/configuracoes/`, dadosConfiguracoes, {
                        headers: {
                            authorization: Token.GetToken(),
                        }
                    })
                    .then(
                        response => {
                            exibirMensagem('Configurações alterada com sucesso!', 'success');
                            history.push('/configuracoes/');
                        },
                        error => {                   

                            if (error.response.status === 401){
                                exibirMensagem('Não foi possível alterar configurações! ' + error.response.data.mensagem, 'error');
                                localStorage.clear();
                                history.push('/');
                            }else{
                                exibirMensagem('Não foi possível alterar configurações! ' + error.response.data.error, 'error');
                            }
                        }
                    )
                    .catch(error => {
                        exibirMensagem('Erro desconhecido. Não foi possível alterar configurações! ' + error.response.data.mensagem, 'error');
                        history.push('/home');
                })
            })
            .catch(err => {
                exibirMensagem(err.errors, 'error');
            }
        );
    }

    function salvar (){
            
        const dadosConfiguracoes = {
            con_email_servidorsmtp: conEmailServidorSmtp,
            con_email_porta: conEmailPorta,
            con_email_usuario: conEmailUsuario,
            con_email_senha: conEmailSenha,            
            con_email_mensagem: conEmailMensagem,
            con_email_conexao_segura: (conEmailConexaoSegura.checkedConSegura) ? 'S' : 'N',
            con_email_tls: (conEmailTLS.checkedTLS) ? 'S' : 'N',
            con_email_conf_leitura: (conEmailConfLeitura.checkedConfLeitura) ? 'S' : 'N'
        }

        Schema.validate(dadosConfiguracoes)
            .then(resolve => {        

                api.post(`api/configuracoes/`, dadosConfiguracoes, {
                    headers: {
                        authorization: Token.GetToken(),
                    }
                })
                .then(
                    response => {
                        exibirMensagem('Configurações cadastrada com sucesso!', 'success')
                        history.goBack();
                    },
                    error => {                   

                        if (error.response.status === 401){
                            exibirMensagem('Não foi possível cadastrar configurações! ' + error.response.data.mensagem, 'error')
                            localStorage.clear();
                            history.push('/');
                        }else{
                            exibirMensagem('Não foi possível cadastrar configurações! ' + error.response.data.error, 'error')
                        }
                    }
                )
                .catch(error => {
                    exibirMensagem('Erro desconhecido. Não foi possível cadastrar configurações! ' + error.response.data.mensagem, 'error')
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
            setconfiguracoes();
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
                                    checked={conEmailConexaoSegura.checkedConSegura}
                                    onChange={handleChangeConexaoSegura}
                                    name="checkedConSegura"
                                    color="primary"
                                />
                            }
                            label="Conexão segura?"
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={conEmailTLS.checkedTLS}
                                    onChange={handleChangeTLS}
                                    name="checkedTLS"
                                    color="primary"
                                />
                            }
                            label="TLS?"
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={conEmailConfLeitura.checkedConfLeitura}
                                    onChange={handleChangeConfLeitura}
                                    name="checkedConfLeitura"
                                    color="primary"
                                />
                            }
                            label="Confirmação de leitura?"
                        />                        
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Servidor SMTP"
                            variant="outlined"
                            size="small"
                            fullWidth                        
                            value={conEmailServidorSmtp} onChange={e => setConEmailServidorSmtp(e.target.value)}
                        />   
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Usuario E-mail"
                            variant="outlined"
                            size="small"
                            fullWidth            
                            value={conEmailUsuario} onChange={e => setConEmailUsuario(e.target.value)}
                        />                          
                    </Grid>               

                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Porta E-mail"
                            variant="outlined"
                            size="small"    
                            type="number"
                            fullWidth
                            value={conEmailPorta} onChange={e => setConEmailPorta(e.target.value)}
                        />   
                    </Grid>

                    <Grid item xs={12} sm={4} >                        
                        <TextField
                            label="Senha E-mail"
                            variant="outlined"
                            type="password"
                            size="small"              
                            value={conEmailSenha} onChange={e => setConEmailSenha(e.target.value)}
                        />  
                    </Grid>

                    <Grid item xs={12} >

                        <TextareaAutosize 
                            aria-label="empty textarea" 
                            rowsMin={1} 
                            placeholder="Mensagem automática enviar para o e-mail"
                            value={conEmailMensagem} onChange={e => setConEmailMensagem(e.target.value)}
                        />                      

                    </Grid>                 
                </Grid>
            </form>

        </Fragment>
    );
};