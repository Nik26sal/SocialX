import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    post:localStorage.getItem('post') || null,
}

const postSlice =createSlice (
    {
        name:"post",
        initialState,
        reducers:{
           post:(state,action)=>{
            state.post = action.payload.post,
            localStorage.setItem('post',action.payload.post);
            },
            reducePost:(state)=>{
                state.post = null;
                localStorage.removeItem('post')
            }
        }
    }
)

export const {post,reducePost} = postSlice.actions
export default postSlice.reducer;
