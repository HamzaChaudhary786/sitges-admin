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
import { Fragment, useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useSelector } from "react-redux";
import { useAppDispatch } from "app/store/store";
import { TableComp } from "app/shared-components/TableComp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ViewDetails from "src/helpers/ViewDetails";
import BlockIcon from "@mui/icons-material/Block";
import {
  closeDialog,
  openDialog,
} from "@fuse/core/FuseDialog/store/fuseDialogSlice";
import { useDevice } from "src/helpers/useDevice";
import { showMessage } from "@fuse/core/FuseMessage/store/fuseMessageSlice";
import {
  deleteBeachAction,
  getBeachAction,
  saveNewBeachAction,
  // selectbeachs,
  updateOldBeachAction,
  selectBeach,
  // deleteBeachAction,
  // updateOldBeachAction,
  // saveNewBeachAction,
} from "app/store/beachSlice";
import {
  CodeStatus,
  Beach,
  IdealFor,
  ProfileStatus,
  Features,
} from "../../../helpers/entities";
import { FormControl } from "@mui/base";
import {
  CodeStatusItems,
  EMAIL_REGEX,
  PASSWORD_REGEX,
  RestaurantIdeal,
  TourismFeatures,
  BeachFeatures,
  TourismIdealFor,
  StatusValue,
  TourismType,
} from "src/helpers/constants";
import { string } from "zod";
import {
  selectRestaurants,
  uploadImageToAWSAndGetLink,
} from "app/store/restaurantSlice";
import StatusSelect from "src/helpers/StatusSelect";
import InputField from "src/helpers/InputField";
import { Stack } from "@mui/system";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { DateFormat } from "src/helpers/DateFormat";
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
  const [IsAddBeachDialogOpen, setIsAddBeachDialogOpen] = useState(false);
  const [IsEditBeachDialogOpen, setIsEditBeachDialogOpen] = useState(false);
  const [IsLoadingData, setIsLoadingData] = useState(true);
  const [IsBeachViewDialogOpen, setIsBeachViewDialogOpen] =
    useState(false);


  const [BeachBeingViewed, setBeachBeingViewed] = useState<
    null | string
  >(null);


  const [Name, setName] = useState<string>("");
  const [danger, setDanger] = useState<string>("");
  const [caution, setCaution] = useState<string>("");
  const [safe, setSafe] = useState<string>("");
  const [ProfileImage, setProfileImage] = useState<string | File>()
  const [CoverImage, setCoverImage] = useState<string | File>()
  const [Status, setStatus] = useState("");


  const [Description, setDescription] = useState<string | undefined>("");
  const [ImportantInformation, setImportantInformation] = useState<
    string | undefined
  >("");
  const [AverageRating, setAverageRating] = useState<number>(0);
  const [IdealFor, setIdealFor] = useState([]);
  const [Lat, setLat] = useState<number>(0);
  const [Long, setLong] = useState<number>(0);
  const [Features, setFeatures] = useState([]);
  const [OpenTime, setOpenTime] = useState<string>("");
  const [ErrorMsg, setErrorMsg] = useState("");
  const [IsLoadingDialog, setIsLoadingDialog] = useState(false);
  const [IsEditing, setIsEditing] = useState(false);
  const [ApproveStatus, setApproveStatus] = useState();
  const [BeachBeingDeletedId, setBeachBeingDeletedId] = useState<
    null | string
  >(null);
  const [BeachBeingEditedId, setBeachBeingEditedId] = useState<null | string>(
    null,
  );
  const [shortBio, setShortBio] = useState<string>("");

  const [FormattedBeach, setFormattedBeach] = useState<any>();

  const beachData = useSelector(selectBeach);
  const newImageStyle = {
    marginTop: "15px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "start",
    justifyContent: "end",
    width: IsEditing ? "40%" : "48%",
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

  const detailsData = [
    { heading: "Name", value: `${Name}` },
    { heading: "Description", value: `${Description}` },
    { heading: "Lat", value: Lat },
    { heading: "Long", value: Long },
    { heading: "Short Bio ", value: shortBio },
    { heading: "Important Information", value: ImportantInformation },
    { heading: "Safe", value: safe },
    { heading: "Caution", value: caution },
    { heading: "Danger", value: danger },
    // { heading: "Ideal For", value: IdealFor ? IdealFor.join(", ") : [] },
    // { heading: "Features", value: Features ? Features.join(", ") : [] },
  ];

  useEffect(() => {
    getBeach();
  }, []);


  useEffect(() => {
    console.log("Formatted Beach", FormattedBeach);
  }, [FormattedBeach]);

  useEffect(() => {
    let beach;
    if (BeachBeingViewed || BeachBeingEditedId && beachData) {
      if (BeachBeingViewed) {
        beach = beachData.find((p) => p.id === BeachBeingViewed);
      } else if (BeachBeingEditedId) {
        beach = beachData.find(
          (p) => p.id === BeachBeingEditedId,
        );
      }
      if (beach) {

        let convertedIdealFor;

        let convertedFeatures;

        convertedIdealFor = beach.idealFor.map((item) => {
          return { value: item, label: item };
        });



        convertedFeatures = beach.features.map((item) => {
          return { value: item, label: item };
        });


        // const convertedIdealFor = beach.idealFor.map((item) => {
        //   return { value: item, label: item };
        // });
        // const convertedFeatures = beach.features.map((item) => {
        //   return { value: item, label: item };
        // });
        setName(beach.name);
        setSafe(beach.safe);
        setDanger(beach.danger);
        setCaution(beach.caution);
        setProfileImage(beach.profileImage);
        setStatus(beach.status);
        setCoverImage(beach.coverImage)
        setDescription(beach.description);
        setImportantInformation(beach.importantInformation);
        setAverageRating(beach.averageRating);
        setLat(beach.lat);
        setShortBio(beach.shortDescription)
        setLong(beach.long);
        setIdealFor(convertedIdealFor || []);
        setFeatures(convertedFeatures || []);

      }
    }
  }, [BeachBeingViewed, BeachBeingEditedId, beachData]);

  useEffect(() => {
    if (!IsAddBeachDialogOpen) {
      setName("");
      setSafe("");
      setCaution("");
      setDanger("");
      setProfileImage("");
      setStatus("");
      setCoverImage("");
      setDescription(undefined);
      setImportantInformation(undefined);
      setAverageRating(0);
      setIdealFor([]);
      setLat(0);
      setShortBio("");
      setLong(0);
      setFeatures([]);
      setOpenTime("");
      setErrorMsg("");
      setIsLoadingDialog(false);
      setIsEditing(false);
      setBeachBeingEditedId(null);
    }
  }, [IsAddBeachDialogOpen]);

  async function initEdit(id: string) {
    setBeachBeingEditedId(id);
    setIsAddBeachDialogOpen(true);
    setIsEditing(true);
  }

  async function getBeach() {
    setIsLoadingData(true);
    await dispatch(getBeachAction());

    setIsLoadingData(false);
  }

  async function deleteBeach(id: string) {
    setBeachBeingDeletedId(id);
    await dispatch(deleteBeachAction(id));
    await dispatch(getBeachAction());
    setBeachBeingDeletedId(null);
  }
  async function initView(id: string) {
    setBeachBeingViewed(id);
    setIsBeachViewDialogOpen(true);
  }

  // async function updateBeachStatus(id: string, newStatus: CodeStatus) {
  //   setBeachBeingUpdatedId(id);
  //   await dispatch(updateOldBeachAction(id, { status: newStatus }));
  //   await dispatch(getBeachAction());
  //   setBeachBeingUpdatedId(null);
  // }
  async function ApproveBeach(id: string) {
    await dispatch(
      updateOldBeachAction(id, { approveStatus: ProfileStatus.Approved }),
    );
    await dispatch(getBeachAction());
  }
  async function RejectRestaurant(id: string) {
    await dispatch(
      updateOldBeachAction(id, { approveStatus: ProfileStatus.Rejected }),
    );
    await dispatch(getBeachAction());
  }


  async function RejectBeach(id: string) {
    await dispatch(
      updateOldBeachAction(id, { approveStatus: ProfileStatus.Rejected }),
    );
    await dispatch(getBeachAction());
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

  async function saveBeach() {
    try {
      const body = await updateSaveBeach();
      const id = await dispatch(saveNewBeachAction(body));
      if (id !== ("Beach Created succesfully" as any)) throw id;

      await dispatch(getBeachAction());
      setIsLoadingDialog(false);
      setIsAddBeachDialogOpen(false);
      dispatch(
        showMessage({
          message: "Beach added successfully!", //text or html
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


  async function updateSaveBeach() {



    if (
      !Name ||
      !ProfileImage ||
      !CoverImage ||
      !IdealFor ||
      !Status ||
      !safe ||
      !danger ||
      !caution ||
      !shortBio ||
      !Lat ||
      !Long ||
      !Features
    )
      throw "Please fill all the required fields";



    // const images = await Promise.all(
    //   Images.map(async (image) => {
    //     if (image instanceof File) {
    //       const link = await dispatch(uploadImageToAWSAndGetLink(image));
    //       if (typeof link !== "string") {
    //         throw new Error("Error while saving the background image");
    //       }
    //       return link;
    //     } else if (typeof image === "string") {
    //       return image;
    //     } else {
    //       return "No image";
    //     }
    //   }),
    // );

    // let updatedImages;
    // if (NewImages) {
    //   let newImage = await Promise.all(
    //     NewImages.map(async (image) => {
    //       if (image instanceof File) {
    //         const link = await dispatch(uploadImageToAWSAndGetLink(image));
    //         if (typeof link !== "string") {
    //           throw new Error("Error while saving the background image");
    //         }
    //         return link;
    //       } else {
    //         return "No Image";
    //       }
    //     }),
    //   );
    //   updatedImages = images.concat(newImage);
    // }
    const profileImageLink = await uploadImage();
    const coverImageLink = await uploadCoverImage();
    setErrorMsg("");
    setIsLoadingDialog(true);

    const transformedIdealFor = IdealFor.map((item) => item.value);
    const transformedFeatures = Features.map((item) => item.value);


    console.log("IdealFor", IdealFor)
    console.log("transformedIdealFor", transformedIdealFor)

    const body: Partial<Beach> = {
      name: Name,

      profileImage: profileImageLink,
      status: Status,
      coverImage: coverImageLink,
      lat: Lat,
      shortDescription: shortBio,
      long: Long,
      approveStatus: ApproveStatus,
      beachDetails: {
        description: Description,
        importantInformation: ImportantInformation,
        idealFor: transformedIdealFor,
        features: transformedFeatures,
        safe: safe,
        danger: danger,
        caution: caution,
      },
    };

    return body;
  }

  async function updateBeach() {
    try {
      const body = await updateSaveBeach();
      const response = await dispatch(
        updateOldBeachAction(BeachBeingEditedId, body),
      );
      if (response !== ("Updated successfully" as any)) throw response;
      await dispatch(getBeachAction());
      setIsLoadingDialog(false);
      setIsAddBeachDialogOpen(false);
      setIsEditBeachDialogOpen(false);
      dispatch(
        showMessage({
          message: "Beach updated successfully!", //text or html
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
  let IsAddRestaurantDialogOpen: any
  let IsAddMeuseumDialogOpen: any
  let IsAddEventDialogOpen: any
  const handleLocationChange = (latitude: any, longitude: any) => {
    setLat(latitude);
    setLong(longitude);
  }


  return (
    <Root
      header={
        <div className="p-24">
          <h1>Beaches</h1>
        </div>
      }
      content={
        <div className="p-24 w-full">
          <br />

          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setIsEditBeachDialogOpen(false);
              setIsAddBeachDialogOpen(true);
            }}
          >
            <AddCircleOutlineIcon /> Add Beach
          </Button>
          <h1 style={{ marginTop: "50px", marginBottom: "50px" }}>
            Beach List :
          </h1>
          <TableComp
            data={beachData}
            isLoading={IsLoadingData}
            // rowsToShow={5}
            columns={[
              {
                Heading: "Pictures",
                accessor: "images",
                Cell: (row: Beach) => (
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
                Heading: "Actions",
                Cell: (row: Beach, index) => {
                  if (BeachBeingDeletedId === row.id)
                    return <CircularProgress />;
                  return (
                    <>
                      <IconButton
                        onClick={() => initView(row.id)}
                        className="mt-4 mr-5"
                      >
                        <VisibilityIcon color="primary" />
                      </IconButton>

                      {row.approveStatus === "AwaitingApproval" ? (
                        <>
                          <IconButton
                            onClick={() => ApproveBeach(row.id)}
                            className="mt-4 mr-5"
                          >
                            <CheckCircleIcon color="success" />
                          </IconButton>

                          <IconButton
                            onClick={() => RejectBeach(row.id)}
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

                        </>
                      )}
                    </>
                  );
                },
              },
            ]}
          />


          {IsAddBeachDialogOpen && (
            <DialogWrapper
              isOpen={IsAddBeachDialogOpen}
              onClose={() => setIsAddBeachDialogOpen(false)}
              title={IsEditing ? "Update Beach" : "Add Beach"}
              maxWidth="lg"
              errorMsg={ErrorMsg}
              isLoadingActions={IsLoadingDialog}
              onSave={() => {
                if (IsEditing) {
                  updateBeach();
                } else {
                  saveBeach();
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
                      label="Description"
                      value={Description || ""}
                      onChange={setDescription}
                      type="text"
                    />
                    <InputField
                      label="Short Bio*"
                      value={shortBio}
                      onChange={setShortBio}
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
                    <GoogleComponent IsAddBeachDialogOpen={IsAddBeachDialogOpen} IsAddEventDialogOpen={IsAddEventDialogOpen} onLocationChange={handleLocationChange} IsAddRestaurantDialogOpen={IsAddRestaurantDialogOpen} IsAddMeuseumDialogOpen={IsAddMeuseumDialogOpen} />

                    <InputField
                      label="Important Information"
                      value={ImportantInformation || ""}
                      onChange={setImportantInformation}
                      type="text"
                    />

                    <InputField
                      label="Safe"
                      value={safe || ""}
                      onChange={setSafe}
                      type="text"
                    />

                    <InputField
                      label="Caution"
                      value={caution || ""}
                      onChange={setCaution}
                      type="text"
                    />

                    <InputField
                      label="Danger"
                      value={danger || ""}
                      onChange={setDanger}
                      type="text"
                    />

                    <StatusSelect
                      label="status*"
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
                        onChange={(event, newValue) => setIdealFor(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label="Ideal For*"
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
                        options={BeachFeatures}
                        getOptionLabel={(option) => option.label}
                        value={Features}
                        onChange={(event, newValue) => setFeatures(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label="Features*"
                            placeholder="Features"
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
            IsBeachViewDialogOpen && (

              <DialogWrapper
                isOpen={IsBeachViewDialogOpen}
                onClose={() => setIsBeachViewDialogOpen(false)}
                title="View Beach"
                maxWidth="lg"
                errorMsg={ErrorMsg}
                isLoadingActions={IsLoadingDialog}
                onSave={() => {
                  if (IsEditing) {
                    updateBeach();
                  } else {
                    saveBeach();
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

                    {/* <div
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
                      <ViewDetails heading="Description" value={Description} />


                      <ViewDetails heading="Lat" value={Lat} />
                      <ViewDetails heading="Long" value={Long} />
                      <ViewDetails heading="Short Bio" value={shortBio} />
                      <ViewDetails heading="Important Information" value={ImportantInformation} />
                      <ViewDetails heading="Safe" value={safe} />
                      <ViewDetails heading="Caution" value={caution} />
                      <ViewDetails heading="Danger" value={danger} />
                      {IdealFor.map((ideal, index) => (
                        <ViewDetails
                          key={index}
                          heading="Ideal For"
                          value={ideal.value}
                        />
                      ))}
                      {Features.map((feature, index) => (
                        <ViewDetails
                          key={index}
                          heading="Feature"
                          value={feature.value}
                        />
                      ))}








                    </div> */}



                    {
                      detailsData.map((detail, index) => {
                        return (
                          <>
                            <ViewDetails
                              key={index}
                              heading={detail.heading}
                              value={detail.value}
                            />

                          </>
                        )
                      })
                    }

                    <ViewDetails
                      heading="Ideal For"
                      value={IdealFor.map(item => item.value).join(", ")}
                    />
                    <ViewDetails
                      heading="Features"
                      value={Features.map(item => item.value).join(", ")}
                    />






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
