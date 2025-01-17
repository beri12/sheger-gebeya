import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";
import { updateUserDetails } from "../../../server/conrollers/user.conroller";

const initialValue = {
  
     _id : "",
     name : "",
     email : "",
     avatar : "",
     mobile : "",
     verify_email : "",
     last_login_date : "",
     status : "",
     address_details: [],
     shopping_cart : [],
     orderHistory : [],
     role : "",
    





}

const userSlice  = createSlice({
    name : 'user',
    initialValue,
    reducers : {
        setUserDetails : (state, action) => {
          state._id = action.payload._id
          state.name = action.payload.name
          state.eamil = action.payload.email
          state.avatar = action.payload.avatar
          state.mobile = action.payload.mobile
          state.verify_email = action.payload.verify_email
          state.last_login_date = action.payload.last_login_date
          state.status = action.payload.status
          state.address_details = action.payload.address_details
          state.shopping_cart = action.payload.shopping_cart
          state.orderHistory = action.payload.orderHistory
          state.role = action.payload.role

        },
        updateAvatar : (state, action)=>{
            state.avatar = action.payload.avatar

        },
      
        logout : (state,action) =>{
            state._id = ""
            state.name = ""
            state.eamil = ""
            state.avatar = ""
            state.mobile = ""
            state.verify_email = ""
            state.last_login_date = ""
            state.status =""
            state.address_details = []
            state.shopping_cart = []
            state.orderHistory = []
            state.role = ""
        }
    }
})

export const  { setUserDetails,logout,   updateAvatar} = userSlice.actions

export default userSlice.reducer