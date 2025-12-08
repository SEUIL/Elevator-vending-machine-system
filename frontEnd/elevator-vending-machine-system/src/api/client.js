import axios from 'axios';

const client = axios.create({
    baseURL: 'http://localhost:8080/api', // 스프링부트 주소 + 공통 경로
    headers: {
        'Content-Type': 'application/json',
    },
});

export default client;