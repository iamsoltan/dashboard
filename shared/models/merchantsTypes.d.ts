import { GridRowData } from "@mui/x-data-grid";

export interface merchantType extends GridRowData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phoneNumber: string;
  enabled: boolean;
  currencyIsoCode: string;
  countryIsoCode: string;
}

export interface FormMerchantType {
  handleSubmit: (data: merchantType) => void;
  isLoading: boolean;
  currentItem: merchantType | undefined;
}
