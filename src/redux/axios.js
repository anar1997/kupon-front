import axios from 'axios';

const access = localStorage.getItem('access')

export default axios.create({
    baseURL: "http://54.163.55.132/api/",
    headers: {
        "Content-Type" : "application/json",
        "Authorization" : `Bearer ${access}`
     }
})