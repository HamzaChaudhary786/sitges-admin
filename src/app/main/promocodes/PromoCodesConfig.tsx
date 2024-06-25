import { lazy } from "react";

const PromoCodes = lazy(() => import("./PromoCodes"));

const PromoCodesConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "promocodes",
      element: <PromoCodes />,
    },
  ],
};

export default PromoCodesConfig;
