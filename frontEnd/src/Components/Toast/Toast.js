import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'

/* Utilizando o Toast */

// import Toast from '../../Components/Toast/Toast';

// const [open, setOpen] = useState(false);

// const handleClick = () => {
//     setOpen(true);
// };

// const handleClose = (event, reason) => {
    
//     if (reason === 'clickaway') {
//       return;
//     }

//     setOpen(false);
// };

// ** No html **
/* <Toast open={open} handleClose={handleClose} severity={tipoMSG}>
    {mensagem}
</Toast> */

export default ({ open, handleClose, children, severity }) => (
    
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'right',}}>
        <Alert onClose={handleClose} variant='filled' severity={severity}>
            {children}
        </Alert>
    </Snackbar>    
)