import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import BusinessIcon from '@material-ui/icons/Business';
import SettingsIcon from '@material-ui/icons/Settings';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import './Home.css';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,  
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function ResponsiveDrawer(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  
  const history = useHistory();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  async function handleEmpresas(e){
    e.preventDefault();

    try {
        // const response = await api.post('sessions', { id });

        // localStorage.setItem('ongId', id);
        // localStorage.setItem('ongName', response.data.name);

        // throw "Erro2";

        history.push('/empresas');
    } catch (err) {
        alert('Falha no outro, tente novamente.');
    }     
  }   

  async function handleUsuarios(e){
    e.preventDefault();

    try {
        // const response = await api.post('sessions', { id });

        // localStorage.setItem('ongId', id);
        // localStorage.setItem('ongName', response.data.name);

        // throw "Erro2";

        history.push('/usuarios');
    } catch (err) {
        alert('Falha no usuarios, tente novamente.');
    }     
  }

  async function handleModulos(e){
    e.preventDefault();

    try {
        // const response = await api.post('sessions', { id });

        // localStorage.setItem('ongId', id);
        // localStorage.setItem('ongName', response.data.name);

        // throw "Erro2";

        history.push('/modulos');
    } catch (err) {
        alert('Falha no modulos, tente novamente.');
    }     
  }  
  
  async function handleConfiguracoes(e){
    e.preventDefault();

    try {
        // const response = await api.post('sessions', { id });

        // localStorage.setItem('ongId', id);
        // localStorage.setItem('ongName', response.data.name);

        // throw "Erro2";

        history.push('/configuracoes');
    } catch (err) {
        alert('Falha no configurações, tente novamente.');
    }     
  }

  async function btnSair(e){
    e.preventDefault();

    try {
        // const response = await api.post('sessions', { id });

        // localStorage.setItem('ongId', id);
        // localStorage.setItem('ongName', response.data.name);

        // throw "Erro2";

        history.push('/');
    } catch (err) {
        alert('Falha ao sair do painel, tente novamente.');
    }     
  }  

  const drawer = (
    <div style={{ backgroundColor: "#01579b", color: "#fff", height: '100%'}} >
      <div className={classes.toolbar} />
      <Divider />
        <List>
            <ListItem button onClick={handleEmpresas} >        
                <ListItemIcon>
                    <BusinessIcon className="Button-menu" />
                </ListItemIcon >
                <ListItemText primary={'Empresas'}/>
            </ListItem>
        </List>
        <List>
            <ListItem button onClick={handleUsuarios}  >        
                <ListItemIcon>
                    <AssignmentIndIcon className="Button-menu" />
                </ListItemIcon>
                <ListItemText primary={'Usuários'}/>
            </ListItem>
        </List>
        <List>
            <ListItem button onClick={handleModulos} >        
                <ListItemIcon>
                    <InboxIcon className="Button-menu" />
                </ListItemIcon>
                <ListItemText primary={'Módulos'}/>
            </ListItem>
        </List>
        <List >
            <ListItem button onClick={handleConfiguracoes} >        
                <ListItemIcon>
                    <SettingsIcon className="Button-menu" />
                </ListItemIcon>
                <ListItemText primary={'Configurações'}/>
            </ListItem>
        </List>               
      <Divider />
      <List>
        <ListItem button onClick={btnSair} >        
            <ListItemIcon>
                <CloseIcon className="Button-menu" />
            </ListItemIcon>
            <ListItemText primary={'Sair'}/>
        </ListItem>
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      
      <AppBar position="fixed" className={classes.appBar} style={{ backgroundColor: '#01579b'}}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            {/* Menu responsivo para o menu */}
            <MenuIcon />

          </IconButton>

          <Typography variant="h6" noWrap>
            { props.paginaAtiva }
          </Typography>

        </Toolbar>
      </AppBar>

      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
            <Drawer
                container={container}
                variant="temporary"
                anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                open={mobileOpen}
                onClose={handleDrawerToggle}
                classes={{
                paper: classes.drawerPaper,
                }}
                ModalProps={{
                keepMounted: true, // Better open performance on mobile.
                }}
            >
                {drawer}
            </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
            <Drawer
            classes={{
                paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
            >
            {drawer}
            </Drawer>
        </Hidden>
      </nav>

        <main className={classes.content}>
            <div className={classes.toolbar} />

            <Fragment>
                { props.children }
            </Fragment>

        </main>

    </div>
  );
}

export default ResponsiveDrawer;