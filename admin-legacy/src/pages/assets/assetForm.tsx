import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState, ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ExcelUpload from '../../components/ExcelUpload'

import { AppDispatch } from '@/redux/store'

import { getProperty } from '../../redux/features/propertySlice'
import { uploadAssetsList } from '../../redux/features/assetsSlice'
import { ToastContainer } from 'react-toastify'
import BreadcrumbsComponent from '../../components/Breadcrums/Breadcrums'
import generateConfig, { Config } from '../../components/HelmetConfig'
import { Helmet } from 'react-helmet'
import Dropdown from '../../components/Dropdown'

const inputFields = {
  name: '',
  slug: '',
}

const multipleSelectFields = {
  coowners: [],
}

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

export default function AssetForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const propertyList: any = useSelector((state: any) => state?.property?.propertyGettingState)
  const [pageTitle, setPageTitle] = useState('Upload Asset')
  const config: Config = generateConfig(pageTitle)
  const dispatch = useDispatch<AppDispatch>()
  const [propertyId, setPropertyValue] = useState<any>('')
  //Errors
  const [errors, setErrors] = useState<any>({})

  useEffect(() => {
    dispatch(getProperty())
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (handleValidation()) {
      const formData: any = new FormData();
      formData.append('file', selectedFile);
      formData.append('property_id', propertyId);

      if (propertyId) {
        dispatch(uploadAssetsList(formData)).then((response: any) => {
          if (response?.payload === true) {
            setTimeout(() => {
              window.location.reload();
            }, 1000)
          }
        })
      }
    }
  }

  const handleValidation = (): boolean => {
    const fieldLabels: Record<string, string> = {
      propertyList: 'Property',
      file: 'File',
    }
    const errors: Record<string, string> = {}
    let formIsValid = true;

    if (!propertyId) {
      console.log('property id not found');
      formIsValid = false
      errors['propertyList'] = `${fieldLabels['propertyList']} Field is Required!`
    }
    if (!selectedFile) {
      console.log('selectedFile not found');
      formIsValid = false
      errors['file'] = `${fieldLabels['file']} Field is Required!`
    }
    // requiredFields.forEach((field) => {
    //   if (!fields[field]) {
    //     formIsValid = false
    //     errors[field] = `${fieldLabels[field]} Field is Required!`
    //   }
    // })

    setErrors(errors)
    return formIsValid
  }

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const { name, value } = event.target
    setPropertyValue(value)
    setErrors((prevErrors: any) => ({
      ...prevErrors,
      [name]: '', // Clear the specific error field for the selected dropdown
    }))
  }

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
            Upload Assets
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={6}>
                <Dropdown
                    margin={0}
                    label={'Select Property'}
                    options={propertyList}
                    onChange={handleChange}
                    name="propertyList"
                    value={propertyId}
                    errormsg={errors['propertyList']} // Pass the error message for this field
                    error={!!errors['propertyList']}
                />
                  <Grid item xs={6}>
                    <ExcelUpload
                      file={selectedFile}
                      setFile={setSelectedFile}
                      errorMsg={errors['file']} // Pass the error message for this field
                    />
                  </Grid>
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
