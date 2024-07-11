import {
  Button,
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import agGrid, { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import { useRouter } from "next/router";
import * as querystring from "querystring";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { httpClient } from "src/common/clients/axios.clientv2";
import { ERRORS } from "src/constants/errors/errors";
import { useDebounce } from "src/utils/utils";
import Icon from "../../../@core/components/icon";
import { API_ENDPOINT_COUPON } from "../../../constants/api";

const CouponDetails = () => {
  const router = useRouter();
  const currentPath = router.asPath;

  const couponFilters =
    JSON.parse(localStorage.getItem("couponFilters") ?? "null") ?? null;

  const selectedNumberofRows = localStorage.getItem("rowsSelected");
  const [selectedToggle, setSelectedToggle] = useState(
    couponFilters ? couponFilters?.isCustomCoupon : 0
  );
  const [selectNoItem, setSelectNoItem] = useState(
    couponFilters ? couponFilters?.rowsSelected : "100"
  );
  const [limit, setLimit] = useState<number>(100);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState(
    couponFilters ? couponFilters?.searchContent : ""
  );
  const [couponType, setCouponType] = useState<Object>("");
  const [selectedCouponType, setSelectedCouponType] = useState(
    couponFilters ? couponFilters?.couponTypeSelected : ""
  );
  const [selectedCouponStatus, setSelectedCouponStatus] = useState(
    couponFilters ? couponFilters?.couponStatusSelected : ""
  );
  const [loading, setLoading] = useState(false);
  const [couponsData, setCouponsData] = useState<string[]>([]);
  const [gridApi, setGridApi] = useState<agGrid.GridApi | null>(null);
  const [startEntry, setStartEntry] = useState<number>(1);
  const currentPageEntries = (page - 1) * limit + 1;

  const DEBOUNCE_DELAY = 500;
  const debouncedSearch = useDebounce(search, DEBOUNCE_DELAY);

  const saveFilterValues = () => {
    localStorage.setItem(
      "couponFilters",
      JSON.stringify({
        rowsSelected: selectNoItem,
        searchContent: search,
        couponTypeSelected: selectedCouponType,
        isCustomCoupon: selectedToggle,
        couponStatusSelected: selectedCouponStatus,
      })
    );
  };

  const clearFilters = () => {
    localStorage.removeItem("couponFilters");
    setSelectedToggle(0);
    setSelectNoItem("100");
    setSelectedCouponType("");
    setSelectedCouponStatus("");
    setSearch("");
  };

  useEffect(() => {
    saveFilterValues();
  }, [
    selectedToggle,
    selectedCouponType,
    selectedCouponStatus,
    selectNoItem,
    search,
  ]);

  const CouponDetails = (props: any) => (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Typography fontSize={15} color={"#706b7d"}>
            {props?.data?.code}
          </Typography>

          <Typography
            fontSize={15}
            color={"#a5a2ad"}
            whiteSpace={"break-spaces"}
          >
            {props?.data?.name}
          </Typography>
        </Grid>
      </Grid>
    </>
  );

  const CouponStatusRenderer = (params: any) => {
    const chipLabel =
      params?.data?.is_disabled === true ? "Inactive" : "Active";
    const chipColor =
      params?.data?.is_disabled === true ? "#FF4B51" : "#28C76F";
    const chipBackgroundColor =
      params?.data?.is_disabled === true ? "#FFE4E3" : "#ddf6e8";

    return (
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Chip
            label={
              <>
                {chipLabel}&nbsp;
                {params?.data?.is_disabled_reason && (
                  <Tooltip
                    title={params?.data?.is_disabled_reason}
                    placement="top"
                  >
                    <IconButton sx={{ p: 0 }}>
                      <Icon
                        icon="tabler:info-circle"
                        fontSize="20px"
                        color="#FF4B51"
                      />
                    </IconButton>
                  </Tooltip>
                )}
              </>
            }
            sx={{
              color: chipColor,
              backgroundColor: chipBackgroundColor,
              borderRadius: 1,
            }}
          />
        </Grid>
      </Grid>
    );
  };
  const HomepageVisibilityRenderer = (params: any) => {
    return (
      <Grid container spacing={2}>
        <Grid item>
          <Typography
            color={
              params?.data?.is_visible_homepage === false
                ? "#FF4B51"
                : "#28C76F"
            }
          >
            {params?.data?.is_visible_homepage === true ? "Active" : "Inactive"}
          </Typography>
        </Grid>
      </Grid>
    );
  };
  const ActionButton = (props: any) => {
    return (
      <IconButton
        color="primary"
        onClick={() => {
          router.push(currentPath + "details/" + props.data.id);
        }}
      >
        <Icon icon="tabler:eye" />
      </IconButton>
    );
  };

  const getIndex = (props: any) => {
    return props?.node?.rowIndex + startEntry;
  };

  const getDefaultColDefs = () => {
    return [
      {
        field: "#",
        headerName: "SI",
        flex: 0.4,
        valueGetter: getIndex,

        ...columnDefs,
      },
      {
        field: "couponDetails",
        headerName: "COUPON DETAILS",
        cellRenderer: CouponDetails,
        flex: 1,
        ...columnDefs,
      },
      {
        field: "type.name",
        headerName: "TYPE",
        flex: 0.6,
        ...columnDefs,
      },
      {
        field: "sorting_order",
        headerName: `HOMEPAGE SORTING`,

        flex: 0.4,
        ...columnDefs,
      },
      {
        field: "HomepageVisibility",
        headerName: "HOMEPAGE VISIBILITY",
        cellRenderer: HomepageVisibilityRenderer,
        flex: 0.6,

        ...columnDefs,
      },
      {
        field: "no_of_mapped_properties",
        headerName: "PROPERTY MAPPED",
        flex: 0.4,
        ...columnDefs,
      },
      {
        field: "status",
        headerName: "STATUS",
        cellRenderer: CouponStatusRenderer,
        flex: 0.6,
        ...columnDefs,
      },

      {
        field: "action",
        headerName: "ACTION",
        cellRenderer: (params: any) => (
          <ActionButton data={params.data} align="center" />
        ),
        flex: 0.4,
        ...columnDefs,
      },
    ];
  };

  const columnDefs = {
    sortable: false,
    suppressMovable: true,
    resizable: false,
    cellStyle: { display: "flex", alignItems: "center" },
  };

  const [colDefs, setColDefs] = useState<ColDef[]>(getDefaultColDefs());

  const resetColDefs = () => {
    setColDefs(getDefaultColDefs());
  };

  const customStyles = `
   .ag-theme-quartz {
    /* Changes the color of the grid text */
    --ag-foreground-color: #2f2b3dc7;
    /* Changes the color of the grid background */
    --ag-background-color: rgba(215, 245, 231, 0);
    /* Changes the background color of selected rows */
    --ag-row-hover-color: white;
    --ag-border-radius: 0px; 
    --ag-wrapper-border-radius: 0px;
    --ag-header-background-color: #f5f5f5;
    
    --ag-selected-row-background-color: rgba(115, 103, 240, 0.08);
}

    .ag-header-cell-resize::after {
    background-color:white;
    border-radius: none;
    }

    .ag-cell-focus {
    border-color: white !important;
    outline: none !important;
    }

    .ag-header-cell:hover .ag-header-cell-resize::after {
    background-color:#2f2b3dc7;
    opacity: 0.2;
    }
    .ag-header-cell-label {
      text-overflow: clip;
      overflow: visible;
      white-space: normal;
  }
    `;

  const styleElement = document.createElement("style");
  styleElement.innerHTML = customStyles;
  document.head.appendChild(styleElement);

  const handleCouponTypeChange = (event: any) => {
    const selectedValue = event.target.value;
    setSelectedCouponType(selectedValue);
    setPage(1);
  };
  const handleCouponStatusChange = (event: any) => {
    const selectedStatusValue = event.target.value;
    setSelectedCouponStatus(selectedStatusValue);
    setPage(1);
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

  const fetchCoupons = async () => {
    try {
      setLoading(true);

      const payload = {
        is_custom: selectedToggle === 1,
        page_size: selectNoItem,
        page_number: search.length > 0 ? 1 : page,
        type_id: (couponType as any)[selectedCouponType],
        is_disabled: selectedCouponStatus
          ? selectedCouponStatus === "Active"
            ? false
            : true
          : "",
        ...(search.length > 0 && { code: search }),
      };

      const response = await httpClient.get(
        API_ENDPOINT_COUPON.GET_COUPONS + querystring.stringify(payload)
      );

      setCouponsData(response?.data?.coupons);
      setTotal(response?.data?.number_of_coupons);
      setLoading(false);
      if (gridApi) {
        gridApi.showLoadingOverlay();
      }
    } catch (err) {
      console.error("Error fetching coupons:", err);
      toast.error(ERRORS.COUPONS.ERROR_FETCHING_COUPONS_DATA, {
        position: "top-center",
      });
    } finally {
      setLoading(false);
      if (gridApi) {
        gridApi.hideOverlay();
      }
    }
  };

  useEffect(() => {
    fetchCouponTypes();
  }, []);

  useEffect(() => {
    const newPage = Math.ceil(startEntry / limit);
    setPage(newPage);
  }, [startEntry, limit]);

  useEffect(() => {
    const newStartEntry = (page - 1) * limit + 1;
    setStartEntry(newStartEntry);
  }, [page, limit]);

  useEffect(() => {
    resetColDefs();
  }, [startEntry]);

  useEffect(() => {
    if (selectedNumberofRows) {
      setLimit(parseInt(selectedNumberofRows));
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [
    total,
    page,
    selectNoItem,
    selectedToggle,
    debouncedSearch,
    selectedCouponStatus,
    selectedCouponType,
  ]);

  return (
    <>
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={() => {
              router.push(currentPath + "create-coupon");
            }}
            size="medium"
          >
            + Create A Coupon
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <Grid padding={4} spacing={2} container>
              <Grid item xs={12}>
                <Grid container spacing={2} justifyContent={"space-between"}>
                  <Grid item xs={4}>
                    <Typography fontSize={18} fontWeight={500}>
                      Coupons List
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="text"
                      onClick={clearFilters}
                      style={{ textDecoration: "underline" }}
                    >
                      Clear Filters
                    </Button>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Grid container justifyContent="space-between">
                  <Grid item xs={4}>
                    <Grid container spacing={5} alignItems={"center"}>
                      <Grid item>
                        <ToggleButtonGroup
                          size={"medium"}
                          color="primary"
                          value={selectedToggle}
                          exclusive
                          onChange={(event, alignment) => {
                            alignment !== null &&
                              alignment !== selectedToggle &&
                              setSelectedToggle(alignment);
                            setPage(1);
                          }}
                        >
                          <ToggleButton
                            value={0}
                            style={{
                              backgroundColor:
                                selectedToggle === 0 ? "#7367F0" : "#edecef",
                              color:
                                selectedToggle === 0 ? "#ffffff" : "#5e596c",
                              border: "none",
                            }}
                          >
                            Sitewide
                          </ToggleButton>
                          <ToggleButton
                            value={1}
                            style={{
                              backgroundColor:
                                selectedToggle === 1 ? "#7367F0" : "#edecef",
                              color:
                                selectedToggle === 1 ? "#ffffff" : "#5e596c",
                              border: "none",
                            }}
                          >
                            Personalized
                          </ToggleButton>
                        </ToggleButtonGroup>
                      </Grid>
                      <Grid item>
                        <FormControl sx={{ m: 0, maxWidth: 80 }}>
                          <Select
                            size={"small"}
                            value={selectNoItem}
                            onChange={(event) => {
                              setSelectNoItem(event.target.value);
                              setLimit(parseInt(event.target.value));
                            }}
                            disabled={page > 1}
                            displayEmpty
                            inputProps={{ "aria-label": "Without label" }}
                          >
                            <MenuItem value="10">10</MenuItem>
                            <MenuItem value="25">25</MenuItem>
                            <MenuItem value="50">50</MenuItem>
                            <MenuItem value="75">75</MenuItem>
                            <MenuItem value="100">100</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={6}>
                    <Grid container spacing={2} alignItems={"center"}>
                      <Grid item xs={4}>
                        <TextField
                          value={search}
                          onChange={(event) => {
                            setSearch(event.target.value);
                          }}
                          size={"small"}
                          variant="outlined"
                          placeholder="Coupon Code"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Icon icon="tabler:search" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <FormControl fullWidth>
                          <Select
                            labelId="coupon-type-label"
                            id="coupon-type-select"
                            renderValue={(selected) => {
                              if (selected === "") {
                                return (
                                  <Typography color={"secondary"}>
                                    Coupon Type
                                  </Typography>
                                );
                              }

                              return selected;
                            }}
                            color="primary"
                            value={selectedCouponType}
                            size={"small"}
                            onChange={handleCouponTypeChange}
                            displayEmpty
                          >
                            {Object.keys(couponType).map((type, index) => (
                              <MenuItem value={type} key={index}>
                                {type}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4}>
                        <FormControl fullWidth>
                          <Select
                            labelId="coupon-status-label"
                            id="coupon-status-select"
                            renderValue={(selected) => {
                              if (selected === "") {
                                return (
                                  <Typography color={"secondary"}>
                                    Coupon Status
                                  </Typography>
                                );
                              }

                              return selected;
                            }}
                            color="primary"
                            value={selectedCouponStatus}
                            size={"small"}
                            onChange={handleCouponStatusChange}
                            displayEmpty
                          >
                            <MenuItem value={"Active"}>Active</MenuItem>
                            <MenuItem value={"Inactive"}>Inactive</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <div className="ag-theme-quartz" style={{ height: 400 }}>
                <AgGridReact
                  gridOptions={{ rowHeight: 70 }}
                  onGridReady={(params: agGrid.GridReadyEvent) => {
                    setGridApi(params.api);
                  }}
                  rowSelection="single"
                  rowData={couponsData}
                  pagination={true}
                  suppressPaginationPanel={true}
                  columnDefs={colDefs}
                  onRowClicked={(event: any) => {
                    const couponId = event.data.id;
                    router.push(`${currentPath}details/${couponId}`);
                  }}
                  getRowStyle={() => ({ cursor: "pointer" })}
                />
              </div>
            </Grid>
            <Grid item xs={12} padding={4}>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <Grid item>
                  <Typography fontSize={12} color="#9E9E9E">
                    Showing {currentPageEntries} of {total} entries
                  </Typography>
                </Grid>
                <Grid item>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                      <Button
                        disabled={page <= 1}
                        variant="tonal"
                        onClick={() => {
                          setPage((prevState: number) => prevState - 1);
                        }}
                        size="small"
                      >
                        Previous
                      </Button>
                    </Grid>
                    {total > 0 &&
                      Array.from(
                        Array(Math.ceil(total / limit)),
                        (_, index) => (
                          <Grid item key={index}>
                            <Button
                              color={
                                index + 1 === page ? "primary" : "secondary"
                              }
                              sx={{ minWidth: "max-content" }}
                              size="small"
                              variant="contained"
                              onClick={() => setPage(index + 1)}
                            >
                              {index + 1}
                            </Button>
                          </Grid>
                        )
                      )}
                    <Grid item>
                      <Button
                        variant="tonal"
                        onClick={() => {
                          setPage((prevState) => prevState + 1);
                        }}
                        disabled={page >= Math.ceil(total / limit)}
                        size="small"
                      >
                        Next
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default CouponDetails;
