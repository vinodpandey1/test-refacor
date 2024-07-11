import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { getPropertiesId } from '../../redux/features/propertySlice'
import { Box, Grid, Paper, Typography, Container } from '@mui/material'
import { makeStyles } from '@material-ui/core/styles'
import { openModal, closeModal } from '../../redux/features/propertySlice'
import { createTheme } from '@mui/material/styles'
import BreadcrumbsComponent from '../../components/Breadcrums/Breadcrums'
import generateConfig, { Config } from '../../components/HelmetConfig'
import { Helmet } from 'react-helmet'

interface Address {
  city: string
  area: string
  pincode: string
  // Add more properties as needed
}

interface PropertyJofromMapping {
  daily_jotform_form_id: string
  weekly_jotform_form_id: string
  monthly_jotform_form_id: string
  half_yearly_jotform_form_id: string
  yearly_jotform_form_id: string
}

interface Property {
  name: string
  Address: Address
  code: string
  lifecycle_stage_id: number
  primary_owner_id: number
  key_account_manager_id: number
  KeyAccountManager: KeyAccountManager
  PropertyJofromMapping: PropertyJofromMapping
  businessModel: number
  organizationModel: string
  Channel: Channel[]
  id: number
  virtual_tour_url: string
  max_occupancy: number
  max_adult: number
  max_children: number

  // Add more properties as needed
}

interface GetPropertiesResponse {
  type: string
  payload: {
    properties: Property[]
  }
}

interface LocationState {
  data: any
}

interface KeyAccountManager {
  id: number
  User: User
}

interface User {
  first_name: string
  last_name: string
}

interface Channel {
  id: number
  name: string
  url: string
}

export const detailsTheme = createTheme({
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
  wrapper: {
    border: '1px solid #999',
    boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.75)',
    width: '55%',
    margin: '0',
    padding: '20px',
    borderRadius: '10px',
  },
  gridItem: {
    paddingLeft: '15px',
    paddingBottom: '5px',
    paddingTop: '5px',
    border: '1px solid #eee',
    // margin: '10px',
  },
  gridContainer: {
    padding: '16px 0 0 16px !important',
  },

  container: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
  heading: {
    // fontWeight: 'bold',
    fontSize: '1.3rem',
  },
  editButton: {
    fontWeight: 'bold',
    color: '#333',
    cursor: 'pointer',
    border: '1px solid #333',
    borderRadius: '4px',
    padding: '4px 10px',
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(2),
    },
  },
  detailsContainer: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    flexWrap: 'wrap',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
  devider: {
    borderColor: '#000',
  },

  bold: {
    fontWeight: 'bold',
  },
  link: {
    textDecoration: 'underline',
    color: 'rgb(25, 118, 210)',
    cursor: 'pointer',
  },
  sectionHeader: {
    fontSize: '1.3rem !important',
  },
  boxWrap: {
    marginTop: '0 !important',
  },
}))

