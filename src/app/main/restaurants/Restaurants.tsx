'use client'
import FusePageSimple from "@fuse/core/FusePageSimple";
import { styled } from "@mui/material/styles";

import { Button, CircularProgress, IconButton, TextField } from "@mui/material";
import { DialogWrapper } from "src/helpers/DialogWrapper";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Autocomplete from "@mui/material/Autocomplete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useSelector } from "react-redux";
import { useAppDispatch } from "app/store/store";
import { TableComp } from "app/shared-components/TableComp";
import { useDevice } from "src/helpers/useDevice";
import { showMessage } from "@fuse/core/FuseMessage/store/fuseMessageSlice";
// import { useRouter } from 'next/router';
import { useNavigate } from "react-router-dom";
import GoogleComponent from "../commonComponent/googleMap/googleMap";

import {
  getRestaurantUsersAction,
  saveNewRestaurantAction,
  selectRestaurants,
  updateOldRestaurantAction,
  uploadImageToAWSAndGetLink,
} from "app/store/restaurantSlice";
import {
  Restaurants,
  ProfileStatus,
  RestaurantTypes,
} from "../../../helpers/entities";
import {
  RestaurantIdeal,
  RestaurantTypeMenuItems,
  ShopFeatures,
  StatusItems,
  YesNoMenuItems,
} from "src/helpers/constants";
import ViewDetails from "src/helpers/ViewDetails";
import { getVendorUsersAction, selectVendors } from "app/store/vendorSlice";
import InputField from "src/helpers/InputField";
import StatusSelect from "src/helpers/StatusSelect";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Stack } from "@mui/system";
import FilterForm from "src/helpers/FilterForm";
import MultiField from "src/helpers/MultiField";

const Root = styled(FusePageSimple)(({ theme }) => ({
  "& .FusePageSimple-header": {
    backgroundColor: theme.palette.background.paper,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: theme.palette.divider,
  },
  "& .FusePageSimple-content": {},
  "& .FusePageSimple-sidebarHeader": {},
  "& .FusePageSimple-sidebarContent": {},
}));

const loadScript = (url) => {
  const script = document.createElement('script');
  script.src = url;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
};

