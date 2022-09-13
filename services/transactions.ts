import { handleErrorThrow } from "shared/utils/shareFunction";

import api from "./api";

const transactionsBaseURL = "/transactions";
const transactionsStatusBaseURL = `${transactionsBaseURL}/status`;
const getReportURL = `${transactionsBaseURL}/report`;

export const getTransactions = async (params: any) => {
  const response = await api
    .get(`${transactionsBaseURL}`, { params })
    .catch(() => {
      throw new Error("transactions Error in getTransactions");
    });

  return {
    content: response?.data.rows,
    rowsLength: response?.data.count,
  };
};
export const getTransactionsStatus = async () => {
  const response = await api.get(`${transactionsStatusBaseURL}`).catch(() => {
    throw new Error("there is problem in getTransactionsStatus");
  });
  return response?.data.rows;
};
export const getReport = async (params: any) => {
  const response = await api.get(`${getReportURL}`, { params }).catch(() => {
    throw new Error("there is problem in getReport");
  });
  return response?.data;
};

export const completeBankTransfer = async (payload: {
  transactionId: string;
}) => {
  const { transactionId } = payload;
  const response = await api
    .post(`${transactionsBaseURL}/${transactionId}/bank-transfer/complete`, {
      approved: true,
    })
    .catch((error) => {
      handleErrorThrow(error);
    });

  return response?.data;
};

export default getTransactions;
