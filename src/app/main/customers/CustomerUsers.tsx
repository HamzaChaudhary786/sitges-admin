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
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useSelector } from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useAppDispatch } from "app/store/store";
import { TableComp } from "app/shared-components/TableComp";
import {
  closeDialog,
  openDialog,
} from "@fuse/core/FuseDialog/store/fuseDialogSlice";
import { useDevice } from "src/helpers/useDevice";
import { showMessage } from "@fuse/core/FuseMessage/store/fuseMessageSlice";
import {
  getCustomersAction,
  getEnterpriseCustomersAction,
  saveNewCustomerAction,
  selectCustomers,
  updateOldCustomerAction,
} from "app/store/customerSlice";
import { Customers, UserStatus } from "../../../helpers/entities";
import { FormControl } from "@mui/base";
import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  YesNoMenuItems,
} from "src/helpers/constants";
import { string } from "zod";
import ViewDetails from "src/helpers/ViewDetails";
import InputField from "src/helpers/InputField";
import StatusSelect from "src/helpers/StatusSelect";
import { useParams } from "react-router-dom";
import MultiField from "src/helpers/MultiField";
import { useNavigate } from "react-router-dom";

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

function CustomerUsers() {
  const navigate = useNavigate();

  const { IsMob, IsTab, IsWeb } = useDevice();
  const { eId } = useParams();

  const dispatch = useAppDispatch();
  const [IsCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [IsEditAdminDialogOpen, setIsEditAdminDialogOpen] = useState(false);
  const [IsLoadingData, setIsLoadingData] = useState(true);
  const [IsAddCustomerDialogOpen, setIsAddCustomerDialogOpen] = useState(false);
  const [IsEditing, setIsEditing] = useState(false);

  const [CustomerBeingEditedId, setCustomerBeingEditedId] = useState<
    null | string
  >(null);
  const [CustomerBeingViewed, setCustomerBeingViewed] = useState<null | string>(
    null,
  );

  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [PhoneNo, setPhoneNo] = useState("");
  const [ReferralCode, setReferralCode] = useState("");
  const [Birthday, setBirthday] = useState("");
  const [Nationality, setNationality] = useState("");
  const [LivesInSitges, setLivesInSitges] = useState(false);
  const [Bio, setBio] = useState("");
  const [CountryCode, setCountryCode] = useState("");
  const [VisitFromDate, setVisitFromDate] = useState(null);
  const [VisitToDate, setVisitToDate] = useState(null);
  const [VisitReason, setVisitReason] = useState(null);
  const [VisitStayType, setVisitStayType] = useState(null);
  const [VisitWith, setVisitWith] = useState(null);
  const [Status, setStatus] = useState("");
  const [IsBasicUserProfileCompleted, setIsBasicUserProfileCompleted] =
    useState(true);
  const [Types, setTypes] = useState([]);
  const [MasterId, setMasterId] = useState("");
  const [EnterpriseId, setEnterpriseId] = useState("");
  const [UserSystemId, setUserSystemId] = useState("");
  const [IsPreLaunchUser, setIsPreLaunchUser] = useState(false);
  const [ErrorMsg, setErrorMsg] = useState("");
  const [IsLoadingDialog, setIsLoadingDialog] = useState(false);

  const [IsView, setIsView] = useState(false);

  const customersData = useSelector(selectCustomers);

  useEffect(() => {
    getCustomers();
    if (eId) {
      setEnterpriseId(eId);
    }
  }, []);

  useEffect(() => {
    let customer;
    if (
      (CustomerBeingViewed && customersData) ||
      (CustomerBeingEditedId && customersData)
    ) {
      if (CustomerBeingViewed)
        customer = customersData.find((p) => p.id === CustomerBeingViewed);
      else if (CustomerBeingEditedId)
        customer = customersData.find((p) => p.id === CustomerBeingEditedId);

      if (customer) {
        setFirstName(customer.firstName);
        setLastName(customer.lastName);
        setEmail(customer.email);
        setPhoneNo(customer.phoneNo);
        setReferralCode(customer.referralCode);
        setBirthday(customer.birthday);
        setNationality(customer.nationality);
        setLivesInSitges(customer.livesInSitges);
        setBio(customer.bio);
        setCountryCode(customer.countryCode);
        setVisitFromDate(customer.visitFromDate);
        setVisitToDate(customer.visitToDate);
        setVisitReason(customer.visitReason);
        setVisitStayType(customer.visitStayType);
        setVisitWith(customer.visitWith);
        setStatus(customer.status);
        setIsBasicUserProfileCompleted(customer.isBasicUserProfileCompleted);
        setTypes(customer.types);
        setMasterId(customer.masterId);
        setEnterpriseId(customer.enterpriseId);
        setUserSystemId(customer.userSystemId);
        setIsPreLaunchUser(customer.isPreLaunchUser);
      }
    }
  }, [CustomerBeingViewed, customersData, CustomerBeingEditedId]);

  const DefaultValuesToState = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhoneNo("");
    setReferralCode(null);
    setBirthday("");
    setPassword("");
    setNationality("");
    setLivesInSitges(false);
    setBio("");
    setCountryCode("");
    setVisitFromDate(null);
    setVisitToDate(null);
    setVisitReason(null);
    setVisitStayType(null);
    setVisitWith(null);
    setStatus("");
    setIsBasicUserProfileCompleted(true);
    setTypes([]);
    setMasterId("");
    // setEnterpriseId("");
    setUserSystemId("");
    setIsPreLaunchUser(false);
    setErrorMsg("");
    setIsLoadingDialog(false);
    setCustomerBeingEditedId(null);
    setCustomerBeingViewed(null);
    setIsEditing(false);
  };

  useEffect(() => {
    if (!IsAddCustomerDialogOpen) {
      DefaultValuesToState();
    }
  }, [IsAddCustomerDialogOpen]);

  useEffect(() => {
    if (!IsCustomerDialogOpen) {
      DefaultValuesToState();
    }
  }, [IsCustomerDialogOpen]);

  const handleCloseViewDialog = () => {
    setIsCustomerDialogOpen(false);
  };

  async function initView(id: string) {
    setIsView(true);
    setIsCustomerDialogOpen(true);
    setCustomerBeingViewed(id);
  }

  async function initEdit(id: string) {
    setIsAddCustomerDialogOpen(true);
    setCustomerBeingEditedId(id);
    setIsEditing(true);
  }

  const handleBack = () => {
    navigate(-1); // navigates to the previous page
  };

  async function updateCustomerStatus(id: string, newStatus: UserStatus) {
    setCustomerBeingEditedId(id);
    await dispatch(updateOldCustomerAction(id, { status: newStatus }));
    if (!eId) await dispatch(getCustomersAction());
    else await dispatch(getEnterpriseCustomersAction(eId));
    setCustomerBeingEditedId(null);
  }

  async function updateCustomer() {
    try {
      if (
        !FirstName ||
        !LastName ||
        !Email ||
        !PhoneNo ||
        !Birthday ||
        !Nationality ||
        LivesInSitges === null ||
        LivesInSitges === undefined
      )
        throw "Please fill all the required fields";

      setErrorMsg("");
      setIsLoadingDialog(true);

      const body: Partial<Customers> = {
        firstName: FirstName,
        lastName: LastName,
        email: Email,
        phoneNo: PhoneNo,
        birthday: Birthday,
        nationality: Nationality,
        livesInSitges: LivesInSitges,
        bio: Bio,
        countryCode: CountryCode,
        visitFromDate: VisitFromDate,
        visitToDate: VisitToDate,
        visitReason: VisitReason,
        visitStayType: VisitStayType,
        visitWith: VisitWith,
        // enterpriseId : EnterpriseId
      };

      const response = await dispatch(
        updateOldCustomerAction(CustomerBeingEditedId, body),
      );

      if (response !== ("Updated successfully" as any)) throw response;
      if (!eId) await dispatch(getCustomersAction());
      else await dispatch(getEnterpriseCustomersAction(eId));
      setIsLoadingDialog(false);
      setIsAddCustomerDialogOpen(false);
      setIsView(false);
      dispatch(
        showMessage({
          message: "Customer updated successfully!", //text or html
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

  async function saveCustomer() {
    try {
      if (
        !FirstName ||
        !LastName ||
        !Email ||
        !PhoneNo ||
        !Password ||
        !ConfirmPassword ||
        !Birthday ||
        !FirstName ||
        !LastName ||
        !Nationality ||
        LivesInSitges === null ||
        LivesInSitges === undefined
      )
        throw "Please fill all the required fields";

      if (Password !== ConfirmPassword) throw "Passwords doesn't match";

      setErrorMsg("");
      setIsLoadingDialog(true);

      const body: Partial<Customers> = {
        firstName: FirstName,
        lastName: LastName,
        email: Email,
        phoneNo: PhoneNo,
        password: Password,
        referralCode: ReferralCode,
        birthday: Birthday,
        nationality: Nationality,
        livesInSitges: LivesInSitges,
        bio: Bio,
        countryCode: CountryCode,
        visitFromDate: VisitFromDate,
        visitToDate: VisitToDate,
        visitReason: VisitReason,
        visitStayType: VisitStayType,
        visitWith: VisitWith,
        enterpriseId: EnterpriseId,
      };

      const id = await dispatch(saveNewCustomerAction(body));
      if (id != ("User Added successfully" as any)) throw id;

      if (!eId) await dispatch(getCustomersAction());
      else await dispatch(getEnterpriseCustomersAction(eId));
      setIsLoadingDialog(false);
      setIsAddCustomerDialogOpen(false);
      dispatch(
        showMessage({
          message: "Customer added successfully!", //text or html
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

  async function getCustomers() {
    setIsLoadingData(true);
    if (!eId) await dispatch(getCustomersAction());
    else await dispatch(getEnterpriseCustomersAction(eId));
    setIsLoadingData(false);
  }

  return (
    <Root
      header={
        eId ? (
          <div style={{ display: "flex" }}>
            <IconButton onClick={handleBack}>
              <ArrowBackIcon style={{ cursor: "pointer" }} />
            </IconButton>
            <h1 className="p-24">Customers In Enterprise E{eId}</h1>
          </div>
        ) : (
          <div className="p-24">
            <h1>Customers</h1>
          </div>
        )
      }
      content={
        <div className="p-24 w-full">
          <Button
            variant="contained"
            className="mb-10"
            color="primary"
            onClick={() => {
              // setIsEditCustomerDialogOpen(false);
              setIsView(false);
              setIsAddCustomerDialogOpen(true);
            }}
          >
            <AddCircleOutlineIcon /> Add Customer
          </Button>
          <br />

          <h1 style={{ marginTop: "50px", marginBottom: "50px" }}>
            Customers List :
          </h1>
          <TableComp
            data={customersData}
            isLoading={IsLoadingData}
            // rowsToShow={5}
            columns={[
              {
                Heading: "First Name",
                accessor: "firstName",
              },
              {
                Heading: "Last Name",
                accessor: "lastName",
              },
              {
                Heading: "Email",
                accessor: "email",
              },
              {
                Heading: "Phone Number",
                accessor: "phoneNo",
              },
              {
                Heading: "Status",
                Cell: (row: Customers, index) => {
                  if (CustomerBeingEditedId === row.id)
                    return <CircularProgress />;
                  return (
                    <>
                      <IconButton
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          dispatch(
                            openDialog({
                              children: (
                                <>
                                  <DialogTitle id="alert-dialog-title">
                                    Are you sure you want to{" "}
                                    {row.status === "Blocked"
                                      ? "Active"
                                      : "Blocked"}{" "}
                                    "{row.firstName}"?
                                  </DialogTitle>
                                  <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                      {row.status === "Blocked"
                                        ? "This action will activate the product and it will not be visible to the users"
                                        : "This action will blocked the admin and it will be not visible to the users"}
                                    </DialogContentText>
                                  </DialogContent>
                                  <DialogActions>
                                    <Button
                                      onClick={() => dispatch(closeDialog())}
                                      color="primary"
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        updateCustomerStatus(
                                          row.id,
                                          row.status === UserStatus.Blocked
                                            ? UserStatus.Active
                                            : UserStatus.Blocked,
                                        );
                                        dispatch(closeDialog());
                                      }}
                                      color={
                                        row.status === "Blocked"
                                          ? "success"
                                          : "error"
                                      }
                                      autoFocus
                                    >
                                      {row.status === "Blocked"
                                        ? "Active"
                                        : "Blocked"}
                                    </Button>
                                  </DialogActions>
                                </>
                              ),
                            }),
                          )
                        }
                      >
                        <Chip
                          label={row.status === "Active" ? "Active" : "Blocked"}
                          color={row.status === "Active" ? "success" : "error"}
                        />
                      </IconButton>
                    </>
                  );
                },
              },
              {
                Heading: "Actions",
                Cell: (row: Customers, index) => {
                  return (
                    <>
                      <IconButton
                        onClick={() => initView(row.id)}
                        className="mt-4 mr-5"
                      >
                        <VisibilityIcon color="primary" />
                      </IconButton>
                      <IconButton
                        onClick={() => initEdit(row.id)}
                        className="mt-4 mr-5"
                      >
                        <EditIcon color="primary" />
                      </IconButton>
                    </>
                  );
                },
              },
            ]}
          />

          {IsCustomerDialogOpen && (
            <DialogWrapper
              isOpen={IsCustomerDialogOpen}
              onClose={handleCloseViewDialog}
              title="View Customer"
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
                    <ViewDetails
                      heading="Name"
                      value={`${FirstName} ${LastName}`}
                    ></ViewDetails>
                    <ViewDetails
                      heading="Email"
                      value={`${Email}`}
                    ></ViewDetails>
                    <ViewDetails
                      heading="Phone Number"
                      value={`${PhoneNo}}`}
                    ></ViewDetails>
                    <ViewDetails
                      heading="Referral Code"
                      value={`${ReferralCode}`}
                    ></ViewDetails>
                    <ViewDetails
                      heading="Birthday"
                      value={`${Birthday} `}
                    ></ViewDetails>
                    <ViewDetails
                      heading="Nationality"
                      value={`${Nationality}`}
                    ></ViewDetails>
                    <ViewDetails heading="Bio" value={`${Bio}`}></ViewDetails>
                    <ViewDetails
                      heading="Country Code"
                      value={`${CountryCode}`}
                    ></ViewDetails>
                    <ViewDetails
                      heading="Lives in Sitges"
                      value={`${LivesInSitges}`}
                    ></ViewDetails>

                    {LivesInSitges ? (
                      <>
                        <ViewDetails
                          heading="Visit From Date"
                          value={`${VisitFromDate}`}
                        ></ViewDetails>
                        <ViewDetails
                          heading="Visit To Date"
                          value={`${VisitToDate}`}
                        ></ViewDetails>
                        <ViewDetails
                          heading="Visit Reason"
                          value={`${VisitReason}`}
                        ></ViewDetails>
                        <ViewDetails
                          heading="Visit Stay Type"
                          value={`${VisitStayType}`}
                        ></ViewDetails>
                        <ViewDetails
                          heading="Visit With"
                          value={`${VisitWith}`}
                        ></ViewDetails>
                      </>
                    ) : (
                      <></>
                    )}

                    <ViewDetails
                      heading="Status"
                      value={`${Status}`}
                    ></ViewDetails>
                    <ViewDetails
                      heading="Is Basic User Profile Completed"
                      value={`${IsBasicUserProfileCompleted}`}
                    ></ViewDetails>
                    <ViewDetails
                      heading="Types"
                      value={`${Types.join(", ")}`}
                    ></ViewDetails>
                    <ViewDetails
                      heading="Master ID"
                      value={`${MasterId}`}
                    ></ViewDetails>
                    <ViewDetails
                      heading="Enterprise ID"
                      value={`${EnterpriseId}`}
                    ></ViewDetails>
                    <ViewDetails
                      heading="User System ID"
                      value={`${UserSystemId}`}
                    ></ViewDetails>
                    <ViewDetails
                      heading="Is Pre-Launch User"
                      value={`${IsPreLaunchUser}`}
                    ></ViewDetails>
                  </div>
                </div>
              }
            />
          )}

          {IsAddCustomerDialogOpen && (
            <DialogWrapper
              isOpen={IsAddCustomerDialogOpen}
              onClose={() => setIsAddCustomerDialogOpen(false)}
              title={!IsEditing ? "Add Customer" : "Update Customer"}
              maxWidth="lg"
              errorMsg={ErrorMsg}
              isLoadingActions={IsLoadingDialog}
              onSave={() => {
                if (IsEditing) {
                  updateCustomer();
                } else {
                  saveCustomer();
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
                      label="Email*"
                      value={Email}
                      onChange={setEmail}
                      type="email"
                    />

                    <InputField
                      label="Country Code*"
                      value={CountryCode}
                      onChange={setCountryCode}
                      type="text"
                    />
                    <InputField
                      label="Phone*"
                      value={PhoneNo}
                      onChange={setPhoneNo}
                      type="text"
                    />

                    <InputField
                      label="Refferal Code"
                      value={ReferralCode}
                      onChange={setReferralCode}
                      type="text"
                    />

                    {IsEditing ? null : (
                      <>
                        <InputField
                          label="Password*"
                          value={Password}
                          onChange={setPassword}
                          type="password"
                        />
                        <InputField
                          label=" Confirm Password*"
                          value={ConfirmPassword}
                          onChange={setConfirmPassword}
                          type="password"
                        />
                      </>
                    )}

                    <InputField
                      label="Birthday*"
                      value={Birthday}
                      onChange={setBirthday}
                      type="date"
                    />
                    <InputField
                      label="Nationality*"
                      value={Nationality}
                      onChange={setNationality}
                      type="text"
                    />
                    <MultiField label="Bio" value={Bio} onChange={setBio} />
                    <StatusSelect
                      label="Do You Live In Sitges?*"
                      value={LivesInSitges}
                      onChange={setLivesInSitges}
                      menuItems={YesNoMenuItems}
                    ></StatusSelect>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                    }}
                  >
                    {!LivesInSitges ? (
                      <>
                        <InputField
                          label="Visit From Date"
                          value={VisitFromDate}
                          onChange={setVisitFromDate}
                          type="datetime-local"
                        />
                        <InputField
                          label="Visit To Date"
                          value={VisitToDate}
                          onChange={setVisitToDate}
                          type="datetime-local"
                        />

                        <InputField
                          label="Visit Reason"
                          value={VisitReason}
                          onChange={setVisitReason}
                          type="text"
                        />
                        <InputField
                          label="Visit Stay Type"
                          value={VisitStayType}
                          onChange={setVisitStayType}
                          type="text"
                        />
                        <InputField
                          label="Visit stay With"
                          value={VisitWith}
                          onChange={setVisitWith}
                          type="text"
                        />
                      </>
                    ) : null}
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

export default CustomerUsers;
