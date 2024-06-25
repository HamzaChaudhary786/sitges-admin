import DemoContent from "@fuse/core/DemoContent";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import { useParams } from "react-router-dom";

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
  getCategoriesAction,
  saveNewCategoryAction,
  selectCategory,
  updateOldCategoryAction,
  // selectCategories,
  // deleteCategoryAction,
  // updateOldCategoryAction,
  // Categories,
  // saveNewCategoryAction,

  // UserStatus,
  // setCategories,
  // saveNewCategoryAction,
  // connectDipatcherToVendor,
} from "app/store/categoriesSlice";
import { getCustomersAction, selectCustomers } from "app/store/customerSlice";

import { FormControl } from "@mui/base";
import {
  CategoryStatusMenuItems,
  DisplayModeMenuItems,
  EMAIL_REGEX,
  PASSWORD_REGEX,
  UserStatusMenuItems,
  vehicleMenuItems,
} from "src/helpers/constants";
import { string } from "zod";
import ViewDetails from "src/helpers/ViewDetails";
import { getVendorUsersAction, selectVendors } from "app/store/vendorSlice";
import FilterForm from "src/helpers/FilterForm";
import InputField from "src/helpers/InputField";
import StatusSelect from "src/helpers/StatusSelect";
import { uploadImageToAWSAndGetLink } from "app/store/restaurantSlice";

// import UserStatusSelect from "src/helpers/UserStatusSelect";
import {
  UserStatus,
  Category,
  DisplayMode,
  CategoryStatus,
  SoldBy,
  // UpdateCategories,
} from "src/helpers/entities";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
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

