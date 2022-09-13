import { GridRowData } from "@mui/x-data-grid";

export interface websiteType extends GridRowData {
  name: string;
  description: string;
  url: string;
  commission: string;
  successUrl: string;
  failUrl: string;
  notificationUrl: string;
  paymentMethods: string[] | number[];
  status: boolean;
  tax: boolean;
  theme: themeType;
}
export interface themeType {
  primaryColor: string;
}

export interface FormWebsiteType {
  handleSubmit: (data: websiteType) => void;
  isLoading: boolean;
  currentItem: websiteType | undefined;
}
