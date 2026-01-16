import { supabase } from "./supabase";
import { setSession } from "../reduxStore/authSlice";
import type { AppDispatch } from "../reduxStore/store";

export const fetchUser = async (dispatch: AppDispatch) => {
  const { data } = await supabase.auth.getSession();
  dispatch(setSession(data.session));
};
