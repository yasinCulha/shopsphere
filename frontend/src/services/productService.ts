import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_BASE_URL;

export const getAllCategories = createAsyncThunk<string[]>(
  "categories/getAllCategories",
  async () => {
    const response = await axios.get<string[]>(
      `${API_URL}/products/category-list`,
    );
    return response.data;
  },
);
