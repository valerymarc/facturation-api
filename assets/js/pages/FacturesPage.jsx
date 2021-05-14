import moment from "moment";
import React, { useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Pagination from '../components/Pagination';
import facturesAPI from '../services/facturesAPI';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";


const STATUT_CLASSE = {
    PAYE : "success",
    ENVOYE: "primary",
    ANNULE: "danger"
}

const STATUT_NAME = {
    PAYE: "Payée",
    ENVOYE: "Envoyée",
    ANNULE: "Annulée"
}

const FacturesPage = () => {
    
    const [factures, setFactures] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [load, setLoad] = useState(true);

    //Lister les factures (charger les données au chargement de la page)
    const fetchFactures = async () =>{
     try{
       const data = await facturesAPI.findAll();
       setFactures(data);
       setLoad(false);
     }catch(error){
        error => console.log(error.response);
        toast.error("Erreur lors du chargement des factures !");
     }
    };

    //Appeler la fonction qui permet de lister les factures
    useEffect(()=>{
         fetchFactures();
    },[]);
    
    //Suppression d'une facture

    const handleDelete = async (id, chrono) =>{
        //Copie du tableau de facture
        const originalFactures = [...factures];

        /*Mise à jour de l'ensemble des factures 
        en tenant du compte du fait que le parmètre id soit bel et
        bien supprimé*/
        setFactures(factures.filter(facture => facture.id !== id))

        //Requete de suppression et gestion des erreurs si nécessaire
        try{
          //appel de la requete API
          await facturesAPI.delete(id)
          toast.success("La facture "+chrono+" a bien été supprimée");
        }catch(error){
            //Remise à jour du jour du tableau initial de facture en cas d'erreur
            setFactures(originalFactures);
            //Recuperation de l'erreur sur la console
            console.log(error.response)
            toast.error("Une erreru est survenue !");
        }

    }

    //Confirmation de la suppression d'une facture
    const vide = () =>{};
    const handleConfirm = async (id, chrono) =>{
        await confirmAlert({
            title: 'Suppression de la facture '+chrono,
            message: 'Etes vous sûr(e) de vouloir supprimer cette facture ?',
            buttons:[
                {
                    label:'Oui',
                    onClick: ()=> handleDelete(id, chrono)
                },
                {
                 label:'Non',
                 onClick: ()=> vide()
                }
            ] 
        });
    }

    //Gérer l'affichage de la date au format choisi
   const formater = str => moment(str).format('DD/MM/YYYY');
   
   //Gestion du changement de page
   const handlePageChange = (page) => setCurrentPage(page);

   //Gestion de la recherche des informations
    const handleSearch = ({currentTarget}) =>{
      const value = currentTarget.value;
      setSearch(value);
      setCurrentPage(1);
    };
    //Nombre de lignes de facture par page
    const itemPerPage = 25;
    
    //Filtrage des données de facture pour la gestion de la recherche
    const filteredFactures = factures.filter(
        f =>
        f.montant.toString().toLowerCase().includes(search.toLowerCase()) ||
        f.chrono.toString().toLowerCase().includes(search.toLowerCase()) ||
        STATUT_NAME[f.statut].toLowerCase().includes(search.toLowerCase()) ||
        f.client.prenom.toLowerCase().includes(search.toLowerCase()) ||
        f.client.nom.toLowerCase().includes(search.toLowerCase()) ||
        formater(f.sentAt).includes(search.toLowerCase()) 
    );

    //Pagination des données 
    const paginatedFactures = Pagination.getData(filteredFactures, currentPage, itemPerPage);

    return ( <>
 
   <div className="mb-3 d-flex justify-content-between align-items-center">
    <h1>Gestion des factures</h1>
    <Link to="/factures/new" className="btn btn-success">Nouvelle facture</Link>
    </div>

    
    <br/>
     <div className="form-group">
         <input type="text" onChange={handleSearch} id="search" value={search} className="form-control" placeholder="Rechercher une facture..."/>
     </div>
    <table className="table table-hover">
        <thead className="table-dark">
            <tr>
                <th>Numéro</th>
                <th>Client</th>
                <th className="text-center">Date d'envoi</th>
                <th className="text-center">Statut</th>
                <th className="text-center">Montant</th>
                <th className="text-center">Actions</th>
            </tr>
        </thead>
       
        {!load && <tbody>
            {paginatedFactures.map(facture => <tr key={facture.id} >
                <td>{facture.chrono}</td>
                <td><Link to={"/clients/"+facture.client.id}>{facture.client.prenom} {facture.client.nom}</Link></td>
                <td className="text-center">{formater(facture.sentAt)}</td>
                <td className="text-center"> 
                    <span className={"badge badge-" + STATUT_CLASSE[facture.statut]}>{STATUT_NAME[facture.statut]}</span>
                </td>
                <td className="text-center">{facture.montant} €</td>
                <td className="text-center">
                    <Link to={"/factures/"+facture.id} className="btn-sm btn-warning">Editer</Link>&nbsp;&nbsp;
                    <button className="btn-sm btn-danger" onClick={() => handleConfirm(facture.id, facture.chrono)}>Delete</button>
                </td>
            </tr>)}
            
        </tbody>
         }
    </table>

   {load && <TableLoader/>}

    {filteredFactures.length >itemPerPage && <Pagination currentPage={currentPage} itemPerPage={itemPerPage} length={filteredFactures.length} onPageChange={handlePageChange} />}

    </> );
}
 
export default FacturesPage;