import { lazy } from "react";

const Enterprise = lazy(() => import("./Enterprise"));

/**
 * The Example page config.
 */
const EnterpriseConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "/enterprise",
      element: <Enterprise />,
    },
  ],
};

export default EnterpriseConfig;
