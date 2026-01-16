import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import Home from "./pages/Home";
import Notfound from "./pages/Notfound";
import UserForm from "./pages/UserForm";
import BlogList from "./pages/BlogList";
import AddBlog from "./pages/AddBlog";
import RootLayout from "./layouts/RootLayout";
import RootDashboard from "./layouts/DashboardLayout";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="auth" element={<UserForm />} />
          <Route path="dashboard" element={<RootDashboard />}>
            <Route index element={<BlogList />} />
            <Route path="addBlog" element={<AddBlog />} />
          </Route>
        </Route>

        <Route path="*" element={<Notfound />} />
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
