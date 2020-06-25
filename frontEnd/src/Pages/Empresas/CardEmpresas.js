import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, Table, TableCell, TableRow, TableBody, TableContainer, Paper } from '@material-ui/core';

import { useSnackbar } from 'notistack';

import './Empresas.css';
import BtnVoltar from '../../Components/Botao/voltar';
import BtnEditar from '../../Components/Botao/editar';
import BtnExcluir from '../../Components/Botao/excluir';
import Dialog from '../../Components/Dialog/Dialog';

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
    const empresas = history.location.state.detail;

    const nivelUsuario = (empresas.nivel === 0) ? 'Administrador' : 'Usuário';
    const situacaoUsuario = (empresas.ativo === 'A') ? 'Ativo' : 'Inativo';   

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
            api.delete(`api/empresas/${empresas.id}`, {
                headers: {
                    authorization: Token.GetToken(),
                }
            }).then(
                response => {
                    exibirMensagem('Empresa(s) excluída com sucesso!', 'success');
                    history.goBack();
                },
                error => {                   

                    if (error.response.status === 401){
                        exibirMensagem('Não foi possível excluir empresa! ' + error.response.data.mensagem, 'error');
                        localStorage.clear();
                        history.push('/');
                    }else{
                        exibirMensagem('Não foi possível excluir empresa! ' + error.response.data.mensagem, 'error');
                    }
                }
            )
        } catch (error) {
            exibirMensagem('Erro desconhecido. Não foi possível excluir empresa! ', 'error');
        }        
    };

  return (
    <div className={classes.root}>

        <div align="right">
            
            <BtnEditar form="/empresas/form" dados={empresas} />
            <BtnExcluir Excluir={excluir} />            
            <BtnVoltar />
        </div>
        
        <Dialog
            open={open}
            onClose={handleCancelar}
            title={'Deseja realmente excluir a empresas?'}
            cancelar={handleCancelar}
            confirmar={handleConfirmar}
            conteudo={'Atenção! Não é possível recuperar o conteúdo excluído!'}
        >
        </Dialog>

        <Paper elevation={3}>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">                  
                    
                    <TableBody>
                        <TableRow key={() => { return 0}}>
                            <TableCell className={classes.cellNome}> Código: </TableCell>
                            <TableCell className={classes.cell}> { empresas.id }</TableCell>
                        </TableRow>
                        <TableRow key={() => { return 1}}>
                            <TableCell className={classes.cellNome}> Nome: </TableCell>
                            <TableCell className={classes.cell}> { empresas.nome }</TableCell>
                        </TableRow>
                        <TableRow key={() => { return 2}}>
                            <TableCell className={classes.cellNome}> Tipo: </TableCell>
                            <TableCell className={classes.cell}> { nivelUsuario }</TableCell>
                        </TableRow>

                        <TableRow key={() => { return 3}}>
                            <TableCell className={classes.cellNome}> CPF: </TableCell>
                            <TableCell className={classes.cell}> { empresas.cpf }</TableCell>
                        </TableRow>

                        <TableRow key={() => { return 4}}>
                            <TableCell className={classes.cellNome}> CNPJ: </TableCell>
                            <TableCell className={classes.cell}> { empresas.cnpj }</TableCell>
                        </TableRow>

                        <TableRow key={() => { return 5}}>
                            <TableCell className={classes.cellNome}> Situação: </TableCell>
                            <TableCell className={classes.cell}> { situacaoUsuario }</TableCell>
                        </TableRow>

                        <TableRow key={() => { return 6}}>
                            <TableCell className={classes.cellNome}> N° de acesso: </TableCell>
                            <TableCell className={classes.cell}> { empresas.qtdeacesso }</TableCell>
                        </TableRow>                                

                        <TableRow key={() => { return 7}}>
                            <TableCell className={classes.cellNome}> Url API: </TableCell>
                            <TableCell className={classes.cell}> { empresas.url }</TableCell>
                        </TableRow>
                    </TableBody>
                    
                </Table>
            </TableContainer>
        </Paper>
    </div>
  );
}