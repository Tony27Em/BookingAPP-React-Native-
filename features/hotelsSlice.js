import { createSlice } from "@reduxjs/toolkit";
import { hotels } from "../assets/hotels";

export const hotelsSlice = createSlice({
  name: 'hotels',
  initialState: {    
    value: hotels,
  },
  reducers: { 
    searchFiltered: (state, action) => {
      const { address, price, rate } = action.payload;

      state.value = state.value.map(item => {        
        if(
          (!address || item.address.toLowerCase().includes(address.toLowerCase())) &&
          (!price || item.price >= Number(price)) &&
          (!rate || item.rate >= Number(rate))
        ) {
          return item;       
        }
        return { ...item, wasFiltered: true };
      })
    },

    resetFiltered: (state) => {
      state.value = state.value.map(item => {
        return { ...item, wasFiltered: false };
      })
    },

    markFavorite: (state, action) => {
      state.value = state.value.map(item => {
        if(item.id === action.payload) {
          return { ...item, isFavorite: !item.isFavorite };
        }
        return item;
      })
    }, 

    resetFavorite: (state) => {
      state.value = state.value.map(item => {
        return { ...item, isFavorite: false };
      })
    },

    addReview: (state, action) => {
      const { id, review, username } = action.payload;
      const newReview = {
        username, 
        review,
        date: new Date().toLocaleDateString(),
      }

      if(review) {        
        state.value = state.value.map(item => {
          if(item.id === id) {
            return { ...item, reviews: [...item.reviews, newReview] };
          }
          return item;
        })
      }
    },

    setUsersFavorite: (state, action) => {
      const favorites = action.payload.favorites;

      if(favorites) {
        state.value = state.value.map(item => {
          if(favorites.some(fav => fav.id === item.id)) {
              return { ...item, isFavorite: true };
            } 
            return item;
        })
      }
    },
  }
})

export const { 
  searchFiltered, 
  resetFiltered, 
  markFavorite, 
  resetFavorite, 
  addReview, 
  setUsersFavorite,
} = hotelsSlice.actions;

export default hotelsSlice.reducer;