import React from "react";
import { useKeycloak } from "@react-keycloak/ssr";
import type { KeycloakInstance } from "keycloak-js";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PersonIcon from "@mui/icons-material/Person";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { useTheme } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/Home";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { CustomListItemProps } from "shared/models";
import { adminRole } from "shared/constants";

export default function ListItems() {
  const { keycloak } = useKeycloak<KeycloakInstance>();
  const router = useRouter();
  const { mid } = router.query;

  const { formatMessage } = useIntl();
  const f = (id: string) => formatMessage({ id });
  const theme = useTheme();
  const isActive = (path: string) => {
    if (router.pathname === `/${path}`) {
      return theme.palette.primary.main;
    }
    return "";
  };
  const CustomListItem = ({ children, path }: CustomListItemProps) => {
    const fullPath =
      path === "merchants" ? `/merchants` : `/${path}?mid=${mid}`;
    return (
      <ListItem
        button
        onClick={() => router.push(fullPath)}
        style={{ color: isActive(path) }}
      >
        <ListItemIcon style={{ color: isActive(path) }}>
          {children}
        </ListItemIcon>
        <ListItemText primary={f(path)} />
      </ListItem>
    );
  };
  return (
    <div>
      {keycloak?.hasRealmRole(adminRole) ? (
        <CustomListItem path="merchants">
          <HomeIcon />
        </CustomListItem>
      ) : null}
      <CustomListItem path="profile">
        <PersonIcon />
      </CustomListItem>
      <CustomListItem path="websites">
        <DashboardIcon />
      </CustomListItem>
      <CustomListItem path="wallets">
        <AccountBalanceWalletIcon />
      </CustomListItem>
      <CustomListItem path="transactions">
        <AccountBalanceIcon />
      </CustomListItem>
      <CustomListItem path="report">
        <ShowChartIcon />
      </CustomListItem>
    </div>
  );
}
