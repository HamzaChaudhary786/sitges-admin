import FuseUtils from "@fuse/utils";
import FuseLoading from "@fuse/core/FuseLoading";
import { Navigate } from "react-router-dom";
import settingsConfig from "app/configs/settingsConfig";
import { FuseRouteConfigsType, FuseRoutesType } from "@fuse/utils/FuseUtils";
import SignInConfig from "../main/sign-in/SignInConfig";
import SignOutConfig from "../main/sign-out/SignOutConfig";
import Error404Page from "../main/404/Error404Page";
import ExampleConfig from "../main/example/ExampleConfig";
import VendorUsersConfig from "../main/vendors/VendorUsersConfig";
import AdminUsersConfig from "../main/admins/AdminUsersConfig";
import CustomerUsersConfig from "../main/customers/CustomerUsersConfig";
import RiderUsersConfig from "../main/riders/RiderUsersConfig";
import DispatcherUsersConfig from "../main/dispatchers/DIspatcherUsersConfig";
import RestaurantsConfig from "../main/restaurants/RestaurantsConfig";
import PromoCodesConfig from "../main/promocodes/PromoCodesConfig";
import BeachConfig from "../main/beaches/BeachConfig";
import EventConfig from "../main/events/EventsConfig";
import MeuseumConfig from "../main/meuseums/MeuseumsConfig";
import CategoriesConfig from "../main/categories/CategoriesConfig";
import ProductsConfig from "../main/products/ProductsConfig";
import EnterpriseConfig from "../main/enterprise/EnterpriseConfig";
import EnterpriseUsersConfig from "../main/enterpriseUsers/EnterpriseUsersConfig";
import PromotionalCodesConfig from "../main/promotionalCode/PromotionalCodesConfig";

const routeConfigs: FuseRouteConfigsType = [
  ExampleConfig,
  SignOutConfig,
  SignInConfig,
  CustomerUsersConfig,
  AdminUsersConfig,
  VendorUsersConfig,
  RiderUsersConfig,
  DispatcherUsersConfig,
  RestaurantsConfig,
  PromoCodesConfig,
  PromotionalCodesConfig,
  BeachConfig,
  EventConfig,
  MeuseumConfig,
  CategoriesConfig,
  ProductsConfig,
  EnterpriseConfig,
  EnterpriseUsersConfig,
];

/**
 * The routes of the application.
 */
const routes: FuseRoutesType = [
  ...FuseUtils.generateRoutesFromConfigs(
    routeConfigs,
    settingsConfig.defaultAuth,
  ),
  {
    path: "/",
    element: <Navigate to="/admins" />,
    auth: settingsConfig.defaultAuth,
  },
  // {
  //   path: "/customers",
  //   element: <Navigate to="/customers" />,
  //   // auth: CustomerUsersConfig.defaultAuth,
  // },
  {
    path: "loading",
    element: <FuseLoading />,
  },
  {
    path: "404",
    element: <Error404Page />,
  },
  {
    path: "*",
    element: <Navigate to="404" />,
  },
];

export default routes;
