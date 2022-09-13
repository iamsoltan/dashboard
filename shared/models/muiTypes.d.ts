import { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import type {
  GridColDef,
  GridFilterModel,
  GridRowData,
  GridSortModel,
} from "@mui/x-data-grid";
import { ReactNode } from "react";
import { childrenProps } from "./reactTypes";

export interface AppBarProps extends MuiAppBarProps {
  open: boolean;
}
export type MainAppBarProps = {
  toggleDrawer: () => void;
  open: boolean;
};

export type AlertDialogType = {
  openDialog?: boolean;
  dialogTitle?: string;
  dialogContent?: string | ReactNode;
  dialogSubmit?: string;
  handleClose?: () => void;
  handleSubmit?: () => void;
};

export type MainDrawer = {
  toggleDrawer: () => void;
  open: boolean;
};

export interface CustomListItemProps extends childrenProps {
  path: string;
}

export type DataGridTypes = {
  columns: GridColDef[];
  rows: GridRowData[];
  rowCount: number;
  pageSize: number;
  rowsPerPageOptions: number[];
  checkboxSelection: boolean;
  onPageSizeChange: (arg0: number) => void;
  onPageChange: (arg0: number) => void;
  onFilterModelChange: (model: GridFilterModel) => void;
  onSortModelChange: (model: GridSortModel) => void;
  loading?: boolean;
  openDialog?: boolean;
  dialogTitle?: string;
  dialogContent?: string;
  handleClose?: () => void;
  handleSubmit?: () => void;
  openModal?: boolean;
  handleCloseModal?: () => void;
  ModalBody?: ReactNode;
  [x: string]: unknown;
};
