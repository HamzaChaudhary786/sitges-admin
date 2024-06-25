import { lazy } from "react";

const VendorUsers = lazy(() => import("./VendorUsers"));

/**
 * The Example page config.
 */
const VendorUsersConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "vendors",
      element: <VendorUsers />,
    },
  ],
};

export default VendorUsersConfig;
