import TextField from '@mui/material/TextField'
import React, { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type: string
  label: string
  name?: string
  onChange?: any
  value?: string | number | readonly string[] | undefined | any
  errorMsg?: any
  disabled?: boolean
  id?: string
  autoComplete?: string
  margin?: string | any
  required?: boolean
  error?: boolean
  multiline?: boolean
  rows?: number
}

const Input: React.FC<InputProps> = ({
  type,
  label,
  onChange,
  name,
  value,
  errorMsg,
  disabled,
  id,
  margin,
  autoComplete,
  required,
  error,
  multiline,
  rows,
  ...props
}) => {
  return (
    <TextField
      fullWidth
      type={type}
      id={id}
      label={label}
      name={name}
      autoComplete={autoComplete}
      onChange={onChange}
      autoFocus
      required={required}
      margin={margin}
      disabled={disabled}
      error={error}
      helperText={errorMsg}
      multiline={multiline}
      rows={rows}
      value={value}
    />
  )
}

export default Input
