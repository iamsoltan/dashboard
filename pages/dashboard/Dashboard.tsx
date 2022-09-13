import React, { ReactElement } from "react";
import Loader from "components/loader";

import { useKeycloak } from "@react-keycloak/ssr";

import type { KeycloakInstance } from "keycloak-js";
import { useRouter } from "next/router";
import { adminRole } from "shared/constants";

function Dashboard() {
  const { keycloak } = useKeycloak<KeycloakInstance>();
  const router = useRouter();

  if (keycloak?.hasRealmRole(adminRole)) {
    router.push("/merchants");
  } else if (router.query.mid !== undefined) {
    router.push(`/websites/?mid=${router.query.mid}`);
  }

  return <Loader />;
}
Dashboard.getLayout = (page: ReactElement) => page;
export default Dashboard;
