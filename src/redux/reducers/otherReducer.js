


import { createReducer } from "@reduxjs/toolkit";


export const otherReducer = createReducer({},{

    contactRequest:(state)=>{
        state.loading = true
    },
    contactSuccess:(state,action)=>{
        state.loading = false
        state.message = action.payload
    },
    contactFail:(state,action)=>{
        state.loading = false
        state.error = action.payload
    },
    courseRequest:(state)=>{
        state.loading = true
    },
    clearError: state => {
        state.error = null;
      },
      clearMessage: state => {
        state.message = null;
      },
    courseSuccess:(state,action)=>{
        state.loading = false
        state.message = action.payload
    },
    courseFail:(state,action)=>{
        state.loading = false
        state.error = action.payload
    }
})