import React from 'react'
import { useHistory } from 'react-router-dom';
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableContainer from '@material-ui/core/TableContainer';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    table: {
      minWidth: '100%',
    },
});

// const CellDeleta = ({ removeDados, id }) => {
//     if (!removeDados) {
//         return null
//     }

//     return (
//         <TableCell>
//             <Button
//                 variant='contained'
//                 color='primary'
//                 onClick={() => {
//                     removeDados(id)
//                 }}
//             >
//                 Remover
//             </Button>
//         </TableCell>
//     )
// }

// const TituloDeleta = ({ removeDados }) => {
//     if (!removeDados) {
//         return null
//     }

//     return <TableCell>Remover</TableCell>
// }

const Tabela = props => {
    // const { campos, dados, removeDados } = props
    const { campos, dados } = props;

    const history = useHistory();
    const classes = useStyles();

    async function abrirForm(objDados){
        // e.preventDefault();
    
        try {
            // const response = await api.post('sessions', { id });
    
            // localStorage.setItem('ongId', id);
            // localStorage.setItem('ongName', response.data.name);
    
            const caminho = props.form;

            history.push(caminho, { detail: objDados});
        } catch (err) {
            alert('Falha ao abrir formulário, tente novamente.');
        }
    }

    return (        
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                
                <TableHead style={{ backgroundColor: '#eeeeee', color: '#fff' }} >
                    <TableRow key={ () => { return 0} }>
                        {campos.map(campo => (
                            <TableCell>{campo.titulo}</TableCell>
                        ))}

                    </TableRow>
                </TableHead>
                
                <TableBody>
                    {dados.map(dados => (

                        <TableRow key={dados.id} hover={true} onClick={ () => { abrirForm(dados) } }>

                            {campos.map(campo => (
                                <TableCell>{dados[campo.dado]}</TableCell>
                            ))}

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default Tabela;