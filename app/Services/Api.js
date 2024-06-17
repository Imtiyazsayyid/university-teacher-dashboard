import axios from "axios";
import { TokenService } from "./StorageService";

export default function Api() {
  const instance = axios.create({
    baseURL: process.env.BASE_URL,
    // baseURL: "http://localhost:8003/api/admin",
  });

  const ACCESS_TOKEN = TokenService.getAccessToken();

  if (ACCESS_TOKEN) {
    instance.defaults.headers.common["Authorization"] = `${ACCESS_TOKEN}`;
  }

  instance.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
  instance.interceptors.request.use((req) => {
    return req;
  });

  instance.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (!error["response"]) {
        showErrorMessage(
          "Your authorization token is invalid or expired ",
          error
        );
        // if (window.location.pathname !== '/login') window.location.replace("/login")
        return Promise.reject(error);
      } else if (error.response.status == 403) {
        TokenService.removeAccessToken();
        if (window.location.pathname !== "/auth/login")
          window.location.replace("/auth/login");
      } else if (error.response.status == 401) {
        TokenService.removeAccessToken();
        if (window.location.pathname !== "/auth/login")
          window.location.replace("/auth/login");
      }
      return Promise.reject(error.response);
    }
  );

  const showErrorMessage = (message) => {
    console.log("Api Error ", message);
  };

  return instance;
}
