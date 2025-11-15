import axios from 'axios';

const access = localStorage.getItem('access')

export default axios.create({
    baseURL: "http://5.175.136.37/api/",
    headers: {
        "Content-Type" : "application/json",
        "Authorization" : `Bearer ${access}`
     }
})