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
import { createRole, getRoleById, editRole, getTypes } from '../../redux/features/roleSlice'
import Dropdown from '../../components/Dropdown'
import { ToastContainer } from 'react-toastify'
import BreadcrumbsComponent from '../../components/Breadcrums/Breadcrums'
import { toast } from 'react-toastify'
import generateConfig, { Config } from '../../components/HelmetConfig'
import { Helmet } from 'react-helmet'

const inputFields = {
  name: '',
  description: '',
  slug: '',
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

export default function RoleForm() {
  const [pageTitle, setPageTitle] = useState('Add Role')
  const config: Config = generateConfig(pageTitle)
  const location = useLocation()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const typesList = useSelector((state: any) => state?.role?.typesListing)
  const { isLoading, error, getEditData } = useSelector((state: any) => state?.role)
  const [type, setType] = useState<any>('')
  const [fields, setInputFields] = useState<any>(inputFields)

  //Errors
  const [errors, setErrors] = useState<any>({})

  useEffect(() => {
    let roleId = location?.state && location?.state?.id
    roleId !== null &&
      dispatch(getRoleById(roleId)).then((response: any) => {
        if (response?.type === 'getRoleById/fulfilled') {
          setInputFields(response.payload.roles[0])
          setType(response.payload.roles[0].type)
          setPageTitle(`${response?.payload?.roles[0]?.id} - ${response?.payload?.roles[0].name} - Edit`)
        }
      })
  }, [])

  useEffect(() => {
    dispatch(getTypes())
  }, [])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    let roleId = location?.state && location?.state?.id
    event.preventDefault()
    if (handleValidation()) {
      let roleData = {
        name: fields.name,
        description: fields.description,
        type: type,
        // revision: 0,
      }
      if (roleId === null) {
        dispatch(createRole(roleData)).then((response: any) => {
          if (response?.payload === true) {
            setTimeout(() => {
              navigate('/roles')
            }, 1000)
          }
        })
      } else {
        let editId = { id: fields.id }
        roleData = Object.assign({}, roleData, editId)
        dispatch(editRole(roleData)).then((response: any) => {
          if (response?.type === 'editRole/fulfilled') {
            setTimeout(() => {
              navigate('/roles')
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
    const requiredFields: string[] = ['name', 'description']
    const fieldLabels: Record<string, string> = {
      name: 'Role Name',
      description: 'Description',
    }
    const requiredData: string[] = ['stageIndex', 'primaryOwn', 'keyAccountMana']
    const errors: Record<string, string> = {}
    let formIsValid = true

    requiredFields.forEach((field) => {
      if (!fields[field]) {
        formIsValid = false
        errors[field] = `${fieldLabels[field]} Field is Required!`
      }
    })

    if (!type) {
      formIsValid = false
      errors.type = 'Role Type field is required!'
    }

    setErrors(errors)
    return formIsValid
  }

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const { name, value } = event.target
    setType(value)
    setErrors((prevErrors: any) => ({
      ...prevErrors,
      [name]: '', // Clear the specific error field for the selected dropdown
    }))
  }

  let roleId = location?.state && location?.state?.id

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
            Role
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={6}>
                <Input
                  margin="normal"
                  label="Role Name"
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
              <Grid item xs={6}>
                <Dropdown
                  margin={0}
                  label={'Select Role Type'}
                  options={typesList}
                  onChange={handleChange}
                  name="type"
                  value={type}
                  errormsg={errors?.type}
                  error={errors?.type ? true : false}
                />
              </Grid>

              <Grid item xs={6}>
                <Input
                  margin="normal"
                  onChange={handleInputChange}
                  required
                  name="description"
                  label="Description"
                  type="text"
                  id="outlined-textarea"
                  autoComplete=""
                  disabled={false}
                  errorMsg={errors?.description}
                  error={errors?.description ? true : false}
                  multiline={true}
                  rows={3}
                  value={fields?.description}
                />
              </Grid>
              <Grid item xs={6}>
                <Grid sx={{ mt: 3 }}>{roleId ? fields.slug : ''}</Grid>
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
