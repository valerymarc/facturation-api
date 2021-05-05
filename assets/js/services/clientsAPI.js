import axios from "axios";

function findAll()
{
    return axios.get("http://localhost:8000/api/clients")
    .then(response => response.data["hydra:member"])
}

function supprimer(id)
{
    return axios.delete("http://localhost:8000/api/clients/"+id);
}

export default{
    findAll,
    delete: supprimer
};