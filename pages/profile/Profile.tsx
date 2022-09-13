import React from "react";
import FormProfile from "components/formProfile";
import { useMutation, useQuery } from "react-query";
import toast from "react-hot-toast";
import router from "next/router";
import { useIntl } from "react-intl";
import { get } from "lodash";

import Title from "components/title";
import { updateMerchant, getMerchantById } from "services/merchants";
import { merchantType } from "shared/models";

function Profile() {
  const { formatMessage } = useIntl();
  const f = (id: string) => formatMessage({ id });
  const { data, refetch } = useQuery(["profile", router.query.mid], () =>
    getMerchantById(router.query.mid as string)
  );

  const updateMutation = useMutation(updateMerchant, {
    onSuccess: () => {
      toast.success("Successfully updated !");
      refetch();
    },
    onError: (error: any) => {
      toast.error(`cannot update  !\n${error.message}`);
    },
  });
  const handleSubmit = (merchant: merchantType) => {
    updateMutation.mutate(merchant);
  };

  const formatData = (e: merchantType) => {
    if (e?.attributes) {
      return {
        ...e,
        currencyIsoCode: get(e.attributes, "currencyIsoCode[0]", ""),
        countryIsoCode: get(e.attributes, "countryIsoCode[0]", ""),
        countryName: get(e.attributes, "countryName[0]", ""),
        phoneNumber: get(e.attributes, "phoneNumber[0]", ""),
        address: get(e.attributes, "address[0]", ""),
      };
    }
    return e;
  };
  return (
    <>
      <Title>{f("profile")}</Title>
      <FormProfile
        handleSubmit={(merchant) => {
          handleSubmit(merchant as merchantType);
        }}
        isLoading={updateMutation.isLoading}
        currentItem={formatData(data)}
      />
    </>
  );
}

export default Profile;
