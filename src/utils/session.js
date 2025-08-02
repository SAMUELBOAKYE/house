import { apiClient } from "../utils/apiClient";

export const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  // Clear axios default headers if they exist
  if (apiClient.defaults?.headers?.common?.Authorization) {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

export const saveSession = (token, refreshToken, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("user", JSON.stringify(user));

  // Set axios default headers
  apiClient.defaults.headers.common["Authorization"] = \Bearer \\;
};
