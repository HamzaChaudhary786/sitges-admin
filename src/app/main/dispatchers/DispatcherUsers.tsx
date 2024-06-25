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
import { useDevice } from "src/helpers/useDevice";
import { showMessage } from "@fuse/core/FuseMessage/store/fuseMessageSlice";
import {
  getDispatcherUsersAction,
  selectDispatchers,
  deleteDispatcherAction,
  updateOldDispatcherAction,
  // DispatcherUsers,
  // saveNewDispatcherAction,

  // UserStatus,
  setDispatchers,
  saveNewDispatcherAction,
  connectDipatcherToVendor,
} from "app/store/dispatcherSlice";
import { getCustomersAction, selectCustomers } from "app/store/customerSlice";

import { FormControl } from "@mui/base";
import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  UserStatusMenuItems,
} from "src/helpers/constants";
import { string } from "zod";
import ViewDetails from "src/helpers/ViewDetails";
import { getVendorUsersAction, selectVendors } from "app/store/vendorSlice";
import FilterForm from "src/helpers/FilterForm";
import InputField from "src/helpers/InputField";
import StatusSelect from "src/helpers/StatusSelect";
// import UserStatusSelect from "src/helpers/UserStatusSelect";
import {
  UserStatus,
  Dispatchers,
  UpdateDispatcherUsers,
} from "src/helpers/entities";

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

