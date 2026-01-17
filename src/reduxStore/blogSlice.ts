import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Blog } from "../services/blogServices";

type Page = { page: number; blogs: Blog[] };

interface BlogState {
  pages: Page[];
  totalPage: number;
  blogToEdit: Blog | null;
}

const initialState: BlogState = {
  pages: [],
  totalPage: 1,
  blogToEdit: null,
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setPages(state, action: PayloadAction<Page>) {
      state.pages.push(action.payload);
    },
    setTotalPage(state, action: PayloadAction<number>) {
      state.totalPage = action.payload;
    },
    setBlogToEdit(state, action: PayloadAction<Blog>) {
      state.blogToEdit = action.payload;
    },
    clearBlogToEdit(state) {
      state.blogToEdit = null;
    },
  },
});

export const { setPages, setBlogToEdit, clearBlogToEdit, setTotalPage } =
  blogSlice.actions;
export default blogSlice.reducer;
