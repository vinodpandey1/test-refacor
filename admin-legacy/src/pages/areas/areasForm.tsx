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

import { AppDispatch } from '@/redux/store'
import {
  createArea,
} from '../../redux/features/areasSlice'
import { ToastContainer } from 'react-toastify'
import BreadcrumbsComponent from '../../components/Breadcrums/Breadcrums'
import generateConfig, { Config } from '../../components/HelmetConfig'
import { Helmet } from 'react-helmet'
import { selectPrimaryOwner } from '../../redux/features/propertySlice'

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

export default function AreasForm() {
  const [pageTitle, setPageTitle] = useState('Add Area')
  const config: Config = generateConfig(pageTitle)
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [fields, setInputFields] = useState<any>(inputFields)
  //Errors
  const [errors, setErrors] = useState<any>({})

  useEffect(() => {
    dispatch(selectPrimaryOwner())
  }, [])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (handleValidation()) {
      let areaData = {
        name: fields.name,
      }
      console.log('areaData',areaData)
        dispatch(createArea(areaData)).then((response: any) => {
          if (response?.payload === true) {
            setTimeout(() => {
              navigate('/areas')
            }, 1000)
          }
        })
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
      name: 'Area Name',
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
            Area
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={6}>
                {
                  <Input
                      margin="normal"
                      label="Area Name"
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
