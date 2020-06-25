import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, Table, TableCell, TableRow, TableBody, TableContainer, Paper } from '@material-ui/core';

import BtnVoltar from '../../Components/Botao/voltar';
import BtnEditar from '../../Components/Botao/editar';
import BtnExcluir from '../../Components/Botao/excluir';
import Dialog from '../../Components/Dialog/Dialog';

import { useSnackbar } from 'notistack';

import api from '../../Services/api';
import Token from '../../Services/token';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      '& > *': {
          margin: theme.spacing(0),
          width: '100%',
          height: '100%',
          padding: theme.spacing(0),
      },
    },
    table: {
      minWidth: '100%'
    },
    cell:{
      border: '0px'
    },  
    cellNome:{
        border: '2px',
        width: '15%',
        fontWeight: 'bold'
    },
    botao: {
      margin: theme.spacing(1)
    }
}));

export default function PaperConfiguracoes() {
  
    const classes = useStyles();
    const history = useHistory();

    const configuracoes = history.location.state.detail;

    const conexaoSegura = (configuracoes.con_email_conexao_segura === 'S') ? 'Sim' : 'Não';
    const conTLS = (configuracoes.con_email_tls === 'S') ? 'Sim' : 'Não';
    const confirmaLeitura = (configuracoes.con_email_conf_leitura === 'S') ? 'Sim' : 'Não';

    const { enqueueSnackbar } = useSnackbar();

    const exibirMensagem = (msg, tipo) => {
        enqueueSnackbar(msg, {variant: tipo, anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
        }});
    };

    const [open, setOpen] = useState(false);

    const excluir = () => {
        setOpen(true);
    };
  
    const handleCancelar = () => {
        setOpen(false);
    };

    const handleConfirmar = () => {
        
        setOpen(false);

        try {
            api.delete(`api/configuracoes/${configuracoes.con_id}`, {
                headers: {
                    authorization: Token.GetToken(),
                }
            }).then(
                response => {
                    exibirMensagem('Configurações excluído com sucesso!', 'success');
                    history.goBack();
                },
                error => {                   

                    if (error.response.status === 401){
                        exibirMensagem('Não foi possível excluir configurações! ' + error.response.data.mensagem, 'error');
                        localStorage.clear();
                        history.push('/');
                    }else{
                        exibirMensagem('Não foi possível excluir configurações! ' + error.response.data.mensagem, 'error');
                    }
                }
            )
        } catch (error) {
            exibirMensagem('Erro desconhecido. Não foi possível excluir configurações! ', 'error');
        }    
    }

    return (
        <div className={classes.root}>

            <div align="right">
                
                <BtnEditar form="/configuracoes/form" dados={configuracoes} />
                <BtnExcluir Excluir={excluir} />            
                <BtnVoltar />
            </div>  

            <Dialog
                open={open}
                onClose={handleCancelar}
                title={'Deseja realmente excluir a configuração?'}
                cancelar={handleCancelar}
                confirmar={handleConfirmar}
                conteudo={'Atenção! Não é possível recuperar o conteúdo excluído!'}
            >
            </Dialog>

            <Paper elevation={3} >
                <TableContainer component={Paper}>                
                    <Table className={classes.table} aria-label="simple table">

                        <TableBody>                                        
                            <TableRow key={() => { return 0}}>
                                <TableCell className={classes.cellNome}> {'Servidor SMTP: '} </TableCell>
                                <TableCell className={classes.cell}> {configuracoes.con_email_servidorsmtp} </TableCell>
                            </TableRow>

                            <TableRow key={() => { return 1}}>
                                <TableCell className={classes.cellNome}> {'Porta E-mail: '} </TableCell>
                                <TableCell className={classes.cell}> {configuracoes.con_email_porta} </TableCell>
                            </TableRow>

                            <TableRow key={() => { return 2}}>
                                <TableCell className={classes.cellNome}> {'Usuario E-mail: '} </TableCell>
                                <TableCell className={classes.cell}> {configuracoes.con_email_usuario} </TableCell>
                            </TableRow>

                            <TableRow key={() => { return 3}}>
                                <TableCell className={classes.cellNome}> {'Conexão Segura?: '} </TableCell>
                                <TableCell className={classes.cell}> {conexaoSegura} </TableCell>
                            </TableRow>

                            <TableRow key={() => { return 4}}>
                                <TableCell className={classes.cellNome}> {'TLS?: '} </TableCell>
                                <TableCell className={classes.cell}> {conTLS} </TableCell>
                            </TableRow>

                            <TableRow key={() => { return 5}}>
                                <TableCell className={classes.cellNome}> {'Confirmação de leitura?: '} </TableCell>
                                <TableCell className={classes.cell}> {confirmaLeitura} </TableCell>
                            </TableRow>

                            <TableRow key={() => { return 6}}>
                                <TableCell className={classes.cellNome}> {'Mensagem automática: '} </TableCell>
                                <TableCell className={classes.cell}> {configuracoes.con_email_mensagem} </TableCell>
                            </TableRow>                            
                        </TableBody>

                    </Table>
                </TableContainer>
            </Paper>
        </div>
    );
}