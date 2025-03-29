import { createSlice } from "@reduxjs/toolkit";

const storedComment = localStorage.getItem('comment');
const initialState = {
    comment: storedComment && storedComment !== "undefined" ? JSON.parse(storedComment) : [],
};

const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {
        addComment: (state, action) => {
            const updatedComments = [...state.comment, action.payload.comment];
            state.comment = updatedComments;
            localStorage.setItem('comment', JSON.stringify(updatedComments)); 
        },
        removeComment: (state) => {
            state.comment = [];
            localStorage.removeItem('comment'); 
        }
    }
});

export const { addComment, removeComment } = commentSlice.actions;
export default commentSlice.reducer;
