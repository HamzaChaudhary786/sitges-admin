import { lazy } from "react";

const Beach = lazy(() => import("./Beach"));

const BeachConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "beaches",
      element: <Beach />,
    },
  ],
};

export default BeachConfig;
