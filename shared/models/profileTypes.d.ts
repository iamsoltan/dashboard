import { GridRowData } from "@mui/x-data-grid";

export interface profileType extends GridRowData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phoneNumber: string;
  currencyIsoCode: string;
}

export interface FormProfileType {
  handleSubmit: (data: profileType) => void;
  isLoading: boolean;
  currentItem: profileType | undefined;
}
