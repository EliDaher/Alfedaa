import React from "react";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import POSUsers from "./pages/POSUsers";

// Lazy Loading للصفحات
const Dashboard = React.lazy(() => import("@/pages/Dashboard"));
const NotFound = React.lazy(() => import("@/pages/NotFound"));
const Login = React.lazy(() => import("@/pages/Login"));
const UnauthorizedPage = React.lazy(() => import("@/pages/Unauthorized"));
const PendingTransactions = React.lazy(
  () => import("@/pages/PendingTransactions"),
);
const DoneTransactions = React.lazy(() => import("@/pages/DoneTransactions"));
const POSPayments = React.lazy(() => import("@/pages/POSPayments"));

export const routesConfig = [
  { path: "/login", element: <Login /> },
  { path: "/unauthorized", element: <UnauthorizedPage /> },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute allowedRoles={["admin", "dealer"]}>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/PendingTransactions",
    element: (
      <PrivateRoute allowedRoles={["admin", "employee"]}>
        <PendingTransactions />
      </PrivateRoute>
    ),
  },
  {
    path: "/DoneTransactions",
    element: (
      <PrivateRoute allowedRoles={["admin", "employee"]}>
        <DoneTransactions />
      </PrivateRoute>
    ),
  },
  {
    path: "/POSPayments",
    element: (
      <PrivateRoute allowedRoles={["admin"]}>
        <POSPayments />
      </PrivateRoute>
    ),
  },
  {
    path: "/POSUsers",
    element: (
      <PrivateRoute allowedRoles={["admin"]}>
        <POSUsers />
      </PrivateRoute>
    ),
  },
  { path: "*", element: <NotFound /> },
];