function Restaurant() {


  const NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = "AIzaSyB6bm5mt4pQjgzIIW3ZCHChQbRyajMhsTk";

  const { IsMob, IsTab, IsWeb } = useDevice();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [IsLoadingData, setIsLoadingData] = useState(true);
  const [IsRestaurantViewDialogOpen, setIsRestaurantViewDialogOpen] =
    useState(false);
  const [IsAddRestaurantDialogOpen, setIsAddRestaurantDialogOpen] =
    useState(false);

  const [RestaurantBeingViewed, setRestaurantBeingViewed] = useState<
    null | string
  >(null);
  const [RestaurantBeingDeletedId, setRestaurantBeingDeletedId] = useState<
    null | string
  >(null);

  let restaurantData = useSelector(selectRestaurants);
  let vendors = useSelector(selectVendors);

  const [FilterName, setFilterName] = useState("");
  const [FilterEmail, setFilterEmail] = useState("");
  const [FilterStatus, setFilterStatus] = useState("");

  const [Name, setName] = useState("");

  const [VendorId, setVendorId] = useState("");
  const [Tags, setTags] = useState("");
  const [PromotionTags, setPromotionTags] = useState("");
  const [ProductTags, setProductTags] = useState([]);
  const [PromotionalTags, setPromotionalTags] = useState([]);
  const [Types, setTypes] = useState();
  const [CoverImageLink, setCoverImageLink] = useState();
  const [CoverImage, setCoverImage] = useState<string | File>();

  const [ProfileImageLink, setProfileImageLink] = useState();
  const [ProfileImage, setProfileImage] = useState<string | File>();
  const [Status, setStatus] = useState(true);
  const [ApproveStatus, setApproveStatus] = useState();
  const [DeliveryTime, setDeliveryTime] = useState("");

  const [TermsOfUse, setTermsOfUse] = useState("");
  const [PrivacyPolicy, setPrivacyPolicy] = useState("");
  const [DeliveryAndReturnPolicy, setDeliveryAndReturnPolicy] = useState("");

  const [DeliveryAmount, setDeliveryAmount] = useState(0);
  const [AverageRating, setAverageRating] = useState(0);
  const [Lat, setLat] = useState(0);
  const [Long, setLong] = useState(0);
  const [Email, setEmail] = useState();
  const [AcceptCoupons, setAcceptCoupons] = useState();
  const [FreeShipping, setFreeShipping] = useState();
  const [OnlinePayment, setOnlinePayment] = useState();
  const [CardPayment, setCardPayment] = useState();
  const [EffectivePayment, setEffectivePayment] = useState();
  const [IsVegan, setIsVegan] = useState();
  const [IsVegetarian, setIsVegetarian] = useState();
  const [IsBusinessTelephoneOnWhatsapp, setIsBusinessTelephoneOnWhatsapp] =
    useState();
  const [IsTelephoneOperationsOnWhatsapp, setIsTelephoneOperationsOnWhatsapp] =
    useState();
  const [IsEscalationPhoneOnWhatsapp, setIsEscalationPhoneOnWhatsapp] =
    useState();
  const [Address, setAddress] = useState();
  const [GeneralInformation, setGeneralInformation] = useState();
  const [Attributes, setAttributes] = useState();
  // const [Specialities, setSpecialities] = useState();
  const [IdealFor, setIdealFor] = useState([]);
  const [BussinessName, setBussinessName] = useState();
  const [CompanyName, setCompanyName] = useState();
  const [NifCifId, setNifCifId] = useState();
  const [CommercialCode, setCommercialCode] = useState();
  const [BusinessTelephone, setBusinessTelephone] = useState();
  const [TelephoneOperations, setTelephoneOperations] = useState();
  const [EscalationPhone, setEscalationPhone] = useState();
  const [NameOfTheRoad, setNameOfTheRoad] = useState();
  const [TrackNumber, setTrackNumber] = useState();
  const [PostalCode, setPostalCode] = useState();
  const [Area, setArea] = useState();
  const [Country, setCountry] = useState();
  const [Specialities, setSpecialities] = useState([]);
  const [Features, setFeatures] = useState([]);
  const [Comments, setComments] = useState();
  const [SelectedVendor, setSelectedVendor] = useState<any>(null);

  const [ErrorMsg, setErrorMsg] = useState("");
  const [IsLoadingDialog, setIsLoadingDialog] = useState(false);

  const [FilteredData, setFilteredData] = useState<any>(restaurantData);
  const [IsEditing, setIsEditing] = useState(false);

  const [RestaurantBeingEditedId, setRestaurantBeingEditedId] = useState<
    null | string
  >(null);

  const newImageStyle = {
    marginTop: "15px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "start",
    justifyContent: "end",
    width: IsEditing ? "40%" : "49%",
    height: "200px",
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",

    border: "1px dotted black",
  };
  const new2ImageStyle = {
    display: "flex",
    alignItems: "start",
    justifyContent: "end",
    width: "100%",
    height: "200px",
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    border: "1px dotted black",
  };

  const detailsData = [
    { heading: "Name", value: `${Name}` },
    { heading: "Vendor ID", value: VendorId },
    { heading: "Product Tags", value: ProductTags },
    { heading: "Promotional Tags", value: PromotionalTags },
    { heading: "Type", value: Types },
    { heading: "Status", value: Status ? "Active" : "Inactive" },
    { heading: "Delivery Time", value: DeliveryTime },
    { heading: "Delivery Amount", value: `$${DeliveryAmount}` },

    { heading: "Average Rating", value: AverageRating },
    { heading: "Latitude", value: Lat },
    { heading: "Longitude", value: Long },
    { heading: "Email", value: Email },
    { heading: "Accept Coupons", value: AcceptCoupons ? "Yes" : "No" },
    { heading: "Free Shipping", value: FreeShipping ? "Yes" : "No" },
    { heading: "Online Payment", value: OnlinePayment ? "Yes" : "No" },
    { heading: "Card Payment", value: CardPayment ? "Yes" : "No" },
    { heading: "Address", value: Address },
    { heading: "Effective Payment", value: EffectivePayment ? "Yes" : "No" },
    { heading: "Is Vegan", value: IsVegan ? "Yes" : "No" },
    { heading: "Is Vegetarian", value: IsVegetarian ? "Yes" : "No" },
    { heading: "General Information", value: GeneralInformation },
    { heading: "Attributes", value: Attributes },
    { heading: "Ideal For", value: IdealFor ? IdealFor.join(", ") : [] },
    { heading: "Features", value: Features ? Features.join(", ") : [] },
    { heading: "Business Name", value: BussinessName },
    { heading: "Company Name", value: CompanyName },
    { heading: "NIF/CIF ID", value: NifCifId },
    { heading: "Commercial Code", value: CommercialCode },
    { heading: "Business Telephone", value: BusinessTelephone },
    {
      heading: "Is Business Telephone on WhatsApp",
      value: IsBusinessTelephoneOnWhatsapp ? "Yes" : "No",
    },
    { heading: "Telephone Operations", value: TelephoneOperations },
    {
      heading: "Is Telephone Operations on WhatsApp",
      value: IsTelephoneOperationsOnWhatsapp ? "Yes" : "No",
    },
    { heading: "Escalation Phone", value: EscalationPhone },
    {
      heading: "Is Escalation Phone on WhatsApp",
      value: IsEscalationPhoneOnWhatsapp ? "Yes" : "No",
    },
    { heading: "Name of the Road", value: NameOfTheRoad },
    { heading: "Track Number", value: TrackNumber },
    { heading: "Postal Code", value: PostalCode },
    { heading: "Area", value: Area },
    { heading: "Country", value: Country },

    { heading: "Terms Of Use", value: `${TermsOfUse}` },
    { heading: "Privacy Policy", value: `${PrivacyPolicy}` },
    {
      heading: "Delivery And Return Policy",
      value: `${DeliveryAndReturnPolicy}`,
    },

    {
      heading: "Specialities",
      value: Specialities ? Specialities.join(", ") : [],
    },
    { heading: "Comments", value: Comments },
  ];

  useEffect(() => {
    getRestaurants();
    getVendors();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       if (CoverImage instanceof File) {
  //         const coverLink = await dispatch(
  //           uploadImageToAWSAndGetLink(CoverImage),
  //         );

  //         if (typeof coverLink !== "string") {
  //           throw new Error("Error while saving the ProfileImage image");
  //         }
  //         setCoverImageLink(coverLink);
  //       } else {
  //         return;
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchData();
  // }, [CoverImage]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       if (ProfileImage instanceof File) {
  //         const profileLink = await dispatch(
  //           uploadImageToAWSAndGetLink(ProfileImage),
  //         );
  //         if (typeof profileLink !== "string") {
  //           throw new Error("Error while saving the ProfileImage image");
  //         }
  //         setProfileImageLink(profileLink);
  //       } else {
  //         return;
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchData();
  // }, [ProfileImage]);

  useEffect(() => {
    setFilteredData(restaurantData);
  }, [restaurantData]);

  useEffect(() => {
    let restaurant;
    if ((RestaurantBeingViewed || RestaurantBeingEditedId) && restaurantData) {
      if (RestaurantBeingViewed) {
        restaurant = restaurantData.find((p) => p.id === RestaurantBeingViewed);
      } else if (RestaurantBeingEditedId) {
        restaurant = restaurantData.find(
          (p) => p.id === RestaurantBeingEditedId,
        );
      }
      if (restaurant) {

        let convertedIdealFor;


        if (restaurant.idealFor) {

          console.log(" converted Idea For", restaurant.idealFor)

          if (RestaurantBeingViewed) {

            convertedIdealFor = restaurant.idealFor

          }
          else {

            convertedIdealFor = restaurant.idealFor.map((item) => {
              return { value: item, label: item };
            });

          }
        }
        else {
          convertedIdealFor = [];
        }

        let convertedFeatures;

        if (restaurant.features) {

          if (RestaurantBeingViewed) {
            convertedFeatures = restaurant.features
          }
          else {

            convertedFeatures = restaurant.features.map((item) => {
              return { value: item, label: item };
            });
            console.log("converted ", restaurant.features)
          }
        } else {
          convertedFeatures = [];
        }

        let convertedCommercialTrade;
        if (restaurant.specialities) {

          if (RestaurantBeingViewed) {
            convertedCommercialTrade = restaurant.specialities
          }
          else {

            convertedCommercialTrade = restaurant.specialities.map((item) => {
              return { value: item, label: item };
            });

          }

        } else {
          convertedCommercialTrade = []
        }


        console.log(restaurant.productTags);


        setTags(restaurant.productTags);
        setPromotionTags(restaurant.promotionalTags);
        setName(restaurant.name);
        setVendorId(restaurant.vendorId);
        setProductTags(restaurant.productTags || []);
        setPromotionalTags(restaurant.promotionalTags || []);
        setTypes(restaurant.types);
        setCoverImage(restaurant.coverImage);
        // setCoverImageLink(restaurant.coverImage);
        setProfileImage(restaurant.profileImage);
        // setProfileImageLink(restaurant.profileImage);
        setStatus(restaurant.status);
        setDeliveryTime(restaurant.deliveryTime);
        setDeliveryAmount(restaurant.deliveryAmount);

        setTermsOfUse(restaurant.termsOfUse);
        setPrivacyPolicy(restaurant.privacyPolicy);
        setDeliveryAndReturnPolicy(restaurant.deliveryAndReturnPolicy);

        setAverageRating(restaurant.averageRating);
        setLat(restaurant.lat);
        setLong(restaurant.long);
        setEmail(restaurant.email);
        setAcceptCoupons(restaurant.acceptCoupons);
        setFreeShipping(restaurant.freeShipping);
        setOnlinePayment(restaurant.onlinePayment);
        setCardPayment(restaurant.cardPayment);
        setAddress(restaurant.address);
        setEffectivePayment(restaurant.effectivePayment);
        setIsVegan(restaurant.isVegan);
        setIsVegetarian(restaurant.isVegetarian);
        setGeneralInformation(restaurant.generalInformation);
        setAttributes(restaurant.attributes);
        setIdealFor(convertedIdealFor || []);
        setFeatures(convertedFeatures || []);
        setBussinessName(restaurant.bussinessName);
        setCompanyName(restaurant.companyName);
        setNifCifId(restaurant.nifCifId);
        setCommercialCode(restaurant.commercialCode);
        setBusinessTelephone(restaurant.businessTelephone);
        setIsBusinessTelephoneOnWhatsapp(
          restaurant.isBusinessTelephoneOnWhatsapp,
        );
        setTelephoneOperations(restaurant.telephoneOperations);
        setIsTelephoneOperationsOnWhatsapp(
          restaurant.isTelephoneOperationsOnWhatsapp,
        );
        setEscalationPhone(restaurant.escalationPhone);
        setIsEscalationPhoneOnWhatsapp(restaurant.isEscalationPhoneOnWhatsapp);
        setNameOfTheRoad(restaurant.nameOfTheRoad);
        setTrackNumber(restaurant.trackNumber);
        setPostalCode(restaurant.postalCode);
        setArea(restaurant.area);
        setCountry(restaurant.country);
        setSpecialities(convertedCommercialTrade || []);
        setComments(restaurant.comments);
      }
    }
  }, [RestaurantBeingViewed, restaurantData, RestaurantBeingEditedId]);

  const handleCLoseDialog = () => {
    setRestaurantBeingEditedId(null);
    setIsEditing(false);
    setIsAddRestaurantDialogOpen(false);
  };

  const handleCloseViewDialog = () => {
    setIsRestaurantViewDialogOpen(false);
    setRestaurantBeingViewed(null);
  };

  const DefaultValuesToStates = () => {
    setIsEditing(false);
    setIsRestaurantViewDialogOpen(false);
    setRestaurantBeingEditedId(null);
    setErrorMsg("");
    setName("");
    setVendorId("");
    setTags("");
    setPromotionTags("");
    setProductTags([]);
    setPromotionalTags([]);
    setCoverImage("");
    setProfileImage("");
    setStatus(true);
    setDeliveryTime("");
    setDeliveryAmount(0);

    setTermsOfUse(""),
      setPrivacyPolicy(""),
      setDeliveryAndReturnPolicy(""),
      setAverageRating(0);
    setLat(0);
    setLong(0);
    setEmail(null);
    setAcceptCoupons(null);
    setFreeShipping(null);
    setOnlinePayment(null);
    setCardPayment(null);
    setAddress(null);
    setEffectivePayment(null);
    setIsVegan(null);
    setIsVegetarian(null);
    setGeneralInformation(null);
    setAttributes(null);
    setSpecialities([]);
    setFeatures([]);
    setIdealFor([]);
    setBussinessName(null);
    setCompanyName(null);
    setNifCifId(null);
    setCommercialCode(null);
    setBusinessTelephone(null);
    setIsBusinessTelephoneOnWhatsapp(null);
    setTelephoneOperations(null);
    setIsTelephoneOperationsOnWhatsapp(null);
    setEscalationPhone(null);
    setIsEscalationPhoneOnWhatsapp(null);
    setNameOfTheRoad(null);
    setTrackNumber(null);
    setPostalCode(null);
    setArea(null);
    setCountry(null);
    setComments(null);
  };

  useEffect(() => {
    if (!IsRestaurantViewDialogOpen) DefaultValuesToStates();
  }, [IsRestaurantViewDialogOpen]);

  useEffect(() => {
    if (!IsAddRestaurantDialogOpen) {
      DefaultValuesToStates();
    }
  }, [IsAddRestaurantDialogOpen]);

  async function initEdit(id: string) {
    setRestaurantBeingEditedId(id);
    setIsEditing(true);
    setIsAddRestaurantDialogOpen(true);
  }

  const handleViewCategories = (resId: string) => {
    navigate(`/restaurants/${resId}/categories`);
    // navigate(`/restaurants/1a1b0ac9-55db-4613-acec-93598de98e57/categories`)
  };

  async function initView(id: string) {
    setRestaurantBeingViewed(id);
    setIsRestaurantViewDialogOpen(true);
  }

  const handleVendorChange = (_, newValue) => {
    setSelectedVendor(newValue);
  };

  async function getRestaurants() {
    setIsLoadingData(true);
    await dispatch(getRestaurantUsersAction());
    setIsLoadingData(false);
  }

  async function getVendors() {
    setIsLoadingData(true);
    await dispatch(getVendorUsersAction());
    setIsLoadingData(false);
  }

  async function deleteRestaurant(id: string) {
    setRestaurantBeingDeletedId(id);
    // await dispatch(deleteRestaurantAction(id));
    await dispatch(getRestaurantUsersAction());
    setRestaurantBeingDeletedId(null);
  }

  async function ApplyFilter() {
    await dispatch(getRestaurantUsersAction);

    const filteredData = restaurantData.filter((user) => {
      const emailMatch =
        !FilterEmail ||
        user.email.toLowerCase().includes(FilterEmail.toLowerCase());
      const statusMatch = !FilterStatus || user.approveStatus === FilterStatus;
      const nameMatch =
        !FilterName ||
        user.name.toLowerCase().includes(FilterName.toLowerCase());

      return emailMatch && statusMatch && nameMatch;
    });

    setFilteredData(filteredData);
  }

  async function ApproveRestaurant(id: string) {
    await dispatch(
      updateOldRestaurantAction(id, { approveStatus: ProfileStatus.Approved }),
    );
    await dispatch(getRestaurantUsersAction());
  }

  async function RejectRestaurant(id: string) {
    await dispatch(
      updateOldRestaurantAction(id, { approveStatus: ProfileStatus.Rejected }),
    );
    await dispatch(getRestaurantUsersAction());
  }

  async function BlockRestaurant(id: string) {
    await dispatch(
      updateOldRestaurantAction(id, { approveStatus: ProfileStatus.Blocked }),
    );
    await dispatch(getRestaurantUsersAction());
  }

  function validation() {
    if (
      !Name ||
      // !SelectedVendor ||
      !CoverImage ||
      !ProfileImage ||
      !DeliveryTime ||
      !DeliveryAmount ||
      !TermsOfUse ||
      !PrivacyPolicy ||
      !DeliveryAndReturnPolicy ||
      !Tags ||
      !PromotionTags ||
      // !AverageRating ||
      !Lat ||
      !Long ||
      !Types ||
      !Status ||
      !Email ||
      !Address ||
      !BussinessName ||
      !CompanyName ||
      !NifCifId ||
      !CommercialCode ||
      !BusinessTelephone ||
      !TelephoneOperations ||
      !EscalationPhone ||
      !NameOfTheRoad ||
      !TrackNumber ||
      !PostalCode ||
      !Area ||
      !Country ||
      !GeneralInformation ||
      !Attributes ||
      !Specialities ||
      AcceptCoupons === null ||
      AcceptCoupons === undefined ||
      FreeShipping === null ||
      FreeShipping === undefined ||
      OnlinePayment === null ||
      OnlinePayment === undefined ||
      CardPayment === null ||
      CardPayment === undefined ||
      EffectivePayment === null ||
      EffectivePayment === undefined ||
      IsVegan === null ||
      IsVegan === undefined ||
      IsVegetarian === null ||
      IsVegetarian === undefined ||
      IsBusinessTelephoneOnWhatsapp === null ||
      IsBusinessTelephoneOnWhatsapp === undefined ||
      IsTelephoneOperationsOnWhatsapp === null ||
      IsTelephoneOperationsOnWhatsapp === undefined ||
      IsEscalationPhoneOnWhatsapp === null ||
      IsEscalationPhoneOnWhatsapp === undefined
    )
      return true;
    else {
      return false;
    }
  }

  function convertToArray(tag: string): string[] {
    if (tag.includes(",")) {
      return tag.split(", ");
    } else {
      return [tag];
    }
  }

  async function uploadImage() {
    if (ProfileImage instanceof File) {
      const link = await dispatch(uploadImageToAWSAndGetLink(ProfileImage));
      if (typeof link !== "string") {
        throw new Error("Error while saving the ProfileImage image");
      }
      return link;
    } else return ProfileImage;
  }

  async function uploadCoverImage() {
    if (CoverImage instanceof File) {
      const link = await dispatch(uploadImageToAWSAndGetLink(CoverImage));
      if (typeof link !== "string") {
        throw new Error("Error while saving the CoverImage image");
      }
      return link;
    } else return CoverImage;
  }

  async function saveUpdateData() {
    const extractedValues = IdealFor.map((item) => item.value);
    const extractedFeatures = Features.map((item) => item.value);
    const specialitiesEctractedValue = Specialities.map((item) => item.value);
    console.log("extract", extractedValues)
    console.log("Ideal For", IdealFor)
    // setIdealFor(extractedValues);
    // setCategorizationTrade(specialitiesEctractedValue);

    const ptag = convertToArray(Tags);
    const formattedTags = ptag.join(" | ");
    const profileImageLink = await uploadImage();
    const coverImageLink = await uploadCoverImage();

    const body: Partial<Restaurants> = {
      name: Name,
      productTags: formattedTags,
      promotionalTags: PromotionTags,
      coverImage: coverImageLink,
      profileImage: profileImageLink,
      types: RestaurantTypes.Restaurant,
      status: Status,
      approveStatus: ApproveStatus,
      deliveryTime: DeliveryTime,
      deliveryAmount: DeliveryAmount,

      // averageRating: AverageRating,
      lat: Lat,
      long: Long,
      shopDetails: {
        email: Email,
        acceptCoupons: AcceptCoupons,
        freeShipping: FreeShipping,
        onlinePayment: OnlinePayment,
        cardPayment: CardPayment,
        address: Address,
        effectivePayment: EffectivePayment,
        termsOfUse: TermsOfUse,
        privacyPolicy: PrivacyPolicy,
        deliveryAndReturnPolicy: DeliveryAndReturnPolicy,
        isVegan: IsVegan,
        isVegetarian: IsVegetarian,
        generalInformation: GeneralInformation,
        attributes: Attributes,
        specialities: specialitiesEctractedValue,
        idealFor: extractedValues,
        features: extractedFeatures,
        bussinessName: BussinessName,
        companyName: CompanyName,
        nifCifId: NifCifId,
        commercialCode: CommercialCode,
        businessTelephone: BusinessTelephone,
        isBusinessTelephoneOnWhatsapp: IsBusinessTelephoneOnWhatsapp,
        telephoneOperations: TelephoneOperations,
        isTelephoneOperationsOnWhatsapp: IsTelephoneOperationsOnWhatsapp,
        escalationPhone: EscalationPhone,
        isEscalationPhoneOnWhatsapp: IsEscalationPhoneOnWhatsapp,
        nameOfTheRoad: NameOfTheRoad,
        trackNumber: TrackNumber,
        postalCode: PostalCode,
        area: Area,
        country: Country,
        comments: Comments,
      },
    };
    return body;
  }

  async function updateRestaurant() {
    try {
      if (validation()) {
        throw "Please fill all the required fields";
      }
      setErrorMsg("");
      setIsLoadingDialog(true);

      const body = await saveUpdateData();

      const response = await dispatch(
        updateOldRestaurantAction(RestaurantBeingEditedId, body),
      );
      if (response !== ("Updated successfully" as any)) throw response;
      await dispatch(getRestaurantUsersAction());
      setIsLoadingDialog(false);
      setIsAddRestaurantDialogOpen(false);
      dispatch(
        showMessage({
          message: "Restaurant updated successfully!", //text or html
          autoHideDuration: 6000, //ms
          anchorOrigin: {
            vertical: "top", //top bottom
            horizontal: "right", //left center right
          },
          variant: "success", //success error info warning null
        }),
      );
    } catch (error) {
      setErrorMsg(error);
      setIsLoadingDialog(false);
    }
  }

  async function saveRestaurant() {
    try {
      if (validation()) {
        throw "Please fill all the required fields";
      }
      setErrorMsg("");
      setIsLoadingDialog(true);

      const body = await saveUpdateData();

      console.log("After body");
      const id = await dispatch(
        saveNewRestaurantAction({ vendorId: SelectedVendor.id, ...body }),
      );
      if (id !== ("Restaurants added successfully" as any)) throw id;

      await dispatch(getRestaurantUsersAction());
      setIsLoadingDialog(false);
      setIsAddRestaurantDialogOpen(false);
      dispatch(
        showMessage({
          message: "Admin added successfully!", //text or html
          autoHideDuration: 6000, //ms
          anchorOrigin: {
            vertical: "top", //top bottom
            horizontal: "right", //left center right
          },
          variant: "success", //success error info warning null
        }),
      );
    } catch (error) {
      setErrorMsg(error);
      setIsLoadingDialog(false);
    }
  }

  let IsAddBeachDialogOpen: any
  let IsAddMeuseumDialogOpen: any
  let IsAddEventDialogOpen: any

  const handleLocationChange = (latitude, longitude) => {
    setLat(latitude);
    setLong(longitude);
  };



  return (
    <Root
      header={
        <div className="p-24">
          <h1>Restaurants</h1>
        </div>
      }
      content={
        <div className="p-24 w-full">
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setIsAddRestaurantDialogOpen(true);
            }}
          >
            <AddCircleOutlineIcon /> Add Restaurant
          </Button>

          <FilterForm
            FilterName={FilterName}
            FilterEmail={FilterEmail}
            FilterStatus={FilterStatus}
            setFilterName={setFilterName}
            setFilterEmail={setFilterEmail}
            setFilterStatus={setFilterStatus}
            ApplyFilter={ApplyFilter}
          />

          <h1 style={{ marginTop: "50px", marginBottom: "10px" }}>
            Restaurant List :
          </h1>
          <TableComp
            data={FilteredData}
            isLoading={IsLoadingData}
            // rowsToShow={5}
            columns={[
              {
                Heading: "Pictures",
                accessor: "profileImage",
                Cell: (row: Restaurants) => (
                  <>
                    {row.profileImage ? (
                      <img
                        src={row.profileImage}
                        alt="First Image"
                        style={{ maxWidth: "80px" }}
                      />
                    ) : null}
                  </>
                ),
              },
              {
                Heading: "Name",
                accessor: `name`,
              },
              {
                Heading: "Email",
                accessor: "email",
              },
              {
                Heading: "Status",
                accessor: "approveStatus",
              },
              {
                Heading: "Actions",
                Cell: (row: Restaurants, index) => {
                  if (RestaurantBeingDeletedId === row.id)
                    return <CircularProgress />;
                  return (
                    <>
                      <IconButton
                        onClick={() => initView(row.id)}
                        className="mt-4 mr-5"
                      >
                        <VisibilityIcon color="primary" />
                      </IconButton>

                      {row.approveStatus === "AwaitingApproval" ? (
                        <>
                          <IconButton
                            onClick={() => ApproveRestaurant(row.id)}
                            className="mt-4 mr-5"
                          >
                            <CheckCircleIcon color="success" />
                          </IconButton>

                          <IconButton
                            onClick={() => RejectRestaurant(row.id)}
                            className="mt-4 mr-5"
                          >
                            <CancelIcon style={{ color: "red" }} />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton
                            onClick={() => initEdit(row.id)}
                            className="mt-4 mr-5"
                          >
                            <EditIcon color="secondary" />
                          </IconButton>
                          {row.approveStatus !== ProfileStatus.Blocked ? (
                            <IconButton
                              onClick={() => BlockRestaurant(row.id)}
                              className="mt-4 mr-5"
                            >
                              <BlockIcon style={{ color: "red" }} />
                            </IconButton>
                          ) : null}
                        </>
                      )}
                    </>
                  );
                },
              },
              {
                Heading: "View Categories",
                Cell: (row: Restaurants, index) => {
                  return (
                    <>
                      <Button
                        onClick={() => handleViewCategories(row.id)}
                        style={{
                          backgroundColor: "green",
                          color: "white",
                          padding: "10px",
                          borderRadius: "10px",
                        }}
                      >
                        View Categories
                      </Button>
                    </>
                  );
                },
              },
            ]}
          />

          {IsAddRestaurantDialogOpen && (
            <DialogWrapper
              isOpen={IsAddRestaurantDialogOpen}
              onClose={handleCLoseDialog}
              title={IsEditing ? "Update Restaurant" : "Add Restaurant"}
              maxWidth="lg"


              errorMsg={ErrorMsg}
              isLoadingActions={IsLoadingDialog}
              onSave={() => {
                if (IsEditing) {
                  updateRestaurant();
                } else {
                  saveRestaurant();
                }
              }}
              saveButtonText={IsEditing ? "Update" : "Save"}
              content={
                <div
                  style={{
                    width: IsWeb ? "1000px" : "",
                    height: IsWeb ? "75vh" : "",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                    }}
                  >
                    {/* profile Image */}
                    <input
                      accept="image/*"
                      id="files-uploader-v1"
                      multiple
                      hidden
                      type="file"
                      onChange={(e) => {
                        if (!e.target.files || e.target.files.length === 0)
                          return;
                        setProfileImage(e.target.files[0]);
                      }}
                    />
                    <div
                      onClick={() => {
                        document.getElementById("files-uploader-v1").click();
                      }}
                      style={{
                        marginTop: "15px",
                        marginBottom: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "49%",
                        height: "200px",
                        border: "1px dotted black",
                        background: "#eee",
                        cursor: "pointer",
                      }}
                    >
                      <h3
                        style={{
                          color: "grey",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FuseSvgIcon className="text-48 mr-10" size={24}>
                          heroicons-solid:cloud-upload
                        </FuseSvgIcon>
                        Upload Profile image
                      </h3>
                    </div>

                    {ProfileImage ? (
                      <div style={{ ...newImageStyle }}>
                        {ProfileImage instanceof File ? (
                          <div
                            style={{
                              ...new2ImageStyle,
                              backgroundImage:
                                ProfileImage instanceof File
                                  ? `url(${URL.createObjectURL(ProfileImage)})`
                                  : ProfileImage,
                            }}
                          ></div>
                        ) : (
                          <img
                            style={{ width: "100%", height: "200px" }}
                            src={ProfileImage}
                            alt="Image"
                          />
                        )}
                      </div>
                    ) : null}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                    }}
                  >
                    <input
                      accept="image/*"
                      id="files-uploader-v2"
                      multiple
                      hidden
                      type="file"
                      onChange={(e) => {
                        if (!e.target.files || e.target.files.length === 0)
                          return;
                        setCoverImage(e.target.files[0]);
                      }}
                    />
                    <div
                      onClick={() => {
                        document.getElementById("files-uploader-v2").click();
                      }}
                      style={{
                        marginTop: "15px",
                        marginBottom: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "49%",
                        height: "200px",
                        border: "1px dotted black",
                        background: "#eee",
                        cursor: "pointer",
                      }}
                    >
                      <h3
                        style={{
                          color: "grey",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FuseSvgIcon className="text-48 mr-10" size={24}>
                          heroicons-solid:cloud-upload
                        </FuseSvgIcon>
                        Upload cover image
                      </h3>
                    </div>

                    {CoverImage ? (
                      <div style={{ ...newImageStyle }}>
                        {CoverImage instanceof File ? (
                          <div
                            style={{
                              ...new2ImageStyle,
                              backgroundImage:
                                CoverImage instanceof File
                                  ? `url(${URL.createObjectURL(CoverImage)})`
                                  : CoverImage,
                            }}
                          ></div>
                        ) : (
                          <img
                            style={{ width: "100%", height: "200px" }}
                            src={CoverImage}
                            alt="Image"
                          />
                        )}
                      </div>
                    ) : null}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                    }}
                  >
                    <InputField
                      label="Name*"
                      value={Name}
                      onChange={setName}
                      type="text"
                    />
                    <InputField
                      label="Product Tags*(use comma to separate)"
                      value={Tags}
                      onChange={setTags}
                      type="text"
                    />
                    <InputField
                      label="Promotional Tags*"
                      value={PromotionTags}
                      onChange={setPromotionTags}
                      type="text"
                    />
                    <InputField
                      label="Delivery Time*"
                      value={DeliveryTime}
                      onChange={setDeliveryTime}
                      type="text"
                    />
                    <InputField
                      label="Delivery Amount*"
                      value={DeliveryAmount}
                      onChange={setDeliveryAmount}
                      type="number"
                    />
                    {/* <InputField
                      label="Average Rating"
                      value={AverageRating}
                      onChange={setAverageRating}
                      type="number"
                    /> */}
                    <InputField
                      label="Lat*"
                      value={Lat}
                      onChange={setLat}
                      type="number"
                    />
                    <InputField
                      label="Long*"
                      value={Long}
                      onChange={setLong}
                      type="number"
                    />


                    <GoogleComponent IsAddRestaurantDialogOpen={IsAddRestaurantDialogOpen} onLocationChange={handleLocationChange} IsAddBeachDialogOpen={IsAddBeachDialogOpen} IsAddMeuseumDialogOpen={IsAddMeuseumDialogOpen} IsAddEventDialogOpen={IsAddEventDialogOpen} />


                    <InputField
                      label="Email*"
                      value={Email}
                      onChange={setEmail}
                      type="email"
                    />
                    <InputField
                      label="Address*"
                      value={Address}
                      onChange={setAddress}
                      type="text"
                    />
                    <InputField
                      label="Attributes*"
                      value={Attributes}
                      onChange={setAttributes}
                      type="text"
                    />
                    <InputField
                      label="General information*"
                      value={GeneralInformation}
                      onChange={setGeneralInformation}
                      type="text"
                    />

                    <InputField
                      label="Bussiness Name*"
                      value={BussinessName}
                      onChange={setBussinessName}
                      type="text"
                    />
                    <InputField
                      label="Company Name*"
                      value={CompanyName}
                      onChange={setCompanyName}
                      type="text"
                    />
                    <InputField
                      label="Nif-Id*"
                      value={NifCifId}
                      onChange={setNifCifId}
                      type="text"
                    />
                    <InputField
                      label="Commercial Code*"
                      value={CommercialCode}
                      onChange={setCommercialCode}
                      type="number"
                    />
                    <InputField
                      label="Business Telephone*"
                      value={BusinessTelephone}
                      onChange={setBusinessTelephone}
                      type="text"
                    />
                    <InputField
                      label="Telephone Operations*"
                      value={TelephoneOperations}
                      onChange={setTelephoneOperations}
                      type="text"
                    />
                    <InputField
                      label="Escalation Phone*"
                      value={EscalationPhone}
                      onChange={setEscalationPhone}
                      type="text"
                    />
                    <InputField
                      label="Name Of The Road*"
                      value={NameOfTheRoad}
                      onChange={setNameOfTheRoad}
                      type="text"
                    />
                    <InputField
                      label="Track Number*"
                      value={TrackNumber}
                      onChange={setTrackNumber}
                      type="number"
                    />
                    <InputField
                      label="Postal Code*"
                      value={PostalCode}
                      onChange={setPostalCode}
                      type="number"
                    />
                    <InputField
                      label="Area*"
                      value={Area}
                      onChange={setArea}
                      type="text"
                    />
                    <InputField
                      label="Country*"
                      value={Country}
                      onChange={setCountry}
                      type="text"
                    />
                    <InputField
                      label="Terms Of Use*"
                      value={TermsOfUse}
                      onChange={setTermsOfUse}
                      type="text"
                    />

                    <InputField
                      label="Privacy Policy*"
                      value={PrivacyPolicy}
                      onChange={setPrivacyPolicy}
                      type="text"
                    />
                    <InputField
                      label="Delivery And Return Policy*"
                      value={DeliveryAndReturnPolicy}
                      onChange={setDeliveryAndReturnPolicy}
                      type="text"
                    />
                    <InputField
                      label="Comments"
                      value={Comments}
                      onChange={setComments}
                      type="text"
                    />

                    {IsEditing ? null : (
                      <>
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={vendors}
                          getOptionLabel={(vendor) => vendor.email}
                          value={SelectedVendor}
                          onChange={handleVendorChange}
                          sx={{
                            width: "48%",
                            marginTop: "47px",
                            marginBottom: "20px",
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Connecting this restaurant with a Vendor"
                            />
                          )}
                        />
                        <StatusSelect
                          label="Types*"
                          value={Types}
                          onChange={setTypes}
                          menuItems={RestaurantTypeMenuItems}
                        ></StatusSelect>
                      </>
                    )}

                    <StatusSelect
                      label="ApproveStatus"
                      value={ApproveStatus}
                      onChange={setApproveStatus}
                      menuItems={StatusItems}
                    ></StatusSelect>
                    {/* <StatusSelect
                      label="Status*"
                      value={Status}
                      onChange={setStatus}
                      menuItems={YesNoMenuItems}
                    ></StatusSelect> */}
                    <StatusSelect
                      label="Accept Coupons*"
                      value={AcceptCoupons}
                      onChange={setAcceptCoupons}
                      menuItems={YesNoMenuItems}
                    ></StatusSelect>
                    <StatusSelect
                      label="Free Shipping*"
                      value={FreeShipping}
                      onChange={setFreeShipping}
                      menuItems={YesNoMenuItems}
                    />
                    <StatusSelect
                      label="Online Payment*"
                      value={OnlinePayment}
                      onChange={setOnlinePayment}
                      menuItems={YesNoMenuItems}
                    />
                    <StatusSelect
                      label="Card Payment*"
                      value={CardPayment}
                      onChange={setCardPayment}
                      menuItems={YesNoMenuItems}
                    />
                    <StatusSelect
                      label="Effective Payment*"
                      value={EffectivePayment}
                      onChange={setEffectivePayment}
                      menuItems={YesNoMenuItems}
                    />
                    <StatusSelect
                      label="Is Vegan*"
                      value={IsVegan}
                      onChange={setIsVegan}
                      menuItems={YesNoMenuItems}
                    />
                    <StatusSelect
                      label="Is Vegetarian*"
                      value={IsVegetarian}
                      onChange={setIsVegetarian}
                      menuItems={YesNoMenuItems}
                    />
                    <StatusSelect
                      label="Is Business Telephone On Whatsapp*"
                      value={IsBusinessTelephoneOnWhatsapp}
                      onChange={setIsBusinessTelephoneOnWhatsapp}
                      menuItems={YesNoMenuItems}
                    />
                    <StatusSelect
                      label="Is Telephone Operations On Whatsapp*"
                      value={IsTelephoneOperationsOnWhatsapp}
                      onChange={setIsTelephoneOperationsOnWhatsapp}
                      menuItems={YesNoMenuItems}
                    />
                    <StatusSelect
                      label="Is Escalation Phone On Whatsapp*"
                      value={IsEscalationPhoneOnWhatsapp}
                      onChange={setIsEscalationPhoneOnWhatsapp}
                      menuItems={YesNoMenuItems}
                    />

                    <Stack
                      spacing={3}
                      sx={{
                        marginTop: "15px",
                        marginBottom: "15px",
                        width: "100%",
                      }}
                    >
                      <Autocomplete
                        multiple
                        id="tags-standard"
                        options={RestaurantIdeal}
                        getOptionLabel={(option) => option.label}
                        value={IdealFor}
                        onChange={(event, newValue) => setIdealFor(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label="Ideal For"
                            placeholder="Ideal For"
                          />
                        )}
                      />
                    </Stack>

                    <Stack
                      spacing={3}
                      sx={{ marginTop: "15px", width: "100%" }}
                    >
                      <Autocomplete
                        multiple
                        id="tags-standard"
                        options={RestaurantIdeal}
                        getOptionLabel={(option) => option.label}
                        value={Specialities}
                        onChange={(event, newValue) =>
                          setSpecialities(newValue)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label="Specialities"
                            placeholder="Specialities"
                          />
                        )}
                      />
                    </Stack>

                    <Stack
                      spacing={3}
                      sx={{ marginTop: "15px", width: "100%" }}
                    >
                      <Autocomplete
                        multiple
                        id="tags-standard"
                        options={ShopFeatures}
                        getOptionLabel={(option) => option.label}
                        value={Features}
                        onChange={(event, newValue) => setFeatures(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label="Features"
                            placeholder="Features"
                          />
                        )}
                      />
                    </Stack>
                  </div>
                </div>
              }
            />
          )}

          {IsRestaurantViewDialogOpen && (
            <DialogWrapper
              isOpen={IsRestaurantViewDialogOpen}
              onClose={handleCloseViewDialog}
              title="View Restaurant"
              maxWidth="lg"
              errorMsg={ErrorMsg}
              isLoadingActions={IsLoadingDialog}
              content={
                <div
                  style={{
                    width: IsWeb ? "1000px" : "",
                    height: IsWeb ? "75vh" : "",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <img
                        style={{
                          marginTop: "15px",
                          marginBottom: "20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "45%",
                          height: "45%",
                          border: "1px dotted black",
                          background: "#eee",
                        }}
                        src={CoverImage as string}
                        alt="Cover"
                      />
                    </div>
                    <div>
                      <img
                        style={{
                          marginTop: "15px",
                          marginBottom: "20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "45%",
                          height: "45%",
                          border: "1px dotted black",
                          background: "#eee",
                        }}
                        src={ProfileImage as string}
                        alt="Cover"
                      />
                    </div>

                    {detailsData.map((detail, index) => (
                      <ViewDetails
                        key={index}
                        heading={detail.heading}
                        value={detail.value}
                      />
                    ))}
                  </div>
                </div>
              }
            />
          )}
        </div>
      }
    />
  );
}

export default Restaurant;
