import { lazy } from "react";

const Restaurant = lazy(() => import("./Restaurants"));

/**
 * The Example page config.
 */
const RestaurantsConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "restaurants",
      element: <Restaurant />,
    },
  ],
};

export default RestaurantsConfig;
