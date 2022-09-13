import React, { ChangeEvent } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormHelperText from "@mui/material/FormHelperText";
import { objectOfStringsNumberType } from "shared/models";

interface optionsTypes {
  name: string;
  label: string | undefined;
  options: objectOfStringsNumberType[];
  handleChangeRadio: (event: ChangeEvent<HTMLInputElement>) => void;
  value: string | boolean;
  error: string | undefined;
}

const FieldOption = ({
  name,
  label = undefined,
  options,
  handleChangeRadio,
  value,
  error,
}: optionsTypes) => (
  <div>
    <FormControl component="fieldset" error={!!error}>
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup
        aria-label="gender"
        name="radio-buttons-group"
        onChange={handleChangeRadio}
        value={value}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.id as string}
            value={option.value}
            control={<Radio />}
            label={option.label}
            name={name}
          />
        ))}
      </RadioGroup>
      <FormHelperText>{error}</FormHelperText>
    </FormControl>
  </div>
);

export default FieldOption;
