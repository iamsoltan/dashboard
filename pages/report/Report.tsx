import React from "react";
import { useRouter } from "next/router";
import Chart from "components/Chart";
import useFilters from "components/UseFilters";
import Indicators from "components/indicators";
import { useQuery } from "react-query";
import { getReport } from "services/transactions";
import Title from "components/title";
import { useIntl } from "react-intl";

function Report() {
  const router = useRouter();
  const { mid } = router.query;

  const { formatMessage } = useIntl();
  const f = (id: string) => formatMessage({ id });

  const [FiltersComponent, dateFilter, websiteId, paymentMethodId, statusId] =
    useFilters({
      filterByTransaction: false,
      filterByStatus: false,
      filterByPaymentMethods: true,
      filterByDate: true,
    });

  const startDate = dateFilter ? dateFilter.startDate : undefined;
  const endDate = dateFilter ? dateFilter.endDate : undefined;

  const { data } = useQuery(
    ["report", startDate, endDate, mid, websiteId, paymentMethodId, statusId],
    () =>
      getReport({
        startDate,
        endDate,
        websiteId,
        paymentMethodId,
        statusId: "8", // confirmed
        merchantId: mid,
      }),
    {
      keepPreviousData: true,
    }
  );
  return (
    <>
      <Title>{f("report")}</Title>
      {FiltersComponent()}
      <Indicators {...data} />
      <Chart incomingData={data?.transactions?.rows} />
    </>
  );
}
export default Report;
