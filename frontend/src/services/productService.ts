import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "./apiConfig";

export const getAllCategories = createAsyncThunk<string[]>(
  "categories/getAllCategories",
  async () => {
    const response = await axios.get<string[]>(
      `${API_URL}/products/category-list`,
    );
    return response.data;
  },
);
