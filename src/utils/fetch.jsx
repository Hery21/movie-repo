import axios from "axios";
import config from "./config";

export async function getData(url, params) {
  const res = await axios.get(`${config.api_host_dev}${url}`, {
    params,
    headers: { "Content-Type": "application/json" },
  });

  return res.data;
}
