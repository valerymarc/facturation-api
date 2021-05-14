import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/forms/Field';
import UserAPI from '../services/usersAPI';

const InscriptionPage = ({history}) => {
    
    const [user, setUser] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const [errors, setErrors] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    //Gestion des changement des inputs dans le formulaire
    const handleChange = ({currentTarget}) =>{
        const {name, value} = currentTarget;
        setUser({...user, [name]:value});
    };

    //Gestion de la soumission
    const handleSubmit = async event =>{
        event.preventDefault();

        const apiErrors = {};
        
        if(user.password !== user.passwordConfirm){
            apiErrors.passwordConfirm="Vos mots de passe ne concordent pas";
            setErrors(apiErrors);
            return;
        }

        if(user.passwordConfirm===null){
            apiErrors.passwordConfirm="Confirmez votre mot de passe"; 
            setErrors(apiErrors);
            return;
        }

        try{
          const response = await UserAPI.register(user);
          setErrors({});
          //Notfication Flash succes
          history.replace("/login");
          console.log(response);
        }catch(error){
            console.log(error.response);
            const {violations} = error.response.data;
            if(violations){
                
                violations.forEach(violation => {
                   apiErrors[violation.propertyPath] = violation.message;
                });
                setErrors(apiErrors);
            }
            //Notification Flash erreur
        }
    };

    return ( <>
    <h1>Nouveau ? Créez votre compte ici</h1>

    <form onSubmit={handleSubmit}>
     <Field name="firstname" 
            label="Prénom" 
            placeholder="Entrez votre prénom" 
            onChange={handleChange}
            value={user.firstname} 
            error={errors.firstname} />

    <Field name="lastname" 
            label="Nom de famille" 
            placeholder="Entrez votre nom de famille" 
            onChange={handleChange}
            value={user.lastname} 
            error={errors.lastname} />  

    <Field name="email" 
            label="Email" 
            placeholder="Entrez votre email" 
            type="email"
            onChange={handleChange}
            value={user.email} 
            error={errors.email} />

     <Field name="password"
            label="Mot de passe"
            placeholder="Entrez votre mot de passe"
            type="password"
            onChange={handleChange}
            value={user.password}
            error={errors.password} />
     
     <Field name="passwordConfirm" 
            label="Confirmation" 
            placeholder="Confirmez votre mot de passe" 
            type="password"
            onChange={handleChange}
            value={user.passwordConfirm} 
            error={errors.passwordConfirm} />
    <div className="form-group">
        <button type="submit" className="btn btn-primary">Je crée mon compte</button>
        <Link to="/login" className="btn btn-link">J'ai déjà un compte</Link>
    </div>
    </form>

    </> );
}
 
export default InscriptionPage;