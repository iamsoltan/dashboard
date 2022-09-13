import { Range } from "react-date-range";

export interface datePickerType {
  onChange: (range: Range) => void;
  value: Range | undefined;
  handlePickerClose: () => void;
}

export interface dateFiltersType {
  startDate?: Date;
  endDate?: Date;
}
