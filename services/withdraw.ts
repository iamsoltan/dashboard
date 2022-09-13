import { handleErrorThrow } from "shared/utils/shareFunction";
import api from "./api";

const withdrawRequestBaseURL = "/transactions/sobflous/withdrawl";

export default async function requestWithdraw({ amount }: { amount: number }) {
  const response = await api
    .post(`${withdrawRequestBaseURL}`, { amount })
    .catch((error) => {
      handleErrorThrow(error);
    });

  return response?.data;
}
