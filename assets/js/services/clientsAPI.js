import axios from "axios";
import Cache from "./cache";
import {CLIENTS_API} from "../config";
 
async function findAll()
{
    const cachedClients = await Cache.get("clients");

    if(cachedClients) return cachedClients;

    return axios.get(CLIENTS_API)
    .then(response => { 
        const clients = response.data["hydra:member"];
        Cache.set("clients", clients);
        return clients;
    });
    
}

async function find(id)
{
    const cachedClient = await Cache.get("clients." + id);
    
    if(cachedClient){
        return cachedClient;
    }

    return axios.get(CLIENTS_API + "/" + id)
    .then(response => {
        const client = response.data;
        Cache.set("clients."+id, client);
        return client;
    });
}

function ajouterClient(client)
{
    return axios.post(CLIENTS_API, client)
    .then(async response => {
        const cachedClients = await Cache.get("clients");
        if(cachedClients){
          Cache.set("clients", [...cachedClients, response.data]);
        }
        return response;
    });
}

function modifierClient(id, client)
{
    return axios.put(CLIENTS_API + "/" + id, client)
    .then(async response => {
        //Une autre methode qui invalide directement le le cache
        //Cache.invalidate("clients");
      
             //OU

        const cachedClients = await Cache.get("clients");
        const cachedClient = await Cache.get("clients");

        if(cachedClient){
            Cache.set("clients."+id, response.data);
        }

        if(cachedClients){
            const index = cachedClients.findIndex(c => c.id === +id);
            cachedClients[index] = response.data;
        }
        return response;
    });
}

function supprimerClient(id)
{
    return axios.delete(CLIENTS_API + "/" + id)
    .then(async response => {
        const cachedClients = await Cache.get("clients");
        if(cachedClients){
          Cache.set("clients", cachedClients.filter(c => c.id !== id));
        }
        return response;
    });
}



export default{
    findAll,
    find,
    create: ajouterClient,
    update : modifierClient,
    delete: supprimerClient
};