function Categories() {
  const { resId } = useParams();
  const navigate = useNavigate();

  const { IsMob, IsTab, IsWeb } = useDevice();
  const dispatch = useAppDispatch();
  const [EditCategoryDialogOpen, setEditCategoryDialogOpen] = useState(false);
  const [IsEditCategoryDialogOpen, setIsEditCategoryDialogOpen] =
    useState(false);
  const [IsLoadingData, setIsLoadingData] = useState(true);
  const [IsCategoryViewDialogOpen, setIsCategoryViewDialogOpen] =
    useState(false);
  const [IsAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);

  const [CategoryBeingViewed, setCategoryBeingViewed] = useState<null | string>(
    null,
  );
  const [CategoryBeingDeletedId, setCategoryBeingDeletedId] = useState<
    null | string
  >(null);
  const [CategoryBeingUpdatedId, setCategoryBeingUpdatedId] = useState<
    null | string
  >(null);

  let categoryUsersData = useSelector(selectCategory);
  let vendors = useSelector(selectVendors);
  // // const { resId } = useParams<{resId: string}>();
  // const resId = "1a1b0ac9-55db-4613-acec-93598de98e57"

  const [FilterName, setFilterName] = useState("");
  const [FilterEmail, setFilterEmail] = useState("");
  const [FilterStatus, setFilterStatus] = useState("");
  const [SelectedVendor, setSelectedVendor] = useState<any>(null);

  const [Name, setName] = useState("");
  const [Image, setImage] = useState<string | File>();
  const [DisplayMode, setDisplayMode] = useState<DisplayMode>();
  const [categoryStatus, setCategoryStatus] = useState<CategoryStatus>();
  const [SoldBy, setSoldBy] = useState<SoldBy>(null);
  const [Description, setDescription] = useState("");

  const [ErrorMsg, setErrorMsg] = useState("");

  const [IsLoadingDialog, setIsLoadingDialog] = useState(false);

  const [FilteredData, setFilteredData] = useState<any>(categoryUsersData);
  const [FilteredVendor, setFilteredVendor] = useState<any>(vendors);
  const [IsEditing, setIsEditing] = useState(false);
  const [IsView, setIsView] = useState(false);

  const [CategoryBeingEditedId, setCategoryBeingEditedId] = useState<
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

  useEffect(() => {
    getCategories();
    getVendors();
  }, []);

  useEffect(() => {
    setFilteredData(categoryUsersData);
  }, [categoryUsersData]);

  useEffect(() => {
    const filteredData = vendors.filter((vendor) => !vendor.category);
    setFilteredVendor(filteredData);
  }, [vendors]);

  useEffect(() => {
    let category;
    if (CategoryBeingEditedId && categoryUsersData) {
      category = categoryUsersData.find((p) => p.id === CategoryBeingEditedId);
      if (category) {
        setName(category.name);
        setDisplayMode(category.displayMode);
        setCategoryStatus(category.categoryStatus);
        setImage(category.image);
        setSoldBy(category.soldBy);
        setDescription(category.description);
      }
    }
  }, [categoryUsersData, CategoryBeingEditedId]);

  useEffect(() => {
    if (!IsAddCategoryDialogOpen) {
      setName("");
      setDisplayMode(null);
      setCategoryStatus(null);
      setImage("");
      setSoldBy(null);
      setDescription("");
      setIsEditing(false);

      setCategoryBeingEditedId("");
    }
  }, [IsAddCategoryDialogOpen]);

  async function navigateToProduct(catId: string) {
    navigate(`/restaurants/${resId}/categories/${catId}/products`);
  }

  async function initEdit(id: string) {
    setIsAddCategoryDialogOpen(true);
    setCategoryBeingEditedId(id);
    setEditCategoryDialogOpen(true);
    setIsEditing(true);
  }
  async function initView(id: string) {
    setIsCategoryViewDialogOpen(true);
    setCategoryBeingViewed(id);
  }

  async function uploadImage() {
    if (Image instanceof File) {
      const link = await dispatch(uploadImageToAWSAndGetLink(Image));
      if (typeof link !== "string") {
        throw new Error("Error while saving the background image");
      }
      return link;
    } else return Image;
  }

  async function getCategories() {
    setIsLoadingData(true);
    await dispatch(getCategoriesAction(resId));
    setIsLoadingData(false);
  }

  const handleVendorChange = (_, newValue) => {
    setSelectedVendor(newValue);
  };

  const handleBack = () => {
    navigate(-1); // navigates to the previous page
  };

  async function getVendors() {
    setIsLoadingData(true);
    await dispatch(getVendorUsersAction());
    setIsLoadingData(false);
  }

  async function updateCategoryStatus(id: string, newStatus: CategoryStatus) {
    // setCategoryBeingEditedId(id);
    await dispatch(
      updateOldCategoryAction(resId, id, { categoryStatus: newStatus }),
    );
    await dispatch(getCategoriesAction(resId));
    setCategoryBeingEditedId(null);
  }

  // async function ApplyFilter() {
  //   await dispatch(getCategoriesAction);

  //   const filteredData = categoryUsersData.filter((user) => {
  //     const emailMatch = !FilterEmail || user.email.includes(FilterEmail);
  //     const statusMatch = !FilterStatus || user.status === FilterStatus;
  //     const nameMatch = !FilterName || user.name.includes(FilterName);

  //     return emailMatch && statusMatch && nameMatch;
  //   });

  //   setFilteredData(filteredData);
  //   dispatch(setCategories(filteredData));
  // }

  // async function ApproveCategory(id: string) {
  //   await dispatch(
  //     updateOldCategoryAction(id, { status: UserStatus.Active }),
  //   );
  //   await dispatch(getCategoriesAction());
  // }

  // async function RejectCategory(id: string) {
  //   await dispatch(
  //     updateOldCategoryAction(id, { status: UserStatus.Inactive }),
  //   );
  //   await dispatch(getCategoriesAction());
  // }

  // async function BlockCategory(id: string) {
  //   await dispatch(
  //     updateOldCategoryAction(id, { status: UserStatus.Blocked }),
  //   );
  //   await dispatch(getCategoriesAction());
  // }

  async function updateCategory() {
    try {
      if (!Name || !DisplayMode || !Image || !categoryStatus || !SoldBy)
        throw "Please fill all the required fields";

      setErrorMsg("");
      setIsLoadingDialog(true);
      const imageLink = await uploadImage();

      const body: Partial<Category> = {
        name: Name,
        displayMode: DisplayMode,
        image: imageLink,
        categoryStatus: categoryStatus,
        soldBy: SoldBy,
        description: Description,
      };

      const response = await dispatch(
        updateOldCategoryAction(resId, CategoryBeingEditedId, body),
      );

      if (response !== ("Updated successfully" as any)) throw response;
      await dispatch(getCategoriesAction(resId));
      setIsLoadingDialog(false);
      setEditCategoryDialogOpen(false);
      setIsAddCategoryDialogOpen(false);
      setIsEditCategoryDialogOpen(false);
      setIsView(false);
      dispatch(
        showMessage({
          message: "Category updated successfully!", //text or html
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

  async function saveCategory() {
    try {
      if (!Name || !DisplayMode || !Image || !categoryStatus || !SoldBy)
        throw "Please fill all the required fields";

      setErrorMsg("");
      setIsLoadingDialog(true);
      const imageLink = await uploadImage();

      const body: Partial<Category> = {
        name: Name,
        displayMode: DisplayMode,
        categoryStatus: categoryStatus,
        image: imageLink,

        soldBy: SoldBy,
        description: Description,
      };

      const id = await dispatch(saveNewCategoryAction(resId, body));
      if (id != ("Category Added successfully" as any)) throw id;

      await dispatch(getCategoriesAction(resId));
      setIsLoadingDialog(false);
      setIsAddCategoryDialogOpen(false);
      dispatch(
        showMessage({
          message: "Category added successfully!", //text or html
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
        <div style={{ display: "flex" }}>
          <IconButton onClick={handleBack}>
            <ArrowBackIcon style={{ cursor: "pointer" }} />
          </IconButton>
          <h1 className="p-24">Categories</h1>
        </div>
      }
      content={
        <div className="p-24 w-full">
          <Button
            variant="contained"
            className="mb-10"
            color="primary"
            onClick={() => {
              setIsEditCategoryDialogOpen(false);
              setIsView(false);
              setIsAddCategoryDialogOpen(true);
            }}
          >
            <AddCircleOutlineIcon /> Add Category
          </Button>

          {/* <FilterForm
            FilterName={FilterName}
            FilterEmail={FilterEmail}
            FilterStatus={FilterStatus}
            setFilterName={setFilterName}
            setFilterEmail={setFilterEmail}
            setFilterStatus={setFilterStatus}
            ApplyFilter={ApplyFilter}
          /> */}

          <br />

          <h1 style={{ marginTop: "50px", marginBottom: "10px" }}>
            Category List :
          </h1>

          <TableComp
            data={FilteredData}
            isLoading={IsLoadingData}
            // rowsToShow={5}
            columns={[
              {
                Heading: "Pictures",
                accessor: "image",
                Cell: (row: Category) => (
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
                accessor: `name`,
              },
              {
                Heading: "Description",
                accessor: `description`,
              },
              {
                Heading: "Display Mode",
                accessor: "displayMode",
              },
              {
                Heading: "SoldBy",
                accessor: `soldBy`,
              },
              {
                Heading: "Status",
                Cell: (row: Category, index) => {
                  if (CategoryBeingEditedId === row.id)
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
                                    {row.categoryStatus ===
                                    CategoryStatus.InActive
                                      ? "Active"
                                      : "InActive"}{" "}
                                    "{row.name}"?
                                  </DialogTitle>
                                  <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                      {row.categoryStatus ===
                                      CategoryStatus.InActive
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
                                        updateCategoryStatus(
                                          row.id,
                                          row.categoryStatus ===
                                            CategoryStatus.InActive
                                            ? CategoryStatus.Active
                                            : CategoryStatus.InActive,
                                        );
                                        dispatch(closeDialog());
                                      }}
                                      color={
                                        row.categoryStatus ===
                                        CategoryStatus.InActive
                                          ? "success"
                                          : "error"
                                      }
                                      autoFocus
                                    >
                                      {row.categoryStatus ===
                                      CategoryStatus.InActive
                                        ? CategoryStatus.Active
                                        : CategoryStatus.InActive}
                                    </Button>
                                  </DialogActions>
                                </>
                              ),
                            }),
                          )
                        }
                      >
                        <Chip
                          label={
                            row.categoryStatus === CategoryStatus.Active
                              ? CategoryStatus.Active
                              : CategoryStatus.InActive
                          }
                          color={
                            row.categoryStatus === CategoryStatus.Active
                              ? "success"
                              : "error"
                          }
                        />
                      </IconButton>
                    </>
                  );
                },
              },
              {
                Heading: "Actions",
                Cell: (row: Category, index) => {
                  // if (CustomerBeingDeletedId === row.id)
                  //   return <CircularProgress />;
                  return (
                    <>
                      <>
                        <IconButton
                          onClick={() => initEdit(row.id)}
                          className="mt-4 mr-5"
                        >
                          <EditIcon color="secondary" />
                        </IconButton>
                      </>
                    </>
                  );
                },
              },
              {
                Heading: "View Product",
                Cell: (row: Category, index) => {
                  return (
                    <>
                      <Button
                        onClick={() => navigateToProduct(row.id)}
                        style={{
                          backgroundColor: "green",
                          color: "white",
                          padding: "10px",
                          borderRadius: "10px",
                        }}
                      >
                        View Products
                      </Button>
                    </>
                  );
                },
              },
            ]}
          />

          {IsAddCategoryDialogOpen && (
            <DialogWrapper
              isOpen={IsAddCategoryDialogOpen}
              onClose={() => setIsAddCategoryDialogOpen(false)}
              title={!IsEditing ? "Add Category" : "Update Category"}
              maxWidth="lg"
              errorMsg={ErrorMsg}
              isLoadingActions={IsLoadingDialog}
              onSave={() => {
                if (IsEditing) {
                  updateCategory();
                } else {
                  saveCategory();
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
                      label="Name*"
                      value={Name}
                      onChange={setName}
                      type="text"
                    />
                    <InputField
                      label="Description"
                      value={Description}
                      onChange={setDescription}
                      type="textarea"
                    />

                    <StatusSelect
                      label="status*"
                      value={categoryStatus}
                      onChange={setCategoryStatus}
                      menuItems={CategoryStatusMenuItems}
                    ></StatusSelect>

                    <StatusSelect
                      label="display*"
                      value={DisplayMode}
                      onChange={setDisplayMode}
                      menuItems={DisplayModeMenuItems}
                    ></StatusSelect>

                    <StatusSelect
                      label="sold by*"
                      value={SoldBy}
                      onChange={setSoldBy}
                      menuItems={vehicleMenuItems}
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

export default Categories;
