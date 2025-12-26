import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./views/Home";
import About from "./views/About";
import Contact from "./views/Contact";
import Products from "./views/Products";
import ProductDetail from "./views/ProductDetail";
import FetchAPI_EmptyArray from "./views/FetchAPI_EmptyArray";
import NasaAPI from "./views/NasaAPI";
import Users from "./views/Users";
import UserDetail from "./views/UserDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: (
      <div className="min-h-screen flex justify-center items-center">
        <h1 className="text-4xl">404 - Page Not Found 😭</h1>
      </div>
    ),
    children: [
      { path: "/", element: <Home /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "products", element: <Products /> },
      { path: "products/:productId", element: <ProductDetail /> },
      { path: "FetchAPI_EmptyArray", element: <FetchAPI_EmptyArray /> },
      { path: "nasa", element: <NasaAPI /> },
      // Phase 2: Define Users routes with temporary placeholders
      { path: "users", element: <Users /> },
      { path: "users/:userId", element: <UserDetail /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
