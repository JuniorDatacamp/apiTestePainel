import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({    
    botao: {
        margin: theme.spacing(1)
    }
}));

const BtnExcluir = (props) => {

    const classes = useStyles();

    return (        
        <Fragment>
            <Button
                variant="contained"
                color="primary"
                size="small"
                className={classes.botao}
                // startIcon={<DeleteIcon />}
                disableElevation
                onClick={ () => { props.Excluir() } }
            >
                Excluir
            </Button>   
        </Fragment>
    )
}

export default BtnExcluir;