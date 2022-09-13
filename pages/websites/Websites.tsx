import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  GridActionsCellItem,
  GridColDef,
  GridFilterModel,
  GridRenderCellParams,
  GridRowData,
  GridRowParams,
  GridSortModel,
} from "@mui/x-data-grid";
import { useQuery, useMutation } from "react-query";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { IconButton, Tooltip } from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";
import DescriptionIcon from "@mui/icons-material/Description";
import toast from "react-hot-toast";
import { useIntl } from "react-intl";

import Table from "components/table";
import Title from "components/title";
import DisplayTable from "components/displayTable";

import { createWebsite, getWebsites, updateWebsite } from "services/websites";
import FormWebsite from "components/formWebsite";
import FormTheme from "components/formTheme";
import { dataTableElementType, websiteType } from "shared/models";
import { formatWebsite } from "shared/utils/shareFunction";

import styles from "./Websites.module.scss";

function Websites() {
  const router = useRouter();
  const { formatMessage } = useIntl();
  const f = (id: string) => formatMessage({ id });

  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [currentItem, setCurrentItem] = useState<websiteType | undefined>(
    undefined
  );

  /* eslint-enable */
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [paginationTotalRows, setPaginationTotalRows] = useState(0);
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState({});

  const { data, isLoading, refetch } = useQuery(
    ["websites", page, pageSize, filter, sort, router.query.mid],
    () =>
      getWebsites({
        merchantId: router.query.mid,
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

  const createMutation = useMutation(
    (payload: websiteType) => createWebsite(payload, router.query.mid),
    {
      onSuccess: () => {
        toast.success("Successfully created !");
        setOpenModal(false);
        setCurrentItem(undefined);
        setModalMode("");
        refetch();
      },
      onError: (error: any) => {
        toast.error(`cannot create new Website  !\n${error?.message}`);
      },
    }
  );
  const updateMutation = useMutation(updateWebsite, {
    onSuccess: () => {
      toast.success("Successfully updated !");
      setOpenModal(false);
      setCurrentItem(undefined);
      setModalMode("");
      refetch();
    },
    onError: (error: any) => {
      toast.error(`cannot update Website !\n${error?.message}`);
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
  const handleModalAddSubmit = (payload: websiteType) => {
    createMutation.mutate(payload);
  };
  const handleModalEditSubmit = (payload: websiteType) => {
    updateMutation.mutate(payload);
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
      setCurrentItem(row as websiteType);
    }
    if (mode === "ADD") {
      setModalMode("ADD");
    }
    if (mode === "SHOW") {
      setModalMode("SHOW");
      setCurrentItem(row as websiteType);
    }
    if (mode === "theme") {
      setModalMode("theme");
      setCurrentItem(row as websiteType);
    }
    setOpenModal(true);
  };
  const websiteSchema: dataTableElementType[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "url", label: "URL" },
    { key: "status", label: "Status" },
    { key: "commission", label: "Commission", symbol: "%" },
    { key: "createdAt", label: "Created At" },
    { key: "createdBy", label: "Created By" },
    { key: "updatedAt", label: "UpdatedAt At" },
    { key: "updatedBy", label: "Updated By" },
    { key: "successUrl", label: "SuccessUrl" },
    { key: "failUrl", label: "FailUrl" },
    { key: "notificationUrl", label: "NotificationUrl" },
    { key: "merchantId", label: "Merchant Id" },
    { key: "publicKey", label: "PublicKey" },
    { key: "secretKey", label: "SecretKey" },
  ];
  const websiteToDisplay = websiteSchema?.map((e) => {
    if (currentItem) {
      e.value = currentItem[e.key];
    }
    return e;
  });
  const ModalBody = () => {
    if (modalMode === "ADD") {
      return (
        <FormWebsite
          handleSubmit={handleModalAddSubmit}
          isLoading={createMutation.isLoading}
          currentItem={undefined}
        />
      );
    }
    if (modalMode === "EDIT") {
      return (
        <FormWebsite
          handleSubmit={handleModalEditSubmit}
          isLoading={updateMutation.isLoading}
          currentItem={currentItem}
        />
      );
    }
    if (modalMode === "SHOW") {
      return (
        <DisplayTable title="Complete Website Data" rows={websiteToDisplay} />
      );
    }
    if (modalMode === "theme") {
      return (
        <FormTheme
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
      { field: "id", headerName: f("id"), width: 100, sortable: false },
      {
        field: "name",
        headerName: f("name"),
        type: "string",
        flex: 1,
        sortable: false,
      },
      {
        field: "url",
        headerName: f("url"),
        renderCell: (params: GridRenderCellParams) => (
          <Tooltip title={params?.value as string}>
            <span className={styles.cellsTooltip}>
              {formatWebsite(params?.value as string)}
            </span>
          </Tooltip>
        ),
        type: "string",
        flex: 1,
        sortable: false,
      },
      {
        field: "commission",
        headerName: f("commission"),
        renderCell: (params: GridRenderCellParams) => (
          <Tooltip title={params?.value as string}>
            <span className={styles.cellsTooltip}>{params?.value} %</span>
          </Tooltip>
        ),
        type: "string",
        flex: 1,
        sortable: false,
      },
      {
        field: "status",
        headerName: f("status"),
        renderCell: (params: GridRenderCellParams) => (
          <span className={params.value === "active" ? "active" : "inactive"}>
            {params.value === "active" ? f("active") : f("inactive")}
          </span>
        ),
        type: "string",
        sortable: false,
        flex: 1,
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
            icon={<DescriptionIcon />}
            onClick={() =>
              handleOpenModal({
                row: params.row,
                mode: "SHOW",
              })
            }
            label={f("more")}
            showInMenu
          />,
          // eslint-disable-next-line react/jsx-key
          <GridActionsCellItem
            icon={<PaletteIcon />}
            onClick={() =>
              handleOpenModal({
                row: params.row,
                mode: "theme",
              })
            }
            label={f("editGatewayTheme")}
            showInMenu
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
      <Title>{f("websites")}</Title>
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

export default Websites;