function DispatcherUsers() {
  const { IsMob, IsTab, IsWeb } = useDevice();
  const dispatch = useAppDispatch();
  const [EditDispatcherDialogOpen, setEditDispatcherDialogOpen] =
    useState(false);
  const [IsEditDispatcherDialogOpen, setIsEditDispatcherDialogOpen] =
    useState(false);
  const [IsLoadingData, setIsLoadingData] = useState(true);
  const [IsDispatcherViewDialogOpen, setIsDispatcherViewDialogOpen] =
    useState(false);
  const [IsAddDispatcherDialogOpen, setIsAddDispatcherDialogOpen] =
    useState(false);

  const [DispatcherBeingViewed, setDispatcherBeingViewed] = useState<
    null | string
  >(null);
  const [DispatcherBeingDeletedId, setDispatcherBeingDeletedId] = useState<
    null | string
  >(null);
  const [DispatcherBeingUpdatedId, setDispatcherBeingUpdatedId] = useState<
    null | string
  >(null);

  let dispatcherUsersData = useSelector(selectDispatchers);
  let vendors = useSelector(selectVendors);

  const [FilterName, setFilterName] = useState("");
  const [FilterEmail, setFilterEmail] = useState("");
  const [FilterStatus, setFilterStatus] = useState("");
  const [SelectedVendor, setSelectedVendor] = useState<any>(null);

  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");
  const [Status, setStatus] = useState<any>(UserStatus.Active);
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  const [ErrorMsg, setErrorMsg] = useState("");

  const [IsLoadingDialog, setIsLoadingDialog] = useState(false);

  const [FilteredData, setFilteredData] = useState<any>(dispatcherUsersData);
  const [FilteredVendor, setFilteredVendor] = useState<any>(vendors);
  const [IsEditing, setIsEditing] = useState(false);
  const [IsView, setIsView] = useState(false);

  const [DispatcherBeingEditedId, setDispatcherBeingEditedId] = useState<
    null | string
  >(null);

  useEffect(() => {
    getDispatchers();
    getVendors();
  }, []);

  useEffect(() => {
    setFilteredData(dispatcherUsersData);
  }, [dispatcherUsersData]);

  useEffect(() => {
    const filteredData = vendors.filter((vendor) => !vendor.dispatcher);
    setFilteredVendor(filteredData);
  }, [vendors]);

  useEffect(() => {
    let dispatcher;
    if (DispatcherBeingEditedId && dispatcherUsersData) {
      dispatcher = dispatcherUsersData.find(
        (p) => p.id === DispatcherBeingEditedId,
      );
      if (dispatcher) {
        setName(dispatcher.name);
        setEmail(dispatcher.email);
        setPhone(dispatcher.phone);
        setStatus(dispatcher.status);
      }
    }
  }, [dispatcherUsersData, DispatcherBeingEditedId]);

  useEffect(() => {
    if (!IsAddDispatcherDialogOpen) {
      setName("");
      setEmail("");
      setPhone("");
      setStatus("");
      setDispatcherBeingEditedId("");
    }
  }, [IsAddDispatcherDialogOpen]);

  async function initEdit(id: string) {
    setIsAddDispatcherDialogOpen(true);
    setDispatcherBeingEditedId(id);
    setEditDispatcherDialogOpen(true);
    setIsEditing(true);
  }
  async function initView(id: string) {
    setIsDispatcherViewDialogOpen(true);
    setDispatcherBeingViewed(id);
  }

  async function getDispatchers() {
    setIsLoadingData(true);
    await dispatch(getDispatcherUsersAction());
    setIsLoadingData(false);
  }

  const handleVendorChange = (_, newValue) => {
    setSelectedVendor(newValue);
  };

  async function getVendors() {
    setIsLoadingData(true);
    await dispatch(getVendorUsersAction());
    setIsLoadingData(false);
  }

  async function ConnectDispatcher() {
    if (SelectedVendor && DispatcherBeingEditedId) {
      const response = await dispatch(
        connectDipatcherToVendor(SelectedVendor.id, {
          dispatcherId: DispatcherBeingEditedId,
        }),
      );
      if (response !== ("Dispatcher Connected successfully" as any))
        throw response;
      getVendors();
    }
  }
  // async function deleteDispatcher(id: string) {
  //   setDispatcherBeingDeletedId(id);
  //   await dispatch(deleteDispatcherAction(id));
  //   await dispatch(getDispatcherUsersAction());
  //   setDispatcherBeingDeletedId(null);
  // }

  async function updateDispatcherStatus(id: string, newStatus: string) {
    setDispatcherBeingUpdatedId(id);
    // await dispatch(updateOldDispatcherAction(id, { status: newStatus }));
    await dispatch(getDispatcherUsersAction());
    setDispatcherBeingUpdatedId(null);
  }

  async function ApplyFilter() {
    await dispatch(getDispatcherUsersAction);

    const filteredData = dispatcherUsersData.filter((user) => {
      const emailMatch =
        !FilterEmail ||
        user.email.toLowerCase().includes(FilterEmail.toLowerCase());
      const statusMatch = !FilterStatus || user.status === FilterStatus;
      const nameMatch =
        !FilterName ||
        user.name.toLowerCase().includes(FilterName.toLowerCase());

      return emailMatch && statusMatch && nameMatch;
    });

    setFilteredData(filteredData);
    dispatch(setDispatchers(filteredData));
  }

  async function ApproveDispatcher(id: string) {
    await dispatch(
      updateOldDispatcherAction(id, { status: UserStatus.Active }),
    );
    await dispatch(getDispatcherUsersAction());
  }

  async function RejectDispatcher(id: string) {
    await dispatch(
      updateOldDispatcherAction(id, { status: UserStatus.Inactive }),
    );
    await dispatch(getDispatcherUsersAction());
  }

  async function BlockDispatcher(id: string) {
    await dispatch(
      updateOldDispatcherAction(id, { status: UserStatus.Blocked }),
    );
    await dispatch(getDispatcherUsersAction());
  }

  async function updateDispatcher() {
    try {
      if (!Name || !Email || !Phone || !Status)
        throw "Please fill all the required fields";

      setErrorMsg("");
      setIsLoadingDialog(true);

      const body: UpdateDispatcherUsers = {
        name: Name,
        email: Email,
        phone: Phone,
        status: Status,
      };

      ConnectDispatcher();

      const response = await dispatch(
        updateOldDispatcherAction(DispatcherBeingEditedId, body),
      );

      if (response !== ("Updated successfully" as any)) throw response;
      await dispatch(getDispatcherUsersAction());
      setIsLoadingDialog(false);
      setEditDispatcherDialogOpen(false);
      setIsEditDispatcherDialogOpen(false);
      setIsView(false);
      dispatch(
        showMessage({
          message: "Dispatcher updated successfully!", //text or html
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

  async function saveDispatcher() {
    try {
      if (!Name || !Email || !Phone || !Status || !Password || !ConfirmPassword)
        throw "Please fill all the required fields";

      if (Password !== ConfirmPassword) throw "Passwords doesn't match";

      setErrorMsg("");
      setIsLoadingDialog(true);

      const body: Partial<Dispatchers> = {
        name: Name,
        email: Email,
        phone: Phone,
        password: Password,
        status: Status,
      };

      const id = await dispatch(saveNewDispatcherAction(body));
      if (id != ("Dispatcher Added successfully" as any)) throw id;

      await dispatch(getDispatcherUsersAction());
      setIsLoadingDialog(false);
      setIsAddDispatcherDialogOpen(false);
      dispatch(
        showMessage({
          message: "Dispatcher added successfully!", //text or html
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
          <h1>Dispatchers</h1>
        </div>
      }
      content={
        <div className="p-24 w-full">
          <Button
            variant="contained"
            className="mb-10"
            color="primary"
            onClick={() => {
              setIsEditDispatcherDialogOpen(false);
              setIsView(false);
              setIsAddDispatcherDialogOpen(true);
            }}
          >
            <AddCircleOutlineIcon /> Add Dispatcher
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

          <br />

          <h1 style={{ marginTop: "50px", marginBottom: "10px" }}>
            Dispatcher List :
          </h1>

          <TableComp
            data={FilteredData}
            isLoading={IsLoadingData}
            // rowsToShow={5}
            columns={[
              {
                Heading: "Name",
                accessor: `name`,
              },
              {
                Heading: "Email",
                accessor: "email",
              },
              {
                Heading: "Phone No",
                accessor: `phone`,
              },

              {
                Heading: "Status",
                accessor: "status",
              },
              {
                Heading: "Actions",
                Cell: (row: Dispatchers, index) => {
                  if (DispatcherBeingDeletedId === row.id)
                    return <CircularProgress />;
                  return (
                    <>
                      {row.status === "Pending" ? (
                        <>
                          <IconButton
                            onClick={() => ApproveDispatcher(row.id)}
                            className="mt-4 mr-5"
                          >
                            <CheckCircleIcon color="success" />
                          </IconButton>

                          <IconButton
                            onClick={() => RejectDispatcher(row.id)}
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
                          {row.status !== UserStatus.Blocked ? (
                            <IconButton
                              onClick={() => BlockDispatcher(row.id)}
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

          {IsAddDispatcherDialogOpen && (
            <DialogWrapper
              isOpen={IsAddDispatcherDialogOpen}
              onClose={() => setIsAddDispatcherDialogOpen(false)}
              title={!IsEditing ? "Add Dispatcher" : "Update Dispatcher"}
              maxWidth="lg"
              errorMsg={ErrorMsg}
              isLoadingActions={IsLoadingDialog}
              onSave={() => {
                if (IsEditing) {
                  updateDispatcher();
                } else {
                  saveDispatcher();
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
                      label="Name*"
                      value={Name}
                      onChange={setName}
                      type="text"
                    />
                    <InputField
                      label="Email*"
                      value={Email}
                      onChange={setEmail}
                      type="email"
                    />
                    <InputField
                      label="Phone*"
                      value={Phone}
                      onChange={setPhone}
                      type="text"
                    />

                    {IsEditing ? (
                      <>
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          style={{ marginTop: "25px" }}
                          options={FilteredVendor}
                          getOptionLabel={(vendor) => vendor.email}
                          value={SelectedVendor}
                          onChange={handleVendorChange}
                          sx={{ width: "48%" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="connect this Dispatcher With Vendor"
                            />
                          )}
                        />
                      </>
                    ) : (
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
                      label="status*"
                      value={Status}
                      onChange={setStatus}
                      menuItems={UserStatusMenuItems}
                    ></StatusSelect>
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

export default DispatcherUsers;
