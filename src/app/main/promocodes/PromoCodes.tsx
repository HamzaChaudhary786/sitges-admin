import DemoContent from "@fuse/core/DemoContent";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import {
  Alert,
  Autocomplete,
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
  deletePromocodeAction,
  getPromocodeAction,
  saveNewPromocodeAction,
  selectpromocodes,
  updateOldPromocodeAction,
  // selectPromocodes,
  // deletePromocodeAction,
  // updateOldPromocodeAction,
  // saveNewPromocodeAction,
} from "app/store/promocodeSlice";
import { CodeStatus, Promocode } from "../../../helpers/entities";
import { FormControl } from "@mui/base";
import {
  CodeStatusItems,
  EMAIL_REGEX,
  PASSWORD_REGEX,
} from "src/helpers/constants";
import { string } from "zod";
import {
  getRestaurantUsersAction,
  selectRestaurants,
} from "app/store/restaurantSlice";
import StatusSelect from "src/helpers/StatusSelect";
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

function PromoCodes() {
  const { IsMob, IsTab, IsWeb } = useDevice();
  const dispatch = useAppDispatch();
  const [IsAddPromocodeDialogOpen, setIsAddPromocodeDialogOpen] =
    useState(false);
  const [IsEditPromocodeDialogOpen, setIsEditPromocodeDialogOpen] =
    useState(false);
  const [IsLoadingData, setIsLoadingData] = useState(true);
  const [PromocodeBeingDeletedId, setPromocodeBeingDeletedId] = useState<
    null | string
  >(null);
  const [PromocodeBeingUpdatedId, setPromocodeBeingUpdatedId] = useState<
    null | string
  >(null);

  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Code, setCode] = useState("");
  const [Discount, setDiscount] = useState(0);
  const [Status, setStatus] = useState(CodeStatus.Active);
  const [SelectedShop, setSelectedShop] = useState<any>(null);
  const [ErrorMsg, setErrorMsg] = useState("");
  const [IsLoadingDialog, setIsLoadingDialog] = useState(false);

  const [IsEditing, setIsEditing] = useState(false);

  const [PromocodeBeingEditedId, setPromocodeBeingEditedId] = useState<
    null | string
  >(null);

  const promocodeData = useSelector(selectpromocodes);
  const shopsData = useSelector(selectRestaurants);

  useEffect(() => {
    console.log("shopsData", shopsData);
  }, [shopsData]);

  useEffect(() => {
    getPromocodes();
  }, []);

  useEffect(() => {
    if (PromocodeBeingEditedId && promocodeData) {
      const promocodeUser = promocodeData.find(
        (p) => p.id === PromocodeBeingEditedId,
      );
      if (promocodeUser) {
        setName(promocodeUser.name);
        setCode(promocodeUser.code);
        setDiscount(promocodeUser.discount);
        setStatus(promocodeUser.status);
        if (shopsData) {
          const shop = shopsData.find((p) => p.id === promocodeUser.shopId);
          setSelectedShop(shop);
        }
      }
    }
  }, [PromocodeBeingEditedId, promocodeData]);

  useEffect(() => {
    if (!IsAddPromocodeDialogOpen) {
      setName("");
      setEmail("");
      setStatus(CodeStatus.Active);
      setCode("");
      setDiscount(0);
      setErrorMsg("");
      setIsLoadingDialog(false);
      setIsEditing(false);
      setPromocodeBeingEditedId(null);
    }
  }, [IsAddPromocodeDialogOpen]);

  async function initEdit(id: string) {
    setPromocodeBeingEditedId(id);
    setIsAddPromocodeDialogOpen(true);
    setIsEditing(true);
  }

  const handleShopChange = (_, newValue) => {
    setSelectedShop(newValue);
  };

  async function getPromocodes() {
    setIsLoadingData(true);
    await dispatch(getPromocodeAction());
    await dispatch(getRestaurantUsersAction());

    setIsLoadingData(false);
  }

  async function deletePromocode(id: string) {
    setPromocodeBeingDeletedId(id);
    await dispatch(deletePromocodeAction(id));
    await dispatch(getPromocodeAction());
    setPromocodeBeingDeletedId(null);
  }

  async function updatePromocodeStatus(id: string, newStatus: CodeStatus) {
    setPromocodeBeingUpdatedId(id);
    await dispatch(updateOldPromocodeAction(id, { status: newStatus }));
    await dispatch(getPromocodeAction());
    setPromocodeBeingUpdatedId(null);
  }

  async function savePromocode() {
    try {
      if (!Name || !SelectedShop || !Status || !Code || !Discount)
        throw "Please fill all the required fields";

      setErrorMsg("");
      setIsLoadingDialog(true);

      const body: Partial<Promocode> = {
        name: Name,
        code: Code,
        discount: Discount,
        status: Status,
        shopId: SelectedShop.id,
      };
      const id = await dispatch(saveNewPromocodeAction(body));
      if (id !== ("Promocode Created succesfully" as any)) throw id;

      await dispatch(getPromocodeAction());
      setIsLoadingDialog(false);
      setIsAddPromocodeDialogOpen(false);
      dispatch(
        showMessage({
          message: "Promocode added successfully!", //text or html
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

  async function updatePromocode() {
    try {
      if (!Name || !Status || !Code || !Discount)
        throw "Please fill all the required fields";

      setErrorMsg("");
      setIsLoadingDialog(true);

      const body: Partial<Promocode> = {
        name: Name,
        code: Code,
        discount: Discount,
        status: Status,
        shopId: SelectedShop.id,
      };

      const response = await dispatch(
        updateOldPromocodeAction(PromocodeBeingEditedId, body),
      );
      if (response !== ("Updated successfully" as any)) throw response;
      await dispatch(getPromocodeAction());
      setIsLoadingDialog(false);
      setIsAddPromocodeDialogOpen(false);
      setIsEditPromocodeDialogOpen(false);
      dispatch(
        showMessage({
          message: "Promocode updated successfully!", //text or html
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
          <h1>PromoCodes</h1>
        </div>
      }
      content={
        <div className="p-24 w-full">
          <br />

          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setIsEditPromocodeDialogOpen(false);
              setIsAddPromocodeDialogOpen(true);
            }}
          >
            <AddCircleOutlineIcon /> Add Promocode
          </Button>
          <h1 style={{ marginTop: "50px", marginBottom: "50px" }}>
            Promocode List :
          </h1>
          <TableComp
            data={promocodeData}
            isLoading={IsLoadingData}
            // rowsToShow={5}
            columns={[
              {
                Heading: "Name",
                accessor: "name",
              },
              {
                Heading: "Code",
                accessor: "code",
              },
              {
                Heading: "Discount %",
                accessor: "discount",
              },
              {
                Heading: "Shop Email",
                accessor: "email",
              },
              {
                Heading: "Status",
                Cell: (row: Promocode, index) => {
                  if (PromocodeBeingUpdatedId === row.id)
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
                                    "{row.name} status"?
                                  </DialogTitle>
                                  <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                      {row.status === "Blocked"
                                        ? "This action will activate the product and it will  be visible to the users"
                                        : "This action will blocked the promocode and it will be not visible to the users"}
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
                                        updatePromocodeStatus(
                                          row.id,
                                          row.status === "Blocked"
                                            ? CodeStatus.Active
                                            : CodeStatus.Blocked,
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
                                        ? CodeStatus.Active
                                        : CodeStatus.Blocked}
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
                Cell: (row: Promocode, index) => {
                  if (PromocodeBeingDeletedId === row.id)
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
                                        deletePromocode(row.id);
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

          {IsAddPromocodeDialogOpen && (
            <DialogWrapper
              isOpen={IsAddPromocodeDialogOpen}
              onClose={() => setIsAddPromocodeDialogOpen(false)}
              title={IsEditing ? "Update PromoCode" : "Add Promocode"}
              maxWidth="lg"
              errorMsg={ErrorMsg}
              isLoadingActions={IsLoadingDialog}
              onSave={() => {
                if (IsEditing) {
                  updatePromocode();
                } else {
                  savePromocode();
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
                      label="Code*"
                      value={Code}
                      onChange={setCode}
                      type="text"
                    />
                    <InputField
                      label="Discount*"
                      value={Discount}
                      onChange={setDiscount}
                      type="number"
                    />
                    <StatusSelect
                      label="Status*"
                      value={Status}
                      onChange={setStatus}
                      menuItems={CodeStatusItems}
                    />
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={shopsData}
                      getOptionLabel={(customer) => customer.email}
                      value={SelectedShop}
                      onChange={handleShopChange}
                      sx={{ width: "100%", marginTop: "20px" }}
                      renderInput={(params) => (
                        <TextField {...params} label="Select the Shop Email*" />
                      )}
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

export default PromoCodes;
