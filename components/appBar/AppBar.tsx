import React, { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Button, IconButton, Toolbar } from "@mui/material";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import IosShareIcon from "@mui/icons-material/IosShare";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import { useKeycloak } from "@react-keycloak/ssr";
import { KeycloakInstance } from "keycloak-js";
import { useIntl } from "react-intl";
import { useQuery } from "react-query";

import { adminRole, drawerWidth } from "shared/constants";
import { AppBarProps, MainAppBarProps } from "shared/models";
import { getMerchantById } from "services/merchants";

function OnMidDrawerWidth() {
  const router = useRouter();
  const { mid } = router.query;
  return mid ? drawerWidth : 0;
}
const StylesAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop: any) => prop !== "open",
})<AppBarProps>(({ theme, open }: { theme: any; open: boolean }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: OnMidDrawerWidth(),
    width: `calc(100% - ${OnMidDrawerWidth()}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

function AppBar({ toggleDrawer, open }: MainAppBarProps) {
  const router = useRouter();
  const {
    query: { mid },
    basePath,
  } = router;

  const { formatMessage } = useIntl();
  const f = (id: string) => formatMessage({ id });
  const logoutUrl = window.location.origin + basePath;
  const { keycloak } = useKeycloak<KeycloakInstance>();
  const isAuth = keycloak?.authenticated === true;
  const isAdmin = isAuth && keycloak?.hasRealmRole(adminRole);
  const isMerchant = isAuth && keycloak?.hasRealmRole(adminRole) === false;
  const keycloakSignOut = () => {
    if (keycloak) {
      window.location.href = keycloak.createLogoutUrl({
        redirectUri: logoutUrl,
      });
    }
  };
  const [enabled, setEnabled] = useState(false);
  const { data: profile } = useQuery(
    ["profile", mid],
    () => getMerchantById(mid as string),
    { enabled, keepPreviousData: true, refetchOnWindowFocus: false }
  );
  const getMerchantEmail = useMemo(() => {
    if (isAdmin && mid) {
      setEnabled(true);
      return profile?.email;
    }
    if (isMerchant) {
      setEnabled(false);
      if (keycloak?.userInfo) {
        const info = keycloak?.userInfo as any;
        return info.email;
      }
    }
    setEnabled(false);
    return "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mid, profile]);
  return (
    <StylesAppBar position="absolute" open={open}>
      <Toolbar
        sx={{
          pr: "24px", // keep right padding when drawer closed
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          sx={{
            marginRight: "36px",
            ...(open && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          {f("dashboard")}
          {getMerchantEmail !== "" ? ` / ${getMerchantEmail}` : ""}
        </Typography>
        {isAdmin && (
          <Button
            onClick={() => router.push("/withdraw")}
            variant="outlined"
            style={{ color: "white", marginRight: "25px" }}
            startIcon={<IosShareIcon />}
          >
            {f("withdraw")}
          </Button>
        )}
        <IconButton onClick={keycloakSignOut} color="inherit">
          <PowerSettingsNewIcon />
        </IconButton>
      </Toolbar>
    </StylesAppBar>
  );
}

export default AppBar;
