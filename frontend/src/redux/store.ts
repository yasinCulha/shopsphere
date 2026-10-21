import { configureStore } from "@reduxjs/toolkit";
import productsReducer, {
  savePersistedProductData,
} from "./slices/productSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    auth: authReducer,
  },
});

store.subscribe(() => {
  const { favorites } = store.getState().products;
  savePersistedProductData({ favorites });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
