// src/utils/global.ts
import axios from "axios";

// 환경 변수에서 API URL을 가져와 설정
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

console.log("🚀 Global Axios Base URL:", axios.defaults.baseURL);
