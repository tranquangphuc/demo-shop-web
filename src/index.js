import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Root from "./Root";

import "bootstrap/dist/css/bootstrap.min.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CustomerDetailsPage from "./customer/CustomerDetailsPage";
import CustomerMasterPage from "./customer/CustomerMasterPage";
import ErrorPage from "./error-page";
import ProductDetailsPage from "./product/ProductDetailsPage";
import ProductMasterPage from "./product/ProductMasterPage";
import ShopDetailsPage from "./shop/ShopDetailsPage";
import ShopMasterPage from "./shop/ShopMasterPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            path: "customers",
            element: <CustomerMasterPage />,
            loader: () => fetch(`/api/customers`),
          },
          { path: "customers/new", element: <CustomerDetailsPage /> },
          {
            path: "customers/:customerId",
            element: <CustomerDetailsPage />,
            loader: ({ params }) =>
              fetch(`/api/customers/${params.customerId}`),
          },
          {
            path: "shops",
            element: <ShopMasterPage />,
            loader: () => fetch(`/api/shops`),
          },
          { path: "shops/new", element: <ShopDetailsPage /> },
          {
            path: "shops/:shopId",
            element: <ShopDetailsPage />,
            loader: async ({ params }) => fetch(`/api/shops/${params.shopId}`),
          },
          {
            path: "products",
            element: <ProductMasterPage />,
            loader: () => fetch(`/api/products`),
          },
          { path: "products/new", element: <ProductDetailsPage /> },
          {
            path: "products/:productId",
            element: <ProductDetailsPage />,
            loader: ({ params }) => fetch(`/api/products/${params.productId}`),
          },
        ],
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
