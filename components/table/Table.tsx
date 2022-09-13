import React, { useMemo } from "react";
import { useRouter } from "next/router";
import {
  DataGrid,
  GridColDef,
  GridFilterOperator,
  getGridStringOperators,
  arSD,
  frFR,
  enUS,
  ruRU,
} from "@mui/x-data-grid";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

import Dialog from "components/dialog";
import { DataGridTypes } from "shared/models";

export default function DataGridComponent({
  columns: columnsProps,
  rows,
  rowCount,
  pageSize = 10,
  rowsPerPageOptions = [5, 10, 20],
  checkboxSelection = false,
  onPageSizeChange,
  onPageChange,
  onFilterModelChange,
  onSortModelChange,
  loading,
  openDialog = false,
  dialogTitle,
  dialogContent,
  handleClose,
  handleSubmit,
  openModal = false,
  handleCloseModal,
  ModalBody,
  ...rest
}: DataGridTypes) {
  const { locale } = useRouter();
  const gridLocale = () => {
    switch (locale) {
      case "ar":
        return arSD.components.MuiDataGrid.defaultProps.localeText;
      case "fr":
        return frFR.components.MuiDataGrid.defaultProps.localeText;
      case "ru":
        return ruRU.components.MuiDataGrid.defaultProps.localeText;
      default:
        return enUS.components.MuiDataGrid.defaultProps.localeText;
    }
  };
  const columns: GridColDef[] = useMemo(
    () =>
      columnsProps.map((column) => {
        const myColumn = { ...column };
        if (myColumn.filterable !== false) {
          const filterOperators: GridFilterOperator[] = [
            ...getGridStringOperators().filter(
              (operator) => operator.value === "contains"
            ),
          ];
          myColumn.filterOperators = [...filterOperators];
        }
        if (locale === "ar") {
          myColumn.align = "right";
        }
        return myColumn;
      }),
    [columnsProps, locale]
  );
  return (
    <div style={{ height: 650, width: "100%" }}>
      <DataGrid
        localeText={gridLocale()}
        rows={rows || []}
        columns={columns}
        rowCount={rowCount}
        pageSize={pageSize}
        rowsPerPageOptions={rowsPerPageOptions}
        checkboxSelection={checkboxSelection}
        disableSelectionOnClick
        onPageSizeChange={(newPageSize) => onPageSizeChange(newPageSize)}
        onPageChange={(page) => onPageChange(page)}
        paginationMode="server"
        pagination
        loading={loading}
        onFilterModelChange={(model) => onFilterModelChange(model)}
        filterMode="server"
        onSortModelChange={(model) => onSortModelChange(model)}
        sortingMode="server"
        disableColumnSelector
        disableColumnMenu
        {...rest}
      />
      {openDialog && (
        <Dialog
          openDialog={openDialog}
          handleClose={handleClose}
          dialogTitle={dialogTitle}
          dialogContent={dialogContent}
          handleSubmit={handleSubmit}
        />
      )}
      {openModal && handleCloseModal && (
        <Modal
          open={openModal}
          onClose={() => handleCloseModal()}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute" as const,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "auto",
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            {ModalBody}
          </Box>
        </Modal>
      )}
    </div>
  );
}
