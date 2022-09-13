import React from "react";
import Card from "components/card";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Title from "components/title";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";

import { withdrawMethodType } from "shared/models";
import styles from "./Withdraw.module.scss";

function Withdraw() {
  const router = useRouter();

  const { formatMessage } = useIntl();
  const f = (id: string) => formatMessage({ id });

  const withdrawMethods: withdrawMethodType[] = [
    {
      id: "1",
      name: "sobflous",
      label: "Sobflous",
      logo: "https://www.sobflous.tn/images/ergonomie/logo-sobflous.png",
    },
  ];
  return (
    <>
      <div className={styles.header} onClick={() => router.push("/merchants")}>
        <IconButton aria-label="back" color="primary">
          <ArrowBackIcon />
        </IconButton>
        <Title hr={false}>{f("goBack")}</Title>
      </div>
      <div>
        {withdrawMethods.map((method: withdrawMethodType) => (
          <Card key={method.id} method={method} />
        ))}
      </div>
    </>
  );
}

export default Withdraw;
