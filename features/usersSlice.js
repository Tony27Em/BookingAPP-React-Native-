import { createSlice } from "@reduxjs/toolkit";

export const usersSlice = createSlice({
  name: 'users',
  initialState: {
    value: [],
    currentUser: null,
  },
  reducers: {
    addUser: (state, action) => {
      state.value = [...state.value, action.payload];
    },

    setCurrentUser: (state, action) => {
      state.currentUser = action.payload
    },

    saveFavorite: (state, action) => {
      if(state.currentUser.favorites.some(item => item.id === action.payload.id)) {
        state.currentUser.favorites = state.currentUser.favorites.filter(item => item.id != action.payload.id)
      } else {
        state.currentUser.favorites = [...state.currentUser.favorites, {...action.payload, isFavorite: true}]
      }

      state.value = state.value.map(item => {
        if(item.id === state.currentUser.id) {
          return { ...state.currentUser };
        }
        return item;
      })
    },

    deleteFavorite: (state, action) => {
      state.currentUser.favorites = state.currentUser.favorites.filter(item => item.id != action.payload)
    },

    setChangeUserData: (state, action) => {
      const { id, name, password } = action.payload
      state.currentUser = {...state.currentUser, name, password}

      state.value = state.value.map(item => {
        if(item.id === id) {
          return { ...state.currentUser };
        }
        return item;
      })
    },
  }
})

export const { 
  addUser, 
  setChangeUserData, 
  setCurrentUser, 
  saveFavorite, 
  deleteFavorite, 
} = usersSlice.actions;

export default usersSlice.reducer;