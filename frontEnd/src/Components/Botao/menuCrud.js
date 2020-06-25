import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import Button from '@material-ui/core/Button';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    
    botao: {
      margin: theme.spacing(1)
    }

  }));

export default function MenuCrud(){

    const classes = useStyles();
    const history = useHistory();

    async function voltarForm(e){
        e.preventDefault();
    
        try {    
            history.goBack();
        } catch (err) {
            alert('Falha ao abrir formulario de usuário., tente novamente.');
        }
    }    
    
    return (
        <Fragment>
            <div>
                <Grid container spacing={3}>         
                    <Grid item xs={12} align="right">
                        
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            className={classes.botao}
                            startIcon={<SaveIcon />}
                            disableElevation
                        >
                            Salvar Dados
                        </Button>

                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            className={classes.botao}
                            startIcon={<CancelIcon />}
                            disableElevation
                            onClick={voltarForm}
                        >
                            Sair
                        </Button>
                    </Grid>
                </Grid>
            </div>
        </Fragment>
    );
};