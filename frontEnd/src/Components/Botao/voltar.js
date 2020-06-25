import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({    
    botao: {
        margin: theme.spacing(1)
    }
}));

const BtnVoltar = (props) => {

    const classes = useStyles();

    const history = useHistory();

    async function voltarForm(e){
        e.preventDefault();
    
        try {    
            history.goBack();
        } catch (err) {
            alert('Falha ao voltar, tente novamente.');
        }
    }    

    return (        
        <Fragment>
            <Button
                variant="contained"
                color="primary"
                size="small"
                className={classes.botao}
                // startIcon={<Voltar />}
                disableElevation
                onClick={voltarForm}
            >
                Voltar
            </Button>   
        </Fragment>
    )
}

export default BtnVoltar;