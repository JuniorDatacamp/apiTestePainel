import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, CssBaseline, Link, Box, Container, Typography, makeStyles } from '@material-ui/core';

import './Login.css';
import { white } from 'material-ui/styles/colors';

import { useSnackbar } from 'notistack';
import api from '../../Services/api';
import Token from '../../Services/token';

function Copyright() {
  return (

    <div align='center' style={{ color: 'white' }}>
        {'Copyright © '}

        <Link color="inherit" href="https://datacamp.net.br/" target="_blank">
            <b> DATACAMP LTDA </b>
        </Link>
        { ' - ' + new Date().getFullYear()}
    </div>
  );
}
const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(6),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '10px',
        height: 'auto',
        backgroundColor: '#01579b',    
        borderRadius: '10px 10px 10px 10px'
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: white,
        color: '#01345C'
    },
}));

export default function SignIn() {
  
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();   
    const history = useHistory();

    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');

    const exibirMensagem = (msg, tipo) => {
        enqueueSnackbar(msg, {variant: tipo, anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
        }});
    };

    function efetuarLogin(){
            
        const dadosLogin = {
            login: login,
            senha: senha
        }

        api.post('login', dadosLogin)
        .then(
            response => {

                const { data } = response;

                if ( data ){

                    Token.PostToken(data.token);
                    history.push('/home');
                }                    
            },
            error => {
                localStorage.clear();
                exibirMensagem('Não foi possível efetuar o login: Verifique usuário ou senha.', 'warning');
            },                
        )
    }

    return (
        

        <Container component="main" maxWidth="xs" id="container-principal" >
        <CssBaseline />

            <div className={classes.paper} id="paper">        

                <br/>

                <div align='center'>
                    <img src="logo.png" alt="Datacamp LTDA" width="120" height="60" /> <br/>
                    
                    <br/>
                    <Typography component="h1" variant="h5" className="type-h5">
                        Faça seu login
                    </Typography>   
                </div>

                <form className={classes.form} noValidate>
                    
                    <i>Usuário</i>
                    <input type="text" className="input-text" value={login} onChange={e => setLogin(e.target.value)}></input>
                    <br/><br/>
                    <i>Senha</i>
                    <input type="password" className="input-text" value={senha} onChange={e => setSenha(e.target.value)}></input>

                    <Button className="button" onClick={efetuarLogin} >Acessar</Button>
                    
                    <Box mt={8} align='center'>
                        <Copyright />
                    </Box>
                </form>
            </div>
        </Container>
    );
}