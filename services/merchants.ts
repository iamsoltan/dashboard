/* eslint-disable no-restricted-syntax */
import { merchantType } from "shared/models";
import { handleErrorThrow } from "shared/utils/shareFunction";
import api from "./api";

const merchantsBaseURL = "/merchants";
const currenciesBaseURL = "/currencies";
const countriesBaseURL = "/countries";

export const getMerchants = async (params: any) => {
  const response = await api
    .get(`${merchantsBaseURL}`, { params })
    .catch(() => {
      throw new Error("Merchant Error in getMerchants");
    });

  return {
    content: response?.data.rows,
    rowsLength: response?.data.count,
  };
};
export default getMerchants;

export const getMerchantById = async (id: string | undefined) => {
  const response = await api.get(`${merchantsBaseURL}/${id}`).catch(() => {
    throw new Error("Merchant By Id Error in getMerchantById");
  });

  return response?.data;
};
export const createMerchant = async (payload: merchantType) => {
  const response = await api
    .post(`${merchantsBaseURL}`, payload)
    .catch((error) => {
      handleErrorThrow(error);
    });

  return response?.data;
};
export const updateMerchant = async (payload: merchantType) => {
  const response = await api
    .put(`${merchantsBaseURL}/${payload.id}`, payload)
    .catch((error) => {
      handleErrorThrow(error);
    });

  return response?.data;
};

// currencies

export const getCurrencies = async (params: { locale: string | undefined }) => {
  const response = await api
    .get(`${currenciesBaseURL}`, { params })
    .catch(() => {
      throw new Error("Currencies Error in getCurrencies");
    });

  return response?.data;
};
// countries

export const getCountries = async (params: { locale: string | undefined }) => {
  const response = await api
    .get(`${countriesBaseURL}`, { params })
    .catch(() => {
      throw new Error("Countries Error in getCountries");
    });

  return response?.data;
};
