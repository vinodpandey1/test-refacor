// import React from 'react';
// // import styles from './Select.module.scss';

// type PropType = {
//   options?: { value: any; label: any }[];
//   value?: any;
//   name?: string;
//   label?: string;
//   onChange?: any;
//   errormsg?: string;
// };

// const Dropdown: React.FC<PropType> = ({
//   options,
//   value,
//   name,
//   label,
//   onChange,
//   errormsg,
//   ...props
// }) => {
//   return (
//     <div className={styles.inputContainer}>
//       <label className={styles.label}>{label}</label>
//       <select
//         className={styles.select}
//         value={value}
//         {...props}
//         onChange={onChange}
//         name={name}
//       >
//         <option value='Select Items'>--Select {name}--</option>
//         {options?.map((item: { value: any; label: any }) => {
//           return <option value={item.value}>{item.label}</option>;
//         })}
//       </select>
//       {!value && <p className={styles.errormsg}>{errormsg}</p>}
//     </div>
//   );
// };

// export default Dropdown;

import * as React from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

type PropType = {
  options?: { firstName: any; label: any; name: any; id: any }[]
  value?: any
  name?: string
  label?: string
  onChange?: any
  errormsg?: string
  error?: boolean
  margin?: any
  className?: string
}

const Dropdown: React.FC<PropType> = ({
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
  return (
    <div>
      <FormControl sx={{ mt: 2, width: '100%' }} error={error} className={className}>
        <InputLabel id="demo-simple-select-helper-label">{label}</InputLabel>
        <Select
          margin={margin}
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={value}
          label={label}
          onChange={onChange}
          fullWidth
          error={error}
          name={name}
          sx={{ ml: 0 }}
        >
          {options?.map((item: { firstName: any; name: any; label: any; id: any }, index) => {
            return (
              <MenuItem key={index} value={name === 'area' ? item.name : item.id}>
                {item.name}
              </MenuItem>
            )
          })}
        </Select>
        {error && <FormHelperText>{errormsg}</FormHelperText>}
      </FormControl>
    </div>
  )
}

export default Dropdown
