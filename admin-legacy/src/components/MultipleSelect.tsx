import * as React from 'react'
import { Theme, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Chip from '@mui/material/Chip'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

type PropType = {
  options?: { name: any; id: any }[]
  value?: { name: any; id: any }[]
  name?: any
  label?: string
  onChange?: any
  errormsg?: string
  error?: boolean
  margin?: any
  className?: string
}

const MultipleSelect: React.FC<PropType> = ({
  options,
  value,
  name,
  label,
  onChange,
  errormsg,
  error,
  margin,
  className,
  ...props
}) => {
  // ... (other code)

  return (
    <div>
      <FormControl sx={{ mt: 2, width: '100%' }}>
        <InputLabel id="demo-multiple-checkbox-label">{label}</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          name={name}
          value={value?.map((item) => item.name)} // Display the names of the selected items
          onChange={(e) => onChange(e, name)}
          input={<OutlinedInput id="select-multiple-chip" label={label} />}
          renderValue={(selected) => {
            return (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(selected ?? []).map((name: string) => {
                  return <Chip key={name} label={name} />
                })}
              </Box>
            )
          }}
          MenuProps={MenuProps}
        >
          {options?.map((item: { name: any; id: any }, index) => {
            return (
              <MenuItem key={item.id} value={item.name}>
                {item.name}
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>
    </div>
  )
}

export default MultipleSelect
