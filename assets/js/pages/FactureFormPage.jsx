import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Field from '../components/forms/Field';
import Select from '../components/forms/Select';
import FormContentLoader from '../components/loaders/FormContentLoader';
import ClientAPI from '../services/clientsAPI';
import FactureAPI from '../services/facturesAPI';


const FactureFormPage = ({match, history}) => {
    
    const { id = "new" } = match.params;

    const [facture, setFacture] = useState({ 
        montant: "",
        client: "", 
        statut: "ENVOYE"
    });

    const [clients, setClients] = useState([]);
    const [edit, setEdit] = useState(false);

    const [errors, setErrors] = useState({
        montant: "",
        client: "", 
        statut: ""
    });

    const [load, setLoad] = useState(true);

    //Récupération de la liste de clients
    const fetchClient = async () =>{
        try{
          const data =  await ClientAPI.findAll();
          setClients(data);
          setLoad(false);

        if(!facture.client){
            setFacture({...facture, client: data[0].id});
        }

        }catch(error){
            console.log(error.response);
            toast.error("Impossible de charger les clients")
        }
    }

    //Récupération d'une facture 
    const fetchFacture = async () =>{
        try{
           const data = await FactureAPI.find(id);
          
           const {montant, statut, client} = data

           setFacture({montant, statut, client: client.id});
           setLoad(false);
        }catch(error){
            //Flash notification erreur
            toast.error("Erreur lors du chargement de la factures !");

            history.replace("/factures");
            console.log(error.response)
        }
    };

    //Chargement de la liste des clients à chaque chargement du composant
    useEffect(()=>{
       fetchClient();
    }, []);

    //Recupération dans les champs du formaulaire des informations de la facture quand l'id change
    useEffect(() =>{
        if(id !== "new"){
            setEdit(true);
            fetchFacture(id);
        }
    },[id]);

    //Gestion des changement des inputs dans le formulaire
    const handleChange = ({currentTarget}) =>{
        const {name, value} = currentTarget;
        setFacture({...facture, [name]:value});
    };

    //Gestion de la soumission du formulaire
    const handleSubmit = async event =>{
        event.preventDefault();
        try{

           if(edit){
            await FactureAPI.update(id, facture);
            //Flash de notification succes
            toast.success("La facture a bien été modifiée !");
        
           }else{
            await FactureAPI.create(facture);
            //Flash de notification succes
            toast.success("La facture a bien été crée !");
           }
           
           history.replace("/factures");
        }catch({response}){
            const { violations } = response.data;
            if(violations)
            {
                const apiErrors = {};
                violations.forEach(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message
                });
                setErrors(apiErrors);
                //Flash de notification d'érreur
                toast.error("Des erreurs dans votre formulaire !");
            }
        }
    }

    return ( <>
    {(edit && <h1>Modification de facture</h1>) || (<h1>Création d'une nouvelle facture</h1>)}
    {load && <FormContentLoader />}
    {!load && <form onSubmit={handleSubmit}> 
       <Field name="montant" 
              label="Montant"
              type="number"
              placeholder="Montant de la facture"
              onChange={handleChange}
              value={facture.montant}
              error={errors.montant}
              />

        <Select name="client"
                label="Client"
                value={facture.client}
                onChange={handleChange}
                error={errors.client}>
               {clients.map(client => <option key={client.id} value={client.id}>{client.prenom} {client.nom}</option> )}
        </Select>

        <Select name="statut"
                label="Statut"
                value={facture.statut}
                onChange={handleChange}
                error={errors.statut}>
              <option value="ENVOYE">Envoyée</option>
              <option value="PAYE">Payée</option>
              <option value="ANNULE">Annulée</option>      

        </Select>

       

        <div className="form-group">
            <button type="submit" className="btn btn-success">Enregistrer</button>
            <Link to="/factures" className="btn btn-link">Retour à la liste</Link>
        </div>
    </form>
      }

    </> );
}
 
export default FactureFormPage;