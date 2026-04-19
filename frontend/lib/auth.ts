import { getCookie, setCookie, deleteCookie } from "cookies-next";

export const saveToken = (token: string) => {
  localStorage.setItem("token", token);
  setCookie("token", token, { maxAge: 60 * 60 * 24 * 7 }); // 7 dni
};

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const removeToken = () => {
  localStorage.removeItem("token");
  deleteCookie("token");
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const getTokenFromCookie = (): string | null => {
  return getCookie("token") as string | null;
};
