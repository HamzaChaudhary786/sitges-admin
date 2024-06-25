import { lazy } from "react";

const Admins = lazy(() => import("./AdminUsers"));

/**
 * The Example page config.
 */
const AdminUsersConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "admins",
      element: <Admins />,
    },
  ],
};

export default AdminUsersConfig;
