// features/hotel/hotelSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../utils/constant";

// Async Thunks
export const fetchHotels = createAsyncThunk(
  "hotels/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/hotel/get-hotels`);
      return response.data.data.hotels;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addHotel = createAsyncThunk(
  "hotels/add",
  async (hotelData, { rejectWithValue }) => {
    try {
      console.log("Adding hotel data:", hotelData);

      const response = await axios.post(
        `${API_URL}/hotel/add-hotel`,
        hotelData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateHotel = createAsyncThunk(
  "hotels/update",
  async (hotelData, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user")); // or get from Redux/Context if needed

      const response = await axios.put(
        `${API_URL}/hotel/update-hotel`,
        hotelData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
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

export const deleteHotel = createAsyncThunk(
  "hotels/delete",
  async (hotelId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/hotel/delete-hotel`, {
        data: { _id: hotelId },
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}`,
        }
      });
      return hotelId;
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
    city: "",
  },
  pagination: {
    currentPage: 1,
    rowsPerPage: 5,
    totalPages: 1,
  },
  status: "idle",
  error: null,
};

const hotelSlice = createSlice({
  name: "hotels",
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.filters.searchTerm = action.payload;
      state.pagination.currentPage = 1;
    },
    setStateFilter: (state, action) => {
      state.filters.state = action.payload;
      state.filters.city = "";
      state.pagination.currentPage = 1;
    },
    setCityFilter: (state, action) => {
      state.filters.city = action.payload;
      state.pagination.currentPage = 1;
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    filterHotels: (state) => {
      const { searchTerm, state: stateFilter, city } = state.filters;

      state.filteredData = state.data.filter((hotel) => {
        const matchesSearch =
          hotel.hotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hotel.city.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesState = stateFilter ? hotel.state === stateFilter : true;
        const matchesCity = city ? hotel.city === city : true;

        return matchesSearch && matchesState && matchesCity;
      });

      state.pagination.totalPages = Math.ceil(
        state.filteredData.length / state.pagination.rowsPerPage
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotels.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
        state.filteredData = action.payload;
        state.pagination.totalPages = Math.ceil(
          action.payload.length / state.pagination.rowsPerPage
        );
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addHotel.fulfilled, (state, action) => {
        state.data.unshift(action.payload);
      })
      .addCase(updateHotel.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateHotel.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.data.findIndex((h) => h._id === action.payload._id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(deleteHotel.fulfilled, (state, action) => {
        state.data = state.data.filter((hotel) => hotel._id !== action.payload);
      });
  },
});

export const {
  setSearchTerm,
  setStateFilter,
  setCityFilter,
  setPage,
  filterHotels,
} = hotelSlice.actions;

export default hotelSlice.reducer;
