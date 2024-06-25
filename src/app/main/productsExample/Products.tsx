// import DemoContent from "@fuse/core/DemoContent";
// import FusePageSimple from "@fuse/core/FusePageSimple";
// import { useTranslation } from "react-i18next";
// import { styled } from "@mui/material/styles";
// import {
//   Alert,
//   Button,
//   Checkbox,
//   Chip,
//   CircularProgress,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   IconButton,
//   MenuItem,
//   Select,
//   TextField,
// } from "@mui/material";
// import { DialogWrapper } from "src/helpers/DialogWrapper";
// import { tableCellClasses } from "@mui/material/TableCell";
// import { useEffect, useState } from "react";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import { useSelector } from "react-redux";
// import {
//   deleteProductAction,
//   deleteProductImageAction,
//   getProductsAction,
//   Product,
//   ProductImage,
//   ProductToSaveBody,
//   ProductTypes,
//   saveNewImageInProductAction,
//   saveNewProductAction,
//   selectProducts,
//   updateOldProductAction,
//   uploadImageToCloudnairyAndGetLink,
// } from "app/store/productsSlice";
// import { useAppDispatch } from "app/store/store";
// import FuseLoading from "@fuse/core/FuseLoading";
// import { TableComp } from "app/shared-components/TableComp";
// import {
//   closeDialog,
//   openDialog,
// } from "@fuse/core/FuseDialog/store/fuseDialogSlice";
// import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
// import { useDevice } from "src/helpers/useDevice";
// import tr from "date-fns/locale/tr";
// import { showMessage } from "@fuse/core/FuseMessage/store/fuseMessageSlice";

// const Root = styled(FusePageSimple)(({ theme }) => ({
//   "& .FusePageSimple-header": {
//     backgroundColor: theme.palette.background.paper,
//     borderBottomWidth: 1,
//     borderStyle: "solid",
//     borderColor: theme.palette.divider,
//   },
//   "& .FusePageSimple-content": {},
//   "& .FusePageSimple-sidebarHeader": {},
//   "& .FusePageSimple-sidebarContent": {},
// }));

// function Products() {
//   const { t } = useTranslation("examplePage");
//   const { IsMob, IsTab, IsWeb } = useDevice();
//   const dispatch = useAppDispatch();
//   const [IsAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
//   const [IsLoadingData, setIsLoadingData] = useState(true);
//   const [ProductBeingDeletedId, setProductBeingDeletedId] = useState<
//     null | string
//   >(null);
//   const [ProductBeingUpdatedId, setProductBeingUpdatedId] = useState<
//     null | string
//   >(null);

//   const [Title, setTitle] = useState("");
//   const [BackgroundImage, setBackgroundImage] = useState<string | File>("");
//   const [Url, setUrl] = useState("");
//   const [Series, setSeries] = useState("");
//   const [Type, setType] = useState<ProductTypes>(ProductTypes.Lighting);
//   const [Dimensions, setDimensions] = useState("");
//   const [Materials, setMaterials] = useState("");
//   const [Price, setPrice] = useState("");
//   const [IsActive, setIsActive] = useState(true);
//   const [Description, setDescription] = useState("");
//   const [Images, setImages] = useState<File[]>([]);
//   const [ErrorMsg, setErrorMsg] = useState("");
//   const [IsLoadingDialog, setIsLoadingDialog] = useState(false);

//   const [IsEditing, setIsEditing] = useState(false);
//   const [ImagesToDelete, setImagesToDelete] = useState<string[]>([]);
//   const [ExistingImages, setExistingImages] = useState<ProductImage[]>([]);
//   const [ProductBeingEditedId, setProductBeingEditedId] = useState<
//     null | string
//   >(null);

//   const productsData = useSelector(selectProducts);

//   useEffect(() => {
//     getProducts();
//   }, []);

//   useEffect(() => {
//     if (ProductBeingEditedId && productsData) {
//       const product = productsData.find((p) => p.id === ProductBeingEditedId);
//       if (product) {
//         setTitle(product.title);
//         setUrl(product.url);
//         setSeries(product.series);
//         setType(product.type);
//         setDimensions(product.dimensions);
//         setMaterials(product.materials);
//         setBackgroundImage(product.backgroundImage || "");
//         setPrice(product.price?.toString() || "");
//         setIsActive(product.isActive);
//         setDescription(product.description);
//         setExistingImages(product.productImages || []);
//       }
//     }
//   }, [ProductBeingEditedId, productsData]);

