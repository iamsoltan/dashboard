import React, { ReactElement, useEffect } from "react";
import { useKeycloak } from "@react-keycloak/ssr";

import type { KeycloakInstance } from "keycloak-js";
import Cookies from "js-cookie";

import Loader from "components/loader";
import { useRouter } from "next/router";
import { adminRole } from "shared/constants";

const Auth = ({
  children,
  forAdmin,
}: {
  children: ReactElement;
  forAdmin: boolean | undefined;
}) => {
  const router = useRouter();
  const { keycloak } = useKeycloak<KeycloakInstance>();
  // console.log("token parsed", keycloak?.tokenParsed);
  // console.log("token : ", keycloak?.token);
  const isAuth = keycloak?.authenticated === true;
  const isAdmin = isAuth && keycloak?.hasRealmRole(adminRole);
  const isMerchant = isAuth && keycloak?.hasRealmRole(adminRole) === false;

  useEffect(() => {
    Cookies.set("jwt", keycloak?.token as string);
    if (isMerchant) {
      if (forAdmin === true) {
        router.push("/dashboard");
      } else {
        router.push(
          `${router.pathname}/?mid=${keycloak?.tokenParsed?.sub}`,
          undefined,
          { shallow: true }
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keycloak?.authenticated, keycloak?.token]);

  if (isAdmin || (isMerchant && forAdmin !== true)) {
    return children;
  }

  return <Loader />;
};
export default Auth;
