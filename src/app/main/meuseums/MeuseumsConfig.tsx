import { lazy } from "react";

const Meuseum = lazy(() => import("./Meuseums"));

const MeuseumConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "meuseums",
      element: <Meuseum />,
    },
  ],
};

export default MeuseumConfig;
