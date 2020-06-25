import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    botao: {
        margin: theme.spacing(1)
    }
}));

const BtnAdd = (props) => {

    const classes = useStyles();

    const history = useHistory();

    async function abrirForm(e){
        e.preventDefault();
    
        try {
            // const response = await api.post('sessions', { id });
    
            // localStorage.setItem('ongId', id);
            // localStorage.setItem('ongName', response.data.name);
    
            // throw "Erro2";
            const caminho = props.form;
    
            history.push(caminho);
        } catch (err) {
            alert('Falha ao abrir formulario de usuário., tente novamente.');
        }
    }

    return (
        <Fragment>
            <Button
                variant="contained"
                color="primary"
                size="small"
                className={classes.botao}
                startIcon={<AddIcon />}
                disableElevation  
                onClick={abrirForm}              
            >
                Cadastrar
            </Button>
        </Fragment>
    )
}

export default BtnAdd;