import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import clientsAPI from '../services/clientsAPI';
import {confirmAlert} from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const ClientsPage = () => {

    const [clients, setClients] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");

    const fetchClients = async () =>{
        try{
          const data = await clientsAPI.findAll();
          setClients(data);
        }catch(error){
            error => console.log(error.response)
        }
    }


    //Lister tous les clients
    useEffect(() => {
        /*clientsAPI.findAll()
        .then(data => setClients(data))
        .catch(error => console.log(error.response));*/
        fetchClients();
    }, []);

    //Supprimer un client
    const handleDelete = async id =>{
        const originalClients =  [...clients];
        setClients(clients.filter(client => client.id !== id));

//Première façon de faire une requete de delete
try{
    await clientsAPI.delete(id)
}catch(error){
    setClients(originalClients);
    console.log(error.response);
}

//Deuxième facon de faire une requete (traitement de promesse)
      /* clientsAPI.delete(id)
       .then(response => console.log("ok"))
       .catch(error => {
           setClients(originalClients);
           console.log(error.response);
       });*/
    };

     //Confirmation de la suppression d'une facture
     const vide = () =>{};
     const handleConfirm = async id =>{
         await confirmAlert({
             title: 'Suppression du client '+id,
             message: 'Etes vous sûr(e) de vouloir supprimer ce client ?',
             buttons:[
                 {
                     label:'Oui',
                     onClick: ()=> handleDelete(id)
                 },
                 {
                  label:'Non',
                  onClick: ()=> vide()
                 }
             ] 
         });
     }

//Gestion du changement de page
    const handlePageChange = (page) => setCurrentPage(page);

    //Gestion de la recherche des informations
     const handleSearch = ({currentTarget}) =>{
       const value = currentTarget.value;
       setSearch(value);
       setCurrentPage(1);
     };
 
     const itemPerPage = 7;
     //Filtrage des clients en fonction de la recherche
     const filteredClients = clients.filter(
         c =>
         c.prenom.toLowerCase().includes(search.toLowerCase()) ||
         c.nom.toLowerCase().includes(search.toLowerCase()) ||
         c.email.toLowerCase().includes(search.toLowerCase()) ||
         (c.company && c.company.toLowerCase().includes(search.toLowerCase())) ||
         c.id.toString().includes(search.toLowerCase()) ||
         c.factures.length.toString().toLowerCase().includes(search.toLowerCase()) ||
         c.totalMontant.toString().toLowerCase().includes(search.toLowerCase())

     )

     //Pagination des données 
     const paginatedClients = Pagination.getData(filteredClients, currentPage, itemPerPage);
    return ( <>
    <h1>Bienvenue sur les clients</h1>
    <br/>
     <div className="form-group">
         <input type="text" onChange={handleSearch} id="search" value={search} className="form-control" placeholder="Trouver un client ..."/>
     </div>
    <table className="table table-hover">
        <thead className="table-dark">
            <tr>
                <th>Identifiant</th>
                <th>Client</th>
                <th>Email</th>
                <th>Entreprise</th>
                <th className="text-center">Factures</th>
                <th className="text-center">Montant total</th>
                <th className="text-center">Actions</th>
            </tr>
        </thead>
        { filteredClients.length === 0 ? <h5 className="text-center">Désolé ce client n'existe pas </h5> :
        <tbody>
            {paginatedClients.map(client =>(
                <tr key={client.id}>
                    <td>{client.id}</td>
                    <td><a href="#">{client.prenom} {client.nom}</a></td>
                    <td>{client.email}</td>
                    <td>{client.company}</td>
                    <td className="text-center">
                        <span className="badge badge-warning">{client.factures.length}</span> 
                    </td>
                    <td className="text-center">{client.totalMontant.toLocaleString()} €</td>
                    <td>
                        <button 
                        onClick={() => handleConfirm(client.id)} 
                        disabled={client.factures.length > 0 && " active"} 
                        className="btn btn-danger">Delete</button>
                    </td>
                </tr>
            ))}
        </tbody>
         }  
    </table>
    
    {itemPerPage < filteredClients.length && <Pagination currentPage={currentPage} itemPerPage={itemPerPage} length={filteredClients.length} onPageChange={handlePageChange} />}

   
    </> );
}
 
export default ClientsPage;