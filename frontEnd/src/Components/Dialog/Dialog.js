import React from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function Mensagem ({open, onClose, title, cancelar, confirmar, conteudo}) {
    
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>

                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {conteudo}
                </DialogContentText>
                </DialogContent>            
            
            <DialogActions>
            <Button onClick={cancelar} color="primary">
                Cancelar
            </Button>
            <Button onClick={confirmar} color="primary" autoFocus>
                Confirmar
            </Button>
            </DialogActions>
        </Dialog>
    )
}