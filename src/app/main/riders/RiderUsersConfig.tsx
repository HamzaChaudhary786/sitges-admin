import { lazy } from "react";

const RiderUsers = lazy(() => import("./RiderUsers"));

/**
 * The Example page config.
 */
const RiderUsersConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "riders",
      element: <RiderUsers />,
    },
  ],
};

export default RiderUsersConfig;
