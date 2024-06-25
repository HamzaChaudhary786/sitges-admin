import DemoContent from "@fuse/core/DemoContent";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import ViewDetails from "src/helpers/ViewDetails";
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
import { Fragment, useEffect, useState } from "react";
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
  deleteMeuseumAction,
  getMeuseumAction,
  saveNewMeuseumAction,
  // selectmeuseums,
  updateOldMeuseumAction,
  selectMeuseum,
  // deleteMeuseumAction,
  // updateOldMeuseumAction,
  // saveNewMeuseumAction,
} from "app/store/meuseumSlice";
import {
  CodeStatus,
  Meuseum,
  IdealFor,
  TourismTypes,
  Features,
  ShopStatus,
} from "../../../helpers/entities";
import { FormControl } from "@mui/base";
import {
  CodeStatusItems,
  EMAIL_REGEX,
  MeuseumStyle,
  RestaurantIdeal,
  ShopStatusItems,
  StatusValue,
  TourismFeatures,
  TourismIdealFor,
  TourismType,
} from "src/helpers/constants";
import { string } from "zod";
import {
  getRestaurantUsersAction,
  selectRestaurants,
  uploadImageToAWSAndGetLink,
} from "app/store/restaurantSlice";
import StatusSelect from "src/helpers/StatusSelect";
import InputField from "src/helpers/InputField";
import { Stack } from "@mui/system";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { DateFormat } from "src/helpers/DateFormat";
import MultiField from "src/helpers/MultiField";
import GoogleComponent from "../commonComponent/googleMap/googleMap"
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
  const [IsAddMeuseumDialogOpen, setIsAddMeuseumDialogOpen] = useState(false);
  const [IsEditMeuseumDialogOpen, setIsEditMeuseumDialogOpen] = useState(false);
  const [IsMeuseumViewDialogOpen, setIsMeuseumViewDialogOpen] = useState(false)
  const [IsLoadingData, setIsLoadingData] = useState(true);
  const [MeuseumBeingDeletedId, setMeuseumBeingDeletedId] = useState<
    null | string
  >(null);
  const [ProfileImage, setProfileImage] = useState<string | File>()
  const [CoverImage, setCoverImage] = useState<string | File>()
  const [MeuseumBeingUpdatedId, setMeuseumBeingUpdatedId] = useState<
    null | string
  >(null);

  const [FormattedMeuseum, setFormattedMeuseum] = useState<any>();

  const [Name, setName] = useState<string>("");
  const [Images, setImages] = useState<File[] | string[]>([]);
  const [Description, setDescription] = useState<string | undefined>("");
  const [PromotionTags, setPromotionTags] = useState<string>("");
  const [Price, setPrice] = useState<string>();

  const [AverageRating, setAverageRating] = useState<number>(0);
  const [IdealFor, setIdealFor] = useState([]);
  const [Type, setType] = useState<TourismTypes>(TourismTypes.Meuseum);
  const [Status, setStatus] = useState<ShopStatus>(ShopStatus.Active);
  const [Lat, setLat] = useState<number>(0);
  const [Long, setLong] = useState<number>(0);
  const [OpenTime, setOpenTime] = useState<string>("");
  const [Features, setFeatures] = useState([]);
  const [Style, setStyle] = useState([]);
  const [shortBio, setShortBio] = useState<string>("");
  const [ErrorMsg, setErrorMsg] = useState("");
  const [IsLoadingDialog, setIsLoadingDialog] = useState(false);
  const [IsEditing, setIsEditing] = useState(false);
  const [MeuseumBeingEditedId, setMeuseumBeingEditedId] = useState<
    null | string
  >(null);
  const [MeuseumBeingViewed, setMeuseumBeingViewed] = useState<
    null | string
  >(null);
  const [IsEventViewDialogOpen, setIsEventViewDialogOpen] =
    useState(false);
  const [meuseum, setMeuseum] = useState<string>('');
  const [tags, setTags] = useState([]);


  const handleInputChange = (e) => {
    setMeuseum(e.target.value);

  };





  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = meuseum.trim();
      if (newTag) {
        setTags([...tags, newTag]);
        setMeuseum('');
      }
    }
  };
  const meuseumTagsString = tags.join(',');

  console.log("meusuem is", meuseumTagsString)




  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };




  const [specialities, setSpecialities] = useState<string>('');
  const [specialitiesTags, setSpecialitiesTags] = useState([]);


  const handleSpecialitiesChange = (e) => {
    setSpecialities(e.target.value);

  };





  const handleSpecialitiesKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = specialities.trim();
      if (newTag) {
        setSpecialitiesTags([...specialitiesTags, newTag]);
        setSpecialities('');
      }
    }
  };



  let IsAddRestaurantDialogOpen;


  const removeSpecialitiesTag = (tagToRemove) => {
    setSpecialitiesTags(specialitiesTags.filter(tag => tag !== tagToRemove));
  };


  const meuseumData = useSelector(selectMeuseum);

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
    const formattedMeuseumData = meuseumData.map((meuseum) => {
      const formattedDate = DateFormat(meuseum.openTime);
      return { ...meuseum, openTime: formattedDate };
    });
    setFormattedMeuseum(formattedMeuseumData);
  }, [meuseumData]);

  useEffect(() => {
    getMeuseum();
  }, []);

  useEffect(() => {
    let meuseum
    if (MeuseumBeingEditedId || MeuseumBeingViewed && meuseumData) {
      if (MeuseumBeingViewed) {
        meuseum = meuseumData.find((p) => p.id === MeuseumBeingViewed);
      } else if (MeuseumBeingEditedId) {
        meuseum = meuseumData.find(
          (p) => p.id === MeuseumBeingEditedId,
        );
      }
      if (meuseum) {
        const convertedIdealFor = meuseum.idealFor.map((item) => {
          return { value: item, label: item };
        });
        const convertedFeatures = meuseum.features.map((item) => {
          return { value: item, label: item };
        });
        const convertedStyle = meuseum.styles.map((item) => {
          return { value: item, label: item };
        });
        const formattedDate = DateFormat(meuseum.openTime);

        const meuseumTagData = meuseum?.specialities?.map(tag => tag.trim()) || [];
        const meuseumData = meuseum?.meuseumTags?.split(',').map(tag => tag.trim()) || [];
        setName(meuseum.name);
        setProfileImage(meuseum.profileImage)
        setCoverImage(meuseum.coverImage)

        setDescription(meuseum.description);
        setAverageRating(meuseum.averageRating);
        setIdealFor(convertedIdealFor);
        setShortBio(meuseum.shortBio)
        setSpecialitiesTags(meuseumTagData)
        setTags(meuseumData)
        // setType(meuseum.type);
        setPrice(meuseum.price);
        setFeatures(convertedFeatures);
        setPromotionTags(meuseum.promotionalTag);
        setLat(meuseum.lat);
        setLong(meuseum.long);
        setStyle(convertedStyle);
        setOpenTime(`${formattedDate}`);
      }
    }
  }, [MeuseumBeingEditedId, MeuseumBeingViewed, meuseumData]);

  useEffect(() => {
    if (!IsAddMeuseumDialogOpen) {
      setName("");
      setImages([]);
      setDescription(undefined);
      setAverageRating(0);
      setProfileImage("");
      setShortBio(""),
      setCoverImage("");
      setIdealFor([]);
      setFeatures([]);
      setPromotionTags("");
      setStyle([]);
      // setType(TourismTypes.Meuseum); // Assuming you have a default type
      setLat(0);
      setLong(0);
      setOpenTime("");
      setErrorMsg("");
      setIsLoadingDialog(false);
      setIsEditing(false);
      setMeuseumBeingEditedId(null);
    }
  }, [IsAddMeuseumDialogOpen]);

  async function initEdit(id: string) {
    setMeuseumBeingEditedId(id);
    setIsAddMeuseumDialogOpen(true);
    setIsEditing(true);
  }
  async function initView(id: string) {
    setMeuseumBeingViewed(id);
    setIsMeuseumViewDialogOpen(true);
  }

  async function getMeuseum() {
    setIsLoadingData(true);
    await dispatch(getMeuseumAction());

    setIsLoadingData(false);
  }

  async function deleteMeuseum(id: string) {
    setMeuseumBeingDeletedId(id);
    await dispatch(deleteMeuseumAction(id));
    await dispatch(getMeuseumAction());
    setMeuseumBeingDeletedId(null);
  }

  async function updateMeuseumStatus(id: string, newStatus: ShopStatus) {
    setMeuseumBeingUpdatedId(id);
    await dispatch(updateOldMeuseumAction(id, { status: newStatus }));
    await dispatch(getMeuseumAction());
    setMeuseumBeingUpdatedId(null);
  }

  async function uploadImage() {
    if (ProfileImage instanceof File) {
      const link = await dispatch(uploadImageToAWSAndGetLink(ProfileImage));
      if (typeof link !== "string") {
        throw new Error("Error while saving the ProfileImage image");
      }
      return link;
    } else return ProfileImage;
  }
  async function uploadCoverImage() {
    if (CoverImage instanceof File) {
      const link = await dispatch(uploadImageToAWSAndGetLink(CoverImage));
      if (typeof link !== "string") {
        throw new Error("Error while saving the CoverImage image");
      }
      return link;
    } else return CoverImage;
  }


  async function saveMeuseum() {
    try {


      if (
        !ProfileImage ||
        !CoverImage ||
        !Name ||
        !Price ||
        !shortBio ||
        !Description ||
        !OpenTime ||
        !Lat ||
        !Status ||
        !Long ||
        !PromotionTags ||
        // !Type ||
        !Features ||
        !IdealFor ||
        !Style
      )
        throw "Please fill all the required fields";
      if (!ProfileImage) throw "Please upload at least one image";

      const transformedIdealFor = IdealFor.map((item) => item.value);
      const transformedFeatures = Features.map((item) => item.value);
      const transformedStyle = Style.map((item) => item.value);

      const profileImageLink = await uploadImage();
      const coverImageLink = await uploadCoverImage();

      setErrorMsg("");
      setIsLoadingDialog(true);

      //profile and cover image

      const body: Partial<Meuseum> = {
        name: Name,
        profileImage: profileImageLink,
        coverImage: coverImageLink,
        shortBio: shortBio,
        meuseumTags: meuseumTagsString,
        lat: Lat,
        long: Long,
        // type: Type,
        openTime: OpenTime,
        promotionalTag: PromotionTags,
        price: Price,
        status: Status,
        meuseumDetails: {
          description: Description,
          idealFor: transformedIdealFor,
          features: transformedFeatures,
          styles: transformedStyle,
          specialities: specialitiesTags,

        },
      };
      const id = await dispatch(saveNewMeuseumAction(body));
      if (id !== ("Meuseum Created succesfully" as any)) throw id;

      await dispatch(getMeuseumAction());
      setIsLoadingDialog(false);
      setIsAddMeuseumDialogOpen(false);
      dispatch(
        showMessage({
          message: "Meuseum added successfully!", //text or html
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
  let IsAddResDialogOn

  async function updateMeuseum() {
    try {
      if (
        !ProfileImage ||
        !CoverImage ||
        !Name ||
        !Price ||
        !shortBio ||
        !Description ||
        !OpenTime ||
        !Lat ||
        !Status ||
        !Long ||
        !PromotionTags ||
        // !Type ||
        !Features ||
        !IdealFor ||
        !Style
      )
        throw "Please fill all the required fields";





      setErrorMsg("");
      setIsLoadingDialog(true);

      let tag2 = PromotionTags.split(",") || [];

      const transformedIdealFor = IdealFor.map((item) => item.value);
      const transformedFeatures = Features.map((item) => item.value);
      const transformedStyle = Style.map((item) => item.value);

      const body: Partial<Meuseum> = {
        name: Name,
        profileImage: ProfileImage,
        coverImage: CoverImage,
        shortBio: shortBio,
        lat: Lat,
        long: Long,
        // type: Type,
        openTime: OpenTime,
        promotionalTag: PromotionTags,
        price: Price,
        status: Status,
        meuseumDetails: {
          description: Description,
          idealFor: transformedIdealFor,
          features: transformedFeatures,
          styles: transformedStyle,
          specialities: specialitiesTags,

        },
      };

      const response = await dispatch(
        updateOldMeuseumAction(MeuseumBeingEditedId, body),
      );
      if (response !== ("Updated successfully" as any)) throw response;
      await dispatch(getMeuseumAction());
      setIsLoadingDialog(false);
      setIsAddMeuseumDialogOpen(false);
      setIsEditMeuseumDialogOpen(false);
      dispatch(
        showMessage({
          message: "Meuseum updated successfully!", //text or html
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
  const handleLocationChange = (latitude, longitude) => {
    setLat(latitude);
    setLong(longitude);
  };
  return (
    <Root
      header={
        <div className="p-24">
          <h1>Meuseums</h1>
        </div>
      }
      content={
        <div className="p-24 w-full">
          <br />

          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setIsEditMeuseumDialogOpen(false);
              setIsAddMeuseumDialogOpen(true);
            }}
          >
            <AddCircleOutlineIcon /> Add Meuseum
          </Button>
          <h1 style={{ marginTop: "50px", marginBottom: "50px" }}>
            Meuseum List :
          </h1>
          {FormattedMeuseum ? (
            <TableComp
              data={FormattedMeuseum}
              isLoading={IsLoadingData}
              // rowsToShow={5}
              columns={[
                {
                  Heading: "Pictures",
                  accessor: "images",
                  Cell: (row: Meuseum) => (
                    <>
                      {row.profileImage ? (
                        <img
                          src={typeof row.profileImage === 'string' ? row.profileImage : URL.createObjectURL(row.profileImage)}
                          alt="First Image"
                          style={{ maxWidth: "80px", maxHeight: "80px" }}
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
                  Heading: "Ratings",
                  accessor: "averageRating",
                },
                {
                  Heading: "Open Time",
                  accessor: "openTime",
                },
                {
                  Heading: "Status",
                  Cell: (row: Meuseum, index) => {
                    if (MeuseumBeingEditedId === row.id)
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
                                      {row.status === ShopStatus.InActive
                                        ? "Active"
                                        : "InActive"}{" "}
                                      "{row.name}"?
                                    </DialogTitle>
                                    <DialogContent>
                                      <DialogContentText id="alert-dialog-description">
                                        {row.status === ShopStatus.InActive
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
                                          updateMeuseumStatus(
                                            row.id,
                                            row.status === ShopStatus.InActive
                                              ? ShopStatus.Active
                                              : ShopStatus.InActive,
                                          );
                                          dispatch(closeDialog());
                                        }}
                                        color={
                                          row.status === ShopStatus.InActive
                                            ? "success"
                                            : "error"
                                        }
                                        autoFocus
                                      >
                                        {row.status === ShopStatus.InActive
                                          ? "Active"
                                          : "InActive"}
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
                              row.status === "Active" ? "Active" : "InActive"
                            }
                            color={
                              row.status === "Active" ? "success" : "error"
                            }
                          />
                        </IconButton>
                      </>
                    );
                  },
                },

                {
                  Heading: "Actions",
                  Cell: (row: Meuseum, index) => {
                    if (MeuseumBeingDeletedId === row.id)
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
                          onClick={() => initView(row.id)}
                          className="mt-4 mr-5"
                        >
                          <VisibilityIcon color="primary" />
                        </IconButton>
                      </>
                    );
                  },
                },
              ]}
            />
          ) : null}
          {IsAddMeuseumDialogOpen && (
            <DialogWrapper
              isOpen={IsAddMeuseumDialogOpen}
              onClose={() => setIsAddMeuseumDialogOpen(false)}
              title={IsEditing ? "Update Meuseum" : "Add Meuseum"}
              maxWidth="lg"
              errorMsg={ErrorMsg}
              isLoadingActions={IsLoadingDialog}
              onSave={() => {
                if (IsEditing) {
                  updateMeuseum();
                } else {
                  saveMeuseum();
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
                    {/* profile Image */}
                    <input
                      accept="image/*"
                      id="files-uploader-v2"
                      multiple
                      hidden
                      type="file"
                      onChange={(e) => {
                        if (!e.target.files || e.target.files.length === 0)
                          return;
                        setCoverImage(e.target.files[0]);
                      }}
                    />
                    <div
                      onClick={() => {
                        document.getElementById("files-uploader-v2").click();
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
                        Upload Cover image
                      </h3>
                    </div>

                    {CoverImage ? (
                      <div style={{ ...newImageStyle }}>
                        {CoverImage instanceof File ? (
                          <div
                            style={{
                              ...new2ImageStyle,
                              backgroundImage:
                                CoverImage instanceof File
                                  ? `url(${URL.createObjectURL(CoverImage)})`
                                  : CoverImage,
                            }}
                          ></div>
                        ) : (
                          <img
                            style={{ width: "100%", height: "200px" }}
                            src={CoverImage}
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
                      label="Price*"
                      value={Price}
                      onChange={setPrice}
                      type="number"
                    />
                    <InputField
                      label="Short Bio"
                      value={shortBio || ""}
                      onChange={setShortBio}
                      type="text"
                    />


                    <div className="w-full my-16">
                      <div>
                        {tags.map((tag, index) => (
                          <div key={index} className="tag inline-block bg-[#ccced1] text-black py-[7px] px-[13px] mr-[5px] mb-[5px] rounded-[50px] cursor-pointer" onClick={() => removeTag(tag)}>
                            {tag}
                          </div>
                        ))}
                      </div>
                      <input
                        type="text"
                        className="mt-16 w-full border-b-1 border-grey-500 pb-12"
                        placeholder="Type and use comma to create tags"
                        value={meuseum}
                        onChange={handleInputChange}
                        onKeyPress={handleInputKeyPress}
                      />
                    </div>

                    <MultiField
                      label="Description"
                      value={Description || ""}
                      onChange={setDescription}
                    />



                    {IsEditing ? (
                      <>
                        <InputField
                          label="Open Time*"
                          value={OpenTime}
                          onChange={setOpenTime}
                          type="text"
                        />
                      </>
                    ) : (
                      <>
                        <InputField
                          label="Open Time*"
                          value={OpenTime}
                          onChange={setOpenTime}
                          type="datetime-local"
                        />
                      </>
                    )}
                    <InputField
                      label="PromotionTags"
                      value={PromotionTags}
                      onChange={setPromotionTags}
                      type="text"
                    />
                    <InputField
                      label="Lat*"
                      value={Lat}
                      onChange={setLat}
                      type="number"
                    />

                    <InputField
                      label="Long*"
                      value={Long}
                      onChange={setLong}
                      type="number"
                    />

                    <GoogleComponent IsAddRestaurantDialogOpen={IsAddRestaurantDialogOpen} onLocationChange={handleLocationChange} IsAddMeuseumDialogOpen={IsAddMeuseumDialogOpen} />



                    {/* <StatusSelect
                      label="Types*"
                      value={Type}
                      onChange={setType}
                      menuItems={TourismType}
                    /> */}

                    <StatusSelect
                      label="Status*"
                      value={Status}
                      onChange={setStatus}
                      menuItems={StatusValue}
                    ></StatusSelect>

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
                        options={TourismIdealFor}
                        getOptionLabel={(option) => option.label}
                        value={IdealFor}
                        onChange={(meuseum, newValue) => setIdealFor(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label="Ideal For"
                            placeholder="Ideal For"
                          />
                        )}
                      />
                    </Stack>

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
                        options={TourismFeatures}
                        getOptionLabel={(option) => option.label}
                        value={Features}
                        onChange={(event, newValue) => setFeatures(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label="Features"
                            placeholder="Features"
                          />
                        )}
                      />
                    </Stack>

                    <div className="w-full my-16">
                      <div>
                        {specialitiesTags.map((tag, index) => (
                          <div key={index} className="tag inline-block bg-[#ccced1] text-black py-[7px] px-[13px] mr-[5px] mb-[5px] rounded-[50px] cursor-pointer" onClick={() => removeSpecialitiesTag(tag)}>
                            {tag}
                          </div>
                        ))}
                      </div>
                      <input
                        type="text"
                        className="mt-16 w-full border-b-1 border-grey-500 pb-12"
                        placeholder="Type and use comma to create specialities tags"
                        value={specialities}
                        onChange={handleSpecialitiesChange}
                        onKeyPress={handleSpecialitiesKeyPress}
                      />
                    </div>


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
                        options={MeuseumStyle}
                        getOptionLabel={(option) => option.label}
                        value={Style}
                        onChange={(event, newValue) => setStyle(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label="Styles"
                            placeholder="Styles"
                          />
                        )}
                      />
                    </Stack>
                  </div>
                </div>
              }
            />
          )}

          {
            IsMeuseumViewDialogOpen && (

              <DialogWrapper
                isOpen={IsMeuseumViewDialogOpen}
                onClose={() => setIsMeuseumViewDialogOpen(false)}
                title="View Meuseum"
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
                    <div className="w-full">

                      {CoverImage ? (
                        <div style={{ ...newImageStyle }}>
                          {CoverImage instanceof File ? (
                            <div
                              style={{
                                ...new2ImageStyle,
                                backgroundImage:
                                  CoverImage instanceof File
                                    ? `url(${URL.createObjectURL(CoverImage)})`
                                    : CoverImage,
                              }}
                            ></div>
                          ) : (
                            <img
                              src={CoverImage}
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
                        value={`${Name}`}
                      />

                      <ViewDetails
                        heading="Description"
                        value={Description}
                      />
                      <ViewDetails
                        heading="Short Bio"
                        value={shortBio}
                      />
                      <ViewDetails
                        heading="Date and Time"
                        value={OpenTime}
                      />
                      {tags.map((tag, index) => (
                        <ViewDetails
                          key={index}
                          heading="Tags Value"
                          value={tag}
                        />
                      ))}
                      <ViewDetails
                        heading="Lat"
                        value={Lat}
                      />
                      <ViewDetails
                        heading="Long"
                        value={Long}
                      />

                      <ViewDetails
                        heading="Price"
                        value={Price}
                      />
                      <ViewDetails
                        heading="Promotional Tags"
                        value={PromotionTags}
                      />
                      <ViewDetails
                        heading="Types"
                        value={Type}
                      />

                      {specialitiesTags.map((tag, index) => (
                        <ViewDetails
                          key={index}
                          heading="Specialities Tag"
                          value={tag}
                        />
                      ))}


                      {IdealFor.map((tag, index) => (
                        <ViewDetails
                          key={index}
                          heading="Ideal For"
                          value={tag.value}
                        />
                      ))}
                      {Features.map((tag, index) => (
                        <ViewDetails
                          key={index}
                          heading="Features"
                          value={tag.value}
                        />
                      ))}
                      {Style.map((tag, index) => (
                        <ViewDetails
                          key={index}
                          heading="Styles"
                          value={tag.value}
                        />
                      ))}





                    </div>
                  </div>

                }
              />
            )
          }
        </div>
      }
    />
  );
}

export default PromoCodes;
