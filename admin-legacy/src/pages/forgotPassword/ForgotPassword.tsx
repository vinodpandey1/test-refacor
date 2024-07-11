import Input from '../../components/Input'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'
import { validate } from '../../utils/validation'

const inputFields = {
  emailOrMobile: '',
}

const theme = createTheme()

export default function ForgotPassword() {
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
            Forgot Password
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Input
              margin="normal"
              label="Mobile Number / Email Address"
              id="emailOrMobile"
              name="emailOrMobile"
              autoComplete="emailOrMobile"
              onChange={handleInputChange}
              autoFocus
              required
              type="text"
              disabled={false}
              errorMsg={errors.emailOrMobile}
              error={errors.emailOrMobile ? true : false}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Submit
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}
