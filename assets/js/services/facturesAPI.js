import axios from "axios";

function findAll()
{
    return axios.get("http://localhost:8000/api/factures")
    .then(response => response.data["hydra:member"])
}

function find(id)
{
    return axios.get("http://localhost:8000/api/factures/"+id)
    .then(response => response.data);
}

function ajouter(facture)
{
    return axios.post("http://localhost:8000/api/factures", 
    {...facture, client:'/api/clients/'+facture.client});
}

function modifier(id, facture)
{
    return axios.put("http://localhost:8000/api/factures/"+id, 
    {...facture, client:'/api/clients/'+facture.client});
}


function supprimer(id)
{
    return axios.delete("http://localhost:8000/api/factures/"+id);
}

export default{
    findAll,
    find,
    create: ajouter,
    update: modifier,
    delete: supprimer
};