import React from 'react'
import { Chip, Grid, TextField, MenuItem } from '@mui/material'
import './multiSelectWithInput.css'
import FormControl from '@mui/material/FormControl'

interface Option {
  url: any
  channel_id: any
  firstName: any
  label: any
  name: any
  id: any
  subLabelText?: any
}

interface MultiSelectWithInputProps {
  options?: Option[]
  label?: string
  selectedItems: Option[]
  itemValues: string[]
  itemPercentages?: number[]
  setSelectedItems: React.Dispatch<React.SetStateAction<Option[]>>
  setItemValues: React.Dispatch<React.SetStateAction<string[]>>
  subLabelText?: string
}

const MultiSelectWithInput: React.FC<MultiSelectWithInputProps> = (props: MultiSelectWithInputProps) => {
  const { label, options, selectedItems, itemValues, setSelectedItems, setItemValues, subLabelText } = props

  const handleItemChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedItemID = event.target.value as string
    const selectedItem = options?.find((item) => item.id === selectedItemID)
    if (selectedItem) {
      const itemIndex = selectedItems.findIndex((item) => {
        return !item.url ? item.id === selectedItemID : item.channel_id === selectedItemID
      })

      if (itemIndex !== -1) {
        const updatedSelectedItems = selectedItems.filter((_, index) => index !== itemIndex)
        const updatedItemValues = itemValues.filter((_, index) => index !== itemIndex)

        setSelectedItems(updatedSelectedItems)
        setItemValues(updatedItemValues)
      } else {
        setSelectedItems([...selectedItems, selectedItem])
        setItemValues([...itemValues, ''])
      }
    }
  }

  const handleValueChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    setItemValues((prevValues: Option[]) => {
      const newValues = [...prevValues]
      const selectedItem = prevValues[index]

      if (selectedItem?.id) {
        // If id exists, update the url property without affecting other properties
        newValues[index] = { ...selectedItem, url: event.target.value }
      } else {
        // If id doesn't exist, create a new item with the updated url
        newValues[index] = event.target.value
        setItemValues(newValues)
      }
      return newValues
    })
  }

  const isItemSelected = (item: Option) => {
    return selectedItems.some((selectedItem) => selectedItem.id === item.id)
  }

  return (
    <FormControl sx={{ mt: 2, mr: 2, width: '100%' }}>
      <Grid container spacing={2} rowSpacing={2} direction={'row'}>
        <Grid item xs={4}>
          <TextField
            select
            fullWidth
            size="medium"
            label={label}
            value={selectedItems.map((item) => (item.url ? item.channel_id : item.id))}
            onChange={handleItemChange}
            SelectProps={{
              renderValue: (selected) => (
                <div className="chip-container">
                  {(selected as string[]).map((itemId) => {
                    const selectedItem = options?.find((item) => item.id === itemId)
                    return (
                      <Chip
                        key={selectedItem?.id}
                        label={selectedItem?.name}
                        className="chip-item"
                        // color={selectedItems.some((item) => item.id === itemId) ? 'primary' : 'default'}
                      />
                    )
                  })}
                </div>
              ),
            }}
          >
            {options?.map((item) => (
              <MenuItem
                key={item.id}
                value={item.url ? item.channel_id : item.id}
                selected={isItemSelected(item)} // Add this line
              >
                {item.url ? item.url : item.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={4}>
          {selectedItems.map((item, index) => {
            const itemValue = !item.url ? itemValues[index] : (itemValues[index] as any)?.url
            return (
              <div key={index} style={{ display: 'flex', flexDirection: 'row' }}>
                <TextField
                  size="medium"
                  type="text"
                  value={itemValue}
                  onChange={(event) => handleValueChange(index, event)}
                  label={`${item.name}${subLabelText ? ` ${subLabelText}` : ''}`}
                  className="text-input"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                />
              </div>
            )
          })}
        </Grid>
      </Grid>
    </FormControl>
  )
}

export default MultiSelectWithInput
