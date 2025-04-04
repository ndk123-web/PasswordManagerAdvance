import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";


import { SessionProvider } from "./contextprovider/sessionprovider.jsx"; // Import Provider

import Home from "./components/Home.jsx";
import About from "./components/Lists.jsx";
import Contact from "./components/Contact.jsx";
import Navbar from "./components/Navbar.jsx";
import Edit from "./components/edit.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <Home />
      </>
    ),
  },
  {
    path: "/about",
    element: (
      <>
        <Navbar />
        <About />
      </>
    ),
  },
  {
    path: "/contact",
    element: (
      <>
        <Navbar />
        <Contact />
      </>
    ),
  },
  {
    path : '/edit/:id',
    element : (
      <>
        <Navbar />
        <Edit />
      </>
    )
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SessionProvider> {/* Wrap everything inside this */}
      <RouterProvider router={router} />
      <App />
    </SessionProvider>
  </StrictMode>
);
