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
import { Fragment, useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Autocomplete from "@mui/material/Autocomplete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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
  deleteProductVariationAction,
  getProductsAction,
  saveNewProductAction,
  saveNewProductVariationAction,
  selectProduct,
  updateOldProductAction,
  updateOldProductVariationAction,
  deleteProductToppingAction,
  saveNewProductToppingAction,
  updateOldProductToppingAction,
  // selectProducts,
  // deleteProductAction,
  // updateOldProductAction,
  // Products,
  // saveNewProductAction,

  // UserStatus,
  // setProducts,
  // saveNewProductAction,
  // connectDipatcherToVendor,
} from "app/store/productsSlice";
import { getCustomersAction, selectCustomers } from "app/store/customerSlice";

import { FormControl } from "@mui/base";
import {
  // ProductStatusMenuItems,
  DisplayModeMenuItems,
  EMAIL_REGEX,
  PASSWORD_REGEX,
  UserStatusMenuItems,
  YesNoMenuItems,
  allergens,
  vehicleMenuItems,
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
  Product,
  DisplayMode,
  // ActiveBlockStatus,
  SoldBy,
  ActiveBlockStatus,
  ProductTopping,
  ProductVariation,
  // UpdateProducts,
} from "src/helpers/entities";
import { Stack } from "@mui/system";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { uploadImageToAWSAndGetLink } from "app/store/restaurantSlice";
import { useNavigate } from "react-router-dom";
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

