import Input from '../../components/Input'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState, ChangeEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@/redux/store'
import {
  createProperty,
  getPropertiesId,
  editProperties,
  propertyUpload,
  lifecycleStages,
  addAddress,
  selectPrimaryOwner,
  keyAccountManager,
  getChannelList,
  addChannel,
  getPropertyAddressArea,
  businessModels,
  organizationModels,
  addJotformPropertyMapping,
} from '../../redux/features/propertySlice'
import styles from '../user/user.module.scss'
import { makeStyles } from '@material-ui/core/styles'
import MultiSelectWithInput from '../../components/MultipleSelectWithInput'
import Dropdown from '../../components/Dropdown'
import { ToastContainer } from 'react-toastify'
import BreadcrumbsComponent from '../../components/Breadcrums/Breadcrums'
import generateConfig, { Config } from '../../components/HelmetConfig'
import { Helmet } from 'react-helmet'
import MultipleSelect from '../../components/MultipleSelect'

const multipleSelectFields = {
  coOwners: [],
}

const inputFields = {
  name: '',
  code: '',
  city: '',
  ownerId: '',
  googleMapsLocation: '',
  pincode: '',
  id: '',
  virtualTourUrl: '',
  maxOccupancy: '',
  maxAdult: '',
  maxChildren: '',
  dailyJotfromId: '',
  weeklyJotfromId: '',
  monthlyJotfromId: '',
  halfYearlyJotfromId: '',
  yearlyJotfromId: '',
  propertySortOrder: '',
}

