import React from 'react';

import { BrowserRouter, Route, Switch } from  'react-router-dom';

import Login from './Pages/Login/Login';
import Home from './Pages/Home/Home';

import ListEmpresas from './Pages/Empresas/ListEmpresas';
import CardEmpresas from './Pages/Empresas/CardEmpresas';
import FormEmpresas from './Pages/Empresas/FormEmpresas';

import ListUsuarios from './Pages/Usuarios/ListUsuarios';
import CardUsuarios from './Pages/Usuarios/CardUsuarios';
import FormUsuarios from './Pages/Usuarios/FormUsuarios';

import ListConfiguracoes from './Pages/Configuracoes/ListConfiguracoes';
import CardConfiguracoes from './Pages/Configuracoes/CardConfiguracoes';
import FormConfiguracoes from './Pages/Configuracoes/FormConfiguracoes';

import Modulos from './Pages/Modulos/ListModulos';
import NotFound from './Pages/NotFound/NotFound';

import PrivateRoute from './Components/PrivateRoute/PrivateRoute';

export default function Routes(){
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Login} />

                <PrivateRoute path="/home" exact render = { () => {
                        return <Home paginaAtiva="Página principal"> 
                                    <h2>Bem vindo ao painel Datacamp</h2>
                                    <p>Página em desenvolvimento</p>
                                </Home>
                    } 
                } />

                {/* <Route path="/home" exact render = { () => {
                        return <Home paginaAtiva="Home" conteudo={ () => {}} />
                    } 
                }/> */}
                {/* <Route path="/empresas" exact render = { () => {
                        return <Home paginaAtiva="Empresas" pagina={ <Empresas /> } />
                    }
                }/> */}
                
                {/* <Route path="/usuarios" component={Home}> 
                
                </Route>                 */}


                <PrivateRoute path="/empresas" exact render = { () => {
                        return <Home paginaAtiva="Lista de Empresas"> 
                                    <ListEmpresas /> 
                                </Home>
                    } 
                }/>

                <PrivateRoute path="/empresas/info" exact render = { () => {
                        return <Home paginaAtiva="Informações da empresa">
                                    <CardEmpresas /> 
                                </Home>
                    } 
                }/>

                <PrivateRoute path="/empresas/form" exact render = { () => {
                        return <Home paginaAtiva="Empresa">
                                    <FormEmpresas /> 
                                </Home>
                    } 
                }/>

                <PrivateRoute path="/usuarios" exact render = { () => {
                        return <Home paginaAtiva="Lista de Usuários"> 
                                    <ListUsuarios /> 
                                </Home>
                    } 
                }/>

                <PrivateRoute path="/usuarios/info" exact render = { () => {
                        return <Home paginaAtiva="Informações do usuário">
                                    <CardUsuarios /> 
                                </Home>
                    } 
                }/>

                <PrivateRoute path="/usuarios/form" exact render = { () => {
                        return <Home paginaAtiva="Usuário">
                                    <FormUsuarios /> 
                                </Home>
                    } 
                }/>

                <PrivateRoute path="/modulos" exact render = { () => {
                        return <Home paginaAtiva="Módulos">
                                    <Modulos /> 
                                </Home>
                    } 
                }/>

                <PrivateRoute path="/Configuracoes" exact render = { () => {
                        return <Home paginaAtiva="Lista de Configurações"> 
                                    <ListConfiguracoes /> 
                                </Home>
                    } 
                }/>

                <PrivateRoute path="/Configuracoes/info" exact render = { () => {
                        return <Home paginaAtiva="Informações do Configurações">
                                    <CardConfiguracoes /> 
                                </Home>
                    } 
                }/>

                <PrivateRoute path="/Configuracoes/form" exact render = { () => {
                        return <Home paginaAtiva="Configurações">
                                    <FormConfiguracoes /> 
                                </Home>
                    } 
                }/>

                <PrivateRoute render = { () => {
                        return <NotFound />
                    } 
                }/>
            </Switch>
        </BrowserRouter>
    )
}