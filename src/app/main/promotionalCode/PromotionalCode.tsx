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
import BlockIcon from "@mui/icons-material/Block";

import {
  closeDialog,
  openDialog,
} from "@fuse/core/FuseDialog/store/fuseDialogSlice";
import { useDevice } from "src/helpers/useDevice";
import { showMessage } from "@fuse/core/FuseMessage/store/fuseMessageSlice";
import {
  deletePromotionalcodeAction,
  getPromotionalcodeAction,
  saveNewPromotionalcodeAction,
  selectPromotionalcodes,
  updateOldPromotionalcodeAction,
  // selectPromotionalCodes,
  // deletePromotionalcodeAction,
  // updateOldPromotionalcodeAction,
  // saveNewPromotionalcodeAction,
} from "app/store/promotionalCodeSlice";
import {
  CodeStatus,
  PromotionSlidersStatus,
  Promotionalcode,
} from "../../../helpers/entities";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import { FormControl } from "@mui/base";
import {
  CodeStatusItems,
  EMAIL_REGEX,
  PASSWORD_REGEX,
  PromotionSlidersStatusItems,
} from "src/helpers/constants";
import { string } from "zod";
import {
  getRestaurantUsersAction,
  selectRestaurants,
  uploadImageToAWSAndGetLink,
} from "app/store/restaurantSlice";
import StatusSelect from "src/helpers/StatusSelect";
import InputField from "src/helpers/InputField";
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

