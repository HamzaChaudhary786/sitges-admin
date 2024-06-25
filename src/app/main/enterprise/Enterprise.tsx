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
  getEnterpriseAction,
  selectEnterprise,
  deleteEnterpriseAction,
  updateOldEnterpriseAction,
  saveNewEnterpriseAction,
} from "app/store/enterpriseSlice";
import { Enterprises } from "src/helpers/entities";
import { useNavigate } from "react-router-dom";

import { FormControl } from "@mui/base";
import { EMAIL_REGEX, PASSWORD_REGEX } from "src/helpers/constants";
import { string } from "zod";
import InputField from "src/helpers/InputField";

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

function Enterprise() {
  const { IsMob, IsTab, IsWeb } = useDevice();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const [IsAddEnterpriseDialogOpen, setIsAddEnterpriseDialogOpen] =
    useState(false);
  const [IsEditEnterpriseDialogOpen, setIsEditEnterpriseDialogOpen] =
    useState(false);
  const [IsLoadingData, setIsLoadingData] = useState(true);
  const [EnterpriseBeingDeletedId, setEnterpriseBeingDeletedId] = useState<
    null | string
  >(null);

  const [Name, setName] = useState("");
  const [EnterpriseId, setEnterpriseId] = useState("");
  const [ErrorMsg, setErrorMsg] = useState("");
  const [IsLoadingDialog, setIsLoadingDialog] = useState(false);

  const [IsEditing, setIsEditing] = useState(false);
  const [IsView, setIsView] = useState(false);

  const [EnterpriseBeingEditedId, setEnterpriseBeingEditedId] = useState<
    null | string
  >(null);

  const enterpriseUsersData = useSelector(selectEnterprise);

  useEffect(() => {
    getEnterprise();
  }, []);

  useEffect(() => {
    if (EnterpriseBeingEditedId && enterpriseUsersData) {
      const enterpriseUser = enterpriseUsersData.find(
        (p) => p.id === EnterpriseBeingEditedId,
      );
      if (enterpriseUser) {
        setName(enterpriseUser.name);
      }
    }
  }, [EnterpriseBeingEditedId, enterpriseUsersData]);

  useEffect(() => {
    if (!IsAddEnterpriseDialogOpen) {
      setName("");
      setErrorMsg("");
      setIsLoadingDialog(false);
      setIsEditing(false);
      setEnterpriseBeingEditedId(null);
    }
  }, [IsAddEnterpriseDialogOpen]);

  async function navigateToUser(eId: string) {
    navigate(`/users/${eId}/`);
  }

  async function initEdit(id: string) {
    setIsEditEnterpriseDialogOpen(true);
    setEnterpriseBeingEditedId(id);
    setIsAddEnterpriseDialogOpen(true);
    setIsEditing(true);
  }
  async function initView(id: string) {
    setIsView(true);
    setIsEditEnterpriseDialogOpen(true);
    setEnterpriseBeingEditedId(id);
    setIsAddEnterpriseDialogOpen(true);
    setIsEditing(true);
  }

  async function getEnterprise() {
    setIsLoadingData(true);
    await dispatch(getEnterpriseAction());
    setIsLoadingData(false);
  }

  async function deleteEnterprise(id: string) {
    setEnterpriseBeingDeletedId(id);
    await dispatch(deleteEnterpriseAction(id));
    await dispatch(getEnterpriseAction());
    setEnterpriseBeingDeletedId(null);
  }

  async function saveEnterprise() {
    try {
      if (!Name) throw "Please fill all the required fields";

      setErrorMsg("");
      setIsLoadingDialog(true);

      const body: Partial<Enterprises> = {
        name: Name,
      };
      const id = await dispatch(saveNewEnterpriseAction(body));
      if (id !== ("Enterprise Added succesfully" as any)) throw id;

      await dispatch(getEnterpriseAction());
      setIsLoadingDialog(false);
      setIsAddEnterpriseDialogOpen(false);
      dispatch(
        showMessage({
          message: "Enterprise added successfully!", //text or html
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

  async function updateEnterprise() {
    try {
      if (!Name) throw "Please fill all the required fields";

      setErrorMsg("");
      setIsLoadingDialog(true);

      const body: Partial<Enterprises> = {
        name: Name,
      };

      const response = await dispatch(
        updateOldEnterpriseAction(EnterpriseBeingEditedId, body),
      );
      if (response !== ("Updated successfully" as any)) throw response;
      await dispatch(getEnterpriseAction());
      setIsLoadingDialog(false);
      setIsAddEnterpriseDialogOpen(false);
      setIsEditEnterpriseDialogOpen(false);
      setIsView(false);
      dispatch(
        showMessage({
          message: "Enterprise updated successfully!", //text or html
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
          <h1>Enterprise</h1>
        </div>
      }
      content={
        <div className="p-24 w-full">
          <br />

          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setIsEditEnterpriseDialogOpen(false);
              setIsView(false);
              setIsAddEnterpriseDialogOpen(true);
            }}
          >
            <AddCircleOutlineIcon /> Add Enterprise
          </Button>
          <h1 style={{ marginTop: "50px", marginBottom: "50px" }}>
            Enterprise List :
          </h1>
          <TableComp
            data={enterpriseUsersData}
            isLoading={IsLoadingData}
            // rowsToShow={5}
            columns={[
              {
                Heading: "Name",
                accessor: "name",
              },
              {
                Heading: "Enterprise Id",
                accessor: "enterpriseId",
              },

              {
                Heading: "Actions",
                Cell: (row: Enterprises, index) => {
                  if (EnterpriseBeingDeletedId === row.id)
                    return <CircularProgress />;
                  return (
                    <>
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
                                        deleteEnterprise(row.id);
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
              {
                Heading: "Add User",
                Cell: (row: Enterprises, index) => {
                  return (
                    <>
                      <Button
                        onClick={() => navigateToUser(row.enterpriseId)}
                        style={{
                          backgroundColor: "green",
                          color: "white",
                          padding: "10px",
                          borderRadius: "10px",
                        }}
                      >
                        View Users
                      </Button>
                    </>
                  );
                },
              },
            ]}
          />

          {IsAddEnterpriseDialogOpen && (
            <DialogWrapper
              isOpen={IsAddEnterpriseDialogOpen}
              onClose={() => setIsAddEnterpriseDialogOpen(false)}
              title={IsEditing ? "Update Enterprise" : "Add Enterprise"}
              maxWidth="lg"
              errorMsg={ErrorMsg}
              isLoadingActions={IsLoadingDialog}
              onSave={() => {
                if (IsEditing) {
                  updateEnterprise();
                } else {
                  saveEnterprise();
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

export default Enterprise;
