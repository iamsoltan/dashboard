import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  GridColDef,
  GridFilterModel,
  GridRenderCellParams,
  GridSortModel,
  GridValueFormatterParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { useQuery, useMutation } from "react-query";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { format } from "date-fns";
import arTnLocale from "date-fns/locale/ar-TN";
import { CSVLink } from "react-csv";
import toast from "react-hot-toast";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import Table from "components/table";
import Title from "components/title";
import useFilters from "components/UseFilters";
import Dialog from "components/dialog";

import { getTransactions, completeBankTransfer } from "services/transactions";
import { dataTableElementType } from "shared/models";
import { localeStatusList } from "shared/constants";

import styles from "./transactions.module.scss";

function Transactions() {
  const router = useRouter();
  const { formatMessage } = useIntl();
  const f = (id: string) => formatMessage({ id });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [paginationTotalRows, setPaginationTotalRows] = useState(0);
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState({});
  const [allData, setAllData] = useState<any>([]);
  const [exportLoading, setExportLoading] = useState(false);
  const [currentRow, setCurrentRow] = useState<any>(null);
  const csvLink = useRef<any>();

  const statusColor = (status: string) =>
    localeStatusList.find((e) => e.label === status)?.color || "black";
  const onReset = () => {
    setFilter({});
    setPage(1);
  };
  const [
    FiltersComponent,
    dateFilter,
    websiteId,
    paymentMethodId,
    statusId,
    transactionId,
  ] = useFilters({}, onReset);
  const { data, refetch, isLoading } = useQuery(
    [
      "transactions",
      page,
      pageSize,
      filter,
      sort,
      dateFilter,
      websiteId,
      paymentMethodId,
      statusId,
      transactionId,
      router.query.mid,
    ],
    () =>
      getTransactions({
        ...dateFilter,
        ...filter,
        ...sort,
        websiteId,
        paymentMethodId,
        statusId,
        transactionId,
        page,
        perPage: pageSize,
        merchantId: router.query.mid,
      }),
    {
      keepPreviousData: true,
      onSuccess: (res) => {
        setPaginationTotalRows(parseInt(res.rowsLength, 10));
      },
    }
  );

  const approveMutation = useMutation(completeBankTransfer, {
    onSuccess: () => {
      toast.success("Successfully approved !");
      setCurrentRow(null);
      refetch();
    },
    onError: (error: any) => {
      toast.error(`cannot approve this transaction  !\n${error.message}`);
    },
  });

  const onFilterChange = useCallback((filterModel: GridFilterModel) => {
    if (filterModel.items[0]) {
      const { columnField, operatorValue, value } = filterModel.items[0];
      switch (operatorValue) {
        case "contains":
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

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "id",
        headerName: f("id"),
        width: 350,
        sortable: false,
        filterable: false,
      },
      {
        field: "website.name",
        headerName: f("websites"),
        type: "string",
        flex: 1,
        sortable: false,
        filterable: false,
        valueGetter: (params: GridValueGetterParams) =>
          params.row?.website?.name as dataTableElementType,
      },
      {
        field: "amount",
        headerName: f("amount"),
        type: "string",
        flex: 1,
        sortable: false,
        filterable: false,
      },
      {
        field: "currency",
        headerName: f("currency"),
        type: "dateTime",
        flex: 1,
        sortable: false,
        filterable: false,
      },
      {
        field: "createdAt",
        headerName: f("creationDate"),
        type: "string",
        valueFormatter: (params: GridValueFormatterParams) => {
          const { value } = params;
          return (
            value &&
            format(new Date(value as Date), "Pp", { locale: arTnLocale })
          );
        },
        width: 150,
        sortable: false,
        filterable: false,
      },
      {
        field: "paymentMethod",
        headerName: f("paymentMethod"),
        type: "string",
        valueFormatter: (params: GridValueFormatterParams) => {
          const { value } = params;
          return value || f("NA");
        },
        flex: 1,
        sortable: false,
        filterable: false,
      },
      {
        field: "status",
        headerName: f("status"),
        renderCell: (params: GridRenderCellParams) => (
          <div className={styles.status_cell}>
            <span style={{ color: statusColor(params?.value as string) }}>
              {params?.value as string}
            </span>
            {params.row.paymentMethod === "Bank Transfer" &&
              params.row.status === "PROCESSING" && (
                <CheckCircleOutlineIcon
                  className={styles.approve_btn}
                  onClick={() => setCurrentRow(params.row)}
                />
              )}
          </div>
        ),
        type: "string",
        flex: 1,
        sortable: false,
        filterable: false,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const headers = [
    { label: f("id"), key: "id" },
    { label: f("websites"), key: "website.name" },
    { label: f("amount"), key: "amount" },
    { label: f("currency"), key: "currency" },
    { label: f("creationDate"), key: "createdAt" },
    { label: f("paymentMethod"), key: "paymentMethod" },
    { label: f("status"), key: "status" },
  ];

  const getData = () => {
    if (!exportLoading) {
      setExportLoading(true);
      getTransactions({
        ...dateFilter,
        websiteId,
        paymentMethodId,
        statusId,
        transactionId,
        merchantId: router.query.mid,
      })
        .then((res) => {
          setAllData(() => [...res?.content]);
          setExportLoading(false);
          csvLink?.current?.link?.click();
        })
        .catch(() => {
          setExportLoading(false);
        });
    }
  };

  const ExportToolbar = () => (
    <div>
      <Button
        onClick={getData}
        startIcon={<DownloadIcon />}
        disabled={data?.content.length === 0}
      >
        {exportLoading ? f("loadingCsv") : f("exportBtn")}
      </Button>
      <CSVLink
        headers={headers}
        data={allData}
        filename="Transaction_history.csv"
        className="hidden"
        ref={csvLink}
      />
    </div>
  );

  return (
    <div>
      <Title>{f("transactions")}</Title>
      {FiltersComponent()}
      <ExportToolbar />
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
      />
      {!!currentRow && (
        <Dialog
          openDialog={!!currentRow}
          handleClose={() => setCurrentRow(null)}
          dialogTitle={f("confirmBankTransfer")}
          dialogContent={f("messageBankTransfer")}
          dialogSubmit={f("approve")}
          handleSubmit={() =>
            approveMutation.mutate({ transactionId: currentRow?.id })
          }
        />
      )}
    </div>
  );
}

export default Transactions;