function Products() {
  const navigate = useNavigate();
  const { resId, catId } = useParams();
  const { IsMob, IsTab, IsWeb } = useDevice();
  const dispatch = useAppDispatch();
  const [EditProductDialogOpen, setEditProductDialogOpen] = useState(false);
  const [IsEditProductDialogOpen, setIsEditProductDialogOpen] = useState(false);
  const [IsLoadingData, setIsLoadingData] = useState(true);
  const [IsProductViewDialogOpen, setIsProductViewDialogOpen] = useState(false);
  const [IsAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [IsAddProductVariationDialogOpen, setIsAddProductVariationDialogOpen] =
    useState(false);

  const [ProductBeingViewed, setProductBeingViewed] = useState<null | string>(
    null,
  );
  const [ProductBeingDeletedId, setProductBeingDeletedId] = useState<
    null | string
  >(null);
  const [ProductBeingUpdatedId, setProductBeingUpdatedId] = useState<
    null | string
  >(null);

  const [IsAddProductToppingDialogOpen, setIsAddProductToppingDialogOpen] =
    useState(false);

  let productData = useSelector(selectProduct);
  let vendors = useSelector(selectVendors);
  // const { resId } = useParams<{resId: string}>();
  // const resId = "1a1b0ac9-55db-4613-acec-93598de98e57"
  // const catId = "128db642-f78c-4771-a1b4-9c646af83300"

  const [FilterName, setFilterName] = useState("");
  const [FilterEmail, setFilterEmail] = useState("");
  const [FilterStatus, setFilterStatus] = useState("");
  const [SelectedVendor, setSelectedVendor] = useState<any>(null);

  const [Image, setImage] = useState<string | File>();
  const [Name, setName] = useState("");
  const [Price, setPrice] = useState<number>();
  const [MinimumPreparationTime, setMinimumPreparationTime] =
    useState<number>();

  const [VariationName, setVariationName] = useState("");
  const [VariationPrice, setVariationPrice] = useState<number>();

  const [ToppingName, setToppingName] = useState("");
  const [ToppingPrice, setToppingPrice] = useState<number>();

  const [DisplayMode, setDisplayMode] = useState<DisplayMode>();
  const [status, setProductStatus] = useState();
  const [Allergies, setAllergies] = useState([]);
  const [Variations, setVariations] = useState([]);
  const [Toppings, setToppings] = useState([]);
  const [Description, setDescription] = useState("");
  const [ErrorMsg, setErrorMsg] = useState("");

  const [IsLoadingDialog, setIsLoadingDialog] = useState(false);

  const [FilteredData, setFilteredData] = useState<any>(productData);
  const [FilteredVendor, setFilteredVendor] = useState<any>(vendors);
  const [IsEditing, setIsEditing] = useState(false);
  const [IsView, setIsView] = useState(false);

  const [ProductBeingEditedId, setProductBeingEditedId] = useState<
    null | string
  >(null);

  const [ProductVariationBeingEditedId, setProductVariationBeingEditedId] =
    useState<null | string>(null);

  const [ProductToppingBeingEditedId, setProductToppingBeingEditedId] =
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

  useEffect(() => {
    getProducts();
    getVendors();
  }, []);

  useEffect(() => {
    setFilteredData(productData);
  }, [productData]);

  useEffect(() => {
    let product;
    if (ProductBeingEditedId && productData) {
      product = productData.find((p) => p.id === ProductBeingEditedId);
      if (product) {
        const convertedAllergies = product.allergies.map((item) => {
          return { value: item, label: item };
        });
        setName(product.name);
        setPrice(product.price);
        setMinimumPreparationTime(product.minimumPreparationTime);
        setDisplayMode(product.displayMode);
        setDescription(product.shortDescription);
        setImage(product.image);
        setAllergies(convertedAllergies);
        setVariations(product.variations);
        setToppings(product.toppings);
      }
    }
  }, [productData, ProductBeingEditedId]);

  useEffect(() => {
    let productVariation;
    if (ProductVariationBeingEditedId && Variations) {
      productVariation = Variations.find(
        (p) => p.id === ProductVariationBeingEditedId,
      );
      if (productVariation) {
        setVariationName(productVariation.variationName);
        setVariationPrice(productVariation.price);
      }
    }
  }, [Variations, ProductVariationBeingEditedId]);

  useEffect(() => {
    let productVariation;
    if (ProductToppingBeingEditedId && Toppings) {
      productVariation = Toppings.find(
        (p) => p.id === ProductToppingBeingEditedId,
      );
      if (productVariation) {
        setToppingName(productVariation.toppingName);
        setToppingPrice(productVariation.price);
      }
    }
  }, [Toppings, ProductToppingBeingEditedId]);

  useEffect(() => {
    if (!IsAddProductVariationDialogOpen) {
      setVariationName("");
      setVariationPrice(null);

      setProductVariationBeingEditedId("");
      // setIsEditing(false)
    }
  }, [IsAddProductVariationDialogOpen]);

  useEffect(() => {
    if (!IsAddProductToppingDialogOpen) {
      setToppingName("");
      setToppingPrice(null);

      setProductToppingBeingEditedId("");
      // setIsEditing(false)
    }
  }, [IsAddProductToppingDialogOpen]);

  useEffect(() => {
    if (!IsAddProductDialogOpen) {
      setName("");
      setDisplayMode(null);
      setPrice(null);
      setMinimumPreparationTime(null);
      setImage("");
      setAllergies([]);
      setVariations([{}]);
      setToppings([{}]);
      setDescription("");

      setProductBeingEditedId("");
      setIsEditing(false);
    }
  }, [IsAddProductDialogOpen]);

  async function initEdit(id: string) {
    setProductBeingEditedId(id);
    setIsEditing(true);
    setEditProductDialogOpen(true);
    setIsAddProductDialogOpen(true);
  }

  async function initVariationEdit(id: string) {
    setProductVariationBeingEditedId(id);
    setIsEditing(true);
    setIsAddProductVariationDialogOpen(true);
  }

  async function initToppingEdit(id: string) {
    setProductToppingBeingEditedId(id);
    setIsEditing(true);
    setIsAddProductToppingDialogOpen(true);
  }

  async function initVariationDelete(id: string) {
    await dispatch(deleteProductVariationAction(id));
    getProducts();
  }

  async function initToppingDelete(id: string) {
    await dispatch(deleteProductToppingAction(id));
    getProducts();
  }

  async function initView(id: string) {
    setIsProductViewDialogOpen(true);
    setProductBeingViewed(id);
  }

  async function getProducts() {
    setIsLoadingData(true);
    await dispatch(getProductsAction(resId, catId));
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

  const handleBack = () => {
    navigate(-1); // navigates to the previous page
  };

  async function updateProductStatus(id: string, newStatus: ActiveBlockStatus) {
    // setProductBeingEditedId(id);
    await dispatch(
      updateOldProductAction(resId, catId, id, { status: newStatus }),
    );
    await dispatch(getProductsAction(resId, catId));
    setProductBeingEditedId(null);
  }

  // async function ApplyFilter() {
  //   await dispatch(getProductsAction);

  //   const filteredData = productData.filter((user) => {
  //     const emailMatch = !FilterEmail || user.email.includes(FilterEmail);
  //     const statusMatch = !FilterStatus || user.status === FilterStatus;
  //     const nameMatch = !FilterName || user.name.includes(FilterName);

  //     return emailMatch && statusMatch && nameMatch;
  //   });

  //   setFilteredData(filteredData);
  //   dispatch(setProducts(filteredData));
  // }

  async function uploadImage() {
    if (Image instanceof File) {
      const link = await dispatch(uploadImageToAWSAndGetLink(Image));
      if (typeof link !== "string") {
        throw new Error("Error while saving the background image");
      }
      return link;
    } else return Image;
  }

  async function updateProductVariation() {
    try {
      if (!VariationName || !VariationPrice)
        throw "Please fill all the required fields";

      setErrorMsg("");
      setIsLoadingDialog(true);

      const body: Partial<ProductVariation> = {
        variationName: VariationName,
        price: VariationPrice,
      };

      const response = await dispatch(
        updateOldProductVariationAction(ProductVariationBeingEditedId, body),
      );

      if (response !== ("Updated successfully" as any)) throw response;
      await dispatch(getProductsAction(resId, catId));
      setIsLoadingDialog(false);
      setIsAddProductVariationDialogOpen(false);
      dispatch(
        showMessage({
          message: "Product updated successfully!", //text or html
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

  async function saveProductVariation() {
    try {
      if (!VariationName || !VariationPrice)
        throw "Please fill all the required fields";

      setErrorMsg("");
      setIsLoadingDialog(true);

      const body: Partial<ProductVariation> = {
        variationName: VariationName,
        price: VariationPrice,
      };

      const id = await dispatch(
        saveNewProductVariationAction(ProductVariationBeingEditedId, body),
      );
      if (id != ("Product Variation Added successfully" as any)) throw id;

      await dispatch(getProductsAction(resId, catId));
      setIsLoadingDialog(false);
      setIsAddProductVariationDialogOpen(false);
      dispatch(
        showMessage({
          message: "Product Variation added successfully!", //text or html
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

  async function updateProductTopping() {
    try {
      if (!ToppingName || !ToppingPrice)
        throw "Please fill all the required fields";

      setErrorMsg("");
      setIsLoadingDialog(true);

      const body: Partial<ProductTopping> = {
        toppingName: ToppingName,
        price: ToppingPrice,
      };

      const response = await dispatch(
        updateOldProductToppingAction(ProductToppingBeingEditedId, body),
      );

      if (response !== ("Updated successfully" as any)) throw response;
      await dispatch(getProductsAction(resId, catId));
      setIsLoadingDialog(false);
      setIsAddProductToppingDialogOpen(false);
      dispatch(
        showMessage({
          message: "Product updated successfully!", //text or html
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

  async function saveProductTopping() {
    try {
      if (!ToppingName || !ToppingPrice)
        throw "Please fill all the required fields";

      setErrorMsg("");
      setIsLoadingDialog(true);

      const body: Partial<ProductTopping> = {
        toppingName: ToppingName,
        price: ToppingPrice,
      };

      const id = await dispatch(
        saveNewProductToppingAction(ProductToppingBeingEditedId, body),
      );
      if (id != ("Product Toppings Added successfully" as any)) throw id;

      await dispatch(getProductsAction(resId, catId));
      setIsLoadingDialog(false);
      setIsAddProductToppingDialogOpen(false);
      dispatch(
        showMessage({
          message: "Product Variation added successfully!", //text or html
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

  async function updateProduct() {
    try {
      if (!Name || !DisplayMode || !Image || !Price || !MinimumPreparationTime)
        throw "Please fill all the required fields";

      setErrorMsg("");
      setIsLoadingDialog(true);
      const imageLink = await uploadImage();
      const extractedValues = Allergies.map((item) => item.value);

      const body: Partial<Product> = {
        name: Name,
        price: Price,
        displayMode: DisplayMode,
        minimumPreparationTime: MinimumPreparationTime,
        image: imageLink,
        shortDescription: Description,
        allergies: extractedValues,
      };

      const response = await dispatch(
        updateOldProductAction(resId, catId, ProductBeingEditedId, body),
      );

      if (response !== ("Updated successfully" as any)) throw response;
      await dispatch(getProductsAction(resId, catId));
      setIsLoadingDialog(false);
      setEditProductDialogOpen(false);
      setIsAddProductDialogOpen(false);
      setIsEditProductDialogOpen(false);
      setIsView(false);
      dispatch(
        showMessage({
          message: "Product updated successfully!", //text or html
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

  async function saveProduct() {
    try {
      if (!Name || !DisplayMode || !Image || !Price || !MinimumPreparationTime)
        throw "Please fill all the required fields";

      setErrorMsg("");
      setIsLoadingDialog(true);
      const imageLink = await uploadImage();
      const extractedValues = Allergies.map((item) => item.value);

      const body: Partial<Product> = {
        name: Name,
        price: Price,
        minimumPreparationTime: MinimumPreparationTime,
        displayMode: DisplayMode,
        image: imageLink,
        shortDescription: Description,
        allergies: extractedValues,
      };

      const id = await dispatch(saveNewProductAction(resId, catId, body));
      if (id != ("Product Added successfully" as any)) throw id;

      await dispatch(getProductsAction(resId, catId));
      setIsLoadingDialog(false);
      setIsAddProductDialogOpen(false);
      dispatch(
        showMessage({
          message: "Product added successfully!", //text or html
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
          <h1 className="p-24">Products</h1>
        </div>
      }
      content={
        <div className="p-24 w-full">
          <Button
            variant="contained"
            className="mb-10"
            color="primary"
            onClick={() => {
              setIsEditProductDialogOpen(false);
              setIsView(false);
              setIsAddProductDialogOpen(true);
            }}
          >
            <AddCircleOutlineIcon /> Add Product
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
            Product List :
          </h1>

          <TableComp
            data={FilteredData}
            isLoading={IsLoadingData}
            // rowsToShow={5}
            columns={[
              {
                Heading: "Pictures",
                accessor: "image",
                Cell: (row: Product) => (
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
                Heading: "Price",
                accessor: `price`,
              },
              {
                Heading: "Preparation Time",
                accessor: `minimumPreparationTime`,
              },
              {
                Heading: "Description",
                accessor: `shortDescription`,
              },
              {
                Heading: "Display Mode",
                accessor: "displayMode",
              },
              {
                Heading: "Status",
                Cell: (row: Product, index) => {
                  if (ProductBeingEditedId === row.id)
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
                                    {row.status === ActiveBlockStatus.Blocked
                                      ? "Active"
                                      : "Blocked"}{" "}
                                    "{row.name}"?
                                  </DialogTitle>
                                  <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                      {row.status === ActiveBlockStatus.Blocked
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
                                        updateProductStatus(
                                          row.id,
                                          row.status ===
                                            ActiveBlockStatus.Blocked
                                            ? ActiveBlockStatus.Active
                                            : ActiveBlockStatus.Blocked,
                                        );
                                        dispatch(closeDialog());
                                      }}
                                      color={
                                        row.status === ActiveBlockStatus.Blocked
                                          ? "success"
                                          : "error"
                                      }
                                      autoFocus
                                    >
                                      {row.status === ActiveBlockStatus.Blocked
                                        ? ActiveBlockStatus.Active
                                        : ActiveBlockStatus.Blocked}
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
                            row.status === ActiveBlockStatus.Active
                              ? ActiveBlockStatus.Active
                              : ActiveBlockStatus.Blocked
                          }
                          color={
                            row.status === ActiveBlockStatus.Active
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
                Cell: (row: Product, index) => {
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
                Heading: "Add Variation",
                Cell: (row: Product, index) => {
                  return (
                    <>
                      <Button
                        onClick={() => {
                          setIsAddProductVariationDialogOpen(true),
                            setProductVariationBeingEditedId(row.id);
                        }}
                        style={{
                          backgroundColor: "green",
                          color: "white",
                          padding: "10px",
                          borderRadius: "10px",
                        }}
                      >
                        Add Variation
                      </Button>
                    </>
                  );
                },
              },
              ,
              {
                Heading: "Add Toppings",
                Cell: (row: Product, index) => {
                  return (
                    <>
                      <Button
                        onClick={() => {
                          setIsAddProductToppingDialogOpen(true),
                            setProductToppingBeingEditedId(row.id);
                        }}
                        style={{
                          backgroundColor: "green",
                          color: "white",
                          padding: "10px",
                          borderRadius: "10px",
                        }}
                      >
                        Add Topping
                      </Button>
                    </>
                  );
                },
              },
            ]}
          />

          {IsAddProductDialogOpen && (
            <DialogWrapper
              isOpen={IsAddProductDialogOpen}
              onClose={() => setIsAddProductDialogOpen(false)}
              title={!IsEditing ? "Add Product" : "Update Product"}
              maxWidth="lg"
              errorMsg={ErrorMsg}
              isLoadingActions={IsLoadingDialog}
              onSave={() => {
                if (IsEditing) {
                  updateProduct();
                } else {
                  saveProduct();
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
                    {/* <div
                                style={{
                                  ...newImageStyle,
                                  backgroundImage:
                                    Image instanceof File
                                      ? `url(${URL.createObjectURL(Image)})`
                                      : Image,
                                }}
                              ></div> */}
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
                      label="Price*"
                      value={Price}
                      onChange={setPrice}
                      type="number"
                    />
                    <InputField
                      label="Preparation Time* (in minutes)"
                      value={MinimumPreparationTime}
                      onChange={setMinimumPreparationTime}
                      type="number"
                    />

                    <InputField
                      label="Description"
                      value={Description}
                      onChange={setDescription}
                      type="text"
                    />
                    <StatusSelect
                      label="display*"
                      value={DisplayMode}
                      onChange={setDisplayMode}
                      menuItems={DisplayModeMenuItems}
                    ></StatusSelect>

                    {/* <StatusSelect
                      label="status"
                      value={status}
                      onChange={setProductStatus}
                      menuItems={ProductStatusMenuItems}
                    ></StatusSelect> */}

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
                        options={allergens}
                        getOptionLabel={(option) => option.label}
                        value={Allergies}
                        onChange={(event, newValue) => setAllergies(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label="Allergies"
                            placeholder="IAllergies"
                          />
                        )}
                      />
                    </Stack>

                    {IsEditing ? (
                      <>
                        <h1 className="mt-20 mb-20">Variations</h1>

                        <TableComp
                          data={Variations} // Pass the variation data as an array
                          isLoading={false} // Set isLoading to false or provide loading state if needed
                          // rowsToShow={5} // Set the number of rows to show
                          columns={[
                            {
                              Heading: "Name",
                              accessor: `variationName`,
                            },
                            {
                              Heading: "Price",
                              accessor: `price`,
                            },
                            {
                              Heading: "Actions",
                              Cell: (row: Product, index) => {
                                // if (CustomerBeingDeletedId === row.id)
                                //   return <CircularProgress />;
                                return (
                                  <>
                                    <>
                                      <IconButton
                                        onClick={() =>
                                          initVariationEdit(row.id)
                                        }
                                        className="mt-4 mr-5"
                                      >
                                        <EditIcon color="secondary" />
                                      </IconButton>
                                    </>
                                    <>
                                      <IconButton
                                        onClick={() =>
                                          initVariationDelete(row.id)
                                        }
                                        className="mt-4 mr-5"
                                      >
                                        <DeleteIcon style={{ color: "red" }} />
                                      </IconButton>
                                    </>
                                  </>
                                );
                              },
                            },
                          ]}
                        />

                        <h1 className="mt-20 mb-20">Toppings</h1>

                        <TableComp
                          data={Toppings} // Pass the variation data as an array
                          isLoading={false} // Set isLoading to false or provide loading state if needed
                          // rowsToShow={5} // Set the number of rows to show
                          columns={[
                            {
                              Heading: "Name",
                              accessor: `toppingName`,
                            },
                            {
                              Heading: "Price",
                              accessor: `price`,
                            },
                            {
                              Heading: "Actions",
                              Cell: (row: Product, index) => {
                                // if (CustomerBeingDeletedId === row.id)
                                //   return <CircularProgress />;
                                return (
                                  <>
                                    <>
                                      <IconButton
                                        onClick={() => initToppingEdit(row.id)}
                                        className="mt-4 mr-5"
                                      >
                                        <EditIcon color="secondary" />
                                      </IconButton>
                                    </>
                                    <>
                                      <IconButton
                                        onClick={() =>
                                          initToppingDelete(row.id)
                                        }
                                        className="mt-4 mr-5"
                                      >
                                        <DeleteIcon style={{ color: "red" }} />
                                      </IconButton>
                                    </>
                                  </>
                                );
                              },
                            },
                          ]}
                        />
                      </>
                    ) : null}
                  </div>
                </div>
              }
            />
          )}

          {IsAddProductVariationDialogOpen && (
            <DialogWrapper
              isOpen={IsAddProductVariationDialogOpen}
              onClose={() => setIsAddProductVariationDialogOpen(false)}
              title={
                !IsEditing
                  ? "Add Product Variation"
                  : "Update Product Variation"
              }
              maxWidth="lg"
              errorMsg={ErrorMsg}
              isLoadingActions={IsLoadingDialog}
              onSave={() => {
                if (IsEditing) {
                  updateProductVariation();
                } else {
                  saveProductVariation();
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
                      label="Variation Name*"
                      value={VariationName}
                      onChange={setVariationName}
                      type="text"
                    />
                    <InputField
                      label="Price*"
                      value={VariationPrice}
                      onChange={setVariationPrice}
                      type="number"
                    />
                  </div>
                </div>
              }
            />
          )}

          {IsAddProductToppingDialogOpen && (
            <DialogWrapper
              isOpen={IsAddProductToppingDialogOpen}
              onClose={() => setIsAddProductToppingDialogOpen(false)}
              title={
                !IsEditing ? "Add Product Topping" : "Update Product Topping"
              }
              maxWidth="lg"
              errorMsg={ErrorMsg}
              isLoadingActions={IsLoadingDialog}
              onSave={() => {
                if (IsEditing) {
                  updateProductTopping();
                } else {
                  saveProductTopping();
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
                      label="Topping Name*"
                      value={ToppingName}
                      onChange={setToppingName}
                      type="text"
                    />
                    <InputField
                      label="Price*"
                      value={ToppingPrice}
                      onChange={setToppingPrice}
                      type="number"
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

export default Products;