export const propertyTheme = createTheme({
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

const useStyles = makeStyles((theme) => ({
  dropzone: {
    border: `2px dashed ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.secondary,
    padding: theme.spacing(2),
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.background.default,
    },
  },
  imageWrapper: {
    display: 'flex',
    flexWrap: 'nowrap',
    marginTop: theme.spacing(2),
    flexDirection: 'row',
  },
  image: {
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
    maxWidth: 200,
    maxHeight: 200,
  },
}))

const theme = createTheme()

export default function PropertiesForm() {
  const [multiselectValues, setMultiselectValues] = useState<any>(multipleSelectFields)

  const [pageTitle, setPageTitle] = useState('Add Property')
  const config: Config = generateConfig(pageTitle)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const isModalOpen = useSelector((state: any) => state?.property?.isModalOpen)
  const newDetailsId = useSelector((state: any) => state?.property?.propertyId)
  const stages: any = useSelector((state: any) => state?.property?.lifecycleStage)
  const primaryOwner: any = useSelector((state: any) => state?.property?.primaryOwner)
  const accountManager: any = useSelector((state: any) => state?.property?.accountManager)
  const travellAgentList: any = useSelector((state: any) => state?.property?.getChannelList)
  const areaList: any = useSelector((state: any) => state?.property?.propertyAddressAreaList)
  const businessList = useSelector((state: any) => state?.property?.businessModelList)
  const organizationList = useSelector((state: any) => state?.property?.organizationModelList)

  const [fields, setInputFields] = useState<any>(inputFields)
  const [images, setImages] = useState<File[]>([])
  const [selectedChannel, setSelectedChannel] = useState<string[]>([])
  const [travellAgentValues, setSelectedChannelValues] = useState<string[]>([])
  const [formData, setFormData] = useState({
    stageIndex: '',
    primaryOwn: '',
    keyAccountMana: '',
    businessModel: '',
    area: '',
    organizationModel: '',
    organizationName: '',
  })
  const [addAressSectionOpen, setAddressesSectionOpen] = useState(false)
  const [showEditModules, setShowEditModules] = useState<any>('')

  //Errors
  const [errors, setErrors] = useState<any>({})

  const handleAddressSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (handleAddressValidation()) {
      const id =
        JSON.parse(localStorage.getItem('propertyId') || 'null') || location?.pathname.split('/').filter(Boolean).pop()
      let addressData = {
        id: id,
        area: formData.area,
        pincode: fields.pincode,
        city: fields.city,
      }
      dispatch(addAddress(addressData))
        .then((response: any) => {
          if (response?.payload === true) {
            navigate(`/properties/${id}/details`)
          }
        })
        .catch((error: any) => {
          // Handle the error in case the dispatch or promise fails
        })
    }
  }

  const handleJotfromMappingSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (handleJotfromMappingValidation()) {
      const id =
        JSON.parse(localStorage.getItem('propertyId') || 'null') || location?.pathname.split('/').filter(Boolean).pop()
      let jotfromPropertyMappingBody = {
        property_id: id,
        daily_jotform_form_id: fields.dailyJotfromId,
        weekly_jotform_form_id: fields.weeklyJotfromId,
        monthly_jotform_form_id: fields.monthlyJotfromId,
        half_yearly_jotform_form_id: fields.halfYearlyJotfromId,
        yearly_jotform_form_id: fields.yearlyJotfromId,
      }

      console.log('jotfromPropertyMappingBody', jotfromPropertyMappingBody)
      dispatch(addJotformPropertyMapping(jotfromPropertyMappingBody))
        .then((response: any) => {
          if (response?.payload === true) {
            navigate(`/properties/${id}/details`)
          }
        })
        .catch((error: any) => {
          // Handle the error in case the dispatch or promise fails
        })
    }
  }

  const handlePropertySubmit = (event: React.FormEvent<HTMLFormElement>) => {
    let propertyId = location?.pathname.split('/').filter(Boolean).pop()
    event.preventDefault()
    if (handleValidation()) {
      let propertyData = {
        name: fields.name,
        code: fields.code,
        primary_owner_id: parseInt(formData.primaryOwn),
        lifecycle_stage_id: parseInt(formData.stageIndex),
        key_account_manager_id: parseInt(formData.keyAccountMana),
        business_model_id: parseInt(formData.businessModel),
        organization_id: parseInt(formData.organizationModel),
        virtual_tour_url: fields.virtualTourUrl,
        max_occupancy: fields.maxOccupancy ? parseInt(fields.maxOccupancy) : null,
        max_adult: fields.maxAdult ? parseInt(fields.maxAdult) : null,
        max_children: fields.maxChildren ? parseInt(fields.maxChildren) : null,
        property_order: fields.propertySortOrder ? parseInt(fields.propertySortOrder) : null,
        slug: fields.propertySlug ,
      }

      if (propertyId === 'add') {
        dispatch(createProperty(propertyData)).then((response: any) => {
          if (response.payload === true) {
            let propertyId = localStorage.getItem('propertyId')
            navigate(`/properties/${propertyId}/details`)
            // setAddressesSectionOpen(true)
          }
        })
      } else {
        let editId = { id: fields.id }
        propertyData = Object.assign({}, propertyData, editId)
        dispatch(editProperties(propertyData)).then((response: any) => {
          if (response?.type === 'editProperties/fulfilled') {
            navigate(`/properties/${propertyId}/details`)
          }
        })
      }
    }
  }

  const handleChannelSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const id =
      JSON.parse(localStorage.getItem('propertyId') || 'null') || location?.pathname.split('/').filter(Boolean).pop()

    // Assuming you have existingData with previous data, replace it with your actual data
    const existingData: any[] = []

    // Merge the existingData with the new data (selectedChannel)
    const mergedData = [...existingData, ...selectedChannel]

    const transformedData = mergedData.map((agent: any, index: any) => {
      const travellAgentValue = travellAgentValues[index]

      if (travellAgentValue && typeof travellAgentValue === 'object') {
        // If travellAgentValue is an object (with id, url, channel_id, and name properties)
        const { url, channel_id, ...rest } = travellAgentValue
        return { ...rest, url, channel_id } // Keep the existing data and update the url and channel_id with travellAgentValue's properties
      } else if (travellAgentValue && typeof travellAgentValue === 'string') {
        // If travellAgentValue is a string (only containing the url)
        return {
          url: travellAgentValue,
          channel_id: agent.id,
        }
      } else {
        // If travellAgentValue is not defined or not an object or a string
        // Return the agent as is, without any changes
        return agent
      }
    })

    const requestData = {
      id: id,
      data: transformedData.map((item) => {
        const { name, ...rest } = item
        return rest
      }),
    }
    dispatch(addChannel(requestData)).then((response: any) => {
      if (response?.type === 'addChannel/fulfilled' && response?.payload === true) {
        navigate(`/properties/${id}/details`)
      }
    })
  }

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    e.persist()
    const { name, value } = e.currentTarget
    if (name === 'pincode' && value.length > 6) {
      return
    }
    setInputFields((prevFields: any) => ({
      ...prevFields,
      [name]: value,
    }))
    setErrors((prevErrors: any) => {
      const { [name]: removedField, ...updatedError } = prevErrors
      return updatedError
    })
  }

  useEffect(() => {
    dispatch(lifecycleStages())
    dispatch(selectPrimaryOwner())
    dispatch(keyAccountManager())
    dispatch(getChannelList())
    dispatch(getPropertyAddressArea())
    dispatch(businessModels())
    dispatch(organizationModels())
  }, [])

  useEffect(() => {
    if (images.length > 0) {
      dispatch(propertyUpload(images))
    }
  }, [images])

  useEffect(() => {
    const isEditModuleOpen = new URLSearchParams(window.location.search)
    const showValue = isEditModuleOpen.get('show')
    setShowEditModules(showValue)
    const propertiesAddForm = location?.pathname.split('/').filter(Boolean).pop()
    const propertyId = propertiesAddForm || newDetailsId || localStorage.getItem('propertyId')

    if (propertyId !== 'add') {
      dispatch(getPropertiesId(propertyId)).then((response: any) => {
        console.log('kkkk', response)
        if (response?.type === 'getPropertiesId/fulfilled') {
          const property = response.payload.properties[0]
          const {
            code,
            name,
            id,
            Address,
            lifecycle_stage_id,
            primary_owner_id,
            key_account_manager_id,
            PropertyBusinessModelId,
            organizationModel,
            virtual_tour_url,
            max_occupancy,
            max_adult,
            max_children,
            PropertyJotformMapping,
            property_order,
              slug
          } = property || {}

          setInputFields({
            code: code || 'N/A',
            name: name || 'N/A',
            id: id || 'N/A',
            city: Address?.city || 'N/A',
            pincode: Address?.pincode || 'N/A',
            virtualTourUrl: virtual_tour_url || null,
            maxOccupancy: max_occupancy || null,
            maxAdult: max_adult || null,
            maxChildren: max_children || null,
            dailyJotfromId: PropertyJotformMapping?.daily_jotform_form_id || null,
            weeklyJotfromId: PropertyJotformMapping?.weekly_jotform_form_id || null,
            monthlyJotfromId: PropertyJotformMapping?.monthly_jotform_form_id || null,
            halfYearlyJotfromId: PropertyJotformMapping?.half_yearly_jotform_form_id || null,
            yearlyJotfromId: PropertyJotformMapping?.yearly_jotform_form_id || null,
            propertySortOrder: property_order || 'N/A',
            propertySlug: slug || 'N/A',
          })

          setFormData((prevFormData: any) => ({
            ...prevFormData,
            stageIndex: lifecycle_stage_id || 'N/A',
            primaryOwn: primary_owner_id || 'N/A',
            keyAccountMana: key_account_manager_id || 'N/A',
            area: Address?.area || 'N/A',
            businessModel: PropertyBusinessModelId || 'N/A',
            organizationModel: organizationModel || 'N/A',
          }))

          let travellAgentData = response?.payload?.properties[0]?.PropertyChannels?.map((agent: any) => {
            const { Channel, ...rest } = agent
            return {
              ...rest,
              name: Channel?.name || '',
            }
          })
          setPageTitle(`${response?.payload?.properties[0]?.id} - ${response?.payload?.properties[0]?.name} - Edit`)
          setSelectedChannel(travellAgentData)
          setSelectedChannelValues(travellAgentData)
          setAddressesSectionOpen(true)
        }
      })
    }
  }, [isModalOpen, location])

  const handleValidation = (): boolean => {
    const requiredFields: string[] = ['name', 'code']
    const fieldLabels: Record<string, string> = {
      name: 'Property Name',
      code: 'Property Code',
      primaryOwn: 'Primary Owner',
      keyAccountMana: 'Key Account Manager',
      businessModel: 'Business Model',
      stageIndex: 'Stage',
      organizationModel: 'Organization',
      virtualTourUrl: 'Virtual Tour Url',
      maxOccupancy: 'Max Occupancy',
      maxAdult: 'Max Adult',
      maxChildren: 'Max Children',
    }
    const requiredData: string[] = ['stageIndex', 'primaryOwn', 'keyAccountMana', 'businessModel']
    const errors: Record<string, string> = {}
    let formIsValid = true

    requiredFields.forEach((field) => {
      if (!fields[field]) {
        formIsValid = false
        errors[field] = `${fieldLabels[field]} Field is Required!`
      }
    })

    console.log('formData', formData)
    requiredData.forEach((data) => {
      if (!(formData as Record<string, string>)[data]) {
        formIsValid = false
        errors[data] = `${fieldLabels[data]} Field is Required!`
      }
    })

    setErrors(errors)
    return formIsValid
  }

  const handleAddressValidation = (): boolean => {
    const requiredFields: string[] = ['city', 'pincode']
    const fieldLabels: Record<string, string> = {
      pincode: 'Pincode',
      city: 'City',
    }
    const requiredData: string[] = ['area']

    const errors: Record<string, string> = {}
    let formIsValid = true

    requiredFields.forEach((field) => {
      if (!fields[field]) {
        formIsValid = false
        errors[field] = `${fieldLabels[field]} Field is Required!`
      }
    })

    if (fields.pincode && fields.pincode.length !== 6) {
      formIsValid = false
      errors.pincode = 'Pincode must have exactly 6 digits!'
    }
    console.log('formData address', formData)
    requiredData.forEach((data) => {
      if (!(formData as Record<string, string>)[data]) {
        formIsValid = false
        errors[data] = `${fieldLabels[data]} Field is Required!`
      }
    })

    setErrors(errors)
    return formIsValid
  }

  const handleJotfromMappingValidation = (): boolean => {
    const requiredFields: string[] = ['dailyJotfromId']
    const fieldLabels: Record<string, string> = {
      dailyJotfromId: 'DailyJotfromId',
    }

    const errors: Record<string, string> = {}
    let formIsValid = true

    requiredFields.forEach((field) => {
      console.log('field', field)
      console.log('fields', fields[field])
      console.log('!fields[field]', !fields[field])
      if (!fields[field]) {
        console.log('inner validation')
        formIsValid = false
        errors[field] = `${fieldLabels[field]} Field is Required!`
      }
    })

    setErrors(errors)
    return formIsValid
  }

  const handleMultiSelectChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>, name: string) => {
    const { value } = event.target
    setMultiselectValues((prevState: any) => ({ ...prevState, [name]: value as string[] }))
  }

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const { name, value } = event.target
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      [name]: value,
    }))
    setErrors((prevErrors: any) => ({
      ...prevErrors,
      [name]: '', // Clear the specific error field for the selected dropdown
    }))
  }
  console.log('PropertyBusinessModelId', formData.businessModel)
  console.log('Organization Id', formData.organizationModel)
  return (
    <>
      <Helmet>
        <title>{config.title}</title>
      </Helmet>
      <ToastContainer />
      <BreadcrumbsComponent />
      <ThemeProvider theme={propertyTheme}>
        <Container disableGutters component="main" maxWidth="xl" sx={{ mt: 4 }}>
          <CssBaseline />
          {showEditModules === 'basic' || showEditModules === 'add' ? (
            <>
              {' '}
              <Typography component="h1" variant="h5">
                Basic Details
              </Typography>
              <Box component="form" onSubmit={handlePropertySubmit} noValidate sx={{ mt: 1 }}>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  <Grid item xs={4}>
                    <Input
                      margin="normal"
                      label="Property Name"
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
                  </Grid>
                  <Grid item xs={4}>
                    <Input
                      margin="normal"
                      onChange={handleInputChange}
                      required
                      name="code"
                      label="Property Code"
                      type="text"
                      id="code"
                      autoComplete=""
                      disabled={false}
                      errorMsg={errors?.code}
                      error={errors?.code ? true : false}
                      value={fields?.code}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Dropdown
                      margin={0}
                      label={'Select Primary Owner'}
                      options={primaryOwner}
                      onChange={handleChange}
                      name="primaryOwn"
                      value={formData.primaryOwn}
                      errormsg={errors?.primaryOwn}
                      error={errors?.primaryOwn ? true : false}
                      className={`${styles.login_dropdown_container}`}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Dropdown
                      margin={0}
                      label={'Select Key Account Manager'}
                      options={accountManager}
                      onChange={handleChange}
                      name="keyAccountMana"
                      value={formData.keyAccountMana}
                      errormsg={errors?.keyAccountMana}
                      error={errors?.keyAccountMana ? true : false}
                      className={`${styles.login_dropdown_container}`}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Dropdown
                      margin={0}
                      label={'Select Stage'}
                      options={stages}
                      onChange={handleChange}
                      name="stageIndex"
                      value={formData.stageIndex}
                      errormsg={errors?.stageIndex}
                      error={errors?.stageIndex ? true : false}
                      className={`${styles.login_dropdown_container}`}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <Dropdown
                      margin={0}
                      label={'Select Businees Model'}
                      options={businessList}
                      onChange={handleChange}
                      name="businessModel"
                      value={formData.businessModel}
                      errormsg={errors?.businessModel}
                      error={errors?.businessModel ? true : false}
                      className={`${styles.login_dropdown_container}`}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Dropdown
                      margin={0}
                      label={'Select Organization'}
                      options={organizationList}
                      onChange={handleChange}
                      name="organizationModel"
                      value={formData.organizationModel}
                      errormsg={errors?.organizationModel}
                      error={errors?.organizationModel ? true : false}
                      className={`${styles.login_dropdown_container}`}
                    />

                    {/*options?: { firstName: any; label: any; name: any; id: any }[]*/}
                    {/*value?: any*/}
                    {/*name?: any*/}
                    {/*label?: string*/}
                    {/*onChange?: any*/}
                    {/*errormsg?: string*/}
                    {/*error?: boolean*/}
                    {/*margin?: any*/}
                    {/*className?: string*/}
                    {/*<Dropdown*/}
                    {/*    margin={0}*/}
                    {/*    label={'Select Businees Model'}*/}
                    {/*    options={businessList}*/}
                    {/*    onChange={handleChange}*/}
                    {/*    name="businessModel"*/}
                    {/*    value={formData.businessModel}*/}
                    {/*    errormsg={errors?.businessModel}*/}
                    {/*    error={errors?.businessModel ? true : false}*/}
                    {/*    className={`${styles.login_dropdown_container}`}*/}
                    {/*/>*/}
                  </Grid>
                  <Grid item xs={8}>
                    <Input
                      margin="normal"
                      label="Virtual Tour Url"
                      id="virtualTourUrl"
                      name="virtualTourUrl"
                      autoComplete=""
                      onChange={handleInputChange}
                      type="text"
                      disabled={false}
                      errorMsg={errors?.virtualTourUrl}
                      error={errors?.virtualTourUrl ? true : false}
                      value={fields?.virtualTourUrl}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Input
                      margin="normal"
                      label="Max Occupancy"
                      id="maxOccupancy"
                      name="maxOccupancy"
                      autoComplete=""
                      onChange={handleInputChange}
                      autoFocus
                      required
                      type="number"
                      disabled={false}
                      errorMsg={errors?.maxOccupancy}
                      error={errors?.maxOccupancy ? true : false}
                      value={fields?.maxOccupancy}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Input
                      margin="normal"
                      label="Max Adults"
                      id="maxAdult"
                      name="maxAdult"
                      autoComplete=""
                      onChange={handleInputChange}
                      autoFocus
                      required
                      type="number"
                      disabled={false}
                      errorMsg={errors?.maxAdult}
                      error={errors?.maxAdult ? true : false}
                      value={fields?.maxAdult}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Input
                      margin="normal"
                      label="Max Children"
                      id="maxChildren"
                      name="maxChildren"
                      autoComplete=""
                      onChange={handleInputChange}
                      autoFocus
                      required
                      type="number"
                      disabled={false}
                      errorMsg={errors?.maxChildren}
                      error={errors?.maxChildren ? true : false}
                      value={fields?.maxChildren}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Input
                      margin="normal"
                      label="Property Website Sorting Order"
                      id="maxChildren"
                      name="propertySortOrder"
                      autoComplete=""
                      onChange={handleInputChange}
                      autoFocus
                      type="number"
                      disabled={false}
                      errorMsg={errors?.propertySortOrder}
                      error={errors?.propertySortOrder ? true : false}
                      value={fields?.propertySortOrder}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Input
                        margin="normal"
                        label="Property Slug"
                        id="propertySlug"
                        name="propertySlug"
                        autoComplete=""
                        onChange={handleInputChange}
                        autoFocus
                        type="text"
                        disabled={false}
                        errorMsg={errors?.propertySlug}
                        error={errors?.propertySlug ? true : false}
                        value={fields?.propertySlug}
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
          {(showEditModules === 'add' && addAressSectionOpen === true) || showEditModules === 'address' ? (
            <>
              <hr style={{ margin: '20px 0' }} />
              <Typography component="h1" variant="h5">
                Address Details
              </Typography>
              <Box component="form" onSubmit={handleAddressSubmit} noValidate sx={{ mt: 1 }}>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  <Grid item xs={4}>
                    <Input
                      margin="normal"
                      label="City"
                      id="city"
                      name="city"
                      autoComplete=""
                      onChange={handleInputChange}
                      autoFocus
                      required
                      type="text"
                      disabled={false}
                      errorMsg={errors?.city}
                      error={errors?.city ? true : false}
                      value={fields?.city}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Dropdown
                      margin={0}
                      label={'Select Area'}
                      options={areaList}
                      onChange={handleChange}
                      name="area"
                      value={formData.area}
                      errormsg={errors?.area}
                      error={errors?.area ? true : false}
                      className={`${styles.login_dropdown_container}`}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Input
                      margin="normal"
                      label="Pincode"
                      id="pincode"
                      name="pincode"
                      autoComplete=""
                      onChange={handleInputChange}
                      autoFocus
                      required
                      type="number"
                      disabled={false}
                      errorMsg={errors?.pincode}
                      error={errors?.pincode ? true : false}
                      value={fields?.pincode}
                    />
                  </Grid>
                  <Grid item container direction="row" sx={{ mt: 1 }} justifyContent="space-between" xs={12}>
                    <Button type="submit" fullWidth variant="contained" sx={{ width: 150 }}>
                      Submit
                    </Button>

                    {/* <Link
                      color="primary"
                      sx={{ width: 150, whiteSpace: 'nowrap', cursor: 'pointer' }}
                      onClick={goToProperty}
                    >
                      Goto Property Listing
                    </Link> */}
                  </Grid>
                </Grid>
              </Box>
            </>
          ) : (
            ''
          )}
          {(showEditModules === 'add' && addAressSectionOpen === true) || showEditModules === 'channel' ? (
            <>
              <hr style={{ margin: '20px 0' }} />
              <Typography component="h1" variant="h5">
                Channel
              </Typography>
              <Box component="form" onSubmit={handleChannelSubmit} noValidate sx={{ mt: 1 }}>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  <Grid item xs={12}>
                    <MultiSelectWithInput
                      label={'Select Channel'}
                      options={travellAgentList}
                      selectedItems={selectedChannel}
                      setSelectedItems={setSelectedChannel}
                      itemValues={travellAgentValues}
                      setItemValues={setSelectedChannelValues}
                      subLabelText={'Url'}
                    />
                  </Grid>
                  <Grid item container direction="row" sx={{ mt: 1 }} justifyContent="space-between" xs={12}>
                    <Button type="submit" fullWidth variant="contained" sx={{ width: 150 }}>
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </>
          ) : (
            ''
          )}
          {(showEditModules === 'add' && addAressSectionOpen === true) || showEditModules === 'jotformMapping' ? (
            <>
              <hr style={{ margin: '20px 0' }} />
              <Typography component="h1" variant="h5">
                Property Jotform Mapping
              </Typography>
              <Box component="form" onSubmit={handleJotfromMappingSubmit} noValidate sx={{ mt: 1 }}>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  <Grid item xs={4}>
                    <Input
                      margin="normal"
                      label="Daily Form ID"
                      id="dailyJotfromId"
                      name="dailyJotfromId"
                      autoComplete=""
                      onChange={handleInputChange}
                      autoFocus
                      required
                      type="text"
                      disabled={false}
                      errorMsg={errors?.dailyJotfromId}
                      error={errors?.dailyJotfromId ? true : false}
                      value={fields?.dailyJotfromId}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Input
                      margin="normal"
                      label="Weekly Form Id"
                      id="weeklyJotfromId"
                      name="weeklyJotfromId"
                      autoComplete=""
                      onChange={handleInputChange}
                      autoFocus
                      required
                      type="text"
                      disabled={false}
                      errorMsg={errors?.weeklyJotfromId}
                      error={errors?.weeklyJotfromId ? true : false}
                      value={fields?.weeklyJotfromId}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Input
                      margin="normal"
                      label="Monthly Form ID"
                      id="monthlyJotfromId"
                      name="monthlyJotfromId"
                      autoComplete=""
                      onChange={handleInputChange}
                      autoFocus
                      required
                      type="text"
                      disabled={false}
                      errorMsg={errors?.monthlyJotfromId}
                      error={errors?.monthlyJotfromId ? true : false}
                      value={fields?.monthlyJotfromId}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Input
                      margin="normal"
                      label="Half Yearly Form ID"
                      id="halfYearlyJotfromId"
                      name="halfYearlyJotfromId"
                      autoComplete=""
                      onChange={handleInputChange}
                      autoFocus
                      required
                      type="text"
                      disabled={false}
                      errorMsg={errors?.halfYearlyJotfromId}
                      error={errors?.halfYearlyJotfromId ? true : false}
                      value={fields?.halfYearlyJotfromId}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Input
                      margin="normal"
                      label="Yearly Form ID"
                      id="yearlyJotfromId"
                      name="yearlyJotfromId"
                      autoComplete=""
                      onChange={handleInputChange}
                      autoFocus
                      required
                      type="text"
                      disabled={false}
                      errorMsg={errors?.yearlyJotfromId}
                      error={errors?.yearlyJotfromId ? true : false}
                      value={fields?.yearlyJotfromId}
                    />
                  </Grid>
                  <Grid item container direction="row" sx={{ mt: 1 }} justifyContent="space-between" xs={12}>
                    <Button type="submit" fullWidth variant="contained" sx={{ width: 150 }}>
                      Submit
                    </Button>
                  </Grid>
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
