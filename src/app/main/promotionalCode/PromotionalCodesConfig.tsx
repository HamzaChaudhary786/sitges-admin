import { lazy } from "react";

const PromotionalCodes = lazy(() => import("./PromotionalCode"));

const PromotionalCodesConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "promotional-sliders",
      element: <PromotionalCodes />,
    },
  ],
};

export default PromotionalCodesConfig;
