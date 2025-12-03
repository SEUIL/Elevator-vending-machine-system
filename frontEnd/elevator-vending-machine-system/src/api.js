import axios from 'axios';

// 백엔드 서버 주소 설정 (스프링부트 포트 8080)
const backend = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default backend;