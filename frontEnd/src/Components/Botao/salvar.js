import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';

const useStyles = makeStyles((theme) => ({    
    botao: {
        margin: theme.spacing(1)
    }
}));

const BtnSalvar = (props) => {

    const classes = useStyles();

    return (        
        <Fragment>
            <Button
                variant="contained"
                color="primary"
                size="small"
                className={classes.botao}
                startIcon={<SaveIcon />}
                disableElevation
                onClick={ () => { props.Salvar() } }
            >
                Salvar Dados
            </Button>   
        </Fragment>
    )
}

export default BtnSalvar;