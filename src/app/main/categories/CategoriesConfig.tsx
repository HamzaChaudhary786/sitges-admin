import { lazy } from "react";

const Categories = lazy(() => import("./Categories"));

/**
 * The Example page config.
 */
const CategoriesConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "/restaurants/:resId/categories",
      element: <Categories />,
    },
  ],
};

export default CategoriesConfig;
