export const validate = (values: any) => {
  const errors: any = {}
  const emailregex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
  if (!values.firstName) {
    errors.firstName = 'FirstName field is required!'
  }
  if (!values.lastName) {
    errors.lastName = 'LastName field is required!'
  }
  if (!values.email) {
    errors.email = 'Email field is required!'
  } else if (!emailregex.test(values.email)) {
    errors.email = 'This is not a valid email format!'
  }
  if (!values.password) {
    errors.password = 'Password field is required!'
  }
  if (!values.phoneNumber) {
    errors.phoneNumber = 'Mobile Number field is required!'
  }
  if (!values.company) {
    errors.company = 'Company Name field is required!'
  }
  if (!values.pinCode) {
    errors.pinCode = 'Pincode field is required!'
  }
  if (!values.addressLine1) {
    errors.addressLine1 = 'Address Line 1 field is required!'
  }
  if (!values.addressLine2) {
    errors.addressLine2 = 'Address Line 2 field is required!'
  }
  if (!values.state) {
    errors.state = 'State field is required!'
  }
  if (!values.country) {
    errors.country = 'Country field is required!'
  }
  if (!values.gst) {
    errors.gst = 'GST field is required!'
  }
  if (!values.emailOrMobile) {
    errors.emailOrMobile = 'Email is required!'
  } else if (!emailregex.test(values.emailOrMobile)) {
    errors.email = 'This is not a valid email format!'
  }
  if (!values.newpassword) {
    errors.newpassword = 'New Password field is required!'
  }
  if (!values.reenterpwd) {
    errors.reenterpwd = 'Re enter Password field is required!'
  }
  if (values.newpassword && values.reenterpwd) {
    if (values.newpassword !== values.reenterpwd) {
      errors.matchingPwd = 'Passwords must not match'
    }
  }
  return errors
}

// export const EmailValidate = (values: any) => {
//   if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values)) {
//     errors.email = 'This is not a valid email format!'
//   }
//   return errors
// }
// export const changePwdValidator = (values: any) => {
//   const errors: any = {}
//   if (!values.new) {
//     errors.new = 'New Password field is required!'
//   }
//   if (!values.reEnter) {
//     errors.reEnter = 'Re enter Password field is required!'
//   }
//   if (!values.current) {
//     errors.current = 'Current Password field is required!'
//   }
//   return errors
// }
