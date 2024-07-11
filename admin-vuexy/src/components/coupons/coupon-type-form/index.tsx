import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import Icon from "../../../@core/components/icon";

import ReactDatePicker from "react-datepicker";
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";

const CouponTypeForm = (props: any) => {
  const {
    isCustomCoupon,
    register,
    selectedCouponType,
    formType,
    setSelectedCouponType,
    couponType,
    isBookingValidity,
    isHollowCoupon,
    handleBookingValidityChange,
    handleHollowCouponChange,
    applicableStartDate,
    applicableEndDate,
    onChange,
    status,
    handleStatusChange,
    setSelectedDate,
    selectedDate,
    onValidityChange,
  } = props;

  const isEditForm = formType == "edit" ? true : false;

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

        return isCustomCoupon && label === "Bank Offer" ? (
          <></>
        ) : (
          <FormControlLabel
            key={key}
            value={key}
            control={
              <Radio
                // checked={!isCustomCoupon}
                disabled={isEditForm ? true : false}
                onChange={(event) => setSelectedCouponType(event.target.value)}
              />
            }
            label={label}
          />
        );
      });
    }
  };

  return (
    <Grid container spacing={10}>
      <Grid item xs={12}>
        <RadioGroup
          row
          aria-label="coupon-type"
          name="coupon-type"
          defaultValue={selectedCouponType}
          value={selectedCouponType}
        >
          {renderFormControlLabels()}
        </RadioGroup>
      </Grid>

      {(selectedCouponType === "DISCOUNT" && (
        <>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <label>
                <Typography fontSize={15}>Discount</Typography>
              </label>
              <TextField
                size={"small"}
                variant="outlined"
                placeholder="00"
                disabled={isEditForm ? true : false}
                type="number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Icon icon="tabler:discount" />
                    </InputAdornment>
                  ),
                }}
                {...register("offer.discount_percentage", {
                  required: isEditForm ? false : true,
                })}
              />
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <label>
                <Typography fontSize={15}>Capped amount</Typography>
              </label>
              <TextField
                size={"small"}
                variant="outlined"
                placeholder="00"
                type="number"
                disabled={isEditForm ? true : false}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon icon="tabler:currency-rupee" />
                    </InputAdornment>
                  ),
                }}
                {...register("offer.offer_cap_amount", {
                  required: isEditForm ? false : true,
                })}
              />
            </FormControl>
          </Grid>
        </>
      )) ||
        (selectedCouponType === "BOGO" && (
          <>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <label>
                  <Typography fontSize={15}>
                    Minimum number of nights required to book
                  </Typography>
                </label>
                <TextField
                  size={"small"}
                  variant="outlined"
                  type="number"
                  disabled={isEditForm ? true : false}
                  placeholder="00"
                  {...register("offer.buy_nights_count", {
                    required: isEditForm ? false : true,
                  })}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <label>
                  <Typography fontSize={15}>Nights FREE</Typography>
                </label>
                <TextField
                  size={"small"}
                  variant="outlined"
                  type="number"
                  disabled={isEditForm ? true : false}
                  placeholder="00"
                  {...register("offer.get_nights_count", {
                    required: isEditForm ? false : true,
                  })}
                />
              </FormControl>
            </Grid>
          </>
        ))}

      {(selectedCouponType !== "BANK_OFFER" ||
        selectedCouponType === "BOGO" ||
        ["DISCOUNT"].includes(selectedCouponType)) && (
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {selectedCouponType !== "BANK_OFFER" && (
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isBookingValidity}
                          onChange={handleBookingValidityChange}
                          disabled={isEditForm ? true : false}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                      label="Booking Validity Period (Optional)"
                    />
                  </FormGroup>
                  <Grid container>
                    <Grid item xs={12}>
                      <DatePickerWrapper>
                        <ReactDatePicker
                          placeholderText="DD/MM/YYYY to DD/MM/YYYY"
                          selected={applicableStartDate}
                          onChange={onChange}
                          minDate={new Date()}
                          startDate={applicableStartDate}
                          endDate={applicableEndDate}
                          selectsRange
                          popperPlacement="bottom-end"
                          dateFormat="dd/MM/yyyy"
                          disabled={isEditForm ? true : !isBookingValidity}
                          customInput={
                            <TextField
                              size="small"
                              fullWidth
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <Icon icon={"tabler:calendar-clock"} />
                                  </InputAdornment>
                                ),
                              }}
                              style={{
                                backgroundColor: !isBookingValidity
                                  ? "#f1f0f2"
                                  : "transparent",
                              }}
                            />
                          }
                        />
                      </DatePickerWrapper>
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
            )}

            {["DISCOUNT", "BOGO"].includes(selectedCouponType) && (
              <Grid item xs={4} sx={{ mt: 5 }}>
                <FormControl fullWidth>
                  <label>
                    <Typography fontSize={15}>Status</Typography>
                  </label>
                  <TextField
                    size="small"
                    variant="outlined"
                    value={status ? "Active" : "Inactive"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Switch
                            checked={status}
                            onChange={handleStatusChange}
                          />
                        </InputAdornment>
                      ),
                    }}
                    {...register("coupon.is_disabled", {
                      required: isEditForm ? false : true,
                    })}
                  />
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12}>
              <Grid container>
                {["DISCOUNT"].includes(selectedCouponType) && (
                  <Grid item xs={4} sx={{ mt: 5 }}>
                    <FormControl fullWidth>
                      <label>
                        <Typography fontSize={15}>
                          Minimum number of nights required to book
                        </Typography>
                      </label>
                      <TextField
                        size={"small"}
                        variant="outlined"
                        placeholder="00"
                        type="number"
                        disabled={isEditForm ? true : false}
                        {...register("coupon.min_nights_count", {
                          required: isEditForm ? false : true,
                        })}
                      />
                    </FormControl>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}

      <Grid item xs={12}>
        <Grid container spacing={2}>
          {selectedCouponType === "BANK_OFFER" && (
            <>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <label>
                    <Typography fontSize={15}>External Offer ID</Typography>
                  </label>
                  <TextField
                    size="small"
                    disabled={isEditForm}
                    variant="outlined"
                    placeholder="eg. 0002987LKJ98"
                    {...register("offer.external_id", {
                      required: !isEditForm,
                    })}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <label>
                    <Typography fontSize={15}>
                      Minimum number of nights required to book
                    </Typography>
                  </label>
                  <TextField
                    size="small"
                    variant="outlined"
                    type="number"
                    disabled={isEditForm}
                    placeholder="00"
                    {...register("offer.buy_nights_count", {
                      required: !isEditForm,
                    })}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <label>
                    <Typography fontSize={15}>Nights FREE</Typography>
                  </label>
                  <TextField
                    size="small"
                    variant="outlined"
                    type="number"
                    disabled={isEditForm}
                    placeholder="00"
                    {...register("offer.get_nights_count", {
                      required: !isEditForm,
                    })}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isBookingValidity}
                          onChange={handleBookingValidityChange}
                          disabled={isEditForm}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                      label="Booking Validity Period (Optional)"
                    />
                  </FormGroup>
                  <DatePickerWrapper>
                    <ReactDatePicker
                      placeholderText="DD/MM/YYYY to DD/MM/YYYY"
                      selected={applicableStartDate}
                      onChange={onChange}
                      minDate={new Date()}
                      startDate={applicableStartDate}
                      endDate={applicableEndDate}
                      selectsRange
                      popperPlacement="bottom-end"
                      dateFormat="dd/MM/yyyy"
                      disabled={isEditForm || !isBookingValidity}
                      customInput={
                        <TextField
                          size="small"
                          fullWidth
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Icon icon={"tabler:calendar-clock"} />
                              </InputAdornment>
                            ),
                          }}
                          style={{
                            backgroundColor: !isBookingValidity
                              ? "#f1f0f2"
                              : "transparent",
                          }}
                        />
                      }
                    />
                  </DatePickerWrapper>
                </FormControl>
              </Grid>
              <Grid item xs={4} sx={{ mt: 5 }}>
                <FormControl fullWidth>
                  <label>
                    <Typography fontSize={15}>Status</Typography>
                  </label>
                  <TextField
                    size="small"
                    variant="outlined"
                    value={status ? "Active" : "Inactive"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Switch
                            checked={status}
                            onChange={handleStatusChange}
                          />
                        </InputAdornment>
                      ),
                    }}
                    {...register("coupon.is_disabled", { required: true })}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4} sx={{ mt: 5 }}>
                <FormControl fullWidth>
                  <label>
                    <Typography fontSize={15}>Is Hollow Coupon ?</Typography>
                  </label>
                  <TextField
                    size="small"
                    variant="outlined"
                    disabled={isEditForm}
                    value={isHollowCoupon ? "Yes" : "No"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Switch
                            disabled={isEditForm}
                            checked={isHollowCoupon}
                            onChange={handleHollowCouponChange}
                          />
                        </InputAdornment>
                      ),
                    }}
                    {...register("offer.hollow_coupon", {
                      required: !isEditForm,
                    })}
                  />
                </FormControl>
              </Grid>
            </>
          )}
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={2}>
          {selectedCouponType !== "BANK_OFFER" && (
            <Grid item xs={4}>
              <FormControl fullWidth>
                <label>
                  <Typography fontSize={15}>Usage Limit</Typography>
                </label>
                <TextField
                  size={"small"}
                  variant="outlined"
                  placeholder="00"
                  disabled={isEditForm ? true : false}
                  type="number"
                  {...register("coupon.usage_limit", {
                    required: isEditForm ? false : true,
                  })}
                />
              </FormControl>
            </Grid>
          )}
          <Grid item xs={4}>
            <FormControl fullWidth>
              <label>
                <Typography fontSize={15}>Coupon Validity</Typography>
              </label>

              <DatePickerWrapper>
                <ReactDatePicker
                  placeholderText="DD/MM/YYYY"
                  selected={selectedDate}
                  onChange={onValidityChange}
                  minDate={new Date()}
                  popperPlacement="bottom-end"
                  dateFormat="dd/MM/yyyy"
                  disabled={isEditForm ? true : false}
                  required
                  customInput={
                    <TextField
                      size="small"
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon icon={"tabler:calendar-clock"} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  }
                />
              </DatePickerWrapper>
            </FormControl>
          </Grid>
          {selectedCouponType === "BANK_OFFER" && (
            <Grid item xs={4} sm={6} md={4}>
              <FormControl fullWidth>
                <label>
                  <Typography fontSize={15}>Maximum length of stay</Typography>
                </label>
                <TextField
                  size="small"
                  variant="outlined"
                  type="number"
                  disabled={isEditForm}
                  placeholder="00"
                  {...register("coupon.max_nights_count", {
                    required: !isEditForm,
                  })}
                />
              </FormControl>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CouponTypeForm;