//   useEffect(() => {
//     if (!IsAddProductDialogOpen) {
//       setTitle("");
//       setBackgroundImage("");
//       setUrl("");
//       setSeries("");
//       setType(ProductTypes.Lighting);
//       setDimensions("");
//       setMaterials("");
//       setPrice("");
//       setIsActive(true);
//       setDescription("");
//       setImages([]);
//       setErrorMsg("");
//       setIsLoadingDialog(false);
//       setIsEditing(false);
//       setImagesToDelete([]);
//       setExistingImages([]);
//       setProductBeingEditedId(null);
//     }
//   }, [IsAddProductDialogOpen]);

//   async function initEdit(id: string) {
//     setProductBeingEditedId(id);
//     setIsAddProductDialogOpen(true);
//     setIsEditing(true);
//   }

//   async function getProducts() {
//     setIsLoadingData(true);
//     await dispatch(getProductsAction());
//     setIsLoadingData(false);
//   }

//   async function deleteProduct(id: string) {
//     setProductBeingDeletedId(id);
//     await dispatch(deleteProductAction(id));
//     await dispatch(getProductsAction());
//     setProductBeingDeletedId(null);
//   }

//   async function updateProductStatus(id: string, newStatus: boolean) {
//     setProductBeingUpdatedId(id);
//     await dispatch(updateOldProductAction(id, { isActive: newStatus }));
//     await dispatch(getProductsAction());
//     setProductBeingUpdatedId(null);
//   }

//   async function saveProduct() {
//     try {
//       if (
//         !Title ||
//         !Url ||
//         !Series ||
//         !Type ||
//         !Dimensions ||
//         !Materials ||
//         !Description
//       )
//         throw "Please fill all the required fields";
//       if (Images.length === 0) throw "Please upload at least one image";

//       setErrorMsg("");
//       setIsLoadingDialog(true);

//       let backgroundImgLink: undefined | string = undefined;

//       if (BackgroundImage instanceof File) {
//         const link = await dispatch(
//           uploadImageToCloudnairyAndGetLink(BackgroundImage),
//         );
//         if (typeof link !== "string")
//           throw "Error while saving the background image";
//         backgroundImgLink = link;
//       }
//       const body: ProductToSaveBody = {
//         title: Title,
//         url: Url,
//         series: Series,
//         type: Type,
//         dimensions: Dimensions,
//         materials: Materials,
//         price: parseInt(Price),
//         isActive: IsActive,
//         description: Description,
//         backgroundImage: backgroundImgLink,
//       };
//       const id = await dispatch(saveNewProductAction(body));

//       if (typeof id !== "string") throw "Error while saving the product";

//       if (Images.length > 0) {
//         for (let i = 0; i < Images.length; i++) {
//           await dispatch(saveNewImageInProductAction(id, Images[i]));
//         }
//       }

//       await dispatch(getProductsAction());
//       setIsLoadingDialog(false);
//       setIsAddProductDialogOpen(false);
//       dispatch(
//         showMessage({
//           message: "Product added successfully!", //text or html
//           autoHideDuration: 6000, //ms
//           anchorOrigin: {
//             vertical: "top", //top bottom
//             horizontal: "right", //left center right
//           },
//           variant: "success", //success error info warning null
//         }),
//       );
//     } catch (error) {
//       setErrorMsg(error);
//       setIsLoadingDialog(false);
//     }
//   }

//   async function updateProduct() {
//     try {
//       if (
//         !Title ||
//         !Url ||
//         !Series ||
//         !Type ||
//         !Dimensions ||
//         !Materials ||
//         !Description
//       )
//         throw "Please fill all the required fields";

//       setErrorMsg("");
//       setIsLoadingDialog(true);

//       for (let index = 0; index < ImagesToDelete.length; index++) {
//         const element = ImagesToDelete[index];
//         await dispatch(deleteProductImageAction(element));
//       }

//       if (Images.length > 0) {
//         for (let i = 0; i < Images.length; i++) {
//           await dispatch(
//             saveNewImageInProductAction(ProductBeingEditedId, Images[i]),
//           );
//         }
//       }

