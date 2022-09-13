import React from "react";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import { FormHelperText } from "@mui/material";
import { objectOfStringsNumberType } from "shared/models";

interface selectTypes {
  id: string;
  value: string;
  options: objectOfStringsNumberType[];
  error: string | undefined;
  name: string;
  onChangeField: (event: SelectChangeEvent<string>) => void;
}

const FieldSelect = ({
  id,
  value,
  options,
  onChangeField,
  error,
  name,
}: selectTypes) => (
  <div>
    <FormControl fullWidth error={!!error}>
      <Select id={id} name={name} value={value} onChange={onChangeField}>
        {options.map((option) => (
          <MenuItem key={option.id} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{error}</FormHelperText>
    </FormControl>
  </div>
);

export default FieldSelect;
