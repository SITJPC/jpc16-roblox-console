import axios from "axios";

const server = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
  },
});

export default server;
