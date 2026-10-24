import type { User } from "../data/testUser";
import { API_URL } from "./apiConfig";

export type AccountUser = Omit<User, "password"> & { createdAt?: string };

export type Address = {
  id: number;
  title: string;
  recipientName: string;
  phone: string;
  city: string;
  district: string;
  postalCode: string;
  addressLine: string;
  isDefault: boolean;
};

export type AddressForm = Omit<Address, "id">;

export type Order = {
  id: number;
  status: string;
  total: number;
  createdAt: string;
  items: { productId: number | null; title: string; price: number; quantity: number }[];
};

async function accountRequest<T>(accessToken: string, path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}/account${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      Authorization: `Bearer ${accessToken}`,
      ...options.headers,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message ?? "İşlem yapılamadı.");
  return data as T;
}

export const getAccountProfile = (token: string) =>
  accountRequest<{ user: AccountUser }>(token, "/profile");

export const updateAccountProfile = (token: string, profile: Pick<AccountUser, "firstName" | "lastName">) =>
  accountRequest<{ message: string; user: AccountUser }>(token, "/profile", {
    method: "PATCH",
    body: JSON.stringify(profile),
  });

export const getAddresses = (token: string) =>
  accountRequest<{ addresses: Address[] }>(token, "/addresses");

export const saveAddress = (token: string, address: AddressForm, id?: number) =>
  accountRequest<{ message: string; address: Address }>(token, id ? `/addresses/${id}` : "/addresses", {
    method: id ? "PUT" : "POST",
    body: JSON.stringify(address),
  });

export const deleteAddress = (token: string, id: number) =>
  accountRequest<{ message: string }>(token, `/addresses/${id}`, { method: "DELETE" });

export const getOrders = (token: string) =>
  accountRequest<{ orders: Order[] }>(token, "/orders");
