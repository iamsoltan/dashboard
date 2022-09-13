import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useIntl } from "react-intl";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Chart({ incomingData = [] }: { incomingData: any }) {
  const { formatMessage } = useIntl();
  const f = (id: string) => formatMessage({ id });
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: f("chartTitle"),
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: f("transactionsCount"),
        },
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const labels = ["", ...incomingData?.map((e: any) => e.date)];
  const data = {
    labels,
    datasets: [
      {
        label: f("transactions"),
        data: [0, ...incomingData?.map((e: any) => e.count)],
        borderColor: "#103848",
        backgroundColor: "#103848cf",
        fill: true,
      },
    ],
  };

  return <Line options={options} data={data} />;
}
