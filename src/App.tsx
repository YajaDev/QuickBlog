import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import type { AppDispatch } from "./reduxStore/store";
import { supabase } from "./services/supabaseService";
import { setSession } from "./reduxStore/authSlice";

import Home from "./pages/Home";
import Notfound from "./pages/Notfound";
import UserForm from "./pages/UserForm";
import BlogList from "./pages/BlogList";
import AddBlog from "./pages/AddBlog";
import RootLayout from "./layouts/RootLayout";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      dispatch(setSession(data.session));
    };
    fetchUser();

    // Listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        dispatch(setSession(session));
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [dispatch]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="auth" element={<UserForm />} />

          {/* Protected Route */}
          <Route path="dashboard" element={<DashboardLayout />}>
            <Route index element={<BlogList />} />
            <Route path="addblog" element={<AddBlog />} />
          </Route>
        </Route>

        <Route path="*" element={<Notfound />} />
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
