import axios from "axios";
const baseUrl = "http://localhost:3500/";

export default axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
