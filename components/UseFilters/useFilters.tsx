import React, { useState, ChangeEvent } from "react";

import { useQuery } from "react-query";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import {
  InputAdornment,
  OutlinedInput,
  FormControl,
  MenuItem,
  InputLabel,
  Button,
  Menu,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { format, addDays, subMilliseconds } from "date-fns";
import arTnLocale from "date-fns/locale/ar-TN";
import { Range } from "react-date-range";

import DatePickerRange from "components/datePickerRange";
import { getTransactionsStatus } from "services/transactions";
import { getAllMethods, getWebsites } from "services/websites";
import { localeStatusList } from "shared/constants";
import { dateFiltersType, objectOfBooleanType } from "shared/models";
import styles from "./useFilters.module.scss";

const useFilters = (
  {
    filterByTransaction = true,
    filterByStatus = true,
    filterByPaymentMethods = true,
    filterByDate = true,
    filterByWebsiteId = true,
  }: objectOfBooleanType,
  onReset?: () => void
): [
  FiltersComponent: () => React.ReactChild,
  dateFilter: dateFiltersType,
  websiteId?: any,
  paymentMethodId?: string,
  statusId?: string,
  transactionId?: string
] => {
  const router = useRouter();
  const { formatMessage } = useIntl();
  const f = (id: string) => formatMessage({ id });

  const [dateFilter, setDateFilter] = useState<dateFiltersType>({});
  const [dateValue, setDateValue] = useState<Range | undefined>(undefined);
  const [websiteId, setWebsiteId] = useState<string | undefined>(undefined);
  const [paymentMethodId, setPaymentMethodId] = useState<string | undefined>(
    undefined
  );
  const [statusId, setStatusId] = useState<string | undefined>(undefined);

  const [transactionId, setTransactionId] = useState<string | undefined>(
    undefined
  );
  const [localTransactionId, setLocalTransactionId] = useState<
    string | undefined
  >("");
  const all = "all";
  const { data: methods } = useQuery(
    "methods",
    () => getAllMethods({ locale: router.locale }),
    {
      enabled: filterByPaymentMethods,
    }
  );
  const { data: websitesData } = useQuery(
    "websites",
    () => getWebsites({ merchantId: router.query.mid }),
    {
      enabled: !!router.query.mid,
    }
  );

  const { data: statusList } = useQuery(
    "status",
    () => getTransactionsStatus(),
    {
      enabled: !!router.query.mid && filterByStatus,

      placeholderData: localeStatusList,
    }
  );
  const dateBtnMsg = () => {
    if (Object.keys(dateFilter).length !== 0 && dateValue) {
      const { startDate, endDate } = dateValue;

      return `${format(new Date(startDate as Date), "P", {
        locale: arTnLocale,
      })} --> ${format(new Date(endDate as Date), "P", {
        locale: arTnLocale,
      })}`;
    }
    return f("filterByDate");
  };
  const resetFilters = () => {
    setDateValue(undefined);
    setDateFilter({});
    setWebsiteId(undefined);
    setPaymentMethodId(undefined);
    setStatusId(undefined);
    setTransactionId(undefined);
    setLocalTransactionId("");
    if (onReset) onReset();
  };

  const handleWebsiteChange = (event: SelectChangeEvent) => {
    const { value } = event.target;
    const state = value === all ? undefined : value;
    setWebsiteId(state);
  };
  const handlepaymentMethodIdChange = (event: SelectChangeEvent) => {
    const { value } = event.target;
    const state = value === all ? undefined : value;
    setPaymentMethodId(state);
  };
  const handlestatusIdChange = (event: SelectChangeEvent) => {
    const { value } = event.target;
    const state = value === all ? undefined : value;
    setStatusId(state);
  };
  const handleLocalTransactionIdChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setLocalTransactionId(event.target.value);
  };

  // handle modal of range picker
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const openPicker = Boolean(anchorEl);
  const handlePickerOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePickerClose = () => {
    setAnchorEl(null);
  };
  const onDateFilterChange = (range: Range) => {
    const { startDate, endDate } = range;

    if (startDate && endDate) {
      // set the endDate from start of the day to be the end of the day
      const newEndDate = subMilliseconds(addDays(endDate, 1), 1);
      setDateFilter({
        startDate,
        endDate: newEndDate,
      });

      setDateValue(range);
    }
  };

  const FiltersComponent = () => (
    <>
      <div className={styles.useFilters_filters}>
        {filterByTransaction && (
          <FormControl
            className={styles.useFilters_filters_selectFilter1}
            variant="outlined"
            sx={{ m: 1 }}
          >
            <InputLabel>{f("transactionId")}</InputLabel>
            <OutlinedInput
              label={f("transactionId")}
              value={localTransactionId}
              onChange={handleLocalTransactionIdChange}
              endAdornment={
                <InputAdornment position="end">
                  {localTransactionId && (
                    <button
                      type="button"
                      className={styles.useFilters_filters_clearBtn}
                    >
                      <ClearIcon
                        onClick={() => {
                          setTransactionId(undefined);
                          setLocalTransactionId("");
                        }}
                      />
                    </button>
                  )}
                  <button
                    type="button"
                    className={styles.useFilters_filters_searchButton}
                  >
                    <SearchIcon
                      onClick={() => {
                        setTransactionId(localTransactionId);
                      }}
                    />
                  </button>
                </InputAdornment>
              }
            />
          </FormControl>
        )}
        <FormControl
          className={styles.useFilters_filters_selectFilter1}
          variant="outlined"
          sx={{ m: 1, minWidth: 100 }}
        >
          <InputLabel id="select-website-label">
            {f("filterByWebsite")}
          </InputLabel>
          <Select
            labelId="select-website"
            id="select-website"
            value={websiteId || all}
            label={f("filterByWebsite")}
            onChange={handleWebsiteChange}
          >
            {filterByWebsiteId ? (
              <MenuItem key={all} value={all}>
                {f("all")}
              </MenuItem>
            ) : null}
            {websitesData?.content.map((w: any) => (
              <MenuItem key={w.id} value={filterByWebsiteId ? w.id : w}>
                {w.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {filterByPaymentMethods && (
          <FormControl
            className={styles.useFilters_filters_selectFilter2}
            variant="outlined"
            sx={{ m: 1 }}
          >
            <InputLabel id="select-methods-label">
              {f("filterByMethods")}
            </InputLabel>
            <Select
              labelId="select-methods"
              id="select-methods"
              value={paymentMethodId || all}
              label={f("filterByMethods")}
              onChange={handlepaymentMethodIdChange}
            >
              <MenuItem key={all} value={all}>
                {f("all")}
              </MenuItem>
              {methods?.map((w: any) => (
                <MenuItem key={w.id} value={w.id}>
                  {w.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {filterByStatus && (
          <FormControl
            className={styles.useFilters_filters_selectFilter1}
            variant="outlined"
            sx={{ m: 1 }}
          >
            <InputLabel id="select-status-label">
              {f("filterByStatus")}
            </InputLabel>
            <Select
              labelId="select-status"
              id="select-status"
              value={statusId || all}
              label={f("filterByStatus")}
              onChange={handlestatusIdChange}
            >
              <MenuItem key={all} value={all}>
                {f("all")}
              </MenuItem>
              {statusList?.map((w: any) => (
                <MenuItem key={w.id} value={w.id}>
                  {w.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {filterByDate && (
          <Button
            sx={{ fontSize: "0.7em" }}
            variant="outlined"
            id="basic-button"
            aria-controls="basic-menu"
            aria-haspopup="true"
            aria-expanded={openPicker ? "true" : undefined}
            onClick={handlePickerOpen}
          >
            {dateBtnMsg()}
          </Button>
        )}
        <Button
          variant="contained"
          onClick={() => {
            resetFilters();
          }}
        >
          {f("resetFilters")}
        </Button>
      </div>
      {openPicker && (
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={openPicker}
          onClose={handlePickerClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          elevation={0}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <DatePickerRange
            onChange={onDateFilterChange}
            value={dateValue}
            handlePickerClose={handlePickerClose}
          />
        </Menu>
      )}
    </>
  );
  return [
    FiltersComponent,
    dateFilter,
    websiteId,
    paymentMethodId,
    statusId,
    transactionId,
  ];
};

export default useFilters;
