import { lazy } from "react";

const DispatcherUsers = lazy(() => import("./DispatcherUsers"));

/**
 * The Example page config.
 */
const DispatcherUsersConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "dispatchers",
      element: <DispatcherUsers />,
    },
  ],
};

export default DispatcherUsersConfig;
