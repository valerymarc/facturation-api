import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, withRouter } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// start the Stimulus application
import './bootstrap';
import Navbar from './js/components/Navbar';
import PrivateRoute from './js/components/PrivateRoute';
import AuthContext from './js/contexts/AuthContext';
import ClientFormPage from './js/pages/ClientFormPage';
import ClientsPage from './js/pages/ClientsPage';
import FactureFormPage from './js/pages/FactureFormPage';
import FacturesPage from './js/pages/FacturesPage';
import HomePage from './js/pages/HomePage';
import InscriptionPage from './js/pages/InscriptionPage';
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
            <Route path="/register" component={InscriptionPage} /> 
            <PrivateRoute path="/factures/:id" component={FactureFormPage} />
            <PrivateRoute path="/factures"  component={FacturesPage} /> 
            <PrivateRoute path="/clients/:id" component={ClientFormPage}/>
            <PrivateRoute path="/clients" component={ClientsPage} />
         
            <PrivateRoute path="/" component={HomePage}/>
             
         </Switch>
      
     </main>
 </HashRouter>
 <ToastContainer position={toast.POSITION.TOP_CENTER}/>
 </AuthContext.Provider>)
};

const rootElement = document.querySelector('#app');
ReactDOM.render(<App />,rootElement);