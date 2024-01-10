import axios from "axios";

const server = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    Authorization: "Bearer 659c407f9bcada20ef1304d5.TTuunUT3QRv8EhIb",
  },
});

export default server;
