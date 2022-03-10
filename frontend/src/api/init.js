import axios from 'axios'
import {storeToken, getValidToken} from './token'


const baseURL = ':3001'
const api = axios.create({})
api.defaults.port = 3001

/**
 * Tallenna käyttäjätoken selaimen localStorage muistiin
 * @param {Käyttäjän kirjautumisavaimen} token 
 */
export function setToken(token){
    storeToken(token)
    if(token){
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }else {
        delete api.defaults.headers.common['Authorization']
    }
    
}

/**
 * Validoi token tai poista jos vanhentunut
 */
setToken(getValidToken())

export default api