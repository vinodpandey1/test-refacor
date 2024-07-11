// @ts-nocheck

import { FileUploadOutlined } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Radio,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { format } from "date-fns";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import dynamic from "next/dynamic";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useDropzone } from "react-dropzone";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { httpClient } from "src/common/clients/axios.clientv2";
import CouponTypeForm from "src/components/coupons/coupon-type-form";
import ConfirmationDialog from "src/components/coupons/dialogs/confirmation-dialog";
import { API_ENDPOINT_COUPON } from "src/constants/api";
import { ERRORS } from "src/constants/errors/errors";
import couponFormSchema from "src/utils/validations/couponformSchema";
import Icon from "../../../../@core/components/icon";
import { validateCouponCode } from "src/utils/utils";
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);
const CreateCoupon = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [status, setStatus] = useState<boolean>(false);
  const [homepageVisibility, setHomepageVisibility] = useState<boolean>(false);
  const [couponType, setCouponType] = useState<Object>({});
  const [isCustomCoupon, setIsCustomCoupon] = useState<boolean>(false);
  const [selectedCouponType, setSelectedCouponType] = useState("DISCOUNT");
  const [selectedDate, setSelectedDate] = useState<Date>(null);
  const [loading, setLoading] = useState(false);
  const [mediaIcon, setMediaIcon] = useState<File | undefined>(undefined);
  const [fields, setFields] = useState([""]);
  const [isBookingValidity, setIsBookingValidity] = useState(false);
  const [applicableStartDate, setApplicableStartDate] = useState<Date>(null);
  const [applicableEndDate, setApplicableEndDate] = useState<Date>(null);
  const [isHollowCoupon, setIsHollowCoupon] = useState(false);

  const [formErrors, setFormErrors] = useState({
    couponCode: {
      error: false,
      msg: "",
    },
  });
  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createEmpty()
  );
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const handleFocus = () => {
    setTooltipOpen(true);
  };
  const TooltipContent = () => {
    return (
      <Grid container spacing={2} padding={4} whiteSpace={"nowrap"}>
        <Typography
          fontSize={15}
          py={2}
          style={{
            color: "#FF9F43",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          Ensure that these requirements are met
        </Typography>

        <Grid item>
          <ul style={{ padding: 0, margin: 0, fontSize: "13px" }}>
            <li>All capital letters</li>
            <li>Special characters are not allowed</li>
            <li>Space is not allowed</li>
            <li>Code must be unique</li>
          </ul>
        </Grid>
      </Grid>
    );
  };

  const convertToHTML = () => {
    const contentState = editorState.getCurrentContent();

    const rawContentState = convertToRaw(contentState);
    console.log("contentState", rawContentState);
    const markup = draftToHtml(rawContentState);
    return markup;
  };
  console.log("editor", convertToHTML(editorState));

  const resetFormErrors = () => {
    setFormErrors({
      couponCode: {
        error: false,
        msg: "",
      },
    });
  };

  const onChange = (dates: any) => {
    const [start, end] = dates;
    setApplicableStartDate(start);
    setApplicableEndDate(end);
  };

  const handleFieldChange = (index: any, newValue: any) => {
    const newFields = [...fields];
    newFields[index] = newValue;
    setFields(newFields);
  };

  const handleAddField = () => {
    setFields([...fields, ""]);
  };

  const handleRemoveField = (index: number) => {
    const fieldsList = [...fields];
    fieldsList.splice(index, 1);
    setFields(fieldsList);
  };

  const handleClickOpen = () => setIsDialogOpen(true);

  const handleClose = () => setIsDialogOpen(false);

  const handleConfirm = () => {
    reset();
    setIsDialogOpen(false);
    router.push("/home/coupons");
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(event.target.checked);
  };

  const handleHomePageVisibility = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setHomepageVisibility(event.target.checked);
  };

  const onEditorStateChange = (newEditorState: EditorState): void => {
    setEditorState(newEditorState);
  };

  interface CouponForm {
    coupon: {
      code: string;
      name: string;
      description: string;
      is_disabled: boolean;
      terms_and_conditions: string;
      is_visible_homepage: boolean;
      sorting_order: number;
      pdp_sorting_order: number;
      usage_limit: any;
      expiry_date: string;
      min_nights_count: number;
      applicable_date_start?: any;
      applicable_date_end?: any;
      max_nights_count?: any;
    };
    offer: {
      is_custom: boolean;
      type_id: any;
      discount_percentage: number;
      offer_cap_amount: number;
      buy_nights_count: number;
      get_nights_count: number;
      hollow_offer:boolean,
      external_id: string;
    };
    media_icon: File;
  }

  const {
    register,
    handleSubmit,
    control,
    reset,

    getValues,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<CouponForm>();

  const onSubmit: SubmitHandler<CouponForm> = (data) => {
    data.offer.hollow_offer = isHollowCoupon;
    createCoupon(data);
  };

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setMediaIcon(acceptedFiles[0]);
    },
  });

  const toolbarOptions = {
    options: ["inline", "link"],

    inline: {
      options: ["bold", "italic", "underline"],
    },
  };

  const createCoupon = async (data: any) => {
    const couponDescriptionHTML = convertToHTML(editorState);

    let couponObj = {
      code: data.coupon.code,
      name: data.coupon.name,
      description: couponDescriptionHTML,
      is_disabled: !status,
      terms_and_conditions: JSON.stringify(fields),
      is_visible_homepage: homepageVisibility,
      sorting_order: parseInt(data.coupon.sorting_order),
      pdp_sorting_order: parseInt(data.coupon.pdp_sorting_order),
      usage_limit: parseInt(data.coupon.usage_limit),
      expiry_date: selectedDate
        ? format(selectedDate, "yyyy-MM-dd").toString()
        : null,

      min_nights_count: data.coupon.min_nights_count || null,
      max_nights_count: data.coupon.max_nights_count || null,
    };
    if (isBookingValidity) {
      (couponObj.applicable_date_start = applicableStartDate
        ? format(applicableStartDate, "yyyy-MM-dd").toString()
        : null),
        (couponObj.applicable_date_end = applicableEndDate
          ? format(applicableEndDate, "yyyy-MM-dd").toString()
          : null);
    }
    let offerObj = {
      is_custom: isCustomCoupon,
      type_id: (couponType as any)[selectedCouponType],
      discount_percentage: parseInt(data.offer.discount_percentage),
      offer_cap_amount: parseInt(data.offer.offer_cap_amount),
      buy_nights_count: parseInt(data.offer.buy_nights_count),
      get_nights_count: parseInt(data.offer.get_nights_count),
      hollow_offer:data.offer?.hollow_offer,
      external_id: data.offer.external_id,
    };

    let media_icon = mediaIcon || undefined;

    if (!media_icon && !isCustomCoupon) {
      toast.error("Please Upload the Media Icon", {
        position: "top-center",
      });
      return;
    }

    let formData = new FormData();
    formData.append("coupon", JSON.stringify(couponObj));
    formData.append("offer", JSON.stringify(offerObj));
    if (media_icon) {
      formData.append("media_icon", media_icon);
    }

    try {
      setLoading(true);
      const response = await httpClient.post(
        API_ENDPOINT_COUPON.ADD_COUPON,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Coupon Created", {
        position: "top-right",
      });
      reset();
      router.push("/home/coupons");

      return true;
    } catch (err) {
      if (
        err?.response?.data?.statusCode == 500 &&
        err?.response?.data?.message.includes(
          "Coupon code with same name already exists"
        )
      ) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          couponCode: {
            ...prevErrors.couponCode,
            error: true,
            msg: "This code has been used already. Please try a unique code",
          },
        }));
      }
      toast.error(ERRORS.COUPONS.ERROR_CREATING_COUPON, {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCouponTypes = async () => {
    try {
      setLoading(true);
      const response = await httpClient.get(
        API_ENDPOINT_COUPON.GET_COUPON_TYPE
      );

      if (response) {
        setCouponType(response.data);
        return;
      }
    } catch (err) {
      toast.error(ERRORS.COUPONS.ERROR_FETCHING_COUPON_TYPE, {
        position: "top-center",
      });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingValidityChange = (event: any) => {
    setIsBookingValidity(event.target.checked);
  };
  const handleHollowCouponChange = (event: any) => {
    setIsHollowCoupon(event.target.checked);
  };
  const handleCouponCodeChange = (e) => {
    const value = e.target.value;
    const errorMessage = validateCouponCode(value);

    if (errorMessage) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        couponCode: {
          ...prevErrors.couponCode,
          error: true,
          msg: errorMessage,
        },
      }));
    } else {
      resetFormErrors();
    }
  };

  useEffect(() => {
    fetchCouponTypes();
  }, []);
  const onValidityChange = (date) => {
    setSelectedDate(date);
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={10} alignItems="center">
          <Grid item xs={12}>
            <Grid
              container
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Grid item>
                <Grid container spacing={2} alignItems={"center"}>
                  <Grid item>
                    <IconButton
                      onClick={() => {
                        router.back();
                      }}
                      color="primary"
                    >
                      <ArrowBackIcon />
                    </IconButton>
                  </Grid>

                  <Grid item>
                    <Typography fontSize={18} fontWeight={500}>
                      Create Coupon
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item>
                    <Button
                      size="small"
                      variant="contained"
                      color="secondary"
                      onClick={handleClickOpen}
                    >
                      Discard
                    </Button>
                  </Grid>

                  <Grid item>
                    <Button
                      // disabled={loading}
                      type="submit"
                      size="small"
                      variant="contained"
                    >
                      Save Coupon
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Paper>
              <Grid spacing={3} container padding={5} gap={2}>
                <Grid item xs={12}>
                  <Typography fontSize={18} fontWeight={500}>
                    Coupons Details
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Paper
                        elevation={0}
                        sx={{
                          textAlign: "center",
                          paddingTop: 2,
                          border: `1px solid ${
                            !isCustomCoupon ? "#7367F0" : "#DBDADE"
                          }`,
                          paddingBottom: 2,
                          paddingLeft: 6,
                          paddingRight: 6,
                        }}
                      >
                        <Typography
                          fontSize={22}
                          color={!isCustomCoupon ? "#7367F0" : "#4b465b"}
                        >
                          Site wide
                        </Typography>
                        <Typography fontSize={15}>
                          Coupon can be made visible on the website
                        </Typography>
                        <Radio
                          checked={!isCustomCoupon}
                          onChange={(event) =>
                            setIsCustomCoupon(!event.target.checked)
                          }
                        />
                      </Paper>
                    </Grid>
                    <Grid item xs={4}>
                      <Paper
                        elevation={0}
                        sx={{
                          textAlign: "center",
                          paddingTop: 2,
                          border: `1px solid ${
                            isCustomCoupon ? "#7367F0" : "#DBDADE"
                          }`,
                          paddingBottom: 2,
                          paddingLeft: 6,
                          paddingRight: 6,
                        }}
                      >
                        <Typography
                          fontSize={22}
                          color={isCustomCoupon ? "#7367F0" : "#4b465b"}
                        >
                          Personalized
                        </Typography>
                        <Typography fontSize={15}>
                          Share code personally to your guest
                        </Typography>
                        <Radio
                          checked={isCustomCoupon}
                          onChange={(event) =>
                            setIsCustomCoupon(event.target.checked)
                          }
                        />
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <FormControl fullWidth>
                        <label>
                          <Typography fontSize={15}>Coupon Code</Typography>
                        </label>
                        <Tooltip
                          title={<TooltipContent />}
                          open={tooltipOpen}
                          arrow
                          placement="right"
                        >
                          <TextField
                            size={"small"}
                            variant="outlined"
                            placeholder="eg. FLATOFF10"
                            onFocus={handleFocus}
                            {...register("coupon.code", {
                              required: true,
                              onBlur: () => setTooltipOpen(false),
                            })}
                            error={formErrors?.couponCode?.error}
                            onChange={handleCouponCodeChange}
                          />
                        </Tooltip>

                        <span style={{ color: "red", marginTop: "5px" }}>
                          {formErrors?.couponCode?.error &&
                            formErrors?.couponCode?.msg}
                        </span>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <FormControl fullWidth>
                        <label>
                          <Typography fontSize={15}>Coupon Title</Typography>
                        </label>
                        <TextField
                          size={"small"}
                          variant="outlined"
                          {...register("coupon.name", {
                            required: true,
                          })}
                          placeholder="eg. Get 10% OFF up to ₹ 7500"
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <FormControl fullWidth>
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <Typography fontSize={15}>
                            Coupon Description
                          </Typography>{" "}
                          <Typography fontSize={10} color={"#a5a2ad"}>
                            (120 characters only)
                          </Typography>
                        </label>

                        <Editor
                          editorState={editorState}
                          toolbar={toolbarOptions}
                          onEditorStateChange={onEditorStateChange}
                          wrapperClassName="demo-wrapper"
                          editorClassName="demo-editor"
                          toolbarClassName="demo-editor"
                          editorStyle={{
                            border: "1px solid #f1f1f1",
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={8}>
                      <label>
                        <Typography fontSize={15}>Coupon Type</Typography>
                      </label>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <CouponTypeForm
                    isCustomCoupon={isCustomCoupon}
                    register={register}
                    selectedCouponType={selectedCouponType}
                    setSelectedCouponType={setSelectedCouponType}
                    couponType={couponType}
                    formType="create"
                    isBookingValidity={isBookingValidity}
                    isHollowCoupon={isHollowCoupon}
                    handleBookingValidityChange={handleBookingValidityChange}
                    handleHollowCouponChange={handleHollowCouponChange}
                    applicableStartDate={applicableStartDate}
                    applicableEndDate={applicableEndDate}
                    onChange={onChange}
                    status={status}
                    handleStatusChange={handleStatusChange}
                    setSelectedDate={setSelectedDate}
                    selectedDate={selectedDate}
                    onValidityChange={onValidityChange}
                  />
                </Grid>

                {/* file upload */}
                {!(
                  isCustomCoupon &&
                  ["BOGO", "DISCOUNT"].includes(selectedCouponType)
                ) && (
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={8}>
                        <Typography fontSize={14}>Media Icon</Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Grid
                          container
                          {...getRootProps()}
                          alignItems="center"
                          justifyContent="center"
                          sx={{
                            textAlign: "center",
                            paddingTop: 2,
                            border: "1px dashed #DBDADE",
                            paddingBottom: 2,
                            paddingLeft: 6,
                            paddingRight: 6,
                            // position: "relative",
                          }}
                        >
                          <input {...getInputProps()} />

                          {acceptedFiles.length === 0 ? (
                            <Grid
                              paddingBottom={4}
                              paddingTop={4}
                              container
                              spacing={2}
                            >
                              <Grid item xs={12}>
                                <FileUploadOutlined fontSize={"medium"} />
                              </Grid>
                              <Grid item xs={12}>
                                <Typography>
                                  Drag and drop your media file here
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography fontSize={10}>or</Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Button
                                  size={"small"}
                                  sx={{ color: "#7367f0", bgcolor: "#e9e7fd" }}
                                >
                                  Browse image/videos
                                </Button>
                              </Grid>
                            </Grid>
                          ) : (
                            <Grid
                              container
                              alignItems="center"
                              justifyContent="center"
                              position="relative"
                            >
                              <Grid item xs={12}>
                                <img
                                  src={URL.createObjectURL(acceptedFiles[0])}
                                  alt="Preview"
                                  height={"96px"}
                                  width={"96px"}
                                />
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                style={{
                                  position: "absolute",
                                  top: "50%",
                                  right: "38%",
                                  transform: "translateY(-50%)",
                                }}
                              >
                                <IconButton
                                  onClick={() => setMediaIcon(undefined)}
                                  size="small"
                                  style={{
                                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                                    borderRadius: "50%",
                                  }}
                                >
                                  <Icon icon="tabler:trash" color={"#EA5455"} />
                                </IconButton>
                              </Grid>
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography fontSize={10}>
                          Only JPEG, PNG, JPG allowed.
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                )}

                {!isCustomCoupon && (
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={8}>
                        <FormControl fullWidth>
                          <label
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                            }}
                          >
                            <Typography fontSize={15}>
                              Terms & Conditions
                            </Typography>{" "}
                          </label>
                          <Box
                            sx={{
                              border: "2px solid #DBDADE",
                              borderRadius: "5px",
                            }}
                          >
                            {fields.map((field, index) => (
                              <Box
                                sx={{ p: 2, borderBottom: "2px solid #DBDADE" }}
                              >
                                <TextField
                                  key={index}
                                  placeholder={"Write here"}
                                  value={field}
                                  onChange={(e) =>
                                    handleFieldChange(index, e.target.value)
                                  }
                                  fullWidth
                                  variant="standard"
                                  sx={{ border: "none" }}
                                  size="small"
                                  required
                                  InputProps={{
                                    disableUnderline: true,
                                    startAdornment: (
                                      <InputAdornment position="start">{`${
                                        index + 1
                                      }.`}</InputAdornment>
                                    ),
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton
                                          onClick={() =>
                                            handleRemoveField(index)
                                          }
                                        >
                                          <Icon icon="tabler:trash" />
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </Box>
                            ))}

                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Button onClick={handleAddField} variant="text">
                                <Icon icon="tabler:plus" />
                                Add an entry
                              </Button>
                            </Box>
                          </Box>

                          {/* <TextField
                         multiline={true}
                         rows={3}
                         size={"small"}
                         variant="outlined"
                         placeholder="eg. This offer is valid for bookings made through elivaas.com only"
                         {...register("coupon.terms_and_conditions", {
                           required: true,
                         })}
                       /> */}
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                )}

                {!(
                  isCustomCoupon &&
                  ["BOGO", "DISCOUNT"].includes(selectedCouponType)
                ) && (
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <FormControl fullWidth>
                          <label>
                            <Typography fontSize={15}>
                              Homepage visibility
                            </Typography>
                          </label>
                          <TextField
                            size="small"
                            variant="outlined"
                            value={homepageVisibility ? "Active" : "Inactive"}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Switch
                                    checked={homepageVisibility}
                                    onChange={handleHomePageVisibility}
                                  />
                                </InputAdornment>
                              ),
                            }}
                            {...register("coupon.is_visible_homepage", {
                              required: true,
                            })}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={4}>
                        <FormControl fullWidth>
                          <label>
                            <Typography fontSize={15}>
                              Homepage sorting order
                            </Typography>
                          </label>
                          <TextField
                            size={"small"}
                            variant="outlined"
                            placeholder="01"
                            type="number"
                            {...register("coupon.sorting_order", {
                              required: true,
                            })}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
                {!(
                  isCustomCoupon &&
                  ["BOGO", "DISCOUNT"].includes(selectedCouponType)
                ) && (
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <FormControl fullWidth>
                          <label>
                            <Typography fontSize={15}>
                              Property detail page sorting order
                            </Typography>
                          </label>
                          <TextField
                            size={"small"}
                            variant="outlined"
                            placeholder="01"
                            type="number"
                            {...register("coupon.pdp_sorting_order", {
                              required: true,
                            })}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        <ConfirmationDialog
          open={isDialogOpen}
          handleClose={handleClose}
          handleConfirm={handleConfirm}
          title="Do you want to discard this Coupon?"
          message="Changes made will no longer be saved."
        />
      </form>
    </>
  );
};

export default CreateCoupon;
