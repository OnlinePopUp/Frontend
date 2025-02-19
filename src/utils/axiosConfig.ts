import axios from "axios";

// Axios 기본 설정
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

console.log("Axios Global Base URL:", axios.defaults.baseURL);

export default axios;
