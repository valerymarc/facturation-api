import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/forms/Field';
import ClientAPI from '../services/clientsAPI';
import clientsAPI from '../services/clientsAPI';

const ClientFormPage = ({match, history}) => {
    
    const { id="new" } = match.params;
    if(id !== "new"){
        console.log(+id);
    }

    const [client, setClient] = useState({
        prenom: "",
        nom: "",
        email: "",
        company: ""
    });

    const [error, setError] = useState({
        prenom: "",
        nom: "",
        email: "",
        company: ""
    });

    //Gestion des changement des inputs dans le formulaire
    const handleChange = ({currentTarget}) =>{
        const {name, value} = currentTarget;
        setClient({...client, [name]:value});
    };

    //Recupere les données du client dans les champs du formulaire
    const fetchClient = async id => {
        try{
            const {prenom, nom, email, company}  = await ClientAPI.find(id);
            setClient({prenom, nom, email, company});
        }catch(error){
            console.log(error.response);
            //Notifiction de flash d'une erreur
            history.replace("/clients");
        }
        
    }
      
    const [edit, setEdit] = useState(false);

    //Chargement du client si besoin au chargement du composant ou au changement de l'identifiant
   useEffect(()=> {
       if(id !=="new"){
        setEdit(true);
        fetchClient(id);
       } 
   }, [id])

   //Soumission du formulaire
    const handleSubmit = async event =>{
         event.preventDefault();
         try{
            if(edit){
                await clientsAPI.update(id, client);
                //Flash de notification de succes
            }else{
                await ClientAPI.create(client);
                //Flash de notification de succes
            }
            history.replace("/clients");
           
           setError({});
           console.log(response.data);
         }catch({response}){
             const { violations } = response.data;
           if(violations)
           {
               const apiErrors = {};
               violations.forEach(({propertyPath, message}) => {
                   apiErrors[propertyPath] = message
               });
               setError(apiErrors);
               //Flash de notification d'érreur
           }
         }
         console.log(client);
    };

    return ( <>
    {(!edit && <h1>Création d'un nouveau client</h1>) || (<h1>Modification du client</h1>)}
    <form onSubmit={handleSubmit}>
        <Field name="prenom" 
               label="Prénom" 
               value={client.prenom} 
               onChange={handleChange} 
               placeholder="Prénom du client"
               error={error.prenom}/>
        <Field name="nom" 
               label="Nom de famille" 
               value={client.nom} 
               onChange={handleChange} 
               placeholder="Nom de famille du client"
               error={error.nom}/>
        <Field name="email" 
               label="Email" 
               value={client.email} 
               onChange={handleChange} 
               placeholder="Email du client"
               error={error.email}/>
        <Field name="company" 
               label="Compagnie" 
               value={client.company} 
               onChange={handleChange} 
               placeholder="Compagnie du client" 
               error={error.company}/>

        <div className="form-group">
            <button type="submit" className="btn btn-success">Enregistrer</button>
            <Link to="/clients" className="btn btn-link">Retour à la liste</Link>
        </div>

    </form>
    </> );
}
 
export default ClientFormPage;