//       let backgroundImgLink: undefined | string = undefined;

//       if (BackgroundImage instanceof File) {
//         const link = await dispatch(
//           uploadImageToCloudnairyAndGetLink(BackgroundImage),
//         );
//         if (typeof link !== "string")
//           throw "Error while saving the background image";
//         backgroundImgLink = link as string;
//       } else {
//         backgroundImgLink = BackgroundImage as string;
//       }

//       const body: ProductToSaveBody = {
//         title: Title,
//         url: Url,
//         series: Series,
//         type: Type,
//         dimensions: Dimensions,
//         materials: Materials,
//         price: parseInt(Price),
//         isActive: IsActive,
//         description: Description,
//         backgroundImage: backgroundImgLink,
//       };

//       await dispatch(updateOldProductAction(ProductBeingEditedId, body));
//       await dispatch(getProductsAction());
//       setIsLoadingDialog(false);
//       setIsAddProductDialogOpen(false);
//       dispatch(
//         showMessage({
//           message: "Product updated successfully!", //text or html
//           autoHideDuration: 6000, //ms
//           anchorOrigin: {
//             vertical: "top", //top bottom
//             horizontal: "right", //left center right
//           },
//           variant: "success", //success error info warning null
//         }),
//       );
//     } catch (error) {
//       setErrorMsg(error);
//       setIsLoadingDialog(false);
//     }
//   }

//   return (
//     <Root
//       header={
//         <div className="p-24">
//           <h1>Products</h1>
//         </div>
//       }
//       content={
//         <div className="p-24 w-full">
//           <br />

//           <Button
//             variant="contained"
//             color="primary"
//             onClick={() => setIsAddProductDialogOpen(true)}
//           >
//             <AddCircleOutlineIcon /> Add product
//           </Button>
//           <h1 style={{ marginTop: "50px", marginBottom: "50px" }}>
//             Products List :
//           </h1>
//           <TableComp
//             data={productsData}
//             isLoading={IsLoadingData}
//             rowsToShow={5}
//             columns={[
//               {
//                 Heading: "Title",
//                 accessor: "title",
//               },
//               {
//                 Heading: "Series",
//                 accessor: "series",
//               },
//               {
//                 Heading: "Type",
//                 accessor: "type",
//               },
//               {
//                 Heading: "Dimensions",
//                 accessor: "dimensions",
//               },
//               {
//                 Heading: "Materials",
//                 accessor: "materials",
//               },
//               {
//                 Heading: "Price US$",
//                 accessor: "price",
//               },
//               {
//                 Heading: "Status",
//                 Cell: (row: Product, index) => {
//                   if (ProductBeingUpdatedId === row.id)
//                     return <CircularProgress />;
//                   return (
//                     <>
//                       <IconButton
//                         style={{ cursor: "pointer" }}
//                         onClick={() =>
//                           dispatch(
//                             openDialog({
//                               children: (
//                                 <>
//                                   <DialogTitle id="alert-dialog-title">
//                                     Are you sure you want to{" "}
//                                     {row.isActive ? "deactivate" : "activate"} "
//                                     {row.title}"?
//                                   </DialogTitle>
//                                   <DialogContent>
//                                     <DialogContentText id="alert-dialog-description">
//                                       {row.isActive
//                                         ? "This action will deactivate the product and it will not be visible to the users"
//                                         : "This action will activate the product and it will be visible to the users"}
//                                     </DialogContentText>
//                                   </DialogContent>
//                                   <DialogActions>
//                                     <Button
//                                       onClick={() => dispatch(closeDialog())}
//                                       color="primary"
//                                     >
//                                       Cancel
//                                     </Button>
//                                     <Button
//                                       onClick={() => {
//                                         updateProductStatus(
//                                           row.id,
//                                           !row.isActive,
//                                         );
//                                         dispatch(closeDialog());
//                                       }}
//                                       color={row.isActive ? "error" : "success"}
//                                       autoFocus
//                                     >
//                                       {row.isActive ? "Deactivate" : "Activate"}
//                                     </Button>
//                                   </DialogActions>
//                                 </>
//                               ),
//                             }),
//                           )
//                         }
//                       >
//                         <Chip
//                           label={row.isActive ? "Active" : "Inactive"}
//                           color={row.isActive ? "success" : "error"}
//                         />
//                       </IconButton>
//                     </>
//                   );
//                 },
//               },
//               {
//                 Heading: "Actions",
//                 Cell: (row: Product, index) => {
//                   if (ProductBeingDeletedId === row.id)
//                     return <CircularProgress />;
//                   return (
//                     <>
//                       <IconButton
//                         onClick={() => initEdit(row.id)}
//                         className="mt-4 mr-5"
//                       >
//                         <VisibilityIcon color="primary" />
//                       </IconButton>
//                       <IconButton
//                         onClick={() => initEdit(row.id)}
//                         className="mt-4 mr-5"
//                       >
//                         <EditIcon color="secondary" />
//                       </IconButton>
//                       <IconButton
//                         onClick={() =>
//                           dispatch(
//                             openDialog({
//                               children: (
//                                 <>
//                                   <DialogTitle id="alert-dialog-title">
//                                     Are you sure you want to delete "{row.title}
//                                     "?
//                                   </DialogTitle>
//                                   <DialogContent>
//                                     <DialogContentText id="alert-dialog-description">
//                                       This action is irreversible, all the
//                                       images and data inside this product will
//                                       be removed permanently
//                                     </DialogContentText>
//                                   </DialogContent>
//                                   <DialogActions>
//                                     <Button
//                                       onClick={() => dispatch(closeDialog())}
//                                       color="primary"
//                                     >
//                                       Cancel
//                                     </Button>
//                                     <Button
//                                       onClick={() => {
//                                         deleteProduct(row.id);
//                                         dispatch(closeDialog());
//                                       }}
//                                       color="error"
//                                       autoFocus
//                                     >
//                                       Delete
//                                     </Button>
//                                   </DialogActions>
//                                 </>
//                               ),
//                             }),
//                           )
//                         }
//                         className="mt-4 mr-5"
//                       >
//                         <DeleteIcon style={{ color: "red" }} />
//                       </IconButton>
//                     </>
//                   );
//                 },
//               },
//             ]}
//           />

//           {IsAddProductDialogOpen && (
//             <DialogWrapper
//               isOpen={IsAddProductDialogOpen}
//               onClose={() => setIsAddProductDialogOpen(false)}
//               title="Add Product"
//               maxWidth="lg"
//               errorMsg={ErrorMsg}
//               isLoadingActions={IsLoadingDialog}
//               onSave={() => {
//                 if (IsEditing) {
//                   updateProduct();
//                 } else {
//                   saveProduct();
//                 }
//               }}
//               saveButtonText={IsEditing ? "Update" : "Save"}
//               content={
//                 <div
//                   style={{
//                     width: IsWeb ? "1000px" : "",
//                     height: IsWeb ? "75vh" : "",
//                   }}
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                       flexWrap: "wrap",
//                     }}
//                   >
//                     <h4
//                       style={{
//                         marginTop: "15px",
//                         marginBottom: "10px",
//                         width: "100%",
//                       }}
//                     >
//                       Background image
//                     </h4>
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                         flexWrap: "wrap",
//                         flexDirection: "row",
//                         width: "100%",
//                       }}
//                     >
//                       <input
//                         accept="image/*"
//                         id="files-uploader-background"
//                         hidden
//                         type="file"
//                         onChange={(e) => {
//                           if (!e.target.files || e.target.files.length === 0)
//                             return;
//                           setBackgroundImage(e.target.files[0]);
//                         }}
//                       />
//                       <div
//                         onClick={() => {
//                           document
//                             .getElementById("files-uploader-background")
//                             .click();
//                         }}
//                         style={{
//                           marginTop: "15px",
//                           marginBottom: "20px",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           width: "49%",
//                           height: "200px",
//                           border: "1px dotted black",
//                           background: "#eee",
//                           cursor: "pointer",
//                           backgroundImage: BackgroundImage
//                             ? `url(${typeof BackgroundImage === "string" ? BackgroundImage : URL.createObjectURL(BackgroundImage)})`
//                             : "",
//                           backgroundPosition: "center",
//                           backgroundSize: "contain",
//                           backgroundRepeat: "no-repeat",
//                         }}
//                       >
//                         {!BackgroundImage && (
//                           <h3
//                             style={{
//                               color: "grey",
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                             }}
//                           >
//                             <FuseSvgIcon className="text-48 mr-10" size={24}>
//                               heroicons-solid:cloud-upload
//                             </FuseSvgIcon>
//                             Upload image
//                           </h3>
//                         )}
//                         {BackgroundImage && (
//                           <div
//                             style={{
//                               display: "flex",
//                               justifyContent: "flex-end",
//                               alignItems: "flex-start",
//                               width: "100%",
//                               height: "100%",
//                             }}
//                           >
//                             <Button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 setBackgroundImage("");
//                               }}
//                               variant="contained"
//                               className="mt-4 mr-5"
//                             >
//                               <DeleteIcon style={{ color: "red" }} />
//                             </Button>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                     <div className="" style={{ width: "100%" }}>
//                       <h4 style={{ marginTop: "15px", marginBottom: "10px" }}>
//                         Title*
//                       </h4>
//                       <TextField
//                         fullWidth
//                         variant="outlined"
//                         value={Title}
//                         onChange={(e) => setTitle(e.target.value)}
//                         onBlur={(e) => {
//                           if (!e.target.value) return;
//                           setUrl(
//                             e.target.value
//                               .toLowerCase()
//                               .replace(/ /g, "-")
//                               .replace(/'/g, "")
//                               .replace(/"/g, "")
//                               .replace(/\+/g, "")
//                               .replace(/--/g, "-"),
//                           );
//                         }}
//                       />
//                     </div>
//                     <div className="" style={{ width: "100%" }}>
//                       <h4 style={{ marginTop: "15px", marginBottom: "10px" }}>
//                         URL*
//                       </h4>
//                       <TextField
//                         fullWidth
//                         variant="outlined"
//                         value={Url}
//                         onChange={(e) => setUrl(e.target.value)}
//                         InputProps={{
//                           startAdornment: (
//                             <p style={{ color: "grey" }}>
//                               {"https://rakastudio.com" + "/"}
//                             </p>
//                           ),
//                         }}
//                       />
//                     </div>
//                     <div className="" style={{ width: "49%" }}>
//                       <h4 style={{ marginTop: "15px", marginBottom: "10px" }}>
//                         Series*
//                       </h4>
//                       <TextField
//                         fullWidth
//                         variant="outlined"
//                         value={Series}
//                         onChange={(e) => setSeries(e.target.value)}
//                       />
//                     </div>
//                     <div className="" style={{ width: "49%" }}>
//                       <h4 style={{ marginTop: "15px", marginBottom: "10px" }}>
//                         Type*
//                       </h4>
//                       <Select
//                         fullWidth
//                         variant="outlined"
//                         value={Type}
//                         onChange={(e) =>
//                           setType(e.target.value as ProductTypes)
//                         }
//                       >
//                         {Object.values(ProductTypes).map((pr, iPr) => {
//                           if (typeof pr === "string")
//                             return (
//                               <MenuItem value={pr} key={iPr}>
//                                 {pr}
//                               </MenuItem>
//                             );
//                           return null;
//                         })}
//                       </Select>
//                     </div>
//                     <div className="" style={{ width: "49%" }}>
//                       <h4 style={{ marginTop: "15px", marginBottom: "10px" }}>
//                         Dimensions*
//                       </h4>
//                       <TextField
//                         fullWidth
//                         variant="outlined"
//                         value={Dimensions}
//                         onChange={(e) => setDimensions(e.target.value)}
//                       />
//                     </div>
//                     <div className="" style={{ width: "49%" }}>
//                       <h4 style={{ marginTop: "15px", marginBottom: "10px" }}>
//                         Material*
//                       </h4>
//                       <TextField
//                         fullWidth
//                         variant="outlined"
//                         value={Materials}
//                         onChange={(e) => setMaterials(e.target.value)}
//                       />
//                     </div>
//                     <div className="" style={{ width: "100%" }}>
//                       <h4 style={{ marginTop: "15px", marginBottom: "10px" }}>
//                         Price US$
//                       </h4>
//                       <TextField
//                         fullWidth
//                         variant="outlined"
//                         value={Price}
//                         type="number"
//                         onChange={(e) => setPrice(e.target.value)}
//                       />
//                     </div>
//                     <div
//                       className="flex items-center"
//                       style={{ width: "100%" }}
//                     >
//                       <Checkbox
//                         checked={IsActive}
//                         onChange={(e) => setIsActive(e.target.checked)}
//                       />
//                       <h4 style={{ marginTop: "15px", marginBottom: "10px" }}>
//                         Is Active
//                       </h4>
//                     </div>
//                     <div className="" style={{ width: "100%" }}>
//                       <h4 style={{ marginTop: "15px", marginBottom: "10px" }}>
//                         Description*
//                       </h4>
//                       <TextField
//                         rows={4}
//                         multiline
//                         fullWidth
//                         variant="outlined"
//                         value={Description}
//                         onChange={(e) => setDescription(e.target.value)}
//                       />
//                     </div>
//                   </div>
//                   <h4 style={{ marginTop: "15px", marginBottom: "10px" }}>
//                     Images*
//                   </h4>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                       flexWrap: "wrap",
//                       flexDirection: "row",
//                     }}
//                   >
//                     <input
//                       accept="image/*"
//                       id="files-uploader-v1"
//                       multiple
//                       hidden
//                       type="file"
//                       onChange={(e) => {
//                         if (!e.target.files || e.target.files.length === 0)
//                           return;
//                         setImages([...Images, ...e.target.files]);
//                       }}
//                     />
//                     <div
//                       onClick={() => {
//                         document.getElementById("files-uploader-v1").click();
//                       }}
//                       style={{
//                         marginTop: "15px",
//                         marginBottom: "20px",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         width: "49%",
//                         height: "200px",
//                         border: "1px dotted black",
//                         background: "#eee",
//                         cursor: "pointer",
//                       }}
//                     >
//                       <h3
//                         style={{
//                           color: "grey",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                         }}
//                       >
//                         <FuseSvgIcon className="text-48 mr-10" size={24}>
//                           heroicons-solid:cloud-upload
//                         </FuseSvgIcon>
//                         Upload image
//                       </h3>
//                     </div>
//                     {Images.map((value, index) => {
//                       return (
//                         <div
//                           key={index}
//                           style={{
//                             marginTop: "15px",
//                             marginBottom: "20px",
//                             display: "flex",
//                             alignItems: "start",
//                             justifyContent: "end",
//                             width: "49%",
//                             height: "200px",
//                             backgroundSize: "contain",
//                             backgroundPosition: "center",
//                             backgroundRepeat: "no-repeat",
//                             backgroundImage: `url(${URL.createObjectURL(value)})`,
//                             border: "1px dotted black",
//                           }}
//                         >
//                           <div
//                             style={{
//                               display: "flex",
//                               justifyContent: "center",
//                               alignItems: "center",
//                             }}
//                           >
//                             <Button
//                               onClick={() => {
//                                 const newImages = Images.filter(
//                                   (val, i) => i !== index,
//                                 );
//                                 setImages(newImages);
//                               }}
//                               variant="contained"
//                               className="mt-4 mr-5"
//                             >
//                               <DeleteIcon style={{ color: "red" }} />
//                             </Button>
//                           </div>
//                         </div>
//                       );
//                     })}
//                     {ExistingImages.map((value, index) => {
//                       return (
//                         <div
//                           key={index}
//                           style={{
//                             marginTop: "15px",
//                             marginBottom: "20px",
//                             display: "flex",
//                             alignItems: "start",
//                             justifyContent: "end",
//                             width: "49%",
//                             height: "200px",
//                             backgroundSize: "contain",
//                             backgroundPosition: "center",
//                             backgroundRepeat: "no-repeat",
//                             backgroundImage: `url(${value.url_low_quality})`,
//                             border: "1px dotted black",
//                           }}
//                         >
//                           <div
//                             style={{
//                               display: "flex",
//                               justifyContent: "center",
//                               alignItems: "center",
//                             }}
//                           >
//                             <Button
//                               onClick={() => {
//                                 const newImages = ExistingImages.filter(
//                                   (val, i) => i !== index,
//                                 );
//                                 setExistingImages(newImages);
//                                 setImagesToDelete([
//                                   ...ImagesToDelete,
//                                   value.id,
//                                 ]);
//                               }}
//                               variant="contained"
//                               className="mt-4 mr-5"
//                             >
//                               <DeleteIcon style={{ color: "red" }} />
//                             </Button>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               }
//             />
//           )}
//         </div>
//       }
//     />
//   );
// }

// export default Products;
