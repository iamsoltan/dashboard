import React, { useCallback, useMemo, useState } from "react";
import {
  GridActionsCellItem,
  GridColDef,
  GridFilterModel,
  GridRowData,
  GridRowParams,
  GridSortModel,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import {
  Grid,
  Button,
  CircularProgress,
  TextField,
  Modal,
  Typography,
  Box,
} from "@mui/material";
import { useKeycloak } from "@react-keycloak/ssr";
import type { KeycloakInstance } from "keycloak-js";
import { useQuery, useMutation } from "react-query";
import GppMaybeIcon from "@mui/icons-material/GppMaybe";
import TimelineIcon from "@mui/icons-material/Timeline";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ErrorIcon from "@mui/icons-material/Error";
import HistoryIcon from "@mui/icons-material/History";
import AddBoxIcon from "@mui/icons-material/AddBox";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import toast from "react-hot-toast";
import { useIntl } from "react-intl";
import useFilters from "components/UseFilters";

import Table from "components/table";
import Title from "components/title";
import Dialog from "components/dialog";

import {
  getWallets,
  enableWallet,
  increaseWallet,
  decreaseWallet,
  getWalletTransactions,
  getWalletHistory,
} from "services/wallets";
import { walletType } from "shared/models/wallet";
import styles from "./Wallets.module.scss";

function Wallets() {
  const { keycloak } = useKeycloak<KeycloakInstance>();

  const { formatMessage } = useIntl();
  const f = (id: string) => formatMessage({ id });
  const [openDialogIncrease, setOpenDialogIncrease] =
    React.useState<boolean>(false);
  const [openDialogTransactions, setOpenDialogTransactions] =
    React.useState<boolean>(false);
  const [openDialogHistory, setOpenDialogHistory] =
    React.useState<boolean>(false);
  const [openDialogDecrease, setOpenDialogDecrease] =
    React.useState<boolean>(false);
  const [FiltersComponent, , website] = useFilters({
    filterByTransaction: false,
    filterByStatus: false,
    filterByPaymentMethods: false,
    filterByDate: false,
    filterByWebsiteId: false,
  });

  const [openModal, setOpenModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<walletType | undefined>(
    undefined
  );

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [transactionsPage, setTransactionsPage] = useState(1);
  const [transactionsPageSize, setTransactionsPageSize] = useState(10);

  const [transactionsPaginationTotalRows, setTransactionsPaginationTotalRows] =
    useState(0);
  const [paginationTotalRows, setPaginationTotalRows] = useState(0);

  const [historyPage, setHistoryPage] = useState(1);
  const [historyPageSize, setHistoryPageSize] = useState(10);

  const [historyPaginationTotalRows, setHistoryPaginationTotalRows] =
    useState(0);

  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState({});
  const [increaseAmount, setIncreaseAmount] = useState("");
  const [comment, setComment] = useState("");
  const [decreaseAmount, setDecreaseAmount] = useState("");

  const { data, isLoading, refetch } = useQuery(
    ["wallets", page, pageSize, filter, sort, website],
    () =>
      getWallets({
        publicKey: website?.publicKey,
        secretKey: website?.secretKey,
        ...filter,
        ...sort,
        page,
        perPage: pageSize,
      }),
    {
      enabled: !!website,
      keepPreviousData: true,
      onSuccess: (res) => {
        setPaginationTotalRows(parseInt(res.rowsLength, 10));
      },
    }
  );

  const enableMutation = useMutation(enableWallet, {
    onSuccess: () => {
      toast.dismiss();
      toast.success("Successfully updated !");
      setOpenModal(false);
      setCurrentItem(undefined);
      refetch();
    },
    onError: (error: any) => {
      toast.dismiss();
      toast.error(`cannot update  !\n${error.message}`);
    },
  });

  const increaseMutation = useMutation(increaseWallet, {
    onSuccess: () => {
      toast.dismiss();
      toast.success("Successfully updated !");
      setOpenModal(false);
      setCurrentItem(undefined);
      refetch();
    },
    onError: (error: any) => {
      toast.dismiss();
      toast.error(`cannot update  !\n${error.message}`);
    },
  });

  const decreaseMutation = useMutation(decreaseWallet, {
    onSuccess: () => {
      toast.dismiss();
      toast.success("Successfully updated !");
      setOpenModal(false);
      setCurrentItem(undefined);
      refetch();
    },
    onError: (error: any) => {
      toast.dismiss();
      toast.error(`cannot update  !\n${error.message}`);
    },
  });

  const { data: transactions } = useQuery(
    ["WalletTransactions", transactionsPage, transactionsPageSize, website],
    () =>
      getWalletTransactions({
        publicKey: website?.publicKey,
        secretKey: website?.secretKey,
        userId: currentItem?.userId as string,
        page: transactionsPage,
        perPage: transactionsPageSize,
      }),

    {
      enabled: !!website && !!currentItem,
      keepPreviousData: true,
      onSuccess: (res) => {
        setTransactionsPaginationTotalRows(parseInt(res.rowsLength, 10));
      },
    }
  );

  const { data: history } = useQuery(
    ["walletHistory", historyPage, historyPageSize, website],
    () =>
      getWalletHistory({
        publicKey: website?.publicKey,
        secretKey: website?.secretKey,
        userId: currentItem?.userId as string,
        page: historyPage,
        perPage: historyPageSize,
      }),

    {
      enabled: !!website && !!currentItem,
      keepPreviousData: true,
      onSuccess: (res) => {
        setHistoryPaginationTotalRows(parseInt(res.rowsLength, 10));
      },
    }
  );

  const onFilterChange = useCallback((filterModel: GridFilterModel) => {
    if (filterModel.items[0]) {
      const { columnField, operatorValue, value } = filterModel.items[0];
      switch (operatorValue) {
        case "contains":
          setFilter({ [`${columnField}_like`]: value });
          break;
        case "equals":
          setFilter({ [`${columnField}`]: value });
          break;
        default:
          setFilter({});
          break;
      }
    }
  }, []);
  const handleSortModelChange = (newModel: GridSortModel) => {
    if (newModel[0]) {
      const { field, sort: newSort } = newModel[0];
      return setSort({ _sort: field, _order: newSort });
    }
    return setSort({});
  };

  const handleCloseModal = () => {
    setCurrentItem(undefined);
    setOpenModal(false);
  };
  const handleModalSubmit = () => {
    enableMutation.mutate({
      publicKey: website?.publicKey,
      secretKey: website?.secretKey,
      actionOwner: keycloak?.tokenParsed?.sub,
      ...currentItem,
      enabled: !currentItem?.enabled,
    } as any);
    toast.loading(f("processing"));
  };

  const handleOpenModal = (row: GridRowData | null) => {
    setCurrentItem(row as walletType);
    setOpenModal(true);
  };
  const ModalBody = () => (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <GppMaybeIcon fontSize="large" color="error" />
      </Grid>
      <Grid item xs={12}>
        <hr />
        {currentItem?.enabled ? (
          <h5>{f("disableWalletMsg")}</h5>
        ) : (
          <h5>{f("enableWalletMsg")}</h5>
        )}
      </Grid>
      <Grid item xs={12} className={styles.form_button}>
        <Button
          variant="contained"
          color={currentItem?.enabled ? "error" : "primary"}
          disabled={isLoading}
          className={styles.form_btn}
          onClick={handleModalSubmit}
        >
          {(() => {
            if (isLoading) {
              return <CircularProgress color="secondary" />;
            }
            if (currentItem?.enabled) return f("disable");
            return f("enable");
          })()}
        </Button>
      </Grid>
    </>
  );

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "id",
        headerName: f("id"),
        flex: 1,
        sortable: false,
        hide: true,
      },
      {
        field: "userId",
        headerName: f("userId"),
        type: "string",
        flex: 1,
        sortable: false,
      },
      {
        field: "balance",
        headerName: f("balance"),
        type: "string",
        flex: 1,
        sortable: false,
      },
      {
        field: "enabled",
        headerName: f("status"),
        type: "string",
        sortable: false,
        renderCell: (params: GridRenderCellParams) => (
          <span className={params.row.enabled ? "active" : "inactive"}>
            {params.row.enabled ? f("active") : f("inactive")}
          </span>
        ),
        flex: 1,
      },
      {
        field: "actions",
        headerName: f("actions"),
        type: "actions",
        getActions: (params: GridRowParams) => [
          // eslint-disable-next-line react/jsx-key
          <GridActionsCellItem
            icon={<TimelineIcon />}
            // eslint-disable-next-line no-alert
            onClick={() => {
              setCurrentItem(params.row);
              setOpenDialogTransactions(true);
            }}
            label={f("showTransactions")}
            showInMenu
          />,
          // eslint-disable-next-line react/jsx-key
          <GridActionsCellItem
            icon={<HistoryIcon />}
            // eslint-disable-next-line no-alert
            onClick={() => {
              setCurrentItem(params.row);
              setOpenDialogHistory(true);
            }}
            label={f("showHistory")}
            showInMenu
          />,
          // eslint-disable-next-line react/jsx-key
          <GridActionsCellItem
            icon={<AddBoxIcon />}
            // eslint-disable-next-line no-alert
            onClick={() => {
              setCurrentItem(params.row);
              setOpenDialogIncrease(true);
            }}
            label={f("increaseBalance")}
            showInMenu
          />,
          // eslint-disable-next-line react/jsx-key
          <GridActionsCellItem
            icon={<RemoveCircleIcon />}
            onClick={() => {
              setCurrentItem(params.row);
              setOpenDialogDecrease(true);
            }}
            label={f("decreaseBalance")}
            showInMenu
          />,
          // eslint-disable-next-line react/jsx-key
          <GridActionsCellItem
            icon={<ToggleOffIcon />}
            onClick={() => handleOpenModal(params.row)}
            label={f("enableBtn")}
            showInMenu
          />,
        ],
        sortable: false,
        filterable: false,
        width: 160,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      currentItem?.userId,
      transactionsPage,
      transactionsPageSize,
      website?.publicKey,
      website?.secretKey,
    ]
  );

  const transactionsColumns: GridColDef[] = useMemo(
    () => [
      {
        field: "id",
        headerName: f("id"),
        flex: 1,
        sortable: false,
      },
      {
        field: "amount",
        headerName: f("amount"),
        type: "string",
        flex: 1,
        sortable: false,
      },
      {
        field: "sender",
        headerName: f("sender"),
        type: "string",
        flex: 1,
        sortable: false,
      },
      {
        field: "receiver",
        headerName: f("receiver"),
        type: "string",
        flex: 1,
        sortable: false,
      },
      {
        field: "status",
        headerName: f("status"),
        type: "string",
        sortable: false,
        flex: 1,
      },
      {
        field: "type",
        headerName: f("type"),
        type: "string",
        sortable: false,
        flex: 1,
      },
      {
        field: "createdAt",
        headerName: f("createdAt"),
        type: "string",
        width: 250,

        sortable: false,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const historyColumns: GridColDef[] = useMemo(
    () => [
      {
        field: "id",
        headerName: f("id"),
        sortable: false,
      },
      {
        field: "walletId",
        headerName: f("walletId"),
        type: "string",
        sortable: false,
      },
      {
        field: "action",
        headerName: f("action"),
        type: "string",
        flex: 1,
        sortable: false,
      },
      {
        field: "comment",
        headerName: f("comment"),
        type: "string",
        flex: 1,
        sortable: false,
      },
      {
        field: "actionOwner",
        headerName: f("actionOwner"),
        type: "string",
        sortable: false,
        flex: 1,
      },
      {
        field: "createdAt",
        headerName: f("createdAt"),
        type: "string",
        flex: 1,
        sortable: false,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onDialogInputChangeIncrease = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    if (value.match(/[^$,.\d]/) || value.length >= 12) return;
    setIncreaseAmount(value);
  };

  const onDialogInputChangeComment = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    setComment(value);
  };
  const onDialogInputChangeDecrease = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    if (value.match(/[^$,.\d]/) || value.length >= 12) return;
    setDecreaseAmount(value);
  };

  const handleSubmitIncrease = () => {
    const amount = Number(increaseAmount);
    if (amount === 0 || Number.isNaN(amount)) {
      toast.error(f("amountError"));
      return;
    }
    increaseMutation.mutate({
      publicKey: website?.publicKey,
      secretKey: website?.secretKey,
      actionOwner: keycloak?.tokenParsed?.sub as string,
      comment,
      userId: currentItem?.userId as string,
      amount,
    });
    toast.loading(f("processing"));
    setOpenDialogIncrease(false);
    setIncreaseAmount("");
    setComment("");
  };
  const handleSubmitDecrease = () => {
    const amount = Number(decreaseAmount);
    if (amount === 0 || Number.isNaN(amount)) {
      toast.error(f("amountError"));
      return;
    }
    decreaseMutation.mutate({
      publicKey: website?.publicKey,
      secretKey: website?.secretKey,
      actionOwner: keycloak?.tokenParsed?.sub as string,
      comment,
      userId: currentItem?.userId as string,
      amount,
    });
    toast.loading(f("processing"));
    setOpenDialogDecrease(false);
    setDecreaseAmount("");
    setComment("");
  };

  const resetIncreaseDecreaseAmount = () => {
    setCurrentItem(undefined);
    setIncreaseAmount("");
    setDecreaseAmount("");
    setComment("");
  };

  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <Title>{f("displayWalletsTitle")}</Title>
      {FiltersComponent()}
      {website ? (
        <Table
          rows={data?.content}
          columns={columns}
          rowCount={paginationTotalRows}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection={false}
          onPageSizeChange={(newPageSize: number) => {
            setPageSize(newPageSize);
          }}
          onPageChange={(newPage: number) => {
            setPage(newPage + 1);
          }}
          onFilterModelChange={onFilterChange}
          onSortModelChange={(model) => handleSortModelChange(model)}
          loading={isLoading}
          openModal={openModal}
          handleCloseModal={() => handleCloseModal()}
          ModalBody={ModalBody()}
        />
      ) : (
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <ErrorIcon fontSize="large" color="error" />
          <div>{f("selectWebsite")}</div>
        </Grid>
      )}
      {openDialogIncrease && (
        <Dialog
          openDialog={openDialogIncrease}
          handleClose={() => {
            resetIncreaseDecreaseAmount();
            setOpenDialogIncrease(false);
          }}
          dialogTitle={f("increaseBalance")}
          dialogSubmit={`${f("increaseBtn")}`}
          dialogContent={
            <>
              <TextField
                autoFocus
                margin="dense"
                id="amount"
                label={f("amount")}
                type="text"
                fullWidth
                variant="outlined"
                value={increaseAmount}
                onChange={onDialogInputChangeIncrease}
                autoComplete="off"
              />
              <TextField
                autoFocus
                margin="dense"
                id="comment"
                label={f("commentOptional")}
                type="text"
                fullWidth
                variant="outlined"
                value={comment}
                onChange={onDialogInputChangeComment}
                autoComplete="off"
              />
            </>
          }
          handleSubmit={handleSubmitIncrease}
        />
      )}
      {openDialogDecrease && (
        <Dialog
          openDialog={openDialogDecrease}
          handleClose={() => {
            resetIncreaseDecreaseAmount();
            setOpenDialogDecrease(false);
          }}
          dialogTitle={f("decreaseBalance")}
          dialogSubmit={`${f("decreaseBtn")}`}
          dialogContent={
            <>
              <TextField
                autoFocus
                margin="dense"
                id="amount"
                label={f("amount")}
                type="text"
                fullWidth
                variant="outlined"
                value={decreaseAmount}
                onChange={onDialogInputChangeDecrease}
                autoComplete="off"
              />
              <TextField
                autoFocus
                margin="dense"
                id="comment"
                label={f("commentOptional")}
                type="text"
                fullWidth
                variant="outlined"
                value={comment}
                onChange={onDialogInputChangeComment}
                autoComplete="off"
              />
            </>
          }
          handleSubmit={handleSubmitDecrease}
        />
      )}
      {openDialogTransactions && (
        <Modal
          open={openDialogTransactions}
          onClose={() => setOpenDialogTransactions(false)}
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {f("walletTransactionsTitle")}
            </Typography>
            <Table
              rows={transactions?.content}
              columns={transactionsColumns}
              rowCount={transactionsPaginationTotalRows}
              pageSize={transactionsPageSize}
              rowsPerPageOptions={[5, 10, 20]}
              checkboxSelection={false}
              onPageSizeChange={(newPageSize: number) => {
                setTransactionsPageSize(newPageSize);
              }}
              onPageChange={(newPage: number) => {
                setTransactionsPage(newPage + 1);
              }}
              onFilterModelChange={onFilterChange}
              onSortModelChange={(model) => handleSortModelChange(model)}
              loading={isLoading}
            />
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              mt={3}
            >
              <Button onClick={() => setOpenDialogTransactions(false)}>
                {f("close")}
              </Button>
            </Grid>
          </Box>
        </Modal>
      )}

      {openDialogHistory && (
        <Modal
          open={openDialogHistory}
          onClose={() => setOpenDialogHistory(false)}
        >
          <Box sx={style}>
            <Typography id="modal-history-title" variant="h6" component="h2">
              {f("walletHistoryTitle")}
            </Typography>
            <Table
              rows={history?.content}
              columns={historyColumns}
              rowCount={historyPaginationTotalRows}
              pageSize={historyPageSize}
              rowsPerPageOptions={[5, 10, 20]}
              checkboxSelection={false}
              onPageSizeChange={(newPageSize: number) => {
                setHistoryPageSize(newPageSize);
              }}
              onPageChange={(newPage: number) => {
                setHistoryPage(newPage + 1);
              }}
              onFilterModelChange={onFilterChange}
              onSortModelChange={(model) => handleSortModelChange(model)}
              loading={isLoading}
            />
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              mt={3}
            >
              <Button onClick={() => setOpenDialogHistory(false)}>
                {f("close")}
              </Button>
            </Grid>
          </Box>
        </Modal>
      )}
    </>
  );
}

export default Wallets;
