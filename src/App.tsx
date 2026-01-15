import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Notfound from "./pages/Notfound";
import UserForm from "./pages/UserForm";
import RootLayout from "./layout/RootLayout";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="auth" element={<UserForm />} />
        </Route>

        <Route path="*" element={<Notfound />} />
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
