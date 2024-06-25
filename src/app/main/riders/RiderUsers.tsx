import DemoContent from "@fuse/core/DemoContent";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import {
  Alert,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DialogWrapper } from "src/helpers/DialogWrapper";
import { tableCellClasses } from "@mui/material/TableCell";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Autocomplete from "@mui/material/Autocomplete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useSelector } from "react-redux";
import { useAppDispatch } from "app/store/store";
import { TableComp } from "app/shared-components/TableComp";
import {
  closeDialog,
  openDialog,
} from "@fuse/core/FuseDialog/store/fuseDialogSlice";
import { uploadImageToAWSAndGetLink } from "app/store/restaurantSlice";
import { useDevice } from "src/helpers/useDevice";
import { showMessage } from "@fuse/core/FuseMessage/store/fuseMessageSlice";
import {
  getRiderUsersAction,
  selectRiders,
  deleteRiderAction,
  updateOldRiderAction,
  // RiderUsers,
  // saveNewRiderAction,
  setRiders,
  saveNewRiderAction,
} from "app/store/riderSlice";

import {
  UpdateRiderUsers,
  Riders,
  ProfileStatus,
} from "../../../helpers/entities";
import { getCustomersAction, selectCustomers } from "app/store/customerSlice";
import { FormControl } from "@mui/base";
import {
  EMAIL_REGEX,
  IndependenceMenuItems,
  ItemsYesNo,
  CountryCode,
  LanguageMenuItems,
  PASSWORD_REGEX,
  StatusItems,
  VehicleTypeMenuItems,
  VehicleCCMenuItems,
  YesNoMenuItems,
} from "src/helpers/constants";
import { string } from "zod";
import ViewDetails from "src/helpers/ViewDetails";
import FilterForm from "src/helpers/FilterForm";
import StatusSelect from "src/helpers/StatusSelect";
import InputField from "src/helpers/InputField";
import { width } from "@mui/system";

import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

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

