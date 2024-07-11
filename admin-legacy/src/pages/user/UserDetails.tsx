import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Box, Grid, Paper, Typography, Container, Link } from '@mui/material'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store'
import { useLocation, useNavigate } from 'react-router-dom'

import BreadcrumbsComponent from '../../components/Breadcrums/Breadcrums'
import generateConfig, { Config } from '../../components/HelmetConfig'
import { getUsersById } from '../../redux/features/usersSlice'
import { UserData, User, Property } from '../../interfaces/userInterface'

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
  sectionHeader: {
    fontSize: '1.3rem !important',
  },
  boxWrap: {
    marginTop: '0 !important',
  },
}))

export default function UserDetails() {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const [userDetails, setUserDetails] = useState<UserData | null>(null)
  const [pageTitle, setPageTitle] = useState('Property Details')
  const config: Config = generateConfig(pageTitle)

  useEffect(() => {
    const userId = (location?.pathname.split('/').filter(Boolean).slice(-2, -1) || [])[0] || ''
    sessionStorage.setItem('userId', userId)
    dispatch(getUsersById(userId)).then((response) => {
      if (response.payload) {
        const userData = response.payload
        setUserDetails(userData)
      }
    })
  }, [])

  const handleGoToEditPage = (name: string, editPage: string) => {
    if (name) {
      navigate(`/users/${name}?show=${editPage}`)
    }
  }

  const userDetatilsToDisplay: { [key: string]: string } = {
    name: 'Name',
    mobile: 'Mobile No.',
    email: 'Email',
  }

  const handleRedirectToProperty = (details: any) => {
    const properId = details?.id
    if (!properId) return ''
    return (
      <>
        <Link
          href={process.env.REACT_APP_PUBLIC_URL + '/properties/' + properId + '/details'}
          target="_blank"
          style={{
            textDecoration: 'underline',
            color: '#1976d2',
            cursor: 'pointer',
          }}
        >
          {details?.name}
        </Link>
      </>
    )
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
            <Typography
              variant="h6"
              component="h6"
              className={classes.editButton}
              onClick={() => handleGoToEditPage(`${sessionStorage.getItem('userId')}`, 'basic')}
            >
              <span>Edit</span>
            </Typography>
          </Box>
          {userDetails && userDetails.user && userDetails?.user?.User ? (
            <Grid container spacing={2} className={classes.gridContainer}>
              {Object.keys(userDetails.user.User).map((key) => {
                if (userDetatilsToDisplay[key as keyof User]) {
                  return (
                    <React.Fragment key={key}>
                      <Grid item xs={4} className={classes.gridItem}>
                        <strong>{userDetatilsToDisplay[key as keyof User]}</strong>
                      </Grid>
                      <Grid item xs={8} className={classes.gridItem}>
                        {userDetails?.user?.User[key as keyof User]}
                      </Grid>
                    </React.Fragment>
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
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, marginTop: 0 }}
            className={`${classes.boxWrap}`}
          >
            <Typography variant="h5" component="h3" gutterBottom className={`${classes.sectionHeader}`}>
              Role
            </Typography>
            <Typography
              variant="h6"
              component="h6"
              className={classes.editButton}
              onClick={() => handleGoToEditPage(`${sessionStorage.getItem('userId')}`, 'role')}
            >
              <span>Edit</span>
            </Typography>
          </Box>
          <Grid container spacing={2} className={classes.gridContainer}>
            <React.Fragment>
              <Grid item xs={4} className={classes.gridItem}>
                <strong>Role</strong>
              </Grid>
              <Grid item xs={8} className={classes.gridItem}>
                {' '}
                {userDetails?.user?.Role?.name}
              </Grid>
            </React.Fragment>
          </Grid>
        </Paper>
      </Container>
      <Container
        disableGutters
        component="main"
        maxWidth="xl"
        sx={{ mt: 2, display: 'flex', justifyContent: 'flex-start' }}
      >
        <Paper className={classes.wrapper}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h5" component="h1" gutterBottom className={`${classes.sectionHeader}`}>
              Owned Properties
            </Typography>
          </Box>
          {userDetails?.user?.OwnedProperties && userDetails?.user?.OwnedProperties.length > 0 ? (
            <Grid container spacing={2} className={classes.gridContainer}>
              <table
                style={{
                  fontFamily: 'arial sans-serif',
                  borderCollapse: 'collapse',
                  width: '100%',
                }}
              >
                <tr>
                  <th
                    style={{
                      border: '1px solid #dddddd',
                      textAlign: 'left',
                      padding: '8px',
                    }}
                  >
                    ID
                  </th>
                  <th
                    style={{
                      border: '1px solid #dddddd',
                      textAlign: 'left',
                      padding: '8px',
                    }}
                  >
                    Property Name
                  </th>
                  <th
                    style={{
                      border: '1px solid #dddddd',
                      textAlign: 'left',
                      padding: '8px',
                    }}
                  >
                    Address
                  </th>
                </tr>
                {userDetails?.user?.OwnedProperties &&
                  userDetails?.user?.OwnedProperties.map((item: Property, index: number) => {
                    return (
                      <React.Fragment key={index}>
                        <tr>
                          <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{item.id}</td>
                          <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>
                            {handleRedirectToProperty(item)}
                          </td>
                          <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>
                            {item?.Address !== null ? `${item?.Address?.city} ${item?.Address?.area}` : 'N/A'}
                          </td>
                        </tr>
                      </React.Fragment>
                    )
                  })}
              </table>
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
