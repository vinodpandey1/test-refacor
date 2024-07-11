// @ts-nocheck
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import agGrid, { ColDef } from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import { useRouter } from "next/router";
import * as querystring from "querystring";
import { useEffect, useState } from "react";
import Icon from "../../../../@core/components/icon";

import { format } from "date-fns";
import { useRouter as ur } from "next/navigation";
import toast from "react-hot-toast";
import { httpClient } from "src/common/clients/axios.clientv2";
import { API_ENDPOINT_COUPON } from "src/constants/api";
import { ERRORS } from "src/constants/errors/errors";
import { useCheckedItems } from "src/context/CouponContext";
import { useDebounce } from "src/utils/utils";
interface Property {
  id: number;
  name: string;
  __typename: number;
}

const ViewCouponDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  const initalState = {
    created_at: null,
    description: null,
    expiry_date: "",
    id: null,
    is_custom: null,
    is_disabled: false,
    is_visible_homepage: false,
    name: null,
    offer_id: null,
    sorting_order: null,
    terms_and_conditions: null,
    updated_at: null,
    usage_counter: null,
    usage_limit: null,
    is_disabled_reason: null,
    code: null,
    min_nights_count: null,
    applicable_date_start: "",
    applicable_date_end: "",
    Offer: {
      buy_nights_count: null,
      discount_percentage: null,
      get_nights_count: null,
      offer_cap_amount: null,
      type_id: null,
      is_custom: false,
      id: null,
      external_id: null,
    },
    type: {
      id: null,
      name: null,
    },
    properties: [{ id: null, name: null }],
    media_icon_response: {
      url: null,
      formats: {
        thumbnail: {
          url: null,
        },
      },
    },
  };

  const [couponDetail, setCouponDetail] = useState(initalState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const { checkedItems, updateCheckedItems } = useCheckedItems();
  // const [checkedItems, setCheckedItems] = useState<
  //   { index: any; checked: boolean; propertyID: any }[]
  // >([]);
  const [properties, setProperties] = useState([]);
  const [gridApi, setGridApi] = useState<agGrid.GridApi | null>(null);
  const [rowData, setRowData] = useState<Property[]>([]);
  const [searchProperty, setSearchProperty] = useState("");
  const { push } = ur();
  const DEBOUNCE_DELAY = 500;
  const debouncedSearchProperty = useDebounce(searchProperty, DEBOUNCE_DELAY);
  const formatDate = (dateString: string, formatString: string) => {
    if (!dateString) return null;

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return null;
    }

    return format(date, formatString);
  };
  const formattedExpiryDate = formatDate(
    couponDetail?.expiry_date,
    "dd MMM, yyyy"
  );

  const formattedAcceptableStartDate = formatDate(
    couponDetail?.applicable_date_start,
    "dd MMM, yyyy"
  );
  const formattedAcceptableEndDate = formatDate(
    couponDetail?.applicable_date_end,
    "dd MMM, yyyy"
  );
  const ActionButton = ({
    propertyId,
    couponID,
  }: {
    propertyId: string;
    couponID: string;
  }) => {
    const handleDelete = () => {
      handleDeleteCoupon(propertyId, couponID);
    };

    return (
      <>
        <IconButton onClick={handleDelete}>
          <Icon icon="tabler:trash" />
        </IconButton>
      </>
    );
  };
  const columnDefs = {
    sortable: false,
    suppressMovable: true,
    resizable: false,
  };
  const [colDefs] = useState<ColDef[]>([
    {
      field: "SI",
      valueGetter: "node.rowIndex + 1",
      flex: 0.2,
      ...columnDefs,
    },
    {
      field: "name",
      headerName: "PROPERTY NAME",
      flex: 1,
      ...columnDefs,
    },
    {
      field: "action",
      headerName: "ACTIONS",
      cellRenderer: (params: any) => (
        <ActionButton
          propertyId={params.data.id}
          couponID={params.data.couponID}
        />
      ),

      flex: 0.2,
      ...columnDefs,
    },
  ]);

  const handleDeleteCoupon = async (
    propertyIdToDelete: string,
    couponID: string
  ) => {
    try {
      setLoading(true);
      const payload = {
        coupon_id: couponID,
        property_id: propertyIdToDelete,
      };

      const response = await httpClient.delete(
        API_ENDPOINT_COUPON.DELETE_PROPERTIES_COUPON,
        { data: payload }
      );

      setLoading(false);

      toast.success("Deleted Property", { position: "top-center" });
      fetchCouponDetailById(couponID);
    } catch (err) {
      setLoading(false);

      toast.error("Error occurred", { position: "top-center" });
    }
  };

  const fetchCouponDetailById = async (id: any) => {
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
        setCouponDetail(response.data);
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
    }
  };

  const addProperties = async () => {
    try {
      const payload = {
        coupon_id: id,
        property_ids: checkedItems.map((item: any) => item.propertyID),
      };

      setLoading(true);
      const response = await httpClient.post(
        API_ENDPOINT_COUPON.ADD_PROPERTIES_TO_COUPON,
        payload
      );
      updateCheckedItems([]);

      setLoading(false);
      setOpen(false);

      toast.success("Properties Added Successfully", {
        position: "top-right",
      });
      fetchCouponDetailById(id);

      return true;
    } catch (err) {
      setLoading(false);
      toast.error("error", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCheckboxChange = (event: any, index: any, item: any) => {
    const isChecked = event.target.checked;
    const propertyID = item.id;
    let newCheckedItems = [];

    const existingIndex = checkedItems.findIndex(
      (item: any) => item.propertyID === propertyID
    );

    if (isChecked && existingIndex === -1) {
      newCheckedItems = [
        ...checkedItems,
        { index, checked: isChecked, propertyID },
      ];
    } else if (!isChecked && existingIndex !== -1) {
      const updatedCheckedItems = [...checkedItems];
      updatedCheckedItems.splice(existingIndex, 1);
      newCheckedItems = updatedCheckedItems;
    }

    updateCheckedItems(newCheckedItems);
  };

  const getChecked = (index: any, item: any) => {
    const isChecked = checkedItems.some(
      (checkedItem) => checkedItem.propertyID === item.id
    );

    if (isChecked) {
      return (
        checkedItems.find((checkedItem) => checkedItem.propertyID === item.id)
          ?.checked ?? false
      );
    } else {
      return couponDetail.properties.some(
        (property: any) => property.id === item.id
      );
    }
  };

  const handleSelectAllChange = (event: any) => {
    let allSelected: any[] = [];
    if (event.target.checked) {
      properties?.map((item: any, index: number) => {
        if (!rowData.some((rowItem) => rowItem.id === item.id)) {
          let obj = {
            index,
            checked: event.target.checked,
            propertyID: item?.id,
          };
          allSelected.push(obj);
        }
      });
      updateCheckedItems(allSelected);
    } else {
      updateCheckedItems([]);
    }
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const payload = {
        ...(searchProperty.length > 0 && { search_text: searchProperty }),
      };
      const response = await httpClient.get(
        API_ENDPOINT_COUPON.GET_PROPERTIES + querystring.stringify(payload)
      );

      if (response && response.data) {
        setProperties(response.data);
        // updateCheckedItems([]);
      }
    } catch (err) {
      toast.error(ERRORS.COUPONS.ERROR_FETCHING_COUPON_TYPE, {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCouponDetailById(id);
    }
  }, [id, gridApi]);

  useEffect(() => {
    fetchProperties();
  }, [debouncedSearchProperty]);

  useEffect(() => {
    if (couponDetail?.id) {
      const updatedProperties = couponDetail?.properties.map(
        (property: any) => ({
          ...property,
          couponID: couponDetail?.id,
        })
      );
      setRowData(updatedProperties);
    }
  }, [couponDetail]);

  const isSitewide = couponDetail?.Offer?.is_custom;

  const mediaIconsrc =
    couponDetail?.media_icon_response?.formats === null
      ? couponDetail?.media_icon_response?.url
      : couponDetail?.media_icon_response?.formats?.thumbnail?.url;

  return (
    <Grid container spacing={10} alignItems="center">
      <Grid item xs={12}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <IconButton
              onClick={() => {
                router.push("/home/coupons");
              }}
              color="primary"
            >
              <ArrowBackIcon />
            </IconButton>
          </Grid>

          <Grid item>
            <Typography fontSize={18} fontWeight={500}>
              {couponDetail?.code}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <Grid alignItems={"center"} container spacing={4} padding={5}>
            <Grid item>
              <Typography variant="h5">Coupon Details</Typography>
            </Grid>
            <Grid item>
              <Chip
                size="small"
                sx={{
                  color: "#4b4b4b",
                  backgroundColor: "#e2e2e2",
                  borderRadius: 1,
                }}
                label={
                  couponDetail?.Offer?.is_custom === false
                    ? "Site Wide"
                    : "Personalized"
                }
              />
            </Grid>
          </Grid>

          <Paper elevation={0}>
            <CardContent>
              <Grid
                gap={4}
                alignItems={"center"}
                container
                sx={{ backgroundColor: "#f8f7fa" }}
                padding={4}
              >
                {!isSitewide && (
                  // !["BOGO", "DISCOUNT"].includes(selectedCouponType) &&
                  <Grid container>
                    <Grid item xs={2}>
                      <Typography fontSize={15}>Coupon image/icon :</Typography>
                    </Grid>
                    <Grid item xs={10}>
                      {couponDetail?.media_icon_response && (
                        <img
                          src={mediaIconsrc}
                          alt="Preview"
                          width={"48px"}
                          height={"48px"}
                        />
                      )}
                    </Grid>
                  </Grid>
                )}
                <Grid container>
                  <Grid item xs={2}>
                    <Typography fontSize={15}>Coupon Type :</Typography>
                  </Grid>
                  <Grid item>
                    <Typography fontSize={15}>
                      {couponDetail?.type?.name}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container>
                  <Grid item xs={2}>
                    <Typography fontSize={15}>Coupon Title :</Typography>
                  </Grid>
                  <Grid item>
                    <Typography fontSize={15}>{couponDetail?.name}</Typography>
                  </Grid>
                </Grid>

                {couponDetail?.code && (
                  <Grid container>
                    <Grid item xs={2}>
                      <Typography fontSize={15}>Coupon Code :</Typography>
                    </Grid>
                    <Grid item>
                      <Typography fontSize={15}>
                        {couponDetail?.code}
                      </Typography>
                    </Grid>
                  </Grid>
                )}

                {couponDetail?.description && (
                  <Grid container>
                    <Grid item xs={2}>
                      <Typography fontSize={15}>Description :</Typography>
                    </Grid>
                    <Grid item>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: couponDetail?.description,
                        }}
                      />
                    </Grid>
                  </Grid>
                )}

                <Grid container>
                  <Grid item xs={2}>
                    <Typography fontSize={15}>Coupon Status :</Typography>
                  </Grid>
                  <Grid item>
                    <Grid container spacing={3}>
                      <Grid item>
                        <Chip
                          size="small"
                          sx={{
                            color:
                              couponDetail.is_disabled === true
                                ? "#FF4B51"
                                : "#28C76F",
                            backgroundColor:
                              couponDetail?.is_disabled === true
                                ? "#FFE4E3"
                                : "#ddf6e8",
                            borderRadius: 1,
                          }}
                          label={
                            couponDetail?.is_disabled === true
                              ? "Inactive"
                              : "Active"
                          }
                        />
                      </Grid>
                      <Grid item>
                        {couponDetail?.is_disabled_reason && (
                          <Typography fontSize={13} color={"error"}>
                            ( {couponDetail?.is_disabled_reason} )
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                {couponDetail?.Offer?.external_id && (
                  <Grid container>
                    <Grid item xs={2}>
                      <Typography fontSize={15}>External Offer ID :</Typography>
                    </Grid>
                    <Grid item>
                      <Typography fontSize={15}>
                        {couponDetail?.Offer?.external_id}
                      </Typography>
                    </Grid>
                  </Grid>
                )}

                {couponDetail?.Offer?.discount_percentage && (
                  <Grid container>
                    <Grid item xs={2}>
                      <Typography fontSize={15}>Discount :</Typography>
                    </Grid>
                    <Grid item>
                      <Typography style={{ fontSize: 15 }}>
                        {couponDetail?.Offer?.discount_percentage}
                        <span
                          style={{
                            marginLeft: "0.2rem",
                          }}
                        >
                          %
                        </span>
                      </Typography>
                    </Grid>
                  </Grid>
                )}

                {couponDetail?.Offer?.offer_cap_amount && (
                  <Grid container>
                    <Grid item xs={2}>
                      <Typography fontSize={15}>Capped Amount :</Typography>
                    </Grid>
                    <Grid item>
                      <Typography style={{ fontSize: 15 }}>
                        <span
                          style={{
                            marginRight: "0.2rem",
                          }}
                        >
                          ₹
                        </span>
                        {couponDetail?.Offer?.offer_cap_amount}
                      </Typography>
                    </Grid>
                  </Grid>
                )}
                {couponDetail?.applicable_date_start &&
                  couponDetail?.applicable_date_end && (
                    <Grid container>
                      <Grid item xs={2}>
                        <Typography fontSize={15}>
                          Booking Validity Period:
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography fontSize={15}>
                          {`${formattedAcceptableStartDate} - ${formattedAcceptableEndDate}`}
                        </Typography>
                      </Grid>
                    </Grid>
                  )}

                {couponDetail?.Offer?.buy_nights_count &&
                  couponDetail?.type?.name === "BOGO" && (
                    <Grid container>
                      <Grid item xs={2}>
                        <Typography fontSize={15}>
                          Minimum Number of <br />
                          nights required to book :
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography fontSize={15}>
                          {couponDetail?.Offer?.buy_nights_count}
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                {couponDetail?.min_nights_count &&
                  couponDetail?.type?.name === "DISCOUNT" && (
                    <Grid container>
                      <Grid item xs={2}>
                        <Typography fontSize={15}>
                          Minimum Number of <br />
                          nights required to book :
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography fontSize={15}>
                          {couponDetail?.min_nights_count}
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                {/* {couponDetail?.Offer?.get_nights_count && (
                  <Grid container>
                    <Grid item xs={2}>
                      <Typography fontSize={15}>Nights Free :</Typography>
                    </Grid>
                    <Grid item>
                      <Typography style={{ fontSize: 15 }}>
                        {couponDetail?.Offer?.get_nights_count}
                      </Typography>
                    </Grid>
                  </Grid>
                )} */}
                 {couponDetail?.max_nights_count && (
                  <Grid container>
                    <Grid item xs={2}>
                      <Typography fontSize={15}>Maximum length of stay :</Typography>
                    </Grid>
                    <Grid item>
                      <Typography style={{ fontSize: 15 }}>
                        {couponDetail?.max_nights_count}
                      </Typography>
                    </Grid>
                  </Grid>
                )}
                {couponDetail?.usage_limit && (
                  <Grid container>
                    <Grid item xs={2}>
                      <Typography fontSize={15}>Usage Limit :</Typography>
                    </Grid>
                    <Grid item>
                      <Typography fontSize={15}>
                        {couponDetail?.usage_limit}
                      </Typography>
                    </Grid>
                  </Grid>
                )}
                {couponDetail?.type?.name === "BANK_OFFER" && (
                    <>
                      <Grid container>
                        <Grid item xs={2}>
                          <Typography fontSize={15}>Hollow Offer :</Typography>
                        </Grid>
                        <Grid item>
                          <Typography fontSize={15}>
                            <Chip
                                size="small"
                                sx={{
                                  color: couponDetail?.Offer?.hollow_offer === false ? "#FF4B51" : "#28C76F",
                                  backgroundColor: couponDetail?.Offer?.hollow_offer === false ? "#FFE4E3" : "#ddf6e8",
                                  borderRadius: 1,
                                }}
                                label={couponDetail?.Offer?.hollow_offer === false ? "NO" : "YES"}
                            />
                          </Typography>
                        </Grid>
                      </Grid>

                      {couponDetail?.Offer?.hollow_offer && (
                          <>
                            <Grid container>
                              <Grid item xs={2}>
                                <Typography fontSize={15}>
                                  Minimum Number of <br />
                                  nights required to book :
                                </Typography>
                              </Grid>
                              <Grid item>
                                <Typography fontSize={15}>
                                  {couponDetail?.Offer?.buy_nights_count}
                                </Typography>
                              </Grid>
                            </Grid>

                            <Grid container>
                              <Grid item xs={2}>
                                <Typography fontSize={15}>Nights Free :</Typography>
                              </Grid>
                              <Grid item>
                                <Typography fontSize={15}>
                                  {couponDetail?.Offer?.get_nights_count}
                                </Typography>
                              </Grid>
                            </Grid>

                            <Grid container>
                              <Grid item xs={2}>
                                <Typography fontSize={15}>Coupon Validity :</Typography>
                              </Grid>
                              <Grid item>
                                <Typography fontSize={15}>{formattedExpiryDate}</Typography>
                              </Grid>
                            </Grid>
                          </>
                      )}
                    </>
                )}

                {couponDetail?.type?.name !== "BANK_OFFER" && (
                  <Grid container>
                    <Grid item xs={2}>
                      <Typography fontSize={15}>Coupon Validity :</Typography>
                    </Grid>
                    <Grid item>
                      <Typography fontSize={15}>
                        {formattedExpiryDate}
                      </Typography>
                    </Grid>
                  </Grid>
                )}

                {couponDetail?.terms_and_conditions && !isSitewide && (
                  <Grid container>
                    <Grid item xs={2}>
                      <Typography fontSize={15}>
                        Terms & Conditions :
                      </Typography>
                    </Grid>
                    <Grid item>
                      {(couponDetail?.terms_and_conditions as string[])?.map(
                        (item: any, index: any) => (
                          <li
                            key={index}
                            style={{
                              listStyleType: "none",
                              textAlign: "left",
                            }}
                          >
                            <Typography fontSize={15}>{item}</Typography>
                          </li>
                        )
                      )}
                    </Grid>
                  </Grid>
                )}

                {!couponDetail?.Offer?.is_custom && (
                  <Grid container>
                    <Grid item xs={2}>
                      <Typography fontSize={15}>
                        Homepage Visibility :
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Chip
                        size="small"
                        sx={{
                          color:
                            couponDetail.is_visible_homepage === false
                              ? "#FF4B51"
                              : "#28C76F",
                          backgroundColor:
                            couponDetail?.is_visible_homepage === false
                              ? "#FFE4E3"
                              : "#ddf6e8",
                          borderRadius: 1,
                        }}
                        label={
                          couponDetail?.is_visible_homepage === false
                            ? "Inactive"
                            : "Active"
                        }
                      />
                    </Grid>
                  </Grid>
                )}

                {couponDetail?.sorting_order && (
                  <Grid container>
                    <Grid item xs={2}>
                      <Typography fontSize={15}>
                        Homepage sorting order :
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography fontSize={15}>
                        {couponDetail?.sorting_order}
                      </Typography>
                    </Grid>
                  </Grid>
                )}

                {couponDetail?.pdp_sorting_order && (
                  <Grid container>
                    <Grid item xs={2}>
                      <Typography fontSize={15}>
                        Property detail page sorting order
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography fontSize={15}>
                        {couponDetail?.pdp_sorting_order}
                      </Typography>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Paper>

          {!couponDetail?.is_disabled_reason && (
            <CardActions>
              <Grid container spacing={6}>
                <Grid item>
                  <Button
                    variant="contained"
                    startIcon={<Icon icon="tabler:pencil" />}
                    onClick={() => {
                      push("/home/coupons/edit-coupon/" + id);
                    }}
                  >
                    Edit
                  </Button>
                </Grid>
              </Grid>
            </CardActions>
          )}
        </Card>
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
            {/* Adding Properties */}

            <Grid item xs={12}>
              <Typography fontSize={18} fontWeight={500}>
                Added Properties
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2} justifyContent={"space-between"}>
                <Grid item xs={6}>
                  <Typography variant="body1" color={"#a5a2ad"}>
                    The properties on which this coupon will be applicable.
                  </Typography>
                </Grid>

                <Grid item>
                  <Button variant="contained" onClick={handleClickOpen}>
                    <Icon icon="tabler:plus" fontSize={14} />
                    &nbsp; Add Properties
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            {couponDetail?.properties?.length > 0 && (
              <Grid item xs={12}>
                <div className="ag-theme-quartz" style={{ height: 400 }}>
                  <AgGridReact
                    gridOptions={{ rowHeight: 50 }}
                    onGridReady={(params) => {
                      setGridApi(params.api);
                    }}
                    rowData={rowData}
                    pagination={true}
                    suppressPaginationPanel={true}
                    columnDefs={colDefs}
                  />
                </div>
              </Grid>
            )}
            {open && (
              <Dialog
                open={open}
                onClose={() => {
                  setOpen(false), updateCheckedItems([]);
                }}
                maxWidth={"sm"}
                fullWidth
              >
                <DialogTitle>
                  <Grid container spacing={2}>
                    <Grid item xs={12} textAlign={"center"}>
                      <Typography fontSize={26}>Add Properties</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <label>
                        <Typography fontSize={13}>Search Property</Typography>
                      </label>
                      <TextField
                        fullWidth
                        value={searchProperty}
                        onChange={(event) =>
                          setSearchProperty(event.target.value)
                        }
                        size={"small"}
                        variant="outlined"
                        placeholder="Property Name"
                      />
                    </Grid>
                  </Grid>
                </DialogTitle>

                <DialogContent>
                  <Grid
                    container
                    alignItems="center"
                    sx={{ borderBottom: "1px solid #DBDADE" }}
                    justifyContent={"space-between"}
                  >
                    <Grid item>
                      <Typography fontSize={18} padding={3}>
                        Property Name
                      </Typography>
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        control={<Checkbox onChange={handleSelectAllChange} />}
                        label="Select All"
                        labelPlacement="end"
                      />
                    </Grid>
                  </Grid>

                  {loading ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "200px",
                      }}
                    >
                      <CircularProgress />
                    </div>
                  ) : (
                    <>
                      {properties && properties.length > 0 ? (
                        properties.map((item: any, index) => (
                          <Grid
                            container
                            alignItems="center"
                            sx={{ borderBottom: "1px solid #DBDADE" }}
                            key={index}
                          >
                            <Grid item xs={11}>
                              <Typography fontSize={15} padding={3}>
                                {item?.name}
                              </Typography>
                            </Grid>
                            <Grid item xs={1}>
                              <Checkbox
                                checked={getChecked(index, item)}
                                onChange={() =>
                                  handleCheckboxChange(event, index, item)
                                }
                                disabled={
                                  item.id &&
                                  couponDetail.properties.some(
                                    (property: any) => property.id === item.id
                                  )
                                }
                              />
                            </Grid>
                          </Grid>
                        ))
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: "200px",
                          }}
                        >
                          <Typography variant="body1" align="center">
                            No results
                          </Typography>
                        </div>
                      )}
                    </>
                  )}
                </DialogContent>

                <DialogActions
                  sx={{
                    padding: "18px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="tonal"
                    onClick={() => {
                      setOpen(false);
                      setSearchProperty("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color={"primary"}
                    onClick={() => {
                      addProperties();
                      setSearchProperty("");
                    }}
                  >
                    Save
                  </Button>
                </DialogActions>
              </Dialog>
            )}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ViewCouponDetail;