function RiderUsers() {
  const { IsMob, IsTab, IsWeb } = useDevice();
  const dispatch = useAppDispatch();
  const [EditRiderDialogOpen, setEditRiderDialogOpen] = useState(false);
  const [IsEditRiderDialogOpen, setIsEditRiderDialogOpen] = useState(false);
  const [IsLoadingData, setIsLoadingData] = useState(true);
  const [IsRiderViewDialogOpen, setIsRiderViewDialogOpen] = useState(false);
  const [IsAddRiderDialogOpen, setIsAddRiderDialogOpen] = useState(false);
  const [RiderBeingViewed, setRiderBeingViewed] = useState<null | string>(null);
  const [RiderBeingDeletedId, setRiderBeingDeletedId] = useState<null | string>(
    null,
  );
  const [RiderBeingUpdatedId, setRiderBeingUpdatedId] = useState<null | string>(
    null,
  );

  let vendorUsersData = useSelector(selectRiders);
  let customers = useSelector(selectCustomers);
  const [isDate, setIsDate] = useState("");
  const [FilterName, setFilterName] = useState("");
  const [FilterEmail, setFilterEmail] = useState("");
  const [FilterStatus, setFilterStatus] = useState("");
  const [SelectedCustomer, setSelectedCustomer] = useState<any>(null);
  //add country code
  const [idNumber, setIdNumber] = useState("");
  const [FirstName, setFirstName] = useState(null);
  const [LastName, setLastName] = useState(null);
  const [City, setCity] = useState(null);
  const [countryCode, setCountryCode] = useState(null);
  const [Status, setStatus] = useState(null);
  const [VehicleType, setVehicleType] = useState(null);
  const [vehiclePlateNo, setVehiclePlateNo] = useState("");
  const [vehicleCC, setVehicleCC] = useState("");

  const [CreatedAt, setCreatedAt] = useState(null);
  const [UpdatedAt, setUpdatedAt] = useState(null);

  const [circulationValidDate, setCirculationValidDate] = useState<string>("");
  const [insuranceValidDate, setInsuranceValidDate] = useState<string>("");
  const [certificateValidDate, setCertificateValidDate] = useState<string>("");
  const [Email, setEmail] = useState("");
  const [PhoneNo, setPhoneNo] = useState(null);
  const [ErrorMsg, setErrorMsg] = useState("");

  const [IsLoadingDialog, setIsLoadingDialog] = useState(false);

  const [ProfileImage, setProfileImage] = useState<string | File>();

  const [idCardFront, setIdCardFront] = useState<string | File>();
  const [idCardBack, setIdCardBack] = useState<string | File>();
  const [vehicleInsurance, setVehicleInsurance] = useState<string | File>();
  const [drivingLicenseFront, setDrivingLicenseFront] = useState<
    string | File
  >();
  const [drivingLicenseBack, setDrivingLicenseBack] = useState<string | File>();
  const [CoverImageLink, setCoverImageLink] = useState();
  const [CoverImage, setCoverImage] = useState<string>();
  const [circulationPermit, setCirculationPermit] = useState<string | File>();
  const [certificate, setCertificate] = useState<string | File>();
  const [FilteredData, setFilteredData] = useState<any>(vendorUsersData);
  const [IsEditing, setIsEditing] = useState(false);
  const [IsView, setIsView] = useState(false);

  const [RiderBeingEditedId, setRiderBeingEditedId] = useState<null | string>(
    null,
  );

  const newImageStyle = {
    marginTop: "15px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "start",
    justifyContent: "end",
    width: IsEditing ? "40%" : "48%",
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

  useEffect(() => {
    getRiders();
    getCustomers();
  }, []);

  useEffect(() => {
    setFilteredData(vendorUsersData);
  }, [vendorUsersData]);

  useEffect(() => {
    let rider;
    if (
      (RiderBeingViewed && vendorUsersData) ||
      (RiderBeingEditedId && vendorUsersData)
    ) {
      if (RiderBeingViewed)
        rider = vendorUsersData.find((p) => p.id === RiderBeingViewed);
      else if (RiderBeingEditedId)
        rider = vendorUsersData.find((p) => p.id === RiderBeingEditedId);
      if (rider) {
        setFirstName(rider.firstName);
        setLastName(rider.lastName);
        setIdNumber(rider.idNumber);
        setEmail(rider.email);
        setPhoneNo(rider.phoneNo);
        setCity(rider.city);
        setCountryCode(rider.countryCode);
        setStatus(rider.status);
        setIdCardFront(rider.idCard[0]);
        setIdCardBack(rider.idCard[1]);
        setDrivingLicenseFront(rider.drivingLiscence[0]);
        setDrivingLicenseBack(rider.drivingLiscence[1]);
        setVehicleType(rider.vehicleType);
        setVehicleCC(rider.vehicleCC);

        setVehiclePlateNo(rider.vehiclePlateNo);
        setCirculationPermit(rider.circulationPermit);
        setCirculationValidDate(rider.circulationValidDate);
        setVehicleInsurance(rider.vehicleInsurance);
        setInsuranceValidDate(rider.insuranceValidDate);
        setProfileImage(rider.profileImage);
        setCertificate(rider.certificate);
        setCertificateValidDate(rider.certificateValidDate);
        setCreatedAt(rider.createdAt);
        setUpdatedAt(rider.updatedAt);

        if (customers) {
          const customer = customers.find((p) => p.email === rider.email);
          setSelectedCustomer(customer);
        }
      }
    }
  }, [RiderBeingViewed, vendorUsersData, RiderBeingEditedId]);

  const DefaultValues = () => {
    setFirstName("");
    setLastName("");
    setIdNumber("");
    setEmail("");
    setPhoneNo("");
    setCity("");
    setCountryCode("");
    setStatus("");
    setIdCardFront("");
    setIdCardBack("");
    setDrivingLicenseFront("");
    setDrivingLicenseBack("");

    setVehicleType("");
    setVehiclePlateNo("");
    setVehicleCC("");

    setCirculationPermit("");
    setCirculationValidDate("");

    setVehicleInsurance("");
    setInsuranceValidDate("");

    setCertificate("");
    setCertificateValidDate("");
    setProfileImage("");
    setSelectedCustomer(null);

    //not useable

    setCreatedAt("");
    setUpdatedAt("");
    setRiderBeingEditedId("");
    setRiderBeingViewed("");
  };

  useEffect(() => {
    if (!IsAddRiderDialogOpen) {
      DefaultValues();
    }
  }, [IsAddRiderDialogOpen]);

  useEffect(() => {
    if (!IsRiderViewDialogOpen) {
      DefaultValues();
    }
  }, [IsRiderViewDialogOpen]);

  const handleCustomerChange = (_, newValue) => {
    setSelectedCustomer(newValue);
  };

  async function initEdit(id: string) {
    setIsAddRiderDialogOpen(true);
    setRiderBeingEditedId(id);
    setEditRiderDialogOpen(true);
    setIsEditing(true);
  }
  async function initView(id: string) {
    setIsRiderViewDialogOpen(true);
    setRiderBeingViewed(id);
  }

  async function getRiders() {
    setIsLoadingData(true);
    await dispatch(getRiderUsersAction());
    setIsLoadingData(false);
  }

  async function getCustomers() {
    setIsLoadingData(true);
    await dispatch(getCustomersAction());
    setIsLoadingData(false);
  }

  async function deleteRider(id: string) {
    setRiderBeingDeletedId(id);
    await dispatch(deleteRiderAction(id));
    await dispatch(getRiderUsersAction());
    setRiderBeingDeletedId(null);
  }

  async function updateRiderStatus(id: string, newStatus: string) {
    setRiderBeingUpdatedId(id);
    // await dispatch(updateOldRiderAction(id, { status: newStatus }));
    await dispatch(getRiderUsersAction());
    setRiderBeingUpdatedId(null);
  }

  async function ApplyFilter() {
    await dispatch(getRiderUsersAction);

    const filteredData = vendorUsersData.filter((user) => {
      const emailMatch =
        !FilterEmail ||
        user.email.toLowerCase().includes(FilterEmail.toLowerCase());
      const statusMatch = !FilterStatus || user.status === FilterStatus;
      const nameMatch =
        !FilterName ||
        user.firstName.toLowerCase().includes(FilterName.toLowerCase());

      return emailMatch && statusMatch && nameMatch;
    });

    setFilteredData(filteredData);
    // dispatch(setRiders(filteredData));
  }

  async function ApproveRider(id: string) {
    await dispatch(
      updateOldRiderAction(id, { status: ProfileStatus.Approved }),
    );
    await dispatch(getRiderUsersAction());
  }

  async function RejectRider(id: string) {
    await dispatch(
      updateOldRiderAction(id, { status: ProfileStatus.Rejected }),
    );
    await dispatch(getRiderUsersAction());
  }

  async function BlockRider(id: string) {
    await dispatch(updateOldRiderAction(id, { status: ProfileStatus.Blocked }));
    await dispatch(getRiderUsersAction());
  }

  // function convertToArray(tag: string): string[] {
  //   if (tag.includes(",")) {
  //     return tag.split(", ");
  //   } else {
  //     return [tag];
  //   }
  // }

  // async function uploadImage() {
  //   if (ProfileImage instanceof File) {
  //     const link = await dispatch(uploadImageToAWSAndGetLink(ProfileImage));
  //     if (typeof link !== "string") {
  //       throw new Error("Error while saving the ProfileImage image");
  //     }
  //     return link;
  //   } else return ProfileImage;
  // }

  // async function uploadCoverImage() {
  //   if (ProfileImage instanceof File) {
  //     const link = await dispatch(uploadImageToAWSAndGetLink(ProfileImage));
  //     if (typeof link !== "string") {
  //       throw new Error("Error while saving the CoverImage image");
  //     }
  //     return link;
  //   } else return ProfileImage;
  // }

  async function updateRider() {
    try {
      if (
        !FirstName ||
        !LastName ||
        !idNumber ||
        !Email ||
        !City ||
        !PhoneNo ||
        !countryCode ||
        !Status ||
        !idCardFront ||
        !idCardBack ||
        !drivingLicenseFront ||
        !drivingLicenseBack ||
        !VehicleType ||
        !vehicleCC ||
        !vehiclePlateNo ||
        !circulationPermit ||
        !circulationValidDate ||
        !vehicleInsurance ||
        !insuranceValidDate ||
        !certificate ||
        !certificateValidDate ||
        !ProfileImage
      )
        throw "Please fill all the required fields";

      setErrorMsg("");
      setIsLoadingDialog(true);

      const idFrontImageLink = await uploadidCardFront();
      const idBackImageLink = await uploadidCardBack();
      const drivingLicenseFrontLink = await uploadDrivingLicenseFront();
      const drivingLicenseBackLink = await uploadDrivingLicenseBack();

      const drivingLiscence: string[] = [
        drivingLicenseFrontLink,
        drivingLicenseBackLink,
      ];

      const idCardImages: string[] = [idFrontImageLink, idBackImageLink];

      // Similarly, if you want to set driving license images
      // if (typeof drivingLicense[0] === "string" && typeof drivingLicense[1] === "string") {
      //   setDrivingLicenseFront(drivingLicense[0]);
      //   setDrivingLicenseBack(drivingLicense[1]);
      // }

      const body: UpdateRiderUsers = {
        firstName: FirstName,
        lastName: LastName,
        email: Email,
        vehiclePlateNo: vehiclePlateNo,
        vehicleCC: vehicleCC,
        profileImage: ProfileImage,
        idCard: idCardImages,
        status: Status,
        circulationValidDate: circulationValidDate,
        insuranceValidDate: insuranceValidDate,
        certificateValidDate: certificateValidDate,
        vehicleInsurance: vehicleInsurance,
        drivingLiscence: drivingLiscence,
        circulationPermit: circulationPermit,
        certificate: certificate,
        countryCode: countryCode,
        city: City,
        idNumber: idNumber,
        vehicleType: VehicleType,
      };

      const response = await dispatch(
        updateOldRiderAction(RiderBeingEditedId, body),
      );
      if (response !== ("Updated successfully" as any)) throw response;
      await dispatch(getRiderUsersAction());
      setIsLoadingDialog(false);
      setEditRiderDialogOpen(false);
      setIsAddRiderDialogOpen(false);
      setIsEditRiderDialogOpen(false);
      setIsEditing(false);
      setIsView(false);
      dispatch(
        showMessage({
          message: "Rider updated successfully!", //text or html
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

  //add upload image function

  async function uploadImage() {
    if (ProfileImage instanceof File) {
      const link = await dispatch(uploadImageToAWSAndGetLink(ProfileImage));
      if (typeof link !== "string") {
        throw new Error("Error while saving the ProfileImage image");
      }
      return link;
    } else return ProfileImage;
  }

  async function uploadcirculationPermit() {
    if (circulationPermit instanceof File) {
      const link = await dispatch(
        uploadImageToAWSAndGetLink(circulationPermit),
      );
      if (typeof link !== "string") {
        throw new Error("Error while saving the ProfileImage image");
      }
      return link;
    } else return circulationPermit;
  }

  async function uploadvehicleInsurance() {
    if (vehicleInsurance instanceof File) {
      const link = await dispatch(uploadImageToAWSAndGetLink(vehicleInsurance));
      if (typeof link !== "string") {
        throw new Error("Error while saving the ProfileImage image");
      }
      return link;
    } else return vehicleInsurance;
  }
  async function uploadCertificate() {
    if (certificate instanceof File) {
      const link = await dispatch(uploadImageToAWSAndGetLink(certificate));
      if (typeof link !== "string") {
        throw new Error("Error while saving the ProfileImage image");
      }
      return link;
    } else return certificate;
  }

  async function uploadidCardFront() {
    if (idCardFront instanceof File) {
      const link = await dispatch(uploadImageToAWSAndGetLink(idCardFront));
      if (typeof link !== "string") {
        throw new Error("Error while saving the ProfileImage image");
      }
      return link;
    } else return idCardFront;
  }
  async function uploadidCardBack() {
    if (idCardBack instanceof File) {
      const link = await dispatch(uploadImageToAWSAndGetLink(idCardBack));
      if (typeof link !== "string") {
        throw new Error("Error while saving the ProfileImage image");
      }
      return link;
    } else return idCardBack;
  }
  async function uploadDrivingLicenseFront() {
    if (drivingLicenseFront instanceof File) {
      const link = await dispatch(
        uploadImageToAWSAndGetLink(drivingLicenseFront),
      );
      if (typeof link !== "string") {
        throw new Error("Error while saving the ProfileImage image");
      }
      return link;
    } else return drivingLicenseFront;
  }
  async function uploadDrivingLicenseBack() {
    if (drivingLicenseBack instanceof File) {
      const link = await dispatch(
        uploadImageToAWSAndGetLink(drivingLicenseBack),
      );
      if (typeof link !== "string") {
        throw new Error("Error while saving the ProfileImage image");
      }
      return link;
    } else return drivingLicenseBack;
  }

  async function saveRider() {
    try {
      if (
        !FirstName ||
        !LastName ||
        !idNumber ||
        !Email ||
        !City ||
        !PhoneNo ||
        !countryCode ||
        !idCardFront ||
        !idCardBack ||
        !drivingLicenseFront ||
        !drivingLicenseBack ||
        !VehicleType ||
        !Status ||
        !vehicleCC ||
        !vehiclePlateNo ||
        !circulationPermit ||
        !circulationValidDate ||
        !vehicleInsurance ||
        !insuranceValidDate ||
        !certificate ||
        !certificateValidDate ||
        !ProfileImage ||
        !SelectedCustomer
      )
        throw "Please fill all the required fields";
      setErrorMsg("");
      setIsLoadingDialog(true);
      console.log("selected customer ", SelectedCustomer.id);

      const profileImageLink = await uploadImage();
      const circulationPermitImageLink = await uploadcirculationPermit();
      const vehicleInsuranceImagelink = await uploadvehicleInsurance();
      const certificateImageLink = await uploadCertificate();
      const idFrontImageLink = await uploadidCardFront();
      const idBackImageLink = await uploadidCardBack();
      const drivingLicenseFrontLink = await uploadDrivingLicenseFront();
      const drivingLicenseBackLink = await uploadDrivingLicenseBack();

      const idCardImages: string[] = [idFrontImageLink, idBackImageLink];
      const drivingLiscence: string[] = [
        drivingLicenseFrontLink,
        drivingLicenseBackLink,
      ];

      const body: Partial<Riders> = {
        userId: SelectedCustomer.id,
        firstName: FirstName,
        lastName: LastName,
        idNumber: idNumber,
        city: City,
        email: Email,
        phoneNo: PhoneNo,
        countryCode: countryCode,
        idCard: idCardImages, //array data idCard store
        drivingLiscence: drivingLiscence, //array data drivingLiscence store
        profileImage: profileImageLink,
        vehicleType: VehicleType,
        vehiclePlateNo: vehiclePlateNo,
        vehicleCC: vehicleCC,

        circulationPermit: circulationPermitImageLink,
        circulationValidDate: circulationValidDate,

        vehicleInsurance: vehicleInsuranceImagelink,
        insuranceValidDate: insuranceValidDate,

        certificate: certificateImageLink,
        certificateValidDate: certificateValidDate,
      };

      const id = await dispatch(saveNewRiderAction(body));
      if (id !== ("Rider Added successfully" as any)) throw id;

      await dispatch(getRiderUsersAction());
      setIsLoadingDialog(false);
      setIsAddRiderDialogOpen(false);
      dispatch(
        showMessage({
          message: "Rider added successfully!", //text or html
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

  return (
    <Root
      header={
        <div className="p-24">
          <h1>Riders</h1>
        </div>
      }
      content={
        <div className="p-24 w-full">
          <Button
            variant="contained"
            className="mb-10"
            color="primary"
            onClick={() => {
              setIsEditRiderDialogOpen(false);
              setIsView(false);
              setIsEditing(false);
              setIsAddRiderDialogOpen(true);
            }}
          >
            <AddCircleOutlineIcon /> Add Rider
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
            Rider List :
          </h1>

          <TableComp
            data={FilteredData}
            isLoading={IsLoadingData}
            // rowsToShow={5}
            columns={[
              {
                Heading: "Name",
                accessor: `firstName`,
              },
              {
                Heading: "Email",
                accessor: "email",
              },
              {
                Heading: "Phone No",
                accessor: `phoneNo`,
              },

              {
                Heading: "Status",
                accessor: "status",
              },
              {
                Heading: "Actions",
                Cell: (row: Riders, index) => {
                  if (RiderBeingDeletedId === row.id)
                    return <CircularProgress />;
                  return (
                    <>
                      <IconButton
                        onClick={() => initView(row.id)}
                        className="mt-4 mr-5"
                      >
                        <VisibilityIcon color="primary" />
                      </IconButton>

                      {row.status === "AwaitingApproval" ? (
                        <>
                          <IconButton
                            onClick={() => ApproveRider(row.id)}
                            className="mt-4 mr-5"
                          >
                            <CheckCircleIcon color="success" />
                          </IconButton>

                          <IconButton
                            onClick={() => RejectRider(row.id)}
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
                          {row.status !== ProfileStatus.Blocked ? (
                            <IconButton
                              onClick={() => BlockRider(row.id)}
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
            ]}
          />

          {IsAddRiderDialogOpen && (
            <DialogWrapper
              isOpen={IsAddRiderDialogOpen}
              onClose={() => setIsAddRiderDialogOpen(false)}
              title={IsEditing ? "Update Rider" : "Add Rider"}
              maxWidth="lg"
              errorMsg={ErrorMsg}
              isLoadingActions={IsLoadingDialog}
              onSave={() => {
                if (IsEditing) {
                  updateRider();
                } else {
                  saveRider();
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
                        width: "48%",
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
                    <InputField
                      label="First Name*"
                      value={FirstName}
                      onChange={setFirstName}
                      type="text"
                    />
                    <InputField
                      label="Last Name*"
                      value={LastName}
                      onChange={setLastName}
                      type="text"
                    />
                    <InputField
                      label="ID Number*"
                      value={idNumber}
                      onChange={setIdNumber}
                      type="text"
                    />
                    <InputField
                      label="Email*"
                      value={Email}
                      onChange={setEmail}
                      type="email"
                    />
                    <InputField
                      label="City*"
                      value={City}
                      onChange={setCity}
                      type="text"
                    />

                    <InputField
                      label="Phone Number*"
                      value={PhoneNo}
                      onChange={setPhoneNo}
                      type="number"
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                    }}
                  >
                    <StatusSelect
                      label="Country Code*"
                      value={countryCode}
                      onChange={setCountryCode}
                      menuItems={CountryCode}
                    ></StatusSelect>
                    <StatusSelect
                      label="status*"
                      value={Status}
                      onChange={setStatus}
                      menuItems={StatusItems}
                    ></StatusSelect>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={customers}
                      getOptionLabel={(customer) => customer.email}
                      value={SelectedCustomer}
                      onChange={handleCustomerChange}
                      sx={{ width: "48%", marginTop: "30px" }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="connect this Rider With User"
                        />
                      )}
                    />
                  </div>
                  <section>
                    <div>
                      <div>
                        <div>
                          <h4
                            style={{
                              marginTop: "35px",
                              marginBottom: "10px",
                            }}
                          >
                            Upload front sides of your national ID card
                          </h4>

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
                              id="files-uploader-v4"
                              multiple
                              hidden
                              type="file"
                              onChange={(e) => {
                                if (
                                  !e.target.files ||
                                  e.target.files.length === 0
                                )
                                  return;
                                setIdCardFront(e.target.files[0]);
                              }}
                            />
                            <div
                              onClick={() => {
                                document
                                  .getElementById("files-uploader-v4")
                                  .click();
                              }}
                              style={{
                                marginTop: "15px",
                                marginBottom: "20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "48%",
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
                                <FuseSvgIcon
                                  className="text-48 mr-10"
                                  size={24}
                                >
                                  heroicons-solid:cloud-upload
                                </FuseSvgIcon>
                                Choose images from gallery
                              </h3>
                            </div>

                            {idCardFront ? (
                              <div style={{ ...newImageStyle }}>
                                {idCardFront instanceof File ? (
                                  <div
                                    style={{
                                      ...new2ImageStyle,
                                      backgroundImage:
                                        idCardFront instanceof File
                                          ? `url(${URL.createObjectURL(idCardFront)})`
                                          : idCardFront,
                                    }}
                                  ></div>
                                ) : (
                                  <img
                                    style={{ width: "100%", height: "200px" }}
                                    src={idCardFront}
                                    alt="Image"
                                  />
                                )}
                              </div>
                            ) : null}
                          </div>
                        </div>
                        <div>
                          <h4
                            style={{
                              marginTop: "35px",
                              marginBottom: "10px",
                            }}
                          >
                            Upload back sides of your national ID card
                          </h4>

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
                              id="files-uploader-v3"
                              multiple
                              hidden
                              type="file"
                              onChange={(e) => {
                                if (
                                  !e.target.files ||
                                  e.target.files.length === 0
                                )
                                  return;
                                setIdCardBack(e.target.files[0]);
                              }}
                            />
                            <div
                              onClick={() => {
                                document
                                  .getElementById("files-uploader-v3")
                                  .click();
                              }}
                              style={{
                                marginTop: "15px",
                                marginBottom: "20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "48%",
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
                                <FuseSvgIcon
                                  className="text-48 mr-10"
                                  size={24}
                                >
                                  heroicons-solid:cloud-upload
                                </FuseSvgIcon>
                                Choose images from gallery
                              </h3>
                            </div>

                            {idCardBack ? (
                              <div style={{ ...newImageStyle }}>
                                {idCardBack instanceof File ? (
                                  <div
                                    style={{
                                      ...new2ImageStyle,
                                      backgroundImage:
                                        idCardBack instanceof File
                                          ? `url(${URL.createObjectURL(idCardBack)})`
                                          : idCardBack,
                                    }}
                                  ></div>
                                ) : (
                                  <img
                                    style={{ width: "100%", height: "200px" }}
                                    src={idCardBack}
                                    alt="Image"
                                  />
                                )}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div>
                          <h4
                            style={{
                              marginTop: "35px",
                              marginBottom: "10px",
                            }}
                          >
                            Upload front images of your valid driver's license.
                          </h4>
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
                                if (
                                  !e.target.files ||
                                  e.target.files.length === 0
                                )
                                  return;
                                setDrivingLicenseFront(e.target.files[0]);
                              }}
                            />
                            <div
                              onClick={() => {
                                document
                                  .getElementById("files-uploader-v2")
                                  .click();
                              }}
                              style={{
                                marginTop: "15px",
                                marginBottom: "20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "48%",
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
                                <FuseSvgIcon
                                  className="text-48 mr-10"
                                  size={24}
                                >
                                  heroicons-solid:cloud-upload
                                </FuseSvgIcon>
                                Choose images from gallery
                              </h3>
                            </div>

                            {drivingLicenseFront ? (
                              <div style={{ ...newImageStyle }}>
                                {drivingLicenseFront instanceof File ? (
                                  <div
                                    style={{
                                      ...new2ImageStyle,
                                      backgroundImage:
                                        drivingLicenseFront instanceof File
                                          ? `url(${URL.createObjectURL(drivingLicenseFront)})`
                                          : drivingLicenseFront,
                                    }}
                                  ></div>
                                ) : (
                                  <img
                                    style={{ width: "100%", height: "200px" }}
                                    src={drivingLicenseFront}
                                    alt="Image"
                                  />
                                )}
                              </div>
                            ) : null}
                          </div>
                        </div>
                        <div>
                          <h4
                            style={{
                              marginTop: "35px",
                              marginBottom: "10px",
                            }}
                          >
                            Upload back images of your valid driver's license.
                          </h4>
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
                              id="files-uploader-v6"
                              multiple
                              hidden
                              type="file"
                              onChange={(e) => {
                                if (
                                  !e.target.files ||
                                  e.target.files.length === 0
                                )
                                  return;
                                setDrivingLicenseBack(e.target.files[0]);
                              }}
                            />
                            <div
                              onClick={() => {
                                document
                                  .getElementById("files-uploader-v6")
                                  .click();
                              }}
                              style={{
                                marginTop: "15px",
                                marginBottom: "20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "48%",
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
                                <FuseSvgIcon
                                  className="text-48 mr-10"
                                  size={24}
                                >
                                  heroicons-solid:cloud-upload
                                </FuseSvgIcon>
                                Choose images from gallery
                              </h3>
                            </div>

                            {drivingLicenseBack ? (
                              <div style={{ ...newImageStyle }}>
                                {drivingLicenseBack instanceof File ? (
                                  <div
                                    style={{
                                      ...new2ImageStyle,
                                      backgroundImage:
                                        drivingLicenseBack instanceof File
                                          ? `url(${URL.createObjectURL(drivingLicenseBack)})`
                                          : drivingLicenseBack,
                                    }}
                                  ></div>
                                ) : (
                                  <img
                                    style={{ width: "100%", height: "200px" }}
                                    src={drivingLicenseBack}
                                    alt="Image"
                                  />
                                )}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h1 className="text-[20px] font-semibold mt-10 text-[#060811]">
                        Vehicle Details
                      </h1>
                      <StatusSelect
                        label="Vehicle Type*"
                        value={VehicleType}
                        onChange={setVehicleType}
                        menuItems={VehicleTypeMenuItems}
                      ></StatusSelect>
                      <div>
                        <StatusSelect
                          label="Vehicle CC*"
                          value={vehicleCC}
                          onChange={setVehicleCC}
                          menuItems={VehicleCCMenuItems}
                        ></StatusSelect>
                      </div>

                      <InputField
                        label="Vehicle Plate Number*"
                        value={vehiclePlateNo}
                        onChange={setVehiclePlateNo}
                        type="text"
                      />
                    </div>

                    <div>
                      <div>
                        <div
                          style={{
                            marginTop: "35px",
                            marginBottom: "10px",
                          }}
                        >
                          Upload circulation Permit
                        </div>
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
                            id="files-uploader-v7"
                            multiple
                            hidden
                            type="file"
                            onChange={(e) => {
                              if (
                                !e.target.files ||
                                e.target.files.length === 0
                              )
                                return;
                              setCirculationPermit(e.target.files[0]);
                            }}
                          />
                          <div
                            onClick={() => {
                              document
                                .getElementById("files-uploader-v7")
                                .click();
                            }}
                            style={{
                              marginTop: "15px",
                              marginBottom: "20px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "48%",
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
                              Choose Image from gallery
                            </h3>
                          </div>

                          {circulationPermit ? (
                            <div style={{ ...newImageStyle }}>
                              {circulationPermit instanceof File ? (
                                <div
                                  style={{
                                    ...new2ImageStyle,
                                    backgroundImage:
                                      circulationPermit instanceof File
                                        ? `url(${URL.createObjectURL(circulationPermit)})`
                                        : circulationPermit,
                                  }}
                                ></div>
                              ) : (
                                <img
                                  style={{ width: "100%", height: "200px" }}
                                  src={circulationPermit}
                                  alt="Image"
                                />
                              )}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div>
                        <InputField
                          label="  Valid Till"
                          value={circulationValidDate}
                          onChange={setCirculationValidDate}
                          type="date"
                        />
                      </div>
                    </div>

                    <div>
                      <div>
                        <div
                          style={{
                            marginTop: "35px",
                            marginBottom: "10px",
                          }}
                        >
                          Upload vehicle Insurance
                        </div>
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
                            id="files-uploader-v9"
                            multiple
                            hidden
                            type="file"
                            onChange={(e) => {
                              if (
                                !e.target.files ||
                                e.target.files.length === 0
                              )
                                return;
                              setVehicleInsurance(e.target.files[0]);
                            }}
                          />
                          <div
                            onClick={() => {
                              document
                                .getElementById("files-uploader-v9")
                                .click();
                            }}
                            style={{
                              marginTop: "15px",
                              marginBottom: "20px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "48%",
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
                              Choose Image from gallery
                            </h3>
                          </div>

                          {vehicleInsurance ? (
                            <div style={{ ...newImageStyle }}>
                              {vehicleInsurance instanceof File ? (
                                <div
                                  style={{
                                    ...new2ImageStyle,
                                    backgroundImage:
                                      vehicleInsurance instanceof File
                                        ? `url(${URL.createObjectURL(vehicleInsurance)})`
                                        : vehicleInsurance,
                                  }}
                                ></div>
                              ) : (
                                <img
                                  style={{ width: "100%", height: "200px" }}
                                  src={vehicleInsurance}
                                  alt="Image"
                                />
                              )}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div>
                        <InputField
                          label="  Valid Till"
                          value={insuranceValidDate}
                          onChange={setInsuranceValidDate}
                          type="date"
                        />
                      </div>
                    </div>

                    <div>
                      <div>
                        <div
                          style={{
                            marginTop: "35px",
                            marginBottom: "10px",
                          }}
                        >
                          Upload Certificate
                        </div>
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
                            id="files-uploader-v8"
                            multiple
                            hidden
                            type="file"
                            onChange={(e) => {
                              if (
                                !e.target.files ||
                                e.target.files.length === 0
                              )
                                return;
                              setCertificate(e.target.files[0]);
                            }}
                          />
                          <div
                            onClick={() => {
                              document
                                .getElementById("files-uploader-v8")
                                .click();
                            }}
                            style={{
                              marginTop: "15px",
                              marginBottom: "20px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "48%",
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
                              Choose Image from gallery
                            </h3>
                          </div>

                          {certificate ? (
                            <div style={{ ...newImageStyle }}>
                              {certificate instanceof File ? (
                                <div
                                  style={{
                                    ...new2ImageStyle,
                                    backgroundImage:
                                      certificate instanceof File
                                        ? `url(${URL.createObjectURL(certificate)})`
                                        : certificate,
                                  }}
                                ></div>
                              ) : (
                                <img
                                  style={{ width: "100%", height: "200px" }}
                                  src={certificate}
                                  alt="Image"
                                />
                              )}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div>
                        <InputField
                          label="  Valid Till"
                          value={certificateValidDate}
                          onChange={setCertificateValidDate}
                          type="date"
                        />
                      </div>
                    </div>
                  </section>
                </div>
              }
            />
          )}

          {IsRiderViewDialogOpen && (
            <DialogWrapper
              isOpen={IsRiderViewDialogOpen}
              onClose={() => setIsRiderViewDialogOpen(false)}
              title="View Rider"
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
                  <div className="w-full">

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
                            src={ProfileImage}
                            className="w-full h-[200px]"
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
                    <ViewDetails
                      heading="Name"
                      value={`${FirstName} ${LastName}`}
                    />
                    <ViewDetails heading="Id Number" value={idNumber} />
                    <ViewDetails heading="Email" value={Email} />
                    <ViewDetails heading="Phone Number" value={PhoneNo} />
                    <ViewDetails heading="City" value={City} />
                    <ViewDetails heading="Country Code" value={countryCode} />
                    <ViewDetails heading="Status" value={Status} />
                    <div className="w-full">

                      {idCardFront ? (
                        <div style={{ ...newImageStyle }}>
                          {idCardFront instanceof File ? (
                            <div
                              style={{
                                ...new2ImageStyle,
                                backgroundImage:
                                  idCardFront instanceof File
                                    ? `url(${URL.createObjectURL(idCardFront)})`
                                    : idCardFront,
                              }}
                            ></div>
                          ) : (
                            <img
                              className="w-full h-[200px]"
                              src={idCardFront}
                              alt="Image"
                            />
                          )}
                        </div>
                      ) : null}
                    </div>
                    <div className="w-full my-5">

                      {idCardBack ? (
                        <div style={{ ...newImageStyle }}>
                          {idCardBack instanceof File ? (
                            <div
                              style={{
                                ...new2ImageStyle,
                                backgroundImage:
                                  idCardBack instanceof File
                                    ? `url(${URL.createObjectURL(idCardBack)})`
                                    : idCardBack,
                              }}
                            ></div>
                          ) : (
                            <img
                              className="w-full h-[200px]"
                              src={idCardBack}
                              alt="Image"
                            />
                          )}
                        </div>
                      ) : null}
                    </div>
                    <div className="w-full my-5">

                      {drivingLicenseFront ? (
                        <div style={{ ...newImageStyle }}>
                          {drivingLicenseFront instanceof File ? (
                            <div
                              style={{
                                ...new2ImageStyle,
                                backgroundImage:
                                  drivingLicenseFront instanceof File
                                    ? `url(${URL.createObjectURL(drivingLicenseFront)})`
                                    : drivingLicenseFront,
                              }}
                            ></div>
                          ) : (
                            <img
                              className="w-full h-[200px]"
                              src={drivingLicenseFront}
                              alt="Image"
                            />
                          )}
                        </div>
                      ) : null}
                    </div>
                    <div className="w-full my-5">

                      {drivingLicenseBack ? (
                        <div style={{ ...newImageStyle }}>
                          {drivingLicenseBack instanceof File ? (
                            <div
                              style={{
                                ...new2ImageStyle,
                                backgroundImage:
                                  drivingLicenseBack instanceof File
                                    ? `url(${URL.createObjectURL(drivingLicenseBack)})`
                                    : drivingLicenseBack,
                              }}
                            ></div>
                          ) : (
                            <img
                              className="w-full h-[200px]"
                              src={drivingLicenseBack}
                              alt="Image"
                            />
                          )}
                        </div>
                      ) : null}
                    </div>

                    <ViewDetails heading="Vehicle Plate No" value={vehiclePlateNo} />
                    <ViewDetails heading="Vehicle CC" value={vehicleCC} />
                    <ViewDetails heading="Vehicle Type" value={VehicleType} />
                    <div className="w-full my-5">

                      {circulationPermit ? (
                        <div style={{ ...newImageStyle }}>
                          {circulationPermit instanceof File ? (
                            <div
                              style={{
                                ...new2ImageStyle,
                                backgroundImage:
                                  circulationPermit instanceof File
                                    ? `url(${URL.createObjectURL(circulationPermit)})`
                                    : circulationPermit,
                              }}
                            ></div>
                          ) : (
                            <img
                              className="w-full h-[200px]"
                              src={circulationPermit}
                              alt="Image"
                            />
                          )}
                        </div>

                      ) : null}
                    </div>
                    <ViewDetails heading="Circulation Permit" value={circulationValidDate} />
                    <div className="w-full my-5">

                      {vehicleInsurance ? (
                        <div style={{ ...newImageStyle }}>
                          {vehicleInsurance instanceof File ? (
                            <div
                              style={{
                                ...new2ImageStyle,
                                backgroundImage:
                                  vehicleInsurance instanceof File
                                    ? `url(${URL.createObjectURL(vehicleInsurance)})`
                                    : vehicleInsurance,
                              }}
                            ></div>
                          ) : (
                            <img
                              className="w-full h-[200px]"
                              src={vehicleInsurance}
                              alt="Image"
                            />
                          )}
                        </div>

                      ) : null}
                    </div>
                    <ViewDetails heading="Circulation Permit" value={insuranceValidDate} />
                    <div className="w-full my-5">

                      {certificate ? (
                        <div style={{ ...newImageStyle }}>
                          {certificate instanceof File ? (
                            <div
                              style={{
                                ...new2ImageStyle,
                                backgroundImage:
                                  certificate instanceof File
                                    ? `url(${URL.createObjectURL(certificate)})`
                                    : certificate,
                              }}
                            ></div>
                          ) : (
                            <img
                              className="w-full h-[200px]"
                              src={certificate}
                              alt="Image"
                            />
                          )}
                        </div>

                      ) : null}
                    </div>
                    <ViewDetails heading="Circulation Permit" value={certificateValidDate} />

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

export default RiderUsers;
