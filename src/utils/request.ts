import axios from "axios";
import {BASE_URL} from "../confit";

axios.defaults.baseURL = BASE_URL;
// axios.defaults.headers["Content-Type"] = "application/json";

export const request = axios;
