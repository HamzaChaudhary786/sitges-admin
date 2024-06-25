import { lazy } from "react";

const Products = lazy(() => import("./Products"));

/**
 * The Example page config.
 */
const ProductsConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "/restaurants/:resId/categories/:catId/products",
      element: <Products />,
    },
  ],
};

export default ProductsConfig;
