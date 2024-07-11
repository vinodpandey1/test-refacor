import React, { useEffect, useState, ChangeEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Box, Button, Container, CssBaseline, Grid, ThemeProvider, createTheme, Typography } from '@mui/material'
import { Helmet } from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@/redux/store'
import { ToastContainer } from 'react-toastify'

import Input from '../../components/Input'
import Dropdown from '../../components/Dropdown'
import { getRole } from '../../redux/features/roleSlice'
import {
  createUser,
  editUser,
  getUsersById,
  createUserByRole,
  profileUploadOnServer,
} from '../../redux/features/usersSlice'
import styles from './user.module.scss'
import BreadcrumbsComponent from '../../components/Breadcrums/Breadcrums'
import SingleImageUploader from '../../components/SingleImageUpload'
import generateConfig, { Config } from '../../components/HelmetConfig'

const inputFields = {
  first_name: '',
  last_name: '',
  email: '',
  mobile: '',
}

const theme = createTheme()

export const userTheme = createTheme({
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          maxWidth: 'none',
          // backgroundColor:'yellow'
        },
      },
    },
  },
})

export default function UserForm() {
  const navigate = useNavigate()
  const [pageTitle, setPageTitle] = useState('User Add')
  const config: Config = generateConfig(pageTitle)
  const location = useLocation()
  const dispatch = useDispatch<AppDispatch>()
  const roleList = useSelector((state: any) => state?.role?.roleGettingState)

  const [fields, setInputFields] = useState<any>(inputFields)
  const [role, setRole] = useState<any>('')
  const [openRole, setOpenRole] = useState<any>(false)
  const [image, setImage] = useState<File | null>(null)
  const [url, setUrl] = useState<any>('')
  const [profileImage, setProfileImage] = useState<any>('')
  const [showEditModules, setShowEditModules] = useState<any>('')

  //Errors
  const [errors, setErrors] = useState<any>({})

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    let userId = location?.pathname.split('/').filter(Boolean).pop()
    event.preventDefault()
    if (handleValidation()) {
      let userData = {
        first_name: fields.first_name,
        last_name: fields.last_name,
        email: fields.email,
        mobile: fields.mobile,
        profile_photo_url: profileImage?.profile_photo_url,
      }
      if (userId === null || userId === 'add') {
        dispatch(createUser(userData)).then((response: any) => {
          if (response?.payload === true) {
            let userId = sessionStorage.getItem('userId')
            navigate(`/users/${userId}/details`)
          }
        })
      } else {
        let editId = { id: userId }
        userData = Object.assign({}, userData, editId)
        dispatch(editUser(userData)).then((response: any) => {
          if (response?.type === 'editUser/fulfilled') {
            navigate(`/users/${userId}/details`)
          }
        })
      }
    }
  }

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    e.persist()
    const { name, value } = e.currentTarget
    setInputFields((prevFields: any) => ({
      ...prevFields,
      [name]: value,
    }))
    setErrors((prevErrors: any) => {
      const { [name]: removedField, ...updatedError } = prevErrors
      return updatedError
    })
  }

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const { name, value } = event.target
    setRole(value)
    setErrors((prevErrors: any) => ({
      ...prevErrors,
      [name]: '', // Clear the specific error field for the selected dropdown
    }))
  }
  useEffect(() => {
    dispatch(getRole())
  }, [])

  useEffect(() => {
    const isEditModuleOpen = new URLSearchParams(window.location.search)
    const showValue = isEditModuleOpen.get('show')
    setShowEditModules(showValue)
    const userId = location?.pathname.split('/').filter(Boolean).pop()
    userId !== 'add'
      ? dispatch(getUsersById(userId)).then((response: any) => {
          if (response?.type === 'getUserById/fulfilled') {
            setInputFields(response?.payload?.user?.User)
            setRole(response?.payload?.user?.role_id !== null ? response?.payload?.user?.role_id : '')
            setOpenRole(true)
            setImage(response?.payload?.user?.User ? response?.payload?.user?.User?.profile_photo_url_signed?.presignedGetUrl : '')
            setProfileImage(
              response?.payload?.user?.User ? response?.payload?.user?.User?.profile_photo_url_signed?.presignedGetUrl : ''
            )
            setPageTitle(
              `${response?.payload?.user?.id} - ${response?.payload?.user?.User?.first_name} ${response?.payload?.user?.User?.last_name} - Edit`
            )
          }
        })
      : ''
  }, [])

  const handleValidation = (): boolean => {
    const requiredFields = ['first_name', 'last_name', 'email', 'mobile']
    const fieldLabels: Record<string, string> = {
      first_name: 'First Name',
      email: 'Email',
      last_name: 'Last Name',
      mobile: 'Mobile',
    }
    const errors: Record<string, string> = {}
    let formIsValid = true

    requiredFields.forEach((field) => {
      if (!fields[field]) {
        formIsValid = false
        errors[field] = `${fieldLabels[field]} Field is Required!`
      }
    })

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
    if (fields.email && !emailRegex.test(fields.email)) {
      errors.email = 'Invalid email format!'
      formIsValid = false
    }

    const mobileRegex = /^\d{10}$/
    if (fields.mobile && !mobileRegex.test(fields.mobile)) {
      errors.mobile = 'Mobile number must be 10 digits!'
      formIsValid = false
    }

    // if (!image) {
    //   errors.image = 'Image is required!'
    //   formIsValid = false
    // }

    setErrors(errors)
    return formIsValid
  }

  const handleSubmitByRole = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (handleValidation()) {
      const userId =
      location?.pathname.split('/').filter(Boolean).pop()
      let userData = {
        userId: userId !== 'add' ? userId : sessionStorage.getItem('userId'),
        role_id: role,
      }
      if (userId !== null) {
        dispatch(createUserByRole(userData)).then((response: any) => {
          if (response?.payload === true) {
            navigate(`/users/${userId}/details`)
          }
        })
      }
    }
  }

  // ...

  useEffect(() => {
    if (image) {
      const fileType = image.type
      if (fileType) {
        const fileExtension = fileType.split('/').pop()
        let data = {
          namespace: 'string',
          extension: fileExtension,
        }
        dispatch(profileUploadOnServer(data)).then((response: any) => {
          setUrl(response?.payload)
          if (response?.payload) {
            setProfileImage(response?.payload)
          }
          if (response?.payload?.presignedPutUrl && image) {
            axios
              .put(response?.payload?.presignedPutUrl, image, {
                headers: {
                  'Content-Type': image.type,
                  'Content-Length': image.size,
                },
              })
              .then((axiosResponse: any) => {
                // Handle the response
                console.log('Axios POST response:', axiosResponse)
              })
              .catch((error: any) => {
                // Handle the error
                console.error('Axios POST error:', error)
              })
          }
        })
      }
    }
  }, [image, dispatch])

  return (
    <>
      <Helmet>
        <title>{config.title}</title>
        {/* Add other meta tags or configurations here if needed */}
      </Helmet>
      <ToastContainer />
      <BreadcrumbsComponent />
      <ThemeProvider theme={userTheme}>
        <Container disableGutters component="main" maxWidth="xl" sx={{ mt: 4 }}>
          <CssBaseline />
          {showEditModules === 'basic' || showEditModules === 'add' ? (
            <>
              {' '}
              <Typography component="h1" variant="h5">
                Add User
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  <Grid item xs={6}>
                    <Input
                      margin="normal"
                      label="First Name"
                      id="first_name"
                      name="first_name"
                      autoComplete=""
                      onChange={handleInputChange}
                      autoFocus
                      required
                      type="text"
                      disabled={false}
                      errorMsg={errors?.first_name}
                      error={errors?.first_name ? true : false}
                      value={fields?.first_name}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Input
                      margin="normal"
                      onChange={handleInputChange}
                      required
                      name="last_name"
                      label="Last Name"
                      type="text"
                      id="last_name"
                      autoComplete=""
                      disabled={false}
                      errorMsg={errors?.last_name}
                      error={errors.last_name ? true : false}
                      value={fields?.last_name}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Input
                      margin="normal"
                      label="Email"
                      id="email"
                      name="email"
                      autoComplete=""
                      onChange={handleInputChange}
                      autoFocus
                      required
                      type="text"
                      disabled={false}
                      errorMsg={errors?.email}
                      error={errors?.email ? true : false}
                      value={fields?.email}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Input
                      margin="normal"
                      label="Mobile Number"
                      id="mobile"
                      name="mobile"
                      autoComplete=""
                      onChange={handleInputChange}
                      autoFocus
                      required
                      type="number"
                      disabled={false}
                      errorMsg={errors?.mobile}
                      error={errors?.mobile ? true : false}
                      value={fields?.mobile}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <SingleImageUploader
                      image={image}
                      setImage={setImage}
                      // errorMsg={errors?.image}
                      // error={errors?.image ? true : false}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, width: 150 }}>
                    Submit
                  </Button>
                </Grid>
              </Box>
            </>
          ) : (
            ''
          )}

          {(showEditModules === 'add' && openRole) || showEditModules === 'role' ? (
            <>
              {' '}
              <hr style={{ margin: '20px 0' }} />
              <Typography component="h1" variant="h5">
                Add Role
              </Typography>
              <Box component="form" onSubmit={handleSubmitByRole} noValidate sx={{ mt: 1 }}>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  <Grid item xs={6}>
                    <Dropdown
                      margin={0}
                      label={'Select Role'}
                      options={roleList}
                      onChange={handleChange}
                      name="role"
                      value={role}
                      errormsg={errors?.role}
                      error={errors?.role ? true : false}
                      className={`${styles.login_dropdown_container}`}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, width: 150 }}>
                    Submit
                  </Button>
                </Grid>
              </Box>
            </>
          ) : (
            ''
          )}
        </Container>
      </ThemeProvider>
    </>
  )
}
