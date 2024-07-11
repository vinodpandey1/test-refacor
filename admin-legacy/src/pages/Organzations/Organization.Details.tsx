import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { Box, Grid, Paper, Typography, Container } from '@mui/material'
import { makeStyles } from '@material-ui/core/styles'
import { createTheme } from '@mui/material/styles'
import BreadcrumbsComponent from '../../components/Breadcrums/Breadcrums'
import generateConfig, { Config } from '../../components/HelmetConfig'
import { Helmet } from 'react-helmet'
import { getOrganizationById } from '../../redux/features/organizationSlice'

interface Organization {
  type: string
  name: string
  OrganizationPmsUsers: PmsUser[]
  id: number
}

interface PmsUser {
  id: number
  User: User
  __typename: string
}

interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  mobile: string
  __typename: string
}

interface LocationState {
  data: any
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

const OrganizationsDetails: React.FC = () => {
  const [pageTitle, setPageTitle] = useState('Organization Details')
  const config: Config = generateConfig(pageTitle)

  const [organizationsDetails, setOrganizationsDetails] = useState<Organization | any>()
  const location = useLocation<LocationState>()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const classes = useStyles()

  useEffect(() => {
    const organizationId = (location?.pathname.split('/').filter(Boolean).slice(-2, -1) || [])[0] || ''
    localStorage.setItem('organizationId', organizationId)
    if (organizationId) {
      dispatch(getOrganizationById(organizationId)).then((response: Organization) => {
        if (response.type === 'getOrganizationById/fulfilled') {
          let dataFromAPI = response?.payload
          const transformedData: Organization = {
            name: dataFromAPI.name,
            type: dataFromAPI?.BusinessPartnership?.name,
            OrganizationPmsUsers: dataFromAPI.PMSOrganizationUsers,
            id: dataFromAPI.id,
          };
          setOrganizationsDetails(transformedData)
          setPageTitle(`${response?.payload?.id} - ${response?.payload?.name}`)
        }
      })
    }
  }, [location])

  const handleGoToEditPage = (name: string, editPage: string) => {
    if (name) {
      navigate(`/organizations/${name}/edit`)
    }
  }

  const keysToDisplay: { [key: string]: string } = {
    name: 'Name',
    type: 'Business Partnership',
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
            {organizationsDetails && (
              <Typography
                variant="h6"
                component="h6"
                className={classes.editButton}
                onClick={() => handleGoToEditPage(`${localStorage.getItem('organizationId')}`, 'basic')}
              >
                <span>Edit</span>
              </Typography>
            )}
          </Box>
          {organizationsDetails ? (
            <Grid container spacing={2} className={classes.gridContainer}>
              {Object.entries(organizationsDetails).map(([key, value]) => {
                if (keysToDisplay.hasOwnProperty(key)) {
                  return (
                    <>
                      <Grid item xs={4} className={`${classes.gridItem}`}>
                        {`${keysToDisplay[key]}:`}
                      </Grid>

                      <Grid item xs={8} className={classes.gridItem}>
                        {typeof value === 'object' && value !== null && value.OrganizationPmsUsers
                            ? value.User.first_name
                            : value || 'N/A'}
                      </Grid>
                    </>
                  )
                }
                return null
              })}
              <div>
                <h2>Co Owners</h2>

                {organizationsDetails.OrganizationPmsUsers &&
                  organizationsDetails.OrganizationPmsUsers.map((user) => (
                    <p key={user.user_id}>
                      {`${user.OrganizationPmsUser.User.first_name} ${user.OrganizationPmsUser.User.last_name}`}
                    </p>
                  ))}
              </div>
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

      <br />
    </>
  )
}

export default OrganizationsDetails
