import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL.js";

//initial state
const initialState = {
  loading: false,
  error: null,
  users: [],
  user: {},
  profile: {},
  userAuth: {
    loading: false,
    error: null,
    userInfo: {},
  },
};

//create action creator - createAsyncThunk

//register
export const registerUserAction = createAsyncThunk(
  "user/register",
  async (
    { fullname, email, password }, // payload we are passing next to baseURL
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      //header
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.post(
        `${baseURL}/users/register`,
        {
          fullname, //payload which we have destructured above
          email,
          password,
        },
        config
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//users slice
const usersSlice = createSlice({
  name: "users",
  initialState,
  extraReducers: (builder) => {
    //Register
    //pending
    builder.addCase(registerUserAction.pending, (state, action) => {
      state.loading = true;
    });
    
    //fullfilled
    builder.addCase(registerUserAction.fulfilled, (state, action) => {
      (state.loading = false), (state.userAuth.userInfo = action.payload);
    });
    //rejected
    builder.addCase(registerUserAction.rejected, (state, action) => {
      state.loading = false;
      state.userAuth.error = action.payload;
    });
  },
});

//generate  reducer
const usersReducer = usersSlice.reducer;
export default usersReducer;