const PropertiesDetails: React.FC = () => {
  const [pageTitle, setPageTitle] = useState('Property Details')
  const config: Config = generateConfig(pageTitle)

  const [propertiesDetails, setPropertiesDetails] = useState<Property | any>()
  const location = useLocation<LocationState>()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const isModalOpen = useSelector((state: RootState) => state.property.isModalOpen)
  const classes = useStyles()

  useEffect(() => {
    const propertyId = (location?.pathname.split('/').filter(Boolean).slice(-2, -1) || [])[0] || ''
    localStorage.setItem('propertyId', propertyId)
    if (propertyId) {
      dispatch(getPropertiesId(propertyId)).then((response: GetPropertiesResponse) => {
        if (response.type === 'getPropertiesId/fulfilled') {
          setPropertiesDetails(response.payload.properties ? response.payload.properties[0] : '')
          setPageTitle(`${response?.payload?.properties[0]?.id} - ${response?.payload?.properties[0]?.name}`)
        }
      })
    }
  }, [location, isModalOpen])

  const handleGoToEditPage = (name: string, editPage: string) => {
    if (name) {
      navigate(`/properties/${name}?show=${editPage}`)
    }
  }

  const keysToDisplay: { [key: string]: string } = {
    name: 'Name',
    code: 'Code',
    lifecycleStageName: 'Stage',
    primaryOwner_full_name: 'Primary Owner',
    keyAccountManager_full_name: 'Key Account Manager',
    PropertyBusinessModel: 'Business Model',
    OrganizationModelName: 'Organization',
    virtual_tour_url: 'Virtual Tour Url',
    max_occupancy: 'Max Occupancy',
    max_adult: 'Max Adult',
    max_children: 'Max Children',
    property_order: 'Property Website Sorting Order',
    slug: 'Property Slug',

  }

  const addresskeysToDisplay: { [key: string]: string } = {
    // id: 'ID',
    city: 'City',
    area: 'Area',
    pincode: 'Pincode',
  }

  const jotfromMappingKeysToDisplay: { [key: string]: string } = {
    // id: 'ID',
    daily_jotform_form_id: 'Daily Jotfrom ID',
    weekly_jotform_form_id: 'Weekly Jotfrom ID',
    monthly_jotform_form_id: 'Monthly Jotfrom ID',
    half_yearly_jotform_form_id: 'Half Yearly Jotfrom ID',
    yearly_jotform_form_id: 'Yearly Jotfrom ID',
  }

  const channelToDisplay: { [key: string]: string } = {
    name: 'Name',
    url: 'URL',
  }

  return (
    <>
      <Helmet>
        <title>{config.title}</title>
      </Helmet>
      <BreadcrumbsComponent />
      <Container
        disableGutters
        component="main"
        maxWidth="xl"
        sx={{ mt: 1, display: 'flex', justifyContent: 'flex-start' }}
      >
        <Paper className={classes.wrapper}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, marginTop: 0 }}
            className={`${classes.boxWrap}`}
          >
            <Typography variant="h5" component="h3" gutterBottom className={`${classes.sectionHeader}`}>
              Basic Details
            </Typography>
            {propertiesDetails && (
              <Typography
                variant="h6"
                component="h6"
                className={classes.editButton}
                onClick={() => handleGoToEditPage(`${localStorage.getItem('propertyId')}`, 'basic')}
              >
                <span>Edit</span>
              </Typography>
            )}
          </Box>
          {propertiesDetails ? (
            <Grid container spacing={2} className={classes.gridContainer}>
              {Object.entries(propertiesDetails).map(([key, value]) => {
                if (keysToDisplay.hasOwnProperty(key)) {
                  return (
                    <>
                      <Grid item xs={4} className={`${classes.gridItem}`}>
                        {`${keysToDisplay[key]}:`}
                      </Grid>
                      <Grid item xs={8} className={classes.gridItem}>
                        {key === 'virtual_tour_url' && value ? (
                          <a target="_blank" href={value || ''}>
                            Tour Url
                          </a>
                        ) : typeof value === 'object' && value !== null && value.User ? (
                          value.User.first_name
                        ) : value !== null ? (
                          value
                        ) : (
                          'N/A'
                        )}
                      </Grid>
                    </>
                  )
                }
                return null
              })}
            </Grid>
          ) : (
            <Typography
              variant="body1"
              component="p"
              sx={{
                fontFamily: 'Roboto Helvetica Arial sans-serif',
                lineHeight: '1.5',
                letterSpacing: '0.00938em',
                marginBottom: '0.35em',
                fontWeight: 'bold',
              }}
            >
              Not Available
            </Typography>
          )}
        </Paper>
      </Container>

      <br />
      <Container
        disableGutters
        component="main"
        maxWidth="xl"
        sx={{ mt: 1, display: 'flex', justifyContent: 'flex-start' }}
      >
        <Paper className={classes.wrapper}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h1" gutterBottom className={`${classes.sectionHeader}`}>
              Address Details
            </Typography>
            {propertiesDetails && (
              <Typography
                variant="h6"
                component="h6"
                className={classes.editButton}
                onClick={() => handleGoToEditPage(`${localStorage.getItem('propertyId')}`, 'address')}
              >
                <span>Edit</span>
              </Typography>
            )}
          </Box>
          {propertiesDetails?.Address ? (
            <Grid container spacing={2} className={classes.gridContainer}>
              {Object.entries(propertiesDetails.Address).map(([key, value]) => {
                if (addresskeysToDisplay.hasOwnProperty(key)) {
                  return (
                    <>
                      <Grid item xs={4} className={`${classes.gridItem}`}>
                        {`${addresskeysToDisplay[key]}:`}
                      </Grid>
                      <Grid item xs={8} className={classes.gridItem}>
                        {typeof value === 'object' && value !== null && value.User
                          ? value.User.first_name
                          : value || 'N/A'}
                      </Grid>
                    </>
                  )
                }
                return null
              })}
            </Grid>
          ) : (
            <Typography
              variant="body1"
              component="p"
              sx={{
                fontFamily: 'Roboto Helvetica Arial sans-serif',
                lineHeight: '1.5',
                letterSpacing: '0.00938em',
                marginBottom: '0.35em',
                fontWeight: 'bold',
              }}
            >
              Not Available
            </Typography>
          )}
        </Paper>
      </Container>

      <br />
      <Container
        disableGutters
        component="main"
        maxWidth="xl"
        sx={{ mt: 1, display: 'flex', justifyContent: 'flex-start' }}
      >
        <Paper className={classes.wrapper}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h1" gutterBottom className={`${classes.sectionHeader}`}>
              Channels
            </Typography>
            {propertiesDetails && (
              <Typography
                variant="h6"
                component="h6"
                className={classes.editButton}
                onClick={() => handleGoToEditPage(`${localStorage.getItem('propertyId')}`, 'channel')}
              >
                <span>Edit</span>
              </Typography>
            )}
          </Box>
          {propertiesDetails?.PropertyChannels && propertiesDetails.PropertyChannels.length > 0 ? (
            propertiesDetails.PropertyChannels.map((propertyChannel: any) => (
              <div
                key={propertyChannel.id}
                style={{
                  border: '1px solid grey',
                  margin: '20px',
                  padding: '4px 10px',
                  borderRadius: '10px',
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={4} className={classes.bold}>
                    {`${channelToDisplay.name}:`}
                  </Grid>
                  <Grid item xs={8}>
                    {propertyChannel.Channel?.name || 'Not Available'}
                  </Grid>
                  <Grid item xs={4} className={classes.bold}>
                    {`${channelToDisplay.url}:`}
                  </Grid>
                  <Grid item xs={8} style={{ wordWrap: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {propertyChannel.url ? (
                      <a href={propertyChannel.url} target="_blank" rel="noopener noreferrer" className={classes.link}>
                        {propertyChannel.url}
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </Grid>
                </Grid>
              </div>
            ))
          ) : (
            <Typography variant="body1" component="p" sx={{ fontWeight: 'bold' }}>
              Not Available
            </Typography>
          )}
        </Paper>
      </Container>

      <br />
      <Container
        disableGutters
        component="main"
        maxWidth="xl"
        sx={{ mt: 1, display: 'flex', justifyContent: 'flex-start' }}
      >
        <Paper className={classes.wrapper}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h1" gutterBottom className={`${classes.sectionHeader}`}>
              Jotform Mapping Details
            </Typography>
            {propertiesDetails && (
              <Typography
                variant="h6"
                component="h6"
                className={classes.editButton}
                onClick={() => handleGoToEditPage(`${localStorage.getItem('propertyId')}`, 'jotformMapping')}
              >
                <span>Edit</span>
              </Typography>
            )}
          </Box>
          {propertiesDetails?.PropertyJotformMapping ? (
            <Grid container spacing={2} className={classes.gridContainer}>
              {Object.entries(propertiesDetails.PropertyJotformMapping).map(([key, value]) => {
                if (jotfromMappingKeysToDisplay.hasOwnProperty(key)) {
                  return (
                    <>
                      <Grid item xs={4} className={`${classes.gridItem}`}>
                        {`${jotfromMappingKeysToDisplay[key]}:`}
                      </Grid>
                      <Grid item xs={8} className={classes.gridItem}>
                        {typeof value === 'object' && value !== null && value.User
                          ? value.User.first_name
                          : value || 'N/A'}
                      </Grid>
                    </>
                  )
                }
                return null
              })}
            </Grid>
          ) : (
            <Typography
              variant="body1"
              component="p"
              sx={{
                fontFamily: 'Roboto Helvetica Arial sans-serif',
                lineHeight: '1.5',
                letterSpacing: '0.00938em',
                marginBottom: '0.35em',
                fontWeight: 'bold',
              }}
            >
              Not Available
            </Typography>
          )}
        </Paper>
      </Container>
    </>
  )
}

export default PropertiesDetails
