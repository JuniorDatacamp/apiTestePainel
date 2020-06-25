import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, Table, TableCell, TableRow, TableBody, TableContainer, Paper } from '@material-ui/core';

import './Usuarios.css';
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
        width: '10%',
        fontWeight: 'bold'
    },
    botao: {
        margin: theme.spacing(1)
    }
}));

export default function PaperUsuarios() {

    const classes = useStyles();
    const history = useHistory();
    const usuarios = history.location.state.detail;

    const situacaoUsuario = (usuarios.ativo === 'A') ? 'Ativo' : 'Inativo';

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
            api.delete(`api/usuarios/${usuarios.id}`, {
                headers: {
                    authorization: Token.GetToken(),
                }
             }).then(
                response => {
                    exibirMensagem('Usuário excluído com sucesso!', 'success');
                    history.goBack();
                },
                error => {                   

                    if (error.response.status === 401){
                        exibirMensagem('Não foi possível excluir usuário! ' + error.response.data.mensagem, 'error');
                        localStorage.clear();
                        history.push('/');
                    }else{
                        exibirMensagem('Não foi possível excluir usuário! ' + error.response.data.mensagem, 'error');
                    }
                }
            )
        } catch (error) {
            exibirMensagem('Erro desconhecido. Não foi possível excluir usuário! ' + error.response.data.mensagem, 'error');
        }    
    }

    return (
        <div className={classes.root}>

            <div align="right">
                <BtnEditar form="/usuarios/form" dados={usuarios} />
                <BtnExcluir Excluir={excluir} />            
                <BtnVoltar />
            </div>

            <Dialog
                open={open}
                onClose={handleCancelar}
                title={'Deseja realmente excluir o usuário?'}
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
                                    <TableCell className={classes.cellNome}> {'Código: '} </TableCell>
                                    <TableCell className={classes.cell}> { usuarios.id } </TableCell>
                                </TableRow>

                                <TableRow key={() => { return 1}}>
                                    <TableCell className={classes.cellNome}> {'E-mail: '} </TableCell>
                                    <TableCell className={classes.cell}> { usuarios.email } </TableCell>
                                </TableRow>

                                <TableRow key={() => { return 2}}>
                                    <TableCell className={classes.cellNome}> {'Nome: '} </TableCell>
                                    <TableCell className={classes.cell}> { usuarios.nome } </TableCell>
                                </TableRow>

                                <TableRow key={() => { return 3}}>
                                    <TableCell className={classes.cellNome}> {'Telefone: '} </TableCell>
                                    <TableCell className={classes.cell}> { usuarios.telefone } </TableCell>
                                </TableRow>

                                <TableRow key={() => { return 4}}>
                                    <TableCell className={classes.cellNome}> {'Vendedor: '} </TableCell>
                                    <TableCell className={classes.cell}> { usuarios.codvendedor } </TableCell>
                                </TableRow>

                                <TableRow key={() => { return 5}}>
                                    <TableCell className={classes.cellNome}> {'Empresa: '} </TableCell>
                                    <TableCell className={classes.cell}> { usuarios.codempresa } </TableCell>
                                </TableRow>                                

                                <TableRow key={() => { return 6}}>
                                    <TableCell className={classes.cellNome}> {'Cód. acesso: '} </TableCell>
                                    <TableCell className={classes.cell}> { usuarios.codacesso } </TableCell>
                                </TableRow>

                                <TableRow key={() => { return 7}}>
                                    <TableCell className={classes.cellNome}> {'Situação: '} </TableCell>
                                    <TableCell className={classes.cell}> { situacaoUsuario } </TableCell>
                                </TableRow>
                        </TableBody>                        
                    </Table>
                </TableContainer>                        
            </Paper>
        </div>
    );
}