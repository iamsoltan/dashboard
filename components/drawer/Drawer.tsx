import React from "react";
import { useRouter } from "next/router";
import { Divider, IconButton, Toolbar } from "@mui/material";
import { styled } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import { drawerWidth } from "shared/constants";
import MainListItems from "components/listItems";

import { MainDrawer } from "shared/models";

const StyledDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop: any) => prop !== "open",
})(({ theme, open }: { theme: any; open: boolean }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

function Drawer({ toggleDrawer, open }: MainDrawer) {
  const router = useRouter();
  const { mid } = router.query;

  if (mid) {
    return (
      <StyledDrawer variant="permanent" open={open} theme={undefined}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List>
          <MainListItems />
        </List>
      </StyledDrawer>
    );
  }
  return null;
}

export default Drawer;
