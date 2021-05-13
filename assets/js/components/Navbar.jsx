import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthAPI from '../services/authAPI';
import AuthContext from '../contexts/AuthContext';

const Navbar = ({history}) => {
   
   const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);

  // Déconnexion
    const handleLogout = () =>{
        AuthAPI.logout();
        setIsAuthenticated(false);
        history.replace("/login");
    }

  
    return ( <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    <NavLink className="navbar-brand" to="#">PRESTA</NavLink>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
  
    <div className="collapse navbar-collapse" id="navbarColor02">
      <ul className="navbar-nav mr-auto">
        <li className="nav-item active">
          <NavLink className="nav-link" to="#">Accueil
            <span className="sr-only">(current)</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/clients">Clients</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="factures">Factures</NavLink>
        </li>
        
        <li className="nav-item dropdown">
          <NavLink className="nav-link dropdown-toggle" data-toggle="dropdown" to="#" role="button" aria-haspopup="true" aria-expanded="false">Dropdown</NavLink>
          <div className="dropdown-menu">
            <NavLink className="dropdown-item" to="#">Action</NavLink>
            <NavLink className="dropdown-item" to="#">Another action</NavLink>
            <NavLink className="dropdown-item" to="#">Something else here</NavLink>
            <div className="dropdown-divider"></div>
            <NavLink className="dropdown-item" to="#">Separated link</NavLink>
          </div>
        </li>
      </ul>
      <ul className="navbar-nav ml-auto">
       {(!isAuthenticated && (<>  <li className="nav-item">
            <NavLink to="#" className="btn btn-light">Créer un compte</NavLink>
        </li>
        &nbsp;&nbsp;
        <li className="nav-item">
            <NavLink to="/login" className="btn btn-primary">S'identifier</NavLink>
        </li>
        &nbsp;&nbsp; </>))  || (
           <li className="nav-item">
           <button onClick={handleLogout} className="btn btn-danger">Se deconnecter</button>
       </li>
        )} 
      </ul>
    </div>
  </nav> );
}
 
export default Navbar;