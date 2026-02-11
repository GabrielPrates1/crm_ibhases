import Axios from "axios";

const API = Axios.create({
	baseURL: process.env.REACT_APP_BASE_URL,
	timeout: 2000 * 60,
});

export default API;
