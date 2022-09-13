import React from "react";
import { DateRangePicker } from "react-date-range";
import { useIntl } from "react-intl";
import * as dateLocales from "date-fns/locale";
import { useRouter } from "next/router";

import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { datePickerType } from "shared/models";
import { Button } from "@mui/material";
import styles from "./DatePickerRange.module.scss";

export default function DatePickerRange({
  onChange,
  value,
  handlePickerClose,
}: datePickerType) {
  const { locale } = useRouter();
  const { formatMessage } = useIntl();
  const f = (id: string) => formatMessage({ id });
  const dateLocale = () => {
    switch (locale) {
      case "ar":
        return dateLocales.arTN;
      case "fr":
        return dateLocales.fr;
      case "ru":
        return dateLocales.ru;
      default:
        return dateLocales.enUS;
    }
  };

  const initDate = () => [
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ];

  return (
    <>
      <div className={styles.outerWrapper}>
        <DateRangePicker
          className={styles.wrapper}
          onChange={({ selection }) => onChange(selection)}
          moveRangeOnFirstSelection={false}
          months={1}
          ranges={(value && [value]) || initDate()}
          direction="horizontal"
          locale={dateLocale()}
          staticRanges={[]}
          inputRanges={[]}
        />
        <Button
          className={styles.closeBtn}
          variant="contained"
          onClick={handlePickerClose}
        >
          {f("close")}
        </Button>
      </div>
    </>
  );
}
