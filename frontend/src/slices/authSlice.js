import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload; // The function is saying: "When the setToken action is dispatched, update the token in the state to be whatever value was passed in the action's payload."
    },
  },
});

export const { setToken } = authSlice.actions;
export default authSlice.reducer;
