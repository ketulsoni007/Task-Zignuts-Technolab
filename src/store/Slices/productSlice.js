import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'; // Assuming axios is imported correctly
import config from "../../config";

export const productListApi = createAsyncThunk('product/list', async ({ skip, limit, category, q }, thunkAPI) => {
  try {
    const params = {
      skip,
      limit,
      q,
    };
    const queryParams = new URLSearchParams(params).toString();
    const url = q
      ? `${config.API_URL}/search/?${queryParams}`
      : category ? `${config.API_URL}/category/${category}` : `${config.API_URL}/?${queryParams}`;

    // Make the request to the API
    const response = await axios.get(url);
    if (response && response.status === 200) {
      return response.data;
    } else {
      const errorMessage = (response && response.data && response.data.message) || 'Error occurred';
      throw new Error(errorMessage);
    }
  } catch (error) {
    const errorMessage =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    const status = error?.response?.status ?? 410;
    const errors = error?.response?.data?.errors ?? '';
    return thunkAPI.rejectWithValue({ status: status, message: errorMessage, errors: errors });
  }
});

export const productCategoryApi = createAsyncThunk('product/category-list', async (category, thunkAPI) => {
  try {
    const response = await axios.get(`${config?.API_URL}/category-list`);
    if (response && response.status === 200) {
      return response.data;
    } else {
      const errorMessage = (response && response.data && response.data.message) || 'Error occurred';
      throw new Error(errorMessage);
    }
  } catch (error) {
    const errorMessage =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    const status = error?.response?.status ?? 410;
    const errors = error?.response?.data?.errors ?? '';
    return thunkAPI.rejectWithValue({ status: status, message: errorMessage, errors: errors });
  }
});

export const productDetailApi = createAsyncThunk('product/detail', async ({ id }, thunkAPI) => {
  try {
    const response = await axios.get(`${config?.API_URL}/${id}`);
    if (response && response.status === 200) {
      return response.data;
    } else {
      const errorMessage = (response && response.data && response.data.message) || 'Error occurred';
      throw new Error(errorMessage);
    }
  } catch (error) {
    const errorMessage =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    const status = error?.response?.status ?? 410;
    const errors = error?.response?.data?.errors ?? '';
    return thunkAPI.rejectWithValue({ status: status, message: errorMessage, errors: errors });
  }
});

const initialState = {
  productList: [],
  productCategories: [],
  productDetail: {},
  isApiStatus: {
    productListApi: "",
    productCategoryApi: "",
    productDetailApi: "",
  },
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(productDetailApi.pending, (state) => {
        state.isApiStatus.productDetailApi = "loading";
      })
      .addCase(productDetailApi.fulfilled, (state, action) => {
        state.productDetail = action.payload;
        state.isApiStatus.productDetailApi = "succeeded";
      })
      .addCase(productDetailApi.rejected, (state) => {
        state.productDetail = {};
        state.isApiStatus.productDetailApi = "failed";
      })
      .addCase(productCategoryApi.pending, (state) => {
        state.isApiStatus.productCategoryApi = "loading";
      })
      .addCase(productCategoryApi.fulfilled, (state, action) => {
        state.productCategories = action.payload;
        state.isApiStatus.productCategoryApi = "succeeded";
      })
      .addCase(productCategoryApi.rejected, (state) => {
        state.productCategories = [];
        state.isApiStatus.productCategoryApi = "failed";
      })
      .addCase(productListApi.pending, (state) => {
        state.isApiStatus.productListApi = "loading";
      })
      .addCase(productListApi.fulfilled, (state, action) => {
        state.productList = action.payload;
        state.isApiStatus.productListApi = "succeeded";
      })
      .addCase(productListApi.rejected, (state) => {
        state.productList = [];
        state.isApiStatus.productListApi = "failed";
      });
  },
});

export const { reset } = productSlice.actions;
export default productSlice.reducer;
