import axios from "axios";
import { generateToken, handleErrorThrow } from "shared/utils/shareFunction";
import { NEXT_PUBLIC_WALLET_URL } from "config";

const walletsBaseURL = `${NEXT_PUBLIC_WALLET_URL}/api/v1/wallet`;

export const getWallets = async (payload: {
  publicKey: string;
  secretKey: string;
  perPage: number;
  page: number;
}) => {
  const { publicKey, secretKey, perPage, page } = payload;
  const token = generateToken(secretKey);

  const response = await axios
    .get(`${walletsBaseURL}`, {
      params: { perPage, page },
      headers: {
        "public-key": publicKey,
        token,
      },
    })
    .catch(() => {
      throw new Error("Wallets Error in getWallets");
    });
  return {
    content: response?.data.rows,
    rowsLength: response?.data.count,
  };
};
export default getWallets;

export const enableWallet = async (payload: {
  publicKey: string;
  secretKey: string;
  userId: string;
  actionOwner: string;
  enabled: boolean;
}) => {
  const { publicKey, secretKey, actionOwner, userId, enabled } = payload;
  const token = generateToken(secretKey);
  const response = await axios
    .put(
      `${walletsBaseURL}/enable`,
      {
        userId,
        actionOwner,
        enabled,
      },
      {
        headers: {
          "public-key": publicKey,
          token,
        },
      }
    )
    .catch((error) => {
      handleErrorThrow(error);
    });

  return response?.data;
};

export const increaseWallet = async (payload: {
  publicKey: string;
  secretKey: string;
  userId: string;
  actionOwner: string;
  comment: string;
  amount: number;
}) => {
  const { publicKey, secretKey, userId, actionOwner, comment, amount } =
    payload;
  const token = generateToken(secretKey);
  const response = await axios
    .post(
      `${walletsBaseURL}/increase`,
      {
        userId,
        actionOwner,
        comment,
        amount,
      },
      {
        headers: {
          "public-key": publicKey,
          token,
        },
      }
    )
    .catch((error) => {
      handleErrorThrow(error);
    });

  return response?.data;
};

export const decreaseWallet = async (payload: {
  publicKey: string;
  secretKey: string;
  userId: string;
  actionOwner: string;
  comment: string;

  amount: number;
}) => {
  const { publicKey, secretKey, userId, actionOwner, comment, amount } =
    payload;
  const token = generateToken(secretKey);
  const response = await axios
    .post(
      `${walletsBaseURL}/decrease`,
      {
        userId,
        actionOwner,
        comment,
        amount,
      },
      {
        headers: {
          "public-key": publicKey,
          token,
        },
      }
    )
    .catch((error) => {
      handleErrorThrow(error);
    });

  return response?.data;
};

export const getWalletTransactions = async (payload: {
  publicKey: string;
  secretKey: string;
  perPage: number;
  page: number;
  userId: string;
}) => {
  const { publicKey, secretKey, perPage, page, userId } = payload;

  const token = generateToken(secretKey);

  const response = await axios
    .get(`${walletsBaseURL}/${userId}/transactions`, {
      params: { perPage, page },

      headers: {
        "public-key": publicKey,
        token,
      },
    })
    .catch(() => {
      throw new Error("Wallets Error in getWalletTransactions");
    });
  return {
    content: response?.data.rows,
    rowsLength: response?.data.count,
  };
};

export const getWalletHistory = async (payload: {
  publicKey: string;
  secretKey: string;
  perPage: number;
  page: number;
  userId: string;
}) => {
  const { publicKey, secretKey, perPage, page, userId } = payload;

  const token = generateToken(secretKey);

  const response = await axios
    .get(`${walletsBaseURL}/${userId}/history`, {
      params: { perPage, page },

      headers: {
        "public-key": publicKey,
        token,
      },
    })
    .catch(() => {
      throw new Error("Wallets Error in getWalletHistory");
    });
  return {
    content: response?.data.rows,
    rowsLength: response?.data.count,
  };
};
