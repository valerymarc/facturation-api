import axios from "axios";
import React, { useContext, useState } from 'react';
import AuthAPI from '../services/authAPI';
import AuthContext from '../contexts/AuthContext';

const LoginPage = ({history}) => {
    console.log(history);
    
    const { setIsAuthenticated } = useContext(AuthContext);

    const [credentials, setCredentials] = useState({
        username : "",
        password : ""
    });

    const [error, setError] = useState("");
    
    //Gestion des champs
    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;
        setCredentials({...credentials, [name]: value})
    }

    //Gestion de la validation des données
    const handleSubmit = async event =>{
        event.preventDefault();
        try{
         await AuthAPI.authenticate(credentials);
         setError("");
         setIsAuthenticated(true);
         history.replace("/");
        }catch(error){
            console.log(error.response);
            setError("Aucun compte ne possède cette adresse");
        }

        console.log(credentials);
    }

    return (<>
    <h1>Page de connexion</h1>
   <br/>
    <form action="" onSubmit={handleSubmit}>
        <div className="form-group">
            <label htmlFor="username">Adresse email</label>
            <input  
             value={credentials.username} 
             onChange={handleChange}
             type="email" 
             id="username" 
             className={"form-control" + (error && " is-invalid")} 
             placeholder="Adresse email de connexion" 
             name="username"/>
             {error && <p className="invalid-feedback">{error}</p>}
        </div>
        <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input 
              value={credentials.password}
              onChange={handleChange} 
              type="password" 
              id="password" 
              className="form-control" 
              placeholder="Mot de passe" 
              name="password"/>
        </div>
        <div className="form-group"><button type="submit" className="btn btn-success">Se connecter</button></div>
    </form>
    </> );
}
 
export default LoginPage;