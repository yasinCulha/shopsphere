import type { Product } from "../types/product";

const API_URL = import.meta.env.VITE_BASE_URL;
const TOKEN_KEY = "shopsphereAdminAccessToken";

export function getAdminToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function saveAdminToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

async function adminRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const currentToken = getAdminToken();
  if (!currentToken) throw new Error("Admin girişi gerekli.");
  let token: string = currentToken;

  const sendRequest = (accessToken: string) => fetch(`${API_URL}/admin${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      Authorization: `Bearer ${accessToken}`,
      ...options.headers,
    },
  });

  let response = await sendRequest(token);
  if (response.status === 401) {
    const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (refreshResponse.ok) {
      const refreshed = await refreshResponse.json();
      token = refreshed.accessToken;
      saveAdminToken(token);
      response = await sendRequest(token);
    }
  }

  const data = await response.json();
  if (!response.ok) throw new Error(data.message ?? "Admin isteği başarısız oldu.");
  return data as T;
}

export type AdminStats = { products: number; customers: number; orders: number; sales: number };
export type AdminProductForm = Omit<Product, "id" | "rating" | "reviews">;
export type AdminUser = { id: number; firstName: string; lastName: string; email: string; createdAt: string };
export type AdminOrder = { id: number; status: string; total: number; createdAt: string; email: string; items: { title: string; quantity: number }[] };

export const getDashboardStats = () => adminRequest<AdminStats>("/dashboard");
export const getAdminProducts = () => adminRequest<{ products: Product[] }>("/products");
export const createAdminProduct = (product: AdminProductForm) => adminRequest<{ message: string; product: Product }>("/products", { method: "POST", body: JSON.stringify(product) });
export const updateAdminProduct = (id: number, product: AdminProductForm) => adminRequest<{ message: string; product: Product }>(`/products/${id}`, { method: "PUT", body: JSON.stringify(product) });
export const deleteAdminProduct = (id: number) => adminRequest<{ message: string }>(`/products/${id}`, { method: "DELETE" });
export const getAdminUsers = () => adminRequest<{ users: AdminUser[] }>("/users");
export const getAdminOrders = () => adminRequest<{ orders: AdminOrder[] }>("/orders");
