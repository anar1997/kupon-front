import axios from 'axios';

const access = localStorage.getItem('access')

export default axios.create({
    baseURL: "http://54.166.11.118/api/",
    headers: {
        "Content-Type" : "application/json",
        "Authorization" : `Bearer ${access}`
     }
})