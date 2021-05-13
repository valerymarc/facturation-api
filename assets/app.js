import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, withRouter } from 'react-router-dom';
// start the Stimulus application
import './bootstrap';
import Navbar from './js/components/Navbar';
import PrivateRoute from './js/components/PrivateRoute';
import AuthContext from './js/contexts/AuthContext';
import ClientsPage from './js/pages/ClientsPage';
import FacturesPage from './js/pages/FacturesPage';
import HomePage from './js/pages/HomePage';
import LoginPage from './js/pages/LoginPage';
import AuthAPI from './js/services/authAPI';
/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */
// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';


AuthAPI.setup();

console.log("hello World Valery Marc !!!");




const App = () =>{
// Il faut demander par defaut à notre AuthAPI si on est connecté ou pas
const [isAuthenticated, setIsAuthenticated] = useState(AuthAPI.isAuthenticated());

const NavbarWithRouter = withRouter(Navbar);

const contextValue = {
    isAuthenticated, 
    setIsAuthenticated
}

 return (
 <AuthContext.Provider value={contextValue}>
 <HashRouter>
     <NavbarWithRouter />
     <main className="container pt-5">
         <Switch>
            <Route path="/login" component={LoginPage} /> 
            <PrivateRoute path="/factures"  component={FacturesPage} /> 
            <PrivateRoute path="/clients" component={ClientsPage} />
            <Route path="/" component={HomePage}/>
             
         </Switch>
      
     </main>
 </HashRouter>
 </AuthContext.Provider>)
};

const rootElement = document.querySelector('#app');
ReactDOM.render(<App />,rootElement);