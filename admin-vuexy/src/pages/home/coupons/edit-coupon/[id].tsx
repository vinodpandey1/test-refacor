// @ts-nocheck

import Grid from "@mui/material/Grid";

import { FileUploadOutlined } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  Radio,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { format } from "date-fns";
import { useRouter } from "next/router";
import * as querystring from "querystring";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useDropzone } from "react-dropzone";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { httpClient } from "src/common/clients/axios.clientv2";
import CouponTypeForm from "src/components/coupons/coupon-type-form";
import ConfirmationDialog from "src/components/coupons/dialogs/confirmation-dialog";
import { API_ENDPOINT_COUPON } from "src/constants/api";
import { ERRORS } from "src/constants/errors/errors";
import Icon from "../../../../@core/components/icon";
import { parseHtmlResponse } from "src/utils/utils";

const EditCoupon = () => {
  const router = useRouter();
  const { id } = router.query;

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [status, setStatus] = useState<boolean>(false);
  const [homepageVisibility, setHomepageVisibility] = useState<boolean>(false);
  const handleClickOpen = () => setIsDialogOpen(true);
  const handleClose = () => setIsDialogOpen(false);
  const [couponType, setCouponType] = useState<Object>({});
  const [isCustomCoupon, setIsCustomCoupon] = useState<boolean>(false);
  const [selectedCouponType, setSelectedCouponType] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(null);
  const [loading, setLoading] = useState(false);
  const [couponDetail, setCouponDetail] = useState();
  const [error, setError] = useState("");
  const [fields, setFields] = useState([""]);

  const [applicableStartDate, setApplicableStartDate] = useState<Date>(null);
  const [applicableEndDate, setApplicableEndDate] = useState<Date>(null);
  const [isBookingValidity, setIsBookingValidity] = useState(false);
  const [isHollowCoupon, setIsHollowCoupon] = useState(false);

  const [mediaIcon, setMediaIcon] = useState<File | undefined>(undefined);

  const handleFieldChange = (index: any, newValue: any) => {
    const newFields = [...fields];
    newFields[index] = newValue;
    setFields(newFields);
  };

  const onChange = (dates: any) => {
    const [start, end] = dates;
    setApplicableStartDate(start);
    setApplicableEndDate(end);
  };

  const handleBookingValidityChange = (event: any) => {
    setIsBookingValidity(event.target.checked);
  };

  const handleHollowCouponChange = (event: any) => {
    setIsHollowCoupon(event.target.checked);
  };

  const handleAddField = () => {
    setFields([...fields, ""]);
  };

  const handleRemoveField = (index: number) => {
    const fieldsList = [...fields];
    fieldsList.splice(index, 1);
    setFields(fieldsList);
  };

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    maxFiles: 1,
    useFsAccessApi: false,
    onDrop: (acceptedFiles) => {
      setMediaIcon(acceptedFiles[0]);
    },
  });

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(event.target.checked);
  };

  const handleHomePageVisibility = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setHomepageVisibility(event.target.checked);
  };

  interface CouponForm {
    coupon: {
      code: string;
      name: string;
      description: string;
      is_disabled: any;
      terms_and_conditions: string;
      is_visible_homepage: any;
      sorting_order: number;
      pdp_sorting_order: number;
      usage_limit: any;
      expiry_date: string;
      min_nights_count: any;
      max_nights_count: any;
      applicable_date_start?: any;
      applicable_date_end?: any;
    };
    offer: {
      is_custom: true;
      type_id: any;
      discount_percentage: number;
      offer_cap_amount: number;
      buy_nights_count: number;
      get_nights_count: number;
      hollow_offer:boolean;
      external_id: string;
    };
    media_icon: File;
  }

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CouponForm>();

  const handleConfirm = () => {
    handleClose();
    router.push("/home/coupons/details/" + id);
  };

  const onSubmit: SubmitHandler<CouponForm> = (data) => {
    data.offer.hollow_offer = isHollowCoupon;
    updateCoupon(data);
  };

  const fetchCouponDetailById = async () => {
    let defaultValueObj = {
      coupon: {
        code: "",
        name: "",
        description: "",
        is_disabled: "",
        terms_and_conditions: "",
        is_visible_homepage: "",
        sorting_order: 1,
        pdp_sorting_order: 0,
        usage_limit: 1,
        expiry_date: "",
      },
      offer: {
        is_custom: true,
        type_id: 1,
        discount_percentage: 0,
        offer_cap_amount: 0,
        buy_nights_count: 0,
        get_nights_count: 0,
        hollow_offer:false,
        external_id: "",
      },
      media_icon: "",
    };
    try {
      setLoading(true);
      const couponID = {
        coupon_id: id,
      };
      const response = await httpClient.get(
        API_ENDPOINT_COUPON.GET_COUPON_DETAILS_BY_ID +
          querystring.stringify(couponID)
      );

      if (response.data) {
        defaultValueObj.coupon.code = response.data.code;
        defaultValueObj.coupon.description = parseHtmlResponse(
          response.data.description
        );
        defaultValueObj.coupon.expiry_date = response.data.expiry_date;
        defaultValueObj.coupon.is_disabled =
          response.data.is_disabled == true ? "Inactive" : "Active";

        defaultValueObj.coupon.is_visible_homepage =
          response.data.is_visible_homepage == true ? "Active" : "Inactive";
        defaultValueObj.coupon.name = response.data.name;
        defaultValueObj.coupon.sorting_order = response.data.sorting_order;
        defaultValueObj.coupon.pdp_sorting_order =
          response.data.pdp_sorting_order;
        defaultValueObj.coupon.usage_limit = response.data.usage_limit;

        defaultValueObj.offer.buy_nights_count =
          response.data.Offer.buy_nights_count;
        defaultValueObj.offer.discount_percentage =
          response.data.Offer.discount_percentage;
        defaultValueObj.offer.external_id = response.data.Offer.external_id;
        defaultValueObj.offer.get_nights_count =
          response.data.Offer.get_nights_count;
        defaultValueObj.offer.hollow_offer =
            response.data.Offer.hollow_offer;
        setIsHollowCoupon(response.data.Offer.hollow_offer);

        defaultValueObj.offer.is_custom = response.data.Offer.is_custom;
        defaultValueObj.offer.offer_cap_amount =
          response.data.Offer.offer_cap_amount;
        defaultValueObj.offer.type_id = response.data.Offer.type_id;

        defaultValueObj.media_icon = response.data.media_icon_response
          ? response.data.media_icon_response.formats === null
            ? response.data.media_icon_response.url
            : response.data.media_icon_response.formats.thumbnail?.url
          : null;
        defaultValueObj.coupon.min_nights_count =
          response.data.min_nights_count;
        defaultValueObj.coupon.max_nights_count =
          response.data.max_nights_count;
        setFields(response.data.terms_and_conditions);
        setApplicableStartDate(
          response?.data?.applicable_date_start
            ? new Date(response.data.applicable_date_start)
            : null
        );
        setApplicableEndDate(
          response?.data?.applicable_date_end
            ? new Date(response.data.applicable_date_end)
            : null
        );
        setIsCustomCoupon(response.data.Offer.is_custom);
        setSelectedCouponType(response.data.type.name);
        setStatus(!response.data.is_disabled);
        setHomepageVisibility(response.data.is_visible_homepage);
        setCouponDetail(response.data);
        setSelectedDate(new Date(response.data.expiry_date));
        setMediaIcon(
          response.data.media_icon_response
            ? response.data.media_icon_response.formats === null
              ? response.data.media_icon_response.url
              : response.data.media_icon_response.formats.thumbnail?.url
            : null
        );
        reset(defaultValueObj);

        return;
      }
      setError(ERRORS.COUPONS.ERROR_FETCHING_COUPON_BY_ID);
    } catch (err) {
      setLoading(false);
      toast(ERRORS.COUPONS.ERROR_FETCHING_COUPON_BY_ID, {
        position: "top-center",
      });
      setError(ERRORS.EDIT_USER.FETCHING_USER_ERR);
    } finally {
      setLoading(false);
      return defaultValueObj;
    }
  };

  const updateCoupon = async (data: any) => {
    let couponObj = {
      code: data.coupon.code,
      name: data.coupon.name,
      description: data.coupon.description,
      is_disabled: !status,
      terms_and_conditions: JSON.stringify(fields),
      is_visible_homepage: homepageVisibility,
      sorting_order: parseInt(data.coupon.sorting_order),
      pdp_sorting_order: parseInt(data.coupon.pdp_sorting_order),

      usage_limit: parseInt(data.coupon.usage_limit),
      expiry_date: selectedDate
        ? format(selectedDate, "yyyy-MM-dd").toString()
        : null,
      applicable_date_start: applicableStartDate
        ? format(applicableStartDate, "yyyy-MM-dd").toString()
        : null,

      applicable_date_end: applicableEndDate
        ? format(applicableEndDate, "yyyy-MM-dd").toString()
        : null,
    };
    let offerObj = {
      is_custom: isCustomCoupon,
      type_id: (couponType as any)[selectedCouponType],
      discount_percentage: parseInt(data.offer?.discount_percentage),
      offer_cap_amount: parseInt(data.offer?.offer_cap_amount),
      buy_nights_count: parseInt(data.offer?.buy_nights_count),
      get_nights_count: parseInt(data.offer?.get_nights_count),
      hollow_offer:data.offer?.hollow_offer,
      external_id: data.offer?.external_id,
    };
    let media_icon = mediaIcon;

    let formData = new FormData();
    formData.append("coupon_id", id);
    formData.append("coupon", JSON.stringify(couponObj));
    formData.append("offer", JSON.stringify(offerObj));
    if (media_icon) {
      formData.append("media_icon", media_icon);
    }

    try {
      setLoading(true);
      const response = await httpClient.put(
        API_ENDPOINT_COUPON.UPDATE_COUPON,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Coupon Updated Successfully", { position: "top-center" });
      setLoading(false);
      router.push("/home/coupons/details/" + id);
      return;
    } catch (err) {
      setLoading(false);
      toast.error(ERRORS.COUPONS.ERROR_CREATING_COUPON, {
        position: "top-center",
      });
    } finally {
      setLoading(false);
      reset();
    }
  };

  const renderFormControlLabels = () => {
    if (couponType) {
      return Object.keys(couponType).map((key) => {
        let label = "";
        switch (key) {
          case "BOGO":
            label = "BOGO (Book X nights & get Y nights FREE)";
            break;
          case "DISCOUNT":
            label = "% Discount";
            break;
          case "BANK_OFFER":
            label = "Bank Offer";
            break;
          default:
            break;
        }

        return (
          <FormControlLabel
            key={key}
            value={key}
            control={
              <Radio
                disabled
                onChange={(event) => setSelectedCouponType(event.target.value)}
              />
            }
            label={label}
          />
        );
      });
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

  useEffect(() => {
    fetchCouponTypes();
  }, []);

  useEffect(() => {
    if (id) {
      fetchCouponDetailById();
    }
  }, [id]);

  return (
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
                      router.push("/home/coupons/details/" + id);
                    }}
                    color="primary"
                  >
                    <ArrowBackIcon />
                  </IconButton>
                </Grid>

                <Grid item>
                  <Typography fontSize={18} fontWeight={500}>
                    Edit Coupon
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
            <Grid
              paddingTop={2}
              paddingBottom={6}
              spacing={3}
              container
              paddingRight={5}
              paddingLeft={5}
              gap={2}
            >
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
                        border: "1px solid #DBDADE",
                        paddingBottom: 2,
                        paddingLeft: 6,
                        paddingRight: 6,
                      }}
                    >
                      <Typography fontSize={22}>Site wide</Typography>
                      <Typography fontSize={15}>
                        Coupon can be made visible on the website
                      </Typography>
                      <Radio
                        checked={!isCustomCoupon}
                        disabled
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
                        border: "1px solid #DBDADE",
                        paddingBottom: 2,
                        paddingLeft: 6,
                        paddingRight: 6,
                      }}
                    >
                      <Typography fontSize={22}>Personalized</Typography>
                      <Typography fontSize={15}>
                        Share code personally to your guest
                      </Typography>
                      <Radio
                        checked={isCustomCoupon}
                        disabled
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
                      <TextField
                        size={"small"}
                        variant="outlined"
                        disabled
                        placeholder="eg. FLATOFF10"
                        {...register("coupon.code", {})}
                      />
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
                        disabled
                        {...register("coupon.name", {})}
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
                      <TextField
                        multiline={true}
                        rows={3}
                        size={"small"}
                        disabled
                        variant="outlined"
                        placeholder="eg. Book your stay on website and get 10% off up to ₹7500"
                        {...register("coupon.description", {})}
                      ></TextField>
                    </FormControl>
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
                  formType="edit"
                  isBookingValidity={isBookingValidity}
                  handleBookingValidityChange={handleBookingValidityChange}
                  handleHollowCouponChange={handleHollowCouponChange}
                  isHollowCoupon={isHollowCoupon}
                  applicableStartDate={applicableStartDate}
                  applicableEndDate={applicableEndDate}
                  onChange={onChange}
                  status={status}
                  handleStatusChange={handleStatusChange}
                  setSelectedDate={setSelectedDate}
                  selectedDate={selectedDate}
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
                        }}
                      >
                        <input {...getInputProps()} disabled />
                        {mediaIcon ? (
                          <img
                            src={mediaIcon}
                            alt="Preview"
                            height={"96px"}
                            width={"96px"}
                          />
                        ) : acceptedFiles.length === 0 ? (
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
                                disabled
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
                          {fields &&
                            fields.map((field, index) => (
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
                                  InputProps={{
                                    disableUnderline: true,
                                    startAdornment: (
                                      <InputAdornment
                                        position="start"
                                        disableTypography
                                      >{`${index + 1}.`}</InputAdornment>
                                    ),
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton
                                          disabled
                                          onClick={() =>
                                            handleRemoveField(index)
                                          }
                                        >
                                          <Icon icon="tabler:trash" />
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                  }}
                                  disabled
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
                            <Button
                              onClick={handleAddField}
                              variant="text"
                              disabled
                            >
                              <Icon icon="tabler:plus" />
                              Add an entry
                            </Button>
                          </Box>
                        </Box>
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
                          disabled={couponDetail?.is_disabled_reason}
                          value={homepageVisibility ? "Active" : "Inactive"}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Switch
                                  disabled={couponDetail?.is_disabled_reason}
                                  checked={homepageVisibility}
                                  onChange={handleHomePageVisibility}
                                />
                              </InputAdornment>
                            ),
                          }}
                          {...register("coupon.is_visible_homepage", {})}
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
                          disabled={couponDetail?.is_disabled_reason}
                          placeholder="01"
                          type="number"
                          {...register("coupon.sorting_order")}
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
                          disabled={couponDetail?.is_disabled_reason}
                          placeholder="01"
                          type="number"
                          {...register("coupon.pdp_sorting_order")}
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
  );
};

export default EditCoupon;