function PromotionalCodes() {
  const { IsMob, IsTab, IsWeb } = useDevice();
  const dispatch = useAppDispatch();
  const [IsAddPromotionalcodeDialogOpen, setIsAddPromotionalcodeDialogOpen] =
    useState(false);
  const [IsEditPromotionalcodeDialogOpen, setIsEditPromotionalcodeDialogOpen] =
    useState(false);
  const [IsLoadingData, setIsLoadingData] = useState(true);
  const [PromotionalcodeBeingDeletedId, setPromotionalcodeBeingDeletedId] =
    useState<null | string>(null);
  const [PromotionalcodeBeingUpdatedId, setPromotionalcodeBeingUpdatedId] =
    useState<null | string>(null);

  const [Name, setName] = useState("");
  // const [Email, setEmail] = useState("");
  const [Code, setCode] = useState("");
  const [Status, setStatus] = useState<PromotionSlidersStatus>();
  const [Discount, setDiscount] = useState<number>();
  const [Image, setImage] = useState<string | File>();
  const [SelectedShop, setSelectedShop] = useState<any>(null);
  const [ErrorMsg, setErrorMsg] = useState("");
  const [IsLoadingDialog, setIsLoadingDialog] = useState(false);

  const [IsEditing, setIsEditing] = useState(false);

  const [PromotionalcodeBeingEditedId, setPromotionalcodeBeingEditedId] =
    useState<null | string>(null);

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

  const promotionalcodeData = useSelector(selectPromotionalcodes);
  const shopsData = useSelector(selectRestaurants);

  useEffect(() => {
    console.log("shopsData", shopsData);
  }, [shopsData]);

  useEffect(() => {
    getPromotionalCodes();
  }, []);

  useEffect(() => {
    if (PromotionalcodeBeingEditedId && promotionalcodeData) {
      const promotionalcodeUser = promotionalcodeData.find(
        (p) => p.id === PromotionalcodeBeingEditedId,
      );
      if (promotionalcodeUser) {
        // setName(promotionalcodeUser.name);
        setCode(promotionalcodeUser.code);
        setImage(promotionalcodeUser.image);
        setStatus(promotionalcodeUser.status);
        setDiscount(promotionalcodeUser.discountPercentage);

        if (shopsData) {
          const shop = shopsData.find(
            (p) => p.id === promotionalcodeUser.shopId,
          );
          setSelectedShop(shop);
        }
      }
    }
  }, [PromotionalcodeBeingEditedId, promotionalcodeData]);

  useEffect(() => {
    if (!IsAddPromotionalcodeDialogOpen) {
      setDiscount(0);
      setSelectedShop(null);
      setCode("");
      setStatus(PromotionSlidersStatus.AwaitingApproval);
      setImage("");
      setErrorMsg("");
      setIsLoadingDialog(false);
      setIsEditing(false);
      setPromotionalcodeBeingEditedId(null);
    }
  }, [IsAddPromotionalcodeDialogOpen]);

  async function initEdit(id: string) {
    setPromotionalcodeBeingEditedId(id);
    setIsAddPromotionalcodeDialogOpen(true);
    setIsEditing(true);
  }

  async function ApprovePromotionSlider(id: string) {
    updatePromotionalCodestatus(id, PromotionSlidersStatus.Active);
  }

  async function RejectPromotionSlider(id: string) {
    updatePromotionalCodestatus(id, PromotionSlidersStatus.Blocked);
  }

  async function BlockPromotionSlider(id: string) {
    updatePromotionalCodestatus(id, PromotionSlidersStatus.Blocked);
  }

  const handleShopChange = (_, newValue) => {
    setSelectedShop(newValue);
  };

  async function uploadImage() {
    if (Image instanceof File) {
      const link = await dispatch(uploadImageToAWSAndGetLink(Image));
      if (typeof link !== "string") {
        throw new Error("Error while saving the background image");
      }
      return link;
    } else return Image;
  }

  async function getPromotionalCodes() {
    setIsLoadingData(true);
    await dispatch(getPromotionalcodeAction());
    await dispatch(getRestaurantUsersAction());

    setIsLoadingData(false);
  }

  async function deletePromotionalcode(id: string, shopId: string) {
    setPromotionalcodeBeingDeletedId(id);
    await dispatch(deletePromotionalcodeAction(id, shopId));
    await dispatch(getPromotionalcodeAction());
    setPromotionalcodeBeingDeletedId(null);
  }

  async function updatePromotionalCodestatus(
    id: string,
    newStatus: PromotionSlidersStatus,
  ) {
    setPromotionalcodeBeingUpdatedId(id);
    await dispatch(updateOldPromotionalcodeAction(id, { status: newStatus }));
    await dispatch(getPromotionalcodeAction());
    setPromotionalcodeBeingUpdatedId(null);
  }

  async function savePromotionalcode() {
    try {
      if (!SelectedShop || !Image || !Discount || !Code)
        throw "Please fill all the required fields";

      setErrorMsg("");
      setIsLoadingDialog(true);
      const imageLink = await uploadImage();

      const body: Partial<Promotionalcode> = {
        image: imageLink,
        code: Code,
        discountPercentage: Discount,
        shopId: SelectedShop.id,
      };
      const id = await dispatch(saveNewPromotionalcodeAction(body));
      if (id !== ("Promotionalcode Created succesfully" as any)) throw id;

      await dispatch(getPromotionalcodeAction());
      setIsLoadingDialog(false);
      setIsAddPromotionalcodeDialogOpen(false);
      dispatch(
        showMessage({
          message: "Promotionalcode added successfully!", //text or html
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

  async function updatePromotionalcode() {
    try {
      if (!Discount || !Image || !SelectedShop || !Code)
        throw "Please fill all the required fields";

      setErrorMsg("");
      setIsLoadingDialog(true);
      const imageLink = await uploadImage();

      const body: Partial<Promotionalcode> = {
        image: imageLink,
        code: Code,
        discountPercentage: Discount,
        shopId: SelectedShop.id,
      };

      const response = await dispatch(
        updateOldPromotionalcodeAction(PromotionalcodeBeingEditedId, body),
      );
      if (response !== ("Updated successfully" as any)) throw response;
      await dispatch(getPromotionalcodeAction());
      setIsLoadingDialog(false);
      setIsAddPromotionalcodeDialogOpen(false);
      setIsEditPromotionalcodeDialogOpen(false);
      dispatch(
        showMessage({
          message: "Promotionalcode updated successfully!", //text or html
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
          <h1>PromotionalCodes</h1>
        </div>
      }
      content={
        <div className="p-24 w-full">
          <br />

          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setIsEditPromotionalcodeDialogOpen(false);
              setIsAddPromotionalcodeDialogOpen(true);
            }}
          >
            <AddCircleOutlineIcon /> Add Promotionalcode
          </Button>
          <h1 style={{ marginTop: "50px", marginBottom: "50px" }}>
            Promotionalcode List :
          </h1>
          <TableComp
            data={promotionalcodeData}
            isLoading={IsLoadingData}
            // rowsToShow={5}
            columns={[
              {
                Heading: "Pictures",
                accessor: "image",
                Cell: (row: Promotionalcode) => (
                  <>
                    {row.image ? (
                      <img
                        src={row.image}
                        alt="First Image"
                        style={{ maxWidth: "80px" }}
                      />
                    ) : null}
                  </>
                ),
              },
              {
                Heading: "Name",
                accessor: "name",
              },
              {
                Heading: "Code",
                accessor: "code",
              },
              {
                Heading: "Discount",
                accessor: "discountPercentage",
              },
              {
                Heading: "Shop Email",
                accessor: "email",
              },
              {
                Heading: "Status",
                accessor: "status",
              },
              {
                Heading: "Actions",
                Cell: (row: Promotionalcode, index) => {
                  if (PromotionalcodeBeingDeletedId === row.id)
                    return <CircularProgress />;
                  return (
                    <>
                      {row.status ===
                      PromotionSlidersStatus.AwaitingApproval ? (
                        <>
                          <IconButton
                            onClick={() => ApprovePromotionSlider(row.id)}
                            className="mt-4 mr-5"
                          >
                            <CheckCircleIcon color="success" />
                          </IconButton>

                          <IconButton
                            onClick={() => RejectPromotionSlider(row.id)}
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
                          {row.status !== PromotionSlidersStatus.Blocked ? (
                            <IconButton
                              onClick={() => BlockPromotionSlider(row.id)}
                              className="mt-4 mr-5"
                            >
                              <BlockIcon style={{ color: "red" }} />
                            </IconButton>
                          ) : null}
                        </>
                      )}

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
                                        deletePromotionalcode(
                                          row.id,
                                          row.shopId,
                                        );
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

          {IsAddPromotionalcodeDialogOpen && (
            <DialogWrapper
              isOpen={IsAddPromotionalcodeDialogOpen}
              onClose={() => setIsAddPromotionalcodeDialogOpen(false)}
              title={IsEditing ? "Update PromoCode" : "Add Promotionalcode"}
              maxWidth="lg"
              errorMsg={ErrorMsg}
              isLoadingActions={IsLoadingDialog}
              onSave={() => {
                if (IsEditing) {
                  updatePromotionalcode();
                } else {
                  savePromotionalcode();
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
                    <input
                      accept="image/*"
                      id="files-uploader-v1"
                      multiple
                      hidden
                      type="file"
                      onChange={(e) => {
                        if (!e.target.files || e.target.files.length === 0)
                          return;
                        setImage(e.target.files[0]);
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
                        Upload image
                      </h3>
                    </div>

                    {Image ? (
                      <div style={{ ...newImageStyle }}>
                        {Image instanceof File ? (
                          <div
                            style={{
                              ...new2ImageStyle,
                              backgroundImage:
                                Image instanceof File
                                  ? `url(${URL.createObjectURL(Image)})`
                                  : Image,
                            }}
                          ></div>
                        ) : (
                          <img
                            style={{ width: "100%", height: "200px" }}
                            src={Image}
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
                      menuItems={PromotionSlidersStatusItems}
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

export default PromotionalCodes;
