import axios from "axios";
import clientsAPI from "./clientsAPI";
import jwtDecode from "jwt-decode";

/**
 * Positionne le token JWT sur Axios
 * @param {string} token le token JWT 
 */
function setAxiosToken(token)
{
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}

//Déconnexion et suppression du token sur le localStorage te sur Axios
function logout()
{
    //retirer le token du localStorage
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
    
}


/**
 * Requete HTTP d'authenfication et stockage du token dans le localStorage te sur Axios
 * @param {Object} credentials 
 * 
 */
function authenticate(credentials)
{
    return axios.post("http://localhost:8000/api/login_check", credentials)
    .then(response => response.data.token)
    .then(token => {
        //Stockage du token dans le localStorage
        window.localStorage.setItem("authToken", token);

        //On previent axios qu'on a un header par defaut sur toutes les futures requête HTTP
        setAxiosToken(token);

        //return true;   

    }); 

}

/**
 * Mise ne place lors du chargeent de l'application
 */
function setup()
{
    //Voir si il y a un token
    const token = window.localStorage.getItem("authToken");
    //Verifier si le token est encore valide
    if(token){
        const {exp: expiration} = jwtDecode(token);
        
        if(expiration * 1000 > new Date().getTime())
        {
            //On previent axios qu'on a un header par defaut sur toutes les futures requête HTTP
            setAxiosToken(token)
            console.log("Connexion établi avec AXIOS");
        }
    }
    //Donner le token à axios
}

/**
 * Permet de savoir si on est authentifié ou pas 
 * @returns boolean
 */
function isAuthenticated()
{
    //Voir si il y a un token
    const token = window.localStorage.getItem("authToken");
    //Verifier si le token est encore valide
    if(token){
        const {exp: expiration} = jwtDecode(token);
        
        if(expiration * 1000 > new Date().getTime())
        {
            return true;
        }
        return false;
    }

    return false;
}

export default{
    authenticate,
    logout,
    setup, 
    isAuthenticated
};