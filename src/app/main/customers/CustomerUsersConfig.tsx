import { lazy } from "react";

const CustomerUsers = lazy(() => import("./CustomerUsers"));

/**
 * The Example page config.
 */
const CustomerUsersConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "customer",
      element: <CustomerUsers />,
    },
  ],
};

export default CustomerUsersConfig;
