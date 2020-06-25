import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({    
    botao: {
        margin: theme.spacing(1),
    }
}));

const BtnEditar = (props) => {

    const classes = useStyles();

    const history = useHistory();

    async function abrirForm(){
        // e.preventDefault();
    
        try {
            // const response = await api.post('sessions', { id });
    
            // localStorage.setItem('ongId', id);
            // localStorage.setItem('ongName', response.data.name);
    
            // throw "Erro2";
            const caminho = props.form;
            const dados = props.dados;
    
            history.push(caminho, { detail: dados});

        } catch (err) {
            alert('Falha ao editar formulario. Tente novamente.');
        }
    }

    return (        
        <Fragment>
            <Button
                variant="contained"
                color="primary"
                size="small"
                className={classes.botao}
                // startIcon={<EditIcon />}
                disableElevation
                onClick={abrirForm}
            >
                Editar
            </Button>   
        </Fragment>
    )
}

export default BtnEditar;