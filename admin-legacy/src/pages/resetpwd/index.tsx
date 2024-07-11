import Input from '../../components/Input'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Typography from '@mui/material/Typography'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import React, { useState } from 'react'
import { validate } from '../../utils/validation'

const inputFields = {
  newpassword: '',
  reenterpwd: '',
}

const useStyles = makeStyles({
  errorMessage: {
    fontFamily: 'Roboto',
    fontWeight: 400,
    fontSize: '0.75rem',
    lineHeight: 1.66,
    letterSpacing: '0.03333em',
    textAlign: 'left',
    marginTop: '3px',
    marginRight: '14px',
    marginBottom: 0,
    marginLeft: '14px',
    color: 'red',
  },
})

const theme = createTheme()

export default function ResetPassword() {
  const classes = useStyles()

  const [fields, setInputFields] = useState<any>(inputFields)
  //Errors
  const [errors, setErrors] = useState<any>({})

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrors(validate(fields))
  }

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    e.persist()
    const { name, value } = e.currentTarget
    setErrors({
      ...errors,
      [name]: '',
    })
    setInputFields({
      ...fields,
      [name]: value,
    })
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Input
              margin="normal"
              label="New Password"
              id="newpassword"
              name="newpassword"
              autoComplete="newpassword"
              onChange={handleInputChange}
              autoFocus
              required
              type="text"
              disabled={false}
              errorMsg={errors.newpassword}
              error={errors.newpassword ? true : false}
            />
            <Input
              margin="normal"
              label="Re Enter Password"
              id="reenterpwd"
              name="reenterpwd"
              autoComplete="reenterpwd"
              onChange={handleInputChange}
              autoFocus
              required
              type="text"
              disabled={false}
              errorMsg={errors.reenterpwd}
              error={errors.reenterpwd ? true : false}
            />
            <Typography
              style={{
                fontFamily: 'Roboto',
                fontWeight: 400,
                fontSize: '0.75rem',
                lineHeight: 1.66,
                letterSpacing: '0.03333em',
                textAlign: 'left',
                marginTop: '3px',
                marginRight: '14px',
                marginBottom: 0,
                marginLeft: '14px',
                color: 'red',
              }}
            >
              {errors.matchingPwd}
            </Typography>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Submit
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}
