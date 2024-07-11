import Input from '../../components/Input'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState, ChangeEvent } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import SingleImageUploader from '../../components/SingleImageUpload'

import { AppDispatch } from '@/redux/store'
import {
  createOrganization,
  getOrganizationById,
  editOrganization,
  selectOrganizationType,
  organizationLogoUploadOnServer,
} from '../../redux/features/organizationSlice'
import { ToastContainer } from 'react-toastify'
import BreadcrumbsComponent from '../../components/Breadcrums/Breadcrums'
import generateConfig, { Config } from '../../components/HelmetConfig'
import { Helmet } from 'react-helmet'
import { selectPrimaryOwner } from '../../redux/features/propertySlice'
import MultipleSelect from '../../components/MultipleSelect'
import Dropdown from '../../components/Dropdown'
import axios from 'axios'

const inputFields = {
  name: '',
  slug: '',
}

const multipleSelectFields = {
  coowners: [],
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

export default function OrganizationForm() {
  const name: any = useSelector((state: any) => state?.property?.name)
  const prop = useSelector((state: any) => state?.property)
  const primaryOwner: any = useSelector((state: any) => state?.property?.primaryOwner)
  const typeOfOrganization: any = useSelector((state: any) => state?.organization?.organizationTypesListing)
  const { isLoading, error, getEditData } = useSelector((state: any) => state?.organization)
  const [pageTitle, setPageTitle] = useState('Add Organization')
  const config: Config = generateConfig(pageTitle)
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [fields, setInputFields] = useState<any>(inputFields)
  const [multiselectValues, setMultiselectValues] = useState<any>(multipleSelectFields)
  const [organizationTypes, setOrgTypes] = useState<any>('')
  const [image, setImage] = useState<File | null>(null)
  const [url, setUrl] = useState<any>('')
  const [logoImage, setLogoImage] = useState<any>('')
  //Errors
  const [errors, setErrors] = useState<any>({})
  const coBrandId = typeOfOrganization.find((orgType: any) => orgType.name === "Co-Brand")?.id;


  useEffect(() => {
    dispatch(selectPrimaryOwner())
    dispatch(selectOrganizationType())
  }, [])

  useEffect(() => {
    if (image) {
      const fileType = image.type
      if (fileType) {
        const fileExtension = fileType.split('/').pop()
        let data = {
          namespace: 'string',
          extension: fileExtension,
        }
        dispatch(organizationLogoUploadOnServer(data)).then((response: any) => {
          setUrl(response?.payload)
          if (response?.payload) {
            setLogoImage(response?.payload)
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

  useEffect(() => {
    let organizationId = location?.state && location?.state?.id
    if (id != null && organizationId == null) {
      organizationId = id
    }

    organizationId !== null &&
      dispatch(getOrganizationById(organizationId)).then((response: any) => {
        console.log('ress', response)
        if (response?.type === 'getOrganizationById/fulfilled') {
          setInputFields(response.payload)
          setPageTitle(`${response?.payload?.id} - ${response?.payload.name} - Edit`)
          console.log('zzz',response?.payload)
          setOrgTypes(response?.payload?.business_partnership_id)
          const idsAndNamesArray = response?.payload?.PMSOrganizationUsers.map(item => ({
            id: item.OrganizationPmsUser.id,
            name: `${item.OrganizationPmsUser.User.first_name} ${item.OrganizationPmsUser.User.last_name}`
          }));
          setMultiselectValues({coowners: idsAndNamesArray})
          setImage(response?.payload ? response?.payload?.logo_presigned_url?.presignedGetUrl : '')
          setLogoImage(
              response?.payload ? response?.payload?.logo_presigned_url?.presignedGetUrl : ''
          )
        }
      })
  }, [])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    let organizationId = location?.state && location?.state?.id
    if (id != null && organizationId == null) {
      organizationId = id
    }
    event.preventDefault()
    if (handleValidation()) {
      const idsArray = multiselectValues.coowners.map(item => item.id);

      let organizationData = {
        name: fields.name,
        business_partnership_id: organizationTypes,
        co_owners: idsArray,
        logo_url:logoImage?.profile_photo_url,
      }
      console.log('org data',organizationData)
      if (organizationId === null) {
        dispatch(createOrganization(organizationData)).then((response: any) => {
          if (response?.payload === true) {
            setTimeout(() => {
              navigate('/organizations')
            }, 1000)
          }
        })
      } else {
        let editId = { id: fields.id }
        organizationData = Object.assign({}, organizationData, editId)
        dispatch(editOrganization(organizationData)).then((response: any) => {
          if (response?.type === 'editOrganization/fulfilled') {
            setTimeout(() => {
              navigate('/organizations')
            }, 1000)
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

  const handleValidation = (): boolean => {
    const requiredFields: string[] = ['name']
    const fieldLabels: Record<string, string> = {
      name: 'Organization Name',
    }
    const errors: Record<string, string> = {}
    let formIsValid = true

    requiredFields.forEach((field) => {
      if (!fields[field]) {
        formIsValid = false
        errors[field] = `${fieldLabels[field]} Field is Required!`
      }
    })

    setErrors(errors)
    return formIsValid
  }

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const { name, value } = event.target
    setOrgTypes(value)
    setErrors((prevErrors: any) => ({
      ...prevErrors,
      [name]: '', // Clear the specific error field for the selected dropdown
    }))
  }

  const handleMultiSelectChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>, name: string) => {
    const { value } = event.target
    const normalizedValues = value.map(name => name.replace(/\s+/g, ' ').trim());

    const selectedItems = primaryOwner.filter((item: any) => {
      const trimmedName = item.name.replace(/\s+/g, ' ').trim(); // Normalize spaces
      return normalizedValues.includes(trimmedName);
    });
    setMultiselectValues((prevState: any) => ({
      ...prevState,
      [name]: selectedItems, // Store an array of objects with id and name in the state
    }))
  }

  let organizationId = location?.state && location?.state?.id

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
          <Typography component="h1" variant="h5">
            Organization
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={6}>
                {
                  <Input
                      margin="normal"
                      label="Organization Name"
                      id="name"
                      name="name"
                      autoComplete=""
                      onChange={handleInputChange}
                      autoFocus
                      required
                      type="text"
                      disabled={false}
                      errorMsg={errors?.name}
                      error={errors?.name ? true : false}
                      value={fields?.name}
                  />
                }
                <Dropdown
                    margin={0}
                    label={'Select Organization Type'}
                    options={typeOfOrganization}
                    onChange={handleChange}
                    name="orgTypes"
                    value={organizationTypes}
                    errormsg={errors?.errors?.organizationTypes}
                    error={errors?.errors?.organizationTypes ? true : false}
                />
                <MultipleSelect
                  options={primaryOwner}
                  margin={0}
                  label={'Select Co owners'}
                  onChange={handleMultiSelectChange}
                  name="coowners"
                  value={multiselectValues.coowners}
                  errormsg={errors?.errors?.coowners}
                  error={errors?.errors?.coowners ? true : false}
                />
                {organizationTypes === coBrandId ? (
                    <Grid item xs={6}>
                      <SingleImageUploader
                          image={image}
                          setImage={setImage}
                      />
                    </Grid>
                ) : null}

              </Grid>




              <Grid item xs={6}>
                <Grid sx={{ mt: 3 }}>{organizationId ? fields.slug : ''}</Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, width: 150 }}>
                Submit
              </Button>
            </Grid>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  )
}
