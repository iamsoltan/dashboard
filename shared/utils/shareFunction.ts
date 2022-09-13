import md5 from "md5";
import { sha512 } from "js-sha512";

const formatWebsite = (website: string) =>
  website?.replace(/(^\w+:|^)\/\//, "").replace(/\/+$/, "");

const handleErrorThrow = (error: any) => {
  const errorData = error?.response?.data;
  const errorsList = errorData.errors;
  if (errorsList) {
    let errorListToString = "";

    Object.entries(errorsList).forEach(([key, value]) => {
      errorListToString += `${key}: ${value}\n`;
    });
    throw new Error(errorListToString);
  }

  throw new Error(errorData.message);
};
// eslint-disable-next-line import/prefer-default-export
export { formatWebsite, handleErrorThrow };

export const generateToken = (secretKey: string) => sha512(md5(`${secretKey}`));
