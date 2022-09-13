import React, { useCallback, useMemo, useState } from "react";
import {
  GridActionsCellItem,
  GridColDef,
  GridFilterModel,
  GridRowData,
  GridRowParams,
  GridSortModel,
  GridValueGetterParams,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { useQuery, useMutation } from "react-query";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import toast from "react-hot-toast";
import { useIntl } from "react-intl";
import { get } from "lodash";

import Table from "components/table";
import Title from "components/title";

import {
  getMerchants,
  createMerchant,
  updateMerchant,
} from "services/merchants";
import { useRouter } from "next/router";
import FormMerchant from "components/formMerchant";
import { merchantType } from "shared/models";

function Merchants() {
  const router = useRouter();
  const { formatMessage } = useIntl();
  const f = (id: string) => formatMessage({ id });

  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [currentItem, setCurrentItem] = useState<merchantType | undefined>(
    undefined
  );

  /* eslint-enable */
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [paginationTotalRows, setPaginationTotalRows] = useState(0);
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState({});

  const { data, isLoading, refetch } = useQuery(
    ["merchants", page, pageSize, filter, sort],
    () =>
      getMerchants({
        ...filter,
        ...sort,
        page,
        perPage: pageSize,
      }),
    {
      keepPreviousData: true,
      onSuccess: (res) => {
        setPaginationTotalRows(parseInt(res.rowsLength, 10));
      },
    }
  );
  const createMutation = useMutation(createMerchant, {
    onSuccess: () => {
      toast.success("Successfully created !");
      setOpenModal(false);
      setCurrentItem(undefined);
      setModalMode("");
      refetch();
    },
    onError: (error: any) => {
      toast.error(`cannot create new merchant  !\n${error.message}`);
    },
  });
  const updateMutation = useMutation(updateMerchant, {
    onSuccess: () => {
      toast.success("Successfully updated !");
      setOpenModal(false);
      setCurrentItem(undefined);
      setModalMode("");
      refetch();
    },
    onError: (error: any) => {
      toast.error(`cannot update  !\n${error.message}`);
    },
  });

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
  const handleProfileRedirect = (row: GridRowData) => {
    router.push(`/profile?mid=${row.id}`);
  };
  const handleModalAddSubmit = (payload: merchantType) => {
    createMutation.mutate(payload);
  };
  const handleModalEditSubmit = (payload: merchantType) => {
    updateMutation.mutate(payload);
  };

  const formatData = (e: GridRowData | null) => {
    if (e?.attributes) {
      return {
        ...e,
        currencyIsoCode: get(e.attributes, "currencyIsoCode[0]", ""),
        countryIsoCode: get(e.attributes, "countryIsoCode[0]", ""),
        phoneNumber: get(e.attributes, "phoneNumber[0]", ""),
        address: get(e.attributes, "address[0]", ""),
      };
    }
    return e;
  };
  const handleOpenModal = ({
    row,
    mode,
  }: {
    row: GridRowData | null;
    mode: string;
  }) => {
    if (mode === "EDIT") {
      setModalMode("EDIT");
      const merchantData = formatData(row);
      setCurrentItem(merchantData as merchantType);
    }
    if (mode === "ADD") {
      setModalMode("ADD");
    }
    setOpenModal(true);
  };
  const ModalBody = () => {
    if (modalMode === "ADD") {
      return (
        <FormMerchant
          handleSubmit={handleModalAddSubmit}
          isLoading={createMutation.isLoading}
          currentItem={undefined}
        />
      );
    }
    if (modalMode === "EDIT") {
      return (
        <FormMerchant
          handleSubmit={handleModalEditSubmit}
          isLoading={updateMutation.isLoading}
          currentItem={currentItem}
        />
      );
    }
    return null;
  };

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
        field: "email",
        headerName: f("email"),
        type: "string",
        flex: 1,
        sortable: false,
      },
      {
        field: "name",
        headerName: f("Name"),
        type: "string",
        valueGetter: (params: GridValueGetterParams) =>
          `${params.row.firstName || ""} ${params.row.lastName || ""}`,
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
        width: 90,
      },
      {
        field: "actions",
        headerName: f("actions"),
        type: "actions",
        getActions: (params: GridRowParams) => [
          // eslint-disable-next-line react/jsx-key
          <GridActionsCellItem
            icon={<EditIcon />}
            onClick={() =>
              handleOpenModal({
                row: params.row,
                mode: "EDIT",
              })
            }
            label={f("edit")}
            showInMenu
          />,
          // eslint-disable-next-line react/jsx-key
          <GridActionsCellItem
            icon={<VisibilityIcon />}
            onClick={() => handleProfileRedirect(params.row)}
            label={f("viewMerchant")}
          />,
        ],
        sortable: false,
        filterable: false,
        width: 160,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return (
    <>
      <Title>{f("displayMerchantTitle")}</Title>
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
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <IconButton
          onClick={() => handleOpenModal({ row: null, mode: "ADD" })}
          color="primary"
          component="span"
        >
          <AddCircleOutlineIcon fontSize="large" />
        </IconButton>
      </div>
    </>
  );
}

export default Merchants;
