import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../utils/constant";

// Fetch States
export const fetchStates = createAsyncThunk(
  "cities/fetchStates",
  async (_, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await axios.get(`${API_URL}/state/get-state`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch Cities
export const fetchCities = createAsyncThunk(
  "cities/fetchCities",
  async (_, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await axios.get(`${API_URL}/city/get-city`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const addCity = createAsyncThunk(
  "cities/add",
  async (data, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await axios.post(`${API_URL}/city/add-city`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateCity = createAsyncThunk(
  "cities/update",
  async (data, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await axios.put(`${API_URL}/city/update-city`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteCity = createAsyncThunk(
  "cities/delete",
  async (id, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await axios.delete(`${API_URL}/city/delete-city`, {
        data: { _id: id },
        headers: { Authorization: `Bearer ${user.token}` },
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const citySlice = createSlice({
  name: "cities",   // MUST MATCH STORE
  initialState: {
    data: [],
    filteredData: [],
    states: [],
    filters: { searchTerm: "", state: "" },
    pagination: { currentPage: 1, rowsPerPage: 10 },
    status: "idle",
  },

  reducers: {
    setSearchTerm: (state, action) => {
      state.filters.searchTerm = action.payload;
    },

    setStateFilter: (state, action) => {
      state.filters.state = action.payload;
      state.pagination.currentPage = 1;
    },

    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },

    filterCities: (state) => {
      let filtered = state.data;

      // Search
      if (state.filters.searchTerm) {
        filtered = filtered.filter((city) =>
          city.name.toLowerCase().includes(state.filters.searchTerm.toLowerCase())
        );
      }

      // State filter
      if (state.filters.state) {
        const stateObj = state.states.find((s) => s.name === state.filters.state);
        if (stateObj) {
          filtered = filtered.filter((city) => city.state === stateObj._id);
        }
      }

      state.filteredData = filtered;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.states = action.payload;
      })
      .addCase(fetchCities.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.status = "idle";
        state.data = action.payload;
        state.filteredData = action.payload;
        state.pagination.currentPage = 1;
      })
      .addCase(fetchCities.rejected, (state) => {
        state.status = "idle";
      })
      .addCase(addCity.fulfilled, (state, action) => {
        state.data.unshift(action.payload);
        state.filteredData.unshift(action.payload);
      })
      .addCase(updateCity.fulfilled, (state, action) => {
        const idx = state.data.findIndex((c) => c._id === action.payload._id);
        if (idx !== -1) {
          state.data[idx] = action.payload;
        }
      })
      .addCase(deleteCity.fulfilled, (state, action) => {
        state.data = state.data.filter((c) => c._id !== action.payload);
        state.filteredData = state.filteredData.filter((c) => c._id !== action.payload);
      });
  },
});

export const { setSearchTerm, setStateFilter, setPage, filterCities } = citySlice.actions;
export default citySlice.reducer;
