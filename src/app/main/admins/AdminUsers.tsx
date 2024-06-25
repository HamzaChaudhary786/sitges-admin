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
import { useAppDispatch } from "app/store/store";
import { TableComp } from "app/shared-components/TableComp";
import {
  closeDialog,
  openDialog,
} from "@fuse/core/FuseDialog/store/fuseDialogSlice";
import { useDevice } from "src/helpers/useDevice";
import { showMessage } from "@fuse/core/FuseMessage/store/fuseMessageSlice";
import {
  getAdminUsersAction,
  selectAdmins,
  deleteAdminAction,
  updateOldAdminAction,
  saveNewAdminAction,
} from "app/store/adminsSlice";
import { AdminUsers, Admin, UpdateAdminUsers } from "../../../helpers/entities";
import { FormControl } from "@mui/base";
import { EMAIL_REGEX, PASSWORD_REGEX } from "src/helpers/constants";
import { string } from "zod";

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

function Admins() {
  const { IsMob, IsTab, IsWeb } = useDevice();
  const dispatch = useAppDispatch();
  const [IsAddAdminDialogOpen, setIsAddAdminDialogOpen] = useState(false);
  const [IsEditAdminDialogOpen, setIsEditAdminDialogOpen] = useState(false);
  const [IsLoadingData, setIsLoadingData] = useState(true);
  const [AdminBeingDeletedId, setAdminBeingDeletedId] = useState<null | string>(
    null,
  );
  const [AdminBeingUpdatedId, setAdminBeingUpdatedId] = useState<null | string>(
    null,
  );

  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [Status, setStatus] = useState("Active");
  const [ErrorMsg, setErrorMsg] = useState("");
  const [IsLoadingDialog, setIsLoadingDialog] = useState(false);

  const [IsEditing, setIsEditing] = useState(false);
  const [IsView, setIsView] = useState(false);

  const [AdminBeingEditedId, setAdminBeingEditedId] = useState<null | string>(
    null,
  );

  const adminUsersData = useSelector(selectAdmins);

  useEffect(() => {
    getAdmins();
  }, []);

  useEffect(() => {
    if (AdminBeingEditedId && adminUsersData) {
      const adminUser = adminUsersData.find((p) => p.id === AdminBeingEditedId);
      if (adminUser) {
        setName(adminUser.name);
        setEmail(adminUser.email);
        setStatus(adminUser.status);
      }
    }
  }, [AdminBeingEditedId, adminUsersData]);

  useEffect(() => {
    if (!IsAddAdminDialogOpen) {
      setName("");
      setEmail("");
      setStatus("Active");
      setPassword("");
      setConfirmPassword("");
      setErrorMsg("");
      setIsLoadingDialog(false);
      setIsEditing(false);
      setAdminBeingEditedId(null);
    }
  }, [IsAddAdminDialogOpen]);

  async function initEdit(id: string) {
    setIsEditAdminDialogOpen(true);
    setAdminBeingEditedId(id);
    setIsAddAdminDialogOpen(true);
    setIsEditing(true);
  }
  async function initView(id: string) {
    setIsView(true);
    setIsEditAdminDialogOpen(true);
    setAdminBeingEditedId(id);
    setIsAddAdminDialogOpen(true);
    setIsEditing(true);
  }

  async function getAdmins() {
    setIsLoadingData(true);
    await dispatch(getAdminUsersAction());
    setIsLoadingData(false);
  }

  async function deleteAdmin(id: string) {
    setAdminBeingDeletedId(id);
    await dispatch(deleteAdminAction(id));
    await dispatch(getAdminUsersAction());
    setAdminBeingDeletedId(null);
  }

  async function updateAdminStatus(id: string, newStatus: string) {
    setAdminBeingUpdatedId(id);
    await dispatch(updateOldAdminAction(id, { status: newStatus }));
    await dispatch(getAdminUsersAction());
    setAdminBeingUpdatedId(null);
  }

  async function saveAdmin() {
    try {
      if (!Name || !Email || !Password || !ConfirmPassword)
        throw "Please fill all the required fields";

      if (Password !== ConfirmPassword) throw "Passwords doesn't match";

      if (!PASSWORD_REGEX.test(Password)) throw "Passwords Must be strong";
      if (!EMAIL_REGEX.test(Email)) throw "Email Must be valid";
      setErrorMsg("");
      setIsLoadingDialog(true);

      const body: AdminUsers = {
        name: Name,
        email: Email,
        password: Password,
        status: Status,
      };
      const id = await dispatch(saveNewAdminAction(body));
      if (id !== ("Admin Added succesfully" as any)) throw id;

      await dispatch(getAdminUsersAction());
      setIsLoadingDialog(false);
      setIsAddAdminDialogOpen(false);
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

  async function updateAdmin() {
    try {
      if (!Name || !Email || !Status)
        throw "Please fill all the required fields";

      setErrorMsg("");
      setIsLoadingDialog(true);

      const body: UpdateAdminUsers = {
        name: Name,
        email: Email,
        status: Status,
      };

      const response = await dispatch(
        updateOldAdminAction(AdminBeingEditedId, body),
      );
      if (response !== ("Updated successfully" as any)) throw response;
      await dispatch(getAdminUsersAction());
      setIsLoadingDialog(false);
      setIsAddAdminDialogOpen(false);
      setIsEditAdminDialogOpen(false);
      setIsView(false);
      dispatch(
        showMessage({
          message: "Admin updated successfully!", //text or html
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
          <h1>Admins</h1>
        </div>
      }
      content={
        <div className="p-24 w-full">
          <br />

          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setIsEditAdminDialogOpen(false);
              setIsView(false);
              setIsAddAdminDialogOpen(true);
            }}
          >
            <AddCircleOutlineIcon /> Add Admin
          </Button>
          <h1 style={{ marginTop: "50px", marginBottom: "50px" }}>
            Admin List :
          </h1>
          <TableComp
            data={adminUsersData}
            isLoading={IsLoadingData}
            // rowsToShow={5}
            columns={[
              {
                Heading: "Name",
                accessor: "name",
              },
              {
                Heading: "Email",
                accessor: "email",
              },
              {
                Heading: "Status",
                Cell: (row: Admin, index) => {
                  if (AdminBeingUpdatedId === row.id)
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
                                    "{row.name}"?
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
                                        updateAdminStatus(
                                          row.id,
                                          row.status === "Blocked"
                                            ? "Active"
                                            : "Blocked",
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
                Cell: (row: Admin, index) => {
                  if (AdminBeingDeletedId === row.id)
                    return <CircularProgress />;
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
                        <EditIcon color="secondary" />
                      </IconButton>
                      <IconButton
                        onClick={() =>
                          dispatch(
                            openDialog({
                              children: (
                                <>
                                  <DialogTitle id="alert-dialog-title">
                                    Are you sure you want to delete "{row.name}
                                    "?
                                  </DialogTitle>
                                  <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                      This action is irreversible, all the
                                      images and data inside this product will
                                      be removed permanently
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
                                        deleteAdmin(row.id);
                                        dispatch(closeDialog());
                                      }}
                                      color="error"
                                      autoFocus
                                    >
                                      Delete
                                    </Button>
                                  </DialogActions>
                                </>
                              ),
                            }),
                          )
                        }
                        className="mt-4 mr-5"
                      >
                        <DeleteIcon style={{ color: "red" }} />
                      </IconButton>
                    </>
                  );
                },
              },
            ]}
          />

          {IsAddAdminDialogOpen && (
            <DialogWrapper
              isOpen={IsAddAdminDialogOpen}
              onClose={() => setIsAddAdminDialogOpen(false)}
              title="Add Admin"
              maxWidth="lg"
              errorMsg={ErrorMsg}
              isLoadingActions={IsLoadingDialog}
              onSave={() => {
                if (IsEditing) {
                  updateAdmin();
                } else {
                  saveAdmin();
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
                    <div className="" style={{ width: "100%" }}>
                      <h4 style={{ marginTop: "15px", marginBottom: "10px" }}>
                        Name*
                      </h4>
                      <TextField
                        fullWidth
                        variant="outlined"
                        value={Name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="" style={{ width: "100%" }}>
                      <h4 style={{ marginTop: "15px", marginBottom: "10px" }}>
                        Email*
                      </h4>
                      <TextField
                        fullWidth
                        variant="outlined"
                        value={Email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    {!IsEditAdminDialogOpen ? (
                      <>
                        <div className="" style={{ width: "100%" }}>
                          <h4
                            style={{ marginTop: "15px", marginBottom: "10px" }}
                          >
                            Password*
                          </h4>
                          <TextField
                            fullWidth
                            variant="outlined"
                            type="password"
                            value={Password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>

                        <div className="" style={{ width: "100%" }}>
                          <h4
                            style={{ marginTop: "15px", marginBottom: "10px" }}
                          >
                            Confirm Password*
                          </h4>
                          <TextField
                            fullWidth
                            variant="outlined"
                            type="password"
                            value={ConfirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                      </>
                    ) : null}

                    <FormControl
                      style={{
                        width: "100%",
                        marginTop: "15px",
                        marginBottom: "10px",
                      }}
                    >
                      <InputLabel>Status*</InputLabel>
                      <Select
                        value={Status || "Active"}
                        onChange={(e) => setStatus(e.target.value)}
                        label="Is Active"
                      >
                        <MenuItem value={"Active"}>Active</MenuItem>
                        <MenuItem value={"Blocked"}>Blocked</MenuItem>
                      </Select>
                    </FormControl>
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

export default Admins;
