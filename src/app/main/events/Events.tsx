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
import ViewDetails from "src/helpers/ViewDetails";
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
  deleteEventAction,
  getEventAction,
  saveNewEventAction,
  // selectevents,
  updateOldEventAction,
  selectEvent,
  // deleteEventAction,
  // updateOldEventAction,
  // saveNewEventAction,
} from "app/store/eventSlice";
import {
  CodeStatus,
  Event,
  IdealFor,
  TourismTypes,
  Features,
  EventCategories,
  ShopStatus,
} from "../../../helpers/entities";
import { FormControl } from "@mui/base";
import {
  CodeStatusItems,
  EMAIL_REGEX,
  EventCategoriesItems,
  PASSWORD_REGEX,
  RestaurantIdeal,
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
import { getMeuseumAction, selectMeuseum } from "app/store/meuseumSlice";
import { DateFormat } from "src/helpers/DateFormat";
import { Tag } from "@mui/icons-material";
import { type } from "os";
import GoogleComponent from '../commonComponent/googleMap/googleMap'


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

function TourismEvent() {
  const { IsMob, IsTab, IsWeb } = useDevice();
  const dispatch = useAppDispatch();
  const [IsAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false);
  const [IsEditEventDialogOpen, setIsEditEventDialogOpen] = useState(false);
  const [IsLoadingData, setIsLoadingData] = useState(true);
  const [EventBeingDeletedId, setEventBeingDeletedId] = useState<null | string>(
    null,
  );
  const [meuseumName, setMeuseumName] = useState<null | string>()

  const [EventBeingUpdatedId, setEventBeingUpdatedId] = useState<null | string>(
    null,
  );

  const [FormattedEvent, setFormattedEvent] = useState<any>();
  const [SelectedMeuseum, setSelectedMeuseum] = useState<any>(null);
  const [Name, setName] = useState<string>("");
  const [ProfileImage, setProfileImage] = useState<string | File>()
  const [CoverImage, setCoverImage] = useState<string | File>()
  const [Description, setDescription] = useState<string | undefined>("");

  const [PromotionTags, setPromotionTags] = useState<string>();
  const [Price, setPrice] = useState<string>();
  const [shortBio, setShortBio] = useState<string>("");

  const [AverageRating, setAverageRating] = useState<number>(0);
  const [IdealFor, setIdealFor] = useState([]);
  const [Type, setType] = useState<TourismTypes>(TourismTypes.Events);
  const [Status, setStatus] = useState<ShopStatus>(ShopStatus.Active);
  const [Category, setCategory] = useState<EventCategories>();
  const [Lat, setLat] = useState<number>(0);
  const [Long, setLong] = useState<number>(0);
  const [OpenTime, setOpenTime] = useState<string>("");
  const [Organizer, setOrganizer] = useState<string>("");

  const [ErrorMsg, setErrorMsg] = useState("");
  const [IsLoadingDialog, setIsLoadingDialog] = useState(false);

  const [IsEditing, setIsEditing] = useState(false);

  const [EventBeingEditedId, setEventBeingEditedId] = useState<null | string>(
    null,
  );
  const [IsEventViewDialogOpen, setIsEventViewDialogOpen] =
    useState(false);

  const [EventBeingViewed, setEventBeingViewed] = useState<
    null | string
  >(null);

  const eventData = useSelector(selectEvent);
  const meuseumData = useSelector(selectMeuseum);

  //testing input field
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };



  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag) {
        setTags([...tags, newTag]);
        setInputValue('');
      }
    }
  };
  const eventTagsString = tags.join(' | ');



  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // const shopsData = useSelector(selectRestaurants);

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

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

  const IdealForData = [
    // { heading: "Ideal For", value: IdealFor ? IdealFor.join(", ") : [] },
    { heading: "Name", value: `${Name}` },
    { heading: "Description", value: `${Description}` },
    { heading: "Lat", value: Lat },
    { heading: "Long", value: Long },
    { heading: "Short Bio ", value: shortBio },
    { heading: "Open Time ", value: OpenTime },
    { heading: "Organization Name ", value: Organizer },
    { heading: "Price", value: Price },
    { heading: "Types", value: Type },
    { heading: "Promotional Tags", value: PromotionTags },
    { heading: "Meuseum Name", value: meuseumName },
    { heading: "Category", value: Category },
    { heading: "Status", value: Status ? "true" : "false" },
    { heading: "Tags", value: tags ? tags.join(", ") : [] },

  ]

  useEffect(() => {
    const formattedEventData = eventData.map((event) => {
      const formattedDate = DateFormat(event.openTime);

      return { ...event, openTime: formattedDate };
    });
    setFormattedEvent(formattedEventData);
  }, [eventData]);

  useEffect(() => {
    getEvent();
  }, []);

  useEffect(() => {
    let event
    if (EventBeingEditedId || EventBeingViewed && eventData) {
      if (EventBeingViewed) {
        event = eventData.find((p) => p.id === EventBeingViewed);
      } else if (EventBeingEditedId) {
        event = eventData.find(
          (p) => p.id === EventBeingEditedId,
        );
      }
      if (event) {


        const convertedIdealFor = event.idealFor.map((item) => {
          return { value: item, label: item };
        })


          ;

        const eventTagData = event?.eventTags?.split('|').map(tag => tag.trim()) || [];

        const date = new Date(event.openTime);
        const day = date.getDate();
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        const month = monthNames[date.getMonth()];

        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const formattedDate = `${day} ${month} ${year} (${hours}:${minutes})`;

        setName(event.name);
        setShortBio(event.shortBio);
        setProfileImage(event.profileImage);
        setCoverImage(event.coverImage);
        setDescription(event.description);
        setAverageRating(event.averageRating);
        setTags(eventTagData)
        setIdealFor(convertedIdealFor || []);
        setType(event.type);
        setPrice(event.startingPrice);
        setMeuseumName(event.meuseumName)
        setOrganizer(event.organizer);
        setCategory(event.eventCategoryName);
        setPromotionTags(event.promotionalTag);
        setLat(event.lat);
        setLong(event.long);
        setOpenTime(`${formattedDate}`);

        if (meuseumData) {
          const meuseum = meuseumData.find((p) => p.id === event.meuseumId);
          setSelectedMeuseum(meuseum);
        }
      }
    }
  }, [EventBeingEditedId, EventBeingViewed, eventData]);

  useEffect(() => {
    if (!IsAddEventDialogOpen) {
      setName("");
      setShortBio("");
      setProfileImage("");
      setCoverImage("");
      setDescription(undefined);
      setAverageRating(0);
      setTags([]);
      setIdealFor([]);
      setType(TourismTypes.Events); // Assuming you have a default type
      setLat(0);
      setPrice("");
      setOrganizer("");
      setPromotionTags("");
      setCategory(null);
      setLong(0);
      setOpenTime("");
      setErrorMsg("");
      setIsLoadingDialog(false);
      setIsEditing(false);
      setEventBeingEditedId(null);
      setSelectedMeuseum(null);
    }
  }, [IsAddEventDialogOpen]);

  useEffect(() => {
    console.log("SelectedMeuseum", SelectedMeuseum);
  }, [SelectedMeuseum]);

  

  async function initEdit(id: string) {
    setEventBeingEditedId(id);
    setIsAddEventDialogOpen(true);
    setIsEditing(true);
  }
  async function initView(id: string) {
    setEventBeingViewed(id);
    setIsEventViewDialogOpen(true);
  }

  async function getEvent() {
    setIsLoadingData(true);
    await dispatch(getEventAction());
    await dispatch(getMeuseumAction());
    setIsLoadingData(false);
  }

  const handleEventChange = (_, newValue) => {
    setSelectedMeuseum(newValue);
  };

  async function deleteEvent(id: string) {
    setEventBeingDeletedId(id);
    await dispatch(deleteEventAction(id));
    await dispatch(getEventAction());
    setEventBeingDeletedId(null);
  }

  async function updateEventStatus(id: string, newStatus: ShopStatus) {
    setEventBeingUpdatedId(id);
    await dispatch(updateOldEventAction(id, { status: newStatus }));
    await dispatch(getEventAction());
    setEventBeingUpdatedId(null);
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

  async function saveUpdateData() {
    if (
      !Name ||
      !ProfileImage ||
      !CoverImage ||
      !PromotionTags ||
      !shortBio ||
      !IdealFor ||
      !Type ||
      !tags ||
      !Lat ||
      !Long ||
      !Category ||
      !OpenTime ||
      !Organizer ||
      !Price
    )
      throw "Please fill all the required fields";

    let meuseumId = null;
    if (SelectedMeuseum) meuseumId = SelectedMeuseum.id;
    const profileImageLink = await uploadImage();
    const coverImageLink = await uploadCoverImage();


    setErrorMsg("");
    setIsLoadingDialog(true);

    let tag2 = PromotionTags.split(",") || [];

    const transformedIdealFor = IdealFor.map((item) => item.value);

    const body: Partial<Event> = {
      name: Name,
      profileImage: profileImageLink,
      coverImage: coverImageLink,
      description: Description,
      eventTags: eventTagsString,
      shortBio: shortBio,
      lat: Lat,
      long: Long,
      // type: Type,
      idealFor: transformedIdealFor,
      eventCategoryName: Category,
      openTime: OpenTime,
      promotionalTag: PromotionTags,
      organizer: Organizer,
      startingPrice: Price,
      status: Status,
      meuseumId: meuseumId,
    };

    return body;
  }

  async function saveEvent() {
    try {
      const body = await saveUpdateData();

      const id = await dispatch(saveNewEventAction({ type: Type, ...body }));
      if (id !== ("Event Created succesfully" as any)) throw id;

      await dispatch(getEventAction());
      setIsLoadingDialog(false);
      setIsAddEventDialogOpen(false);
      dispatch(
        showMessage({
          message: "Event added successfully!", //text or html
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

  async function updateEvent() {
    try {
      const body = await saveUpdateData();

      const response = await dispatch(
        updateOldEventAction(EventBeingEditedId, body),
      );
      if (response !== ("Updated successfully" as any)) throw response;
      await dispatch(getEventAction());
      setIsLoadingDialog(false);
      setIsAddEventDialogOpen(false);
      setIsEditEventDialogOpen(false);
      dispatch(
        showMessage({
          message: "Event updated successfully!", //text or html
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
  let IsAddBeachDialogOpen: any
  const handleLocationChange = (latitude: any, longitude: any) => {
    setLat(latitude);
    setLong(longitude);
  };
  return (
    <Root
      header={
        <div className="p-24">
          <h1>Events</h1>
        </div>
      }
      content={
        <div className="p-24 w-full">
          <br />

          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setIsEditEventDialogOpen(false);
              setIsAddEventDialogOpen(true);
            }}
          >
            <AddCircleOutlineIcon /> Add Event
          </Button>


          <h1 style={{ marginTop: "50px", marginBottom: "50px" }}>
            Event List :
          </h1>



          {FormattedEvent ? (
            <TableComp
              data={FormattedEvent}
              isLoading={IsLoadingData}
              // rowsToShow={5}
              columns={[
                {
                  Heading: "Pictures",
                  accessor: "images",
                  Cell: (row: Event) => (
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
                  Cell: (row: Event, index) => {
                    if (EventBeingEditedId === row.id)
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
                                          updateEventStatus(
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
                  Cell: (row: Event, index) => {
                    if (EventBeingDeletedId === row.id)
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

          
          {IsAddEventDialogOpen && (
            <DialogWrapper
              isOpen={IsAddEventDialogOpen}
              onClose={() => setIsAddEventDialogOpen(false)}
              title={IsEditing ? "Update Event" : "Add Event"}
              maxWidth="lg"
              errorMsg={ErrorMsg}
              isLoadingActions={IsLoadingDialog}
              onSave={() => {
                if (IsEditing) {
                  updateEvent();
                } else {
                  saveEvent();
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
                    className="flex items-end justify-between flex-wrap"

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
                      label="Short Bio"
                      value={shortBio || ""}
                      onChange={setShortBio}
                      type="text"
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
                      label="Organizer Name*"
                      value={Organizer}
                      onChange={setOrganizer}
                      type="text"
                    />

                    <InputField
                      label="Price*"
                      value={Price}
                      onChange={setPrice}
                      type="text"
                    />


                    <InputField
                      label="PromotionTags"
                      value={PromotionTags}
                      onChange={setPromotionTags}
                      type="text"
                    />



                    <StatusSelect
                      label="Types*"
                      value={Type}
                      onChange={setType}
                      menuItems={TourismType}
                    />

                    <StatusSelect
                      label="Status*"
                      value={Status}
                      onChange={setStatus}
                      menuItems={StatusValue}
                    />

                    <StatusSelect
                      label="Category*"
                      value={Category}
                      onChange={setCategory}
                      menuItems={EventCategoriesItems}
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
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyPress={handleInputKeyPress}
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
                        options={TourismIdealFor}
                        getOptionLabel={(option) => option.label}
                        value={IdealFor}
                        onChange={(event, newValue) => setIdealFor(newValue)}
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

                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={meuseumData}
                      getOptionLabel={(customer) => customer.name}
                      value={SelectedMeuseum}
                      onChange={handleEventChange}
                      sx={{ width: "100%", margin: "15px 0px" }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Add This Event Inside the Meuseum"
                        />
                      )}
                    />
                  </div>
                </div>
              }
            />
          )}
          {
            IsEventViewDialogOpen && (

              <DialogWrapper
                isOpen={IsEventViewDialogOpen}
                onClose={() => setIsEventViewDialogOpen(false)}
                title="View Event"
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

                      {IdealForData.map((tag, index) => (
                        <ViewDetails
                          key={index}
                          heading={tag.heading}
                          value={tag.value}
                        />
                      ))}

                      <ViewDetails
                        heading="Ideal For"
                        value={IdealFor.map(item => item.value).join(", ")}
                      />









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

export default TourismEvent;
