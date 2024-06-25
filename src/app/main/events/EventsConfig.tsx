import { lazy } from "react";

const TourismEvent = lazy(() => import("./Events"));

const EventConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "events",
      element: <TourismEvent />,
    },
  ],
};

export default EventConfig;
