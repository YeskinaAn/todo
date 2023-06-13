import {
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import { useState } from "react";

const FormSelect = ({
  options,
  labelName,
  onChange,
}) => {
  return (
    <FormControl fullWidth>
      <Select
        value={labelName}
        onChange={(e) => onChange(e)}
      >
        {/* <TextField
          label="Write label"
          variant="outlined"
          value={labelName}
          onChange={onChange}
        /> */}
        {options.map((option) => {
          // console.log(option, 3);
          return (
            <MenuItem key={option.id} value={option.title}>
              {option.title}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default FormSelect;
