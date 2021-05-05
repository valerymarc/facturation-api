import React from 'react';
import ReactDOM  from 'react-dom';
import {HashRouter, Switch, Route} from 'react-router-dom';
/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';

// start the Stimulus application
import './bootstrap';
import Navbar from './js/components/Navbar';
import HomePage from './js/pages/HomePage';
import ClientsPage from './js/pages/ClientsPage';
import FacturesPage from './js/pages/FacturesPage';

console.log("hello World Valery Marc !!!");

const App = () =>{
 return <HashRouter>
     <Navbar />
     <main className="container pt-5">
         <Switch>
            <Route path="/factures" component={FacturesPage} /> 
            <Route path="/clients" component={ClientsPage} />
            <Route path="/" component={HomePage}/>
             
         </Switch>
      
     </main>
 </HashRouter>
};

const rootElement = document.querySelector('#app');
ReactDOM.render(<App />,rootElement);