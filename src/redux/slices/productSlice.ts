import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import { AxiosError } from "axios";
import type { BasketItem } from "../../types/product";
import type { Product, ProductsResponse } from "../../types/product";

const PRODUCT_STORAGE_KEY = "shopsphere:product-data";

type PersistedProductData = Pick<ProductState, "favorites" | "basket">;

function isProduct(value: unknown): value is Product {
  if (typeof value !== "object" || value === null) return false;

  const product = value as Record<string, unknown>;
  return (
    typeof product.id === "number" &&
    typeof product.title === "string" &&
    typeof product.description === "string" &&
    typeof product.category === "string" &&
    typeof product.price === "number" &&
    typeof product.discountPercentage === "number" &&
    typeof product.rating === "number" &&
    typeof product.stock === "number" &&
    typeof product.thumbnail === "string" &&
    Array.isArray(product.images) &&
    Array.isArray(product.reviews)
  );
}

function isBasketItem(value: unknown): value is BasketItem {
  if (typeof value !== "object" || value === null) return false;

  const item = value as Record<string, unknown>;
  return (
    isProduct(item.product) &&
    typeof item.quantity === "number" &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  );
}

export function loadPersistedProductData(): PersistedProductData {
  if (typeof localStorage === "undefined") {
    return { favorites: [], basket: [] };
  }

  try {
    const serializedData = localStorage.getItem(PRODUCT_STORAGE_KEY);
    if (!serializedData) return { favorites: [], basket: [] };

    const data: unknown = JSON.parse(serializedData);
    if (typeof data !== "object" || data === null) {
      throw new Error("Saved product data has an invalid format.");
    }

    const persisted = data as Record<string, unknown>;
    const favorites = Array.isArray(persisted.favorites)
      ? persisted.favorites.filter(isProduct)
      : [];
    const basket = Array.isArray(persisted.basket)
      ? persisted.basket.filter(isBasketItem)
      : [];

    if (
      !Array.isArray(persisted.favorites) ||
      !Array.isArray(persisted.basket) ||
      favorites.length !== persisted.favorites.length ||
      basket.length !== persisted.basket.length
    ) {
      console.error("Some saved favorites or basket items were invalid.");
    }

    return { favorites, basket };
  } catch (error) {
    console.error("Could not load favorites and basket from local storage.", error);
    return { favorites: [], basket: [] };
  }
}

export function savePersistedProductData(data: PersistedProductData): void {
  if (typeof localStorage === "undefined") return;

  try {
    localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Could not save favorites and basket to local storage.", error);
  }
}

export interface ProductState {
  products: Product[];
  searchResults: Product[];
  searchLoading: boolean;
  searchError: string | null;
  searchRequestId: string | null;
  favorites: Product[];
  basket: BasketItem[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  searchResults: [],
  searchLoading: false,
  searchError: null,
  searchRequestId: null,
  ...loadPersistedProductData(),
  selectedProduct: null,
  loading: false,
  error: null,
};

const API_URL = import.meta.env.VITE_BASE_URL;

export const getProducts = createAsyncThunk<ProductsResponse>(
  "products/getAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<ProductsResponse>(`${API_URL}/products`);
      return response.data; // ProductsResponse nesnesinin tamamı
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Ürünler getirilemedi.",
      );
    }
  },
);

export const getProductByID = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>("products/getAllProductById", async (id, { rejectWithValue, signal }) => {
  try {
    const response = await axios.get<Product>(`${API_URL}/products/${id}`, {
      signal,
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      err.response?.data?.message || "Ürünler bulunamadı.",
    );
  }
});

export const searchProducts = createAsyncThunk<
  ProductsResponse,
  string,
  { rejectValue: string }
>("products/searchProducts", async (query, { rejectWithValue, signal }) => {
  try {
    const response = await axios.get<ProductsResponse>(
      `${API_URL}/products/search`,
      { params: { q: query }, signal },
    );
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      err.response?.data?.message || "Ürün araması yapılamadı.",
    );
  }
});

export const getProductsByCategories = createAsyncThunk<
  ProductsResponse,
  string[],
  { rejectValue: string }
>(
  "products/getProductsByCategories",
  async (categories, { rejectWithValue }) => {
    try {
      const responses = await Promise.all(
        categories.map((category) =>
          axios.get<ProductsResponse>(
            `${API_URL}/products/category/${category}`,
          ),
        ),
      );

      return {
        products: responses.flatMap((response) => response.data.products),
        total: responses.reduce(
          (sum, response) => sum + response.data.products.length,
          0,
        ),
        skip: 0,
        limit: 0,
      };
    } catch {
      return rejectWithValue("Ürünler getirilemedi.");
    }
  },
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },

    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchLoading = false;
      state.searchError = null;
      state.searchRequestId = null;
    },

    toggleFavorite: (state, action: PayloadAction<Product>) => {
      const product = action.payload;

      const isFavorite = state.favorites.some((item) => item.id === product.id);

      if (isFavorite) {
        state.favorites = state.favorites.filter(
          (item) => item.id !== product.id,
        );
      } else {
        state.favorites.push(product);
      }
    },

    clearFavorites: (state) => {
      state.favorites = [];
    },

    addToBasket: (state, action: PayloadAction<Product>) => {
      const product = action.payload;

      const existingItem = state.basket.find(
        (item) => item.product.id === product.id,
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.basket.push({
          product,
          quantity: 1,
        });
      }
    },

    increaseProductQuantity: (state, action: PayloadAction<number>) => {
      const existingItem = state.basket.find(
        (item) => item.product.id === action.payload,
      );

      if (existingItem) {
        existingItem.quantity += 1;
      }
    },

    deleteProductsByBasket: (state, action: PayloadAction<number>) => {
      state.basket = state.basket.filter(
        (item) => item.product.id !== action.payload,
      );
    },

    decreaseProductQuantity: (state, action: PayloadAction<number>) => {
      const existingItem = state.basket.find(
        (item) => item.product.id === action.payload,
      );

      if (existingItem) {
        existingItem.quantity -= 1;

        if (existingItem.quantity <= 0) {
          state.basket = state.basket.filter(
            (item) => item.product.id !== action.payload,
          );
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(searchProducts.pending, (state, action) => {
      state.searchLoading = true;
      state.searchError = null;
      state.searchRequestId = action.meta.requestId;
    });

    builder.addCase(searchProducts.fulfilled, (state, action) => {
      if (state.searchRequestId !== action.meta.requestId) return;
      state.searchResults = action.payload.products;
      state.searchLoading = false;
      state.searchRequestId = null;
    });

    builder.addCase(searchProducts.rejected, (state, action) => {
      if (state.searchRequestId !== action.meta.requestId) return;
      state.searchLoading = false;
      state.searchRequestId = null;
      if (!action.meta.aborted) {
        state.searchError =
          action.payload || action.error.message || "Ürün araması yapılamadı.";
      }
    });

    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      getProducts.fulfilled,
      (state, action: PayloadAction<ProductsResponse>) => {
        state.loading = false;
        state.products = action.payload.products;
      },
    );

    builder.addCase(getProducts.rejected, (state, action) => {
      state.loading = false;
      state.error =
        (action.payload as string) ||
        action.error.message ||
        "Beklenmeyen Bir Hata Olustu";
    });

    // getProductById
    builder.addCase(getProductByID.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      getProductByID.fulfilled,
      (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      },
    );

    builder.addCase(getProductByID.rejected, (state, action) => {
      state.loading = false;
      if (!action.meta.aborted) {
        state.error =
          action.payload ||
          action.error.message ||
          "Beklenmeyen Bir Hata Olustu";
      }
    });

    // getProductsByCategory
    builder.addCase(getProductsByCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getProductsByCategories.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload.products;
    });

    builder.addCase(getProductsByCategories.rejected, (state, action) => {
      state.loading = false;
      state.error =
        (action.payload as string) ||
        action.error.message ||
        "Beklenmeyen Bir Hata Olustu";
    });
  },
});

export const {
  clearSelectedProduct,
  clearSearchResults,
  toggleFavorite,
  clearFavorites,
  addToBasket,
  increaseProductQuantity,
  decreaseProductQuantity,
  deleteProductsByBasket,
} = productSlice.actions;
export default productSlice.reducer;
