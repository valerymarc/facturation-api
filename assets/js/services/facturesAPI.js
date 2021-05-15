import axios from "axios";
import { FACTURE_API } from "../config";

function findAll()
{
    return axios.get(FACTURE_API)
    .then(response => response.data["hydra:member"])
}

function find(id)
{
    return axios.get(FACTURE_API + "/" + id)
    .then(response => response.data);
}

function ajouter(facture)
{
    return axios.post(FACTURE_API, 
    {...facture, client:'/api/clients/'+facture.client});
}

function modifier(id, facture)
{
    return axios.put(FACTURE_API + "/" + id, 
    {...facture, client:'/api/clients/'+facture.client});
}


function supprimer(id)
{
    return axios.delete(FACTURE_API + "/" + id);
}

export default{
    findAll,
    find,
    create: ajouter,
    update: modifier,
    delete: supprimer
};