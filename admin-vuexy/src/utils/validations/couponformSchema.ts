import * as Yup from "yup";

const couponFormSchema = Yup.object().shape({
  coupon: Yup.object().shape({
    code: Yup.string()
      .matches(/^[A-Z0-9]+$/, {
        message: "Please ensure code requirements suggested in the tooltip. ",
        excludeEmptyString: true,
      })
      .required(""),
    // name: Yup.string().required("Coupon name is required"),
    // description: Yup.string().required("Coupon description is required"),
    // sorting_order: Yup.mixed().when("is_custom", {
    //   is: false,
    //   then: Yup.number().required("Sorting order is required").positive(),
    //   otherwise: Yup.mixed().notRequired()
    // }),

    // usage_limit: Yup.mixed().when("type_id", {
    //   is: "BANK_OFFER",
    //   then: Yup.mixed().notRequired(),
    //   otherwise: Yup.mixed().required("Usage limit is required")
    // }),
    // expiry_date: Yup.mixed().when("type_id", {
    //   is: "BANK_OFFER",
    //   then: Yup.mixed().notRequired(),
    //   otherwise: Yup.string().required("Expiry date is required")
    // }),
    // min_nights_count: Yup.mixed().when("type_id", {
    //   is: "DISCOUNT",
    //   then: Yup.number()
    //     .required("Minimum nights count is required")
    //     .positive(),
    //   otherwise: Yup.mixed().notRequired()
    // }),
    // applicable_date_start: Yup.mixed(),
    // applicable_date_end: Yup.mixed()
  }),
  // offer: Yup.object().shape({
  //   type_id: Yup.string().required("Coupon Type is required"),
  //   offer_cap_amount: Yup.mixed().when("type_id", {
  //     is: "DISCOUNT",
  //     then: Yup.number().required("Offer cap amount is required").min(0),
  //     otherwise: Yup.mixed().notRequired(),
  //   }),
  //   buy_nights_count: Yup.mixed().when("type_id", {
  //     is: "BOGO",
  //     then: Yup.number().required("Buy nights count is required").positive(),
  //     otherwise: Yup.mixed().notRequired(),
  //   }),
  //   get_nights_count: Yup.mixed().when("type_id", {
  //     is: "BOGO",
  //     then: Yup.number().required("Get nights count is required").positive(),
  //     otherwise: Yup.mixed().notRequired(),
  //   }),
  //   external_id: Yup.mixed().when("type_id", {
  //     is: "BANK_OFFER",
  //     then: Yup.string().required("External ID is required"),
  //     otherwise: Yup.mixed().notRequired(),
  //   }),
  //   discount_percentage: Yup.mixed().when("type_id", {
  //     is: "DISCOUNT",
  //     then: Yup.number()
  //       .required("Discount percentage is required")
  //       .min(0)
  //       .max(100),
  //     otherwise: Yup.mixed().notRequired(),
  //   }),
  // }),

  // media_icon: Yup.mixed().when("is_custom", {
  //   is: false,
  //   then: Yup.mixed().test("isFile", "Media icon file is required", (value) => {
  //     // Check if value is a File object or FileList with at least one file
  //     if (value instanceof File) {
  //       return true; // File is selected
  //     } else if (value instanceof FileList && value.length > 0) {
  //       // For multiple file upload (FileList with files)
  //       return true; // Files are selected
  //     } else {
  //       return false; // No file selected
  //     }
  //   }),
  //   otherwise: Yup.mixed().notRequired(),
  // }),
});

export default couponFormSchema;
