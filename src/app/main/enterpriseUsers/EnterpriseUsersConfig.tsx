import { lazy } from "react";
import CustomerUsers from "../customers/CustomerUsers";

/**
 * The Example page config.
 */
const EnterpriseUsersConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "/users/:eId/",
      element: <CustomerUsers />,
    },
  ],
};

export default EnterpriseUsersConfig;
