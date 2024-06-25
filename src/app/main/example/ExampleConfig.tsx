import { lazy } from "react";

const Example = lazy(() => import("./Example"));

/**
 * The Example page config.
 */
const ExampleConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "example",
      element: <Example />,
    },
  ],
};

export default ExampleConfig;
