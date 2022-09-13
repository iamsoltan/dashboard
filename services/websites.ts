import { handleErrorThrow } from "shared/utils/shareFunction";
import api from "./api";

const websitesBaseURL = (mid: string, websiteId?: string) =>
  `/merchants/${mid}/websites${websiteId ? `/${websiteId}` : ""}`;
const methodsBaseURL = "/payment-methods";

// TODO to update : any type upon completion of website attributes for incoming and outgoing data
export const getWebsites = async (params: any) => {
  const response = await api
    .get(websitesBaseURL(params.merchantId), { params })
    .catch(() => {
      throw new Error("Websites Error in getWebsites");
    });

  return {
    content: response?.data.rows,
    rowsLength: response?.data.count,
  };
};
export default getWebsites;

// TODO to update : any type upon completion of website attributes for incoming and outgoing data
export const createWebsite = async (payload: any, merchantId: any) => {
  const response = await api
    .post(websitesBaseURL(merchantId, payload.id), payload)
    .catch((error) => {
      handleErrorThrow(error);
    });

  return response?.data;
};
// TODO to update : any type upon completion of website attributes for incoming and outgoing data
export const updateWebsite = async (payload: any) => {
  const response = await api
    .put(websitesBaseURL(payload.merchantId, payload.id), payload)
    .catch((error) => {
      handleErrorThrow(error);
    });

  return response?.data;
};

// payment methods

export const getMethods = async (params: {
  locale: string | undefined;
  merchantId: string | string[] | undefined;
}) => {
  const { merchantId, locale } = params;
  const response = await api
    .get(`${methodsBaseURL}/${merchantId}`, {
      params: {
        locale,
      },
    })
    .catch(() => {
      throw new Error("Methods Error in getMethods");
    });

  return response?.data;
};

export const getAllMethods = async (params: { locale: string | undefined }) => {
  const { locale } = params;
  const response = await api
    .get(`${methodsBaseURL}`, {
      params: {
        locale,
      },
    })
    .catch(() => {
      throw new Error("Methods Error in getAllMethods");
    });

  return response?.data;
};
