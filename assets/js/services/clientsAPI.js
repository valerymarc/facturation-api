import axios from "axios";

function findAll()
{
    return axios.get("http://localhost:8000/api/clients")
    .then(response => response.data["hydra:member"])
}

function find(id)
{
    return axios.get("http://localhost:8000/api/clients/"+id)
    .then(response => response.data);
}

function ajouterClient(client)
{
    return axios.post("http://localhost:8000/api/clients", client)
    .then(response => response.data);
}

function modifierClient(id, client)
{
    return axios.put("http://localhost:8000/api/clients/"+id, client)
    .then(response => response.data);
}

function supprimerClient(id)
{
    return axios.delete("http://localhost:8000/api/clients/"+id);
}



export default{
    findAll,
    find,
    create: ajouterClient,
    update : modifierClient,
    delete: supprimerClient
};