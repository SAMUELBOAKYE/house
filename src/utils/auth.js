// src/utils/auth.js
import jwt_decode from "jwt-decode";

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = jwt_decode(token);
    return decoded.exp < Date.now() / 1000;
  } catch {
    return true;
  }
};
