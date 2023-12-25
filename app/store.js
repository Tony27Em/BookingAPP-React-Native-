import { configureStore } from "@reduxjs/toolkit";
import usersSlice from "../features/usersSlice";
import hotelsSlice from "../features/hotelsSlice";

export default configureStore({
  reducer: {
    users: usersSlice,
    hotels: hotelsSlice,
  }
})