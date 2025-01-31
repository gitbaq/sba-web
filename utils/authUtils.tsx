import { jwtDecode } from "jwt-decode";

export function isTokenExpired(token: string): boolean {
  if (!token) return true;
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    const result =
      decodedToken && decodedToken.exp ? decodedToken?.exp < currentTime : true;
    return result;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
}
