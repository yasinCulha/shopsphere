import { API_URL } from "./apiConfig";

export async function getCart(accessToken: string) {
  const response = await fetch(`${API_URL}/cart`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "Sepet Alinamadi ");
  }
  return data;
}

export async function addProductToCart(accessToken: string, productId: number) {
  const response = await fetch(`${API_URL}/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ productId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "Ürün sepete eklenemedi ");
  }
  return data;
}

export async function removeProductFromCart(
  accessToken: string,
  productId: number,
) {
  const response = await fetch(`${API_URL}/cart/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "Ürün sepete eklenemedi ");
  }
  return data;
}

export async function updateCartQuantity(
  accessToken: string,
  productId: number,
  quantity: number,
) {
  const response = await fetch(`${API_URL}/cart/${productId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ quantity }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "Ürün miktarı güncellenemedi.");
  }

  return data;
}
