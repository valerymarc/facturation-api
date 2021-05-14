import React, { useContext, useState } from 'react';
import Field from '../components/forms/Field';
import AuthContext from '../contexts/AuthContext';
import AuthAPI from '../services/authAPI';
import { Link } from 'react-router-dom';

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
        <Field name="username" 
               label="Adresse email"
               value={credentials.username}
               onChange={handleChange}
               placeholder="Adresse email de connexion"
               type="email"
               error={error} 
               />
        
        <Field name="password"
               label="Mot de passe"
               value={credentials.password}
               onChange={handleChange}
               type="password"
               error=""
               />

        
        <div className="form-group">
            <button type="submit" className="btn btn-success">Se connecter</button>
            <Link to="/register" className="btn btn-link">Créez votre compte ici</Link>
            </div>
    </form>
    </> );
}
 
export default LoginPage;