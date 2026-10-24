import type { Product } from "../types/product";
import { API_URL } from "./apiConfig";

export async function getFavorites(accessToken: string): Promise<Product[]> {
  const response = await fetch(`${API_URL}/favorites`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "Favoriler Alinamadi ");
  }
  return data.favorites;
}

export async function addFavorite(accessToken: string, productId: number) {
  const response = await fetch(`${API_URL}/favorites/${productId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "Ürün favorilere eklenemedi ");
  }
  return data;
}

export async function removeFavorite(accessToken: string, productId: number) {
  const response = await fetch(`${API_URL}/favorites/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "Ürün favorilere eklenemedi ");
  }
  return data;
}
