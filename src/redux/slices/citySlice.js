// features/city/citySlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../utils/constant";

// Async Thunks
export const fetchCities = createAsyncThunk(
  "cities/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.get(`${API_URL}/city/get-cities`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      return response.data.data.cities;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addCity = createAsyncThunk(
  "cities/add",
  async (cityData, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.token) {
        return rejectWithValue("No authentication token found. Please login again.");
      }

      const response = await axios.post(
        `${API_URL}/city/add-city`,
        cityData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateCity = createAsyncThunk(
  "cities/update",
  async (cityData, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const response = await axios.put(
        `${API_URL}/city/update-city`,
        cityData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteCity = createAsyncThunk(
  "cities/delete",
  async (cityId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/city/delete-city`, {
        data: { _id: cityId },
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}`,
        }
      });
      return cityId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  data: [],
  filteredData: [],
  filters: {
    searchTerm: "",
    state: "",
  },
  pagination: {
    currentPage: 1,
    rowsPerPage: 10,
    totalPages: 1,
  },
  status: "idle",
  error: null,
};

const citySlice = createSlice({
  name: "cities",
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.filters.searchTerm = action.payload;
      state.pagination.currentPage = 1;
    },
    setStateFilter: (state, action) => {
      state.filters.state = action.payload;
      state.pagination.currentPage = 1;
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    filterCities: (state) => {
      const { searchTerm, state: stateFilter } = state.filters;

      state.filteredData = state.data.filter((city) => {
        const matchesSearch =
          (city.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
          (city.state?.toLowerCase() || "").includes(searchTerm.toLowerCase());
        const matchesState = stateFilter ? city.state === stateFilter : true;

        return matchesSearch && matchesState;
      });

      state.pagination.totalPages = Math.ceil(
        state.filteredData.length / state.pagination.rowsPerPage
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
        state.filteredData = action.payload;
        state.pagination.totalPages = Math.ceil(
          action.payload.length / state.pagination.rowsPerPage
        );
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addCity.fulfilled, (state, action) => {
        state.data.unshift(action.payload);
      })
      .addCase(updateCity.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCity.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.data.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(deleteCity.fulfilled, (state, action) => {
        state.data = state.data.filter((city) => city._id !== action.payload);
      });
  },
});

export const {
  setSearchTerm,
  setStateFilter,
  setPage,
  filterCities,
} = citySlice.actions;

export default citySlice.reducer;
