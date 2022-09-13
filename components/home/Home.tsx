import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { GlobalStyles } from "@mui/material";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import Copyright from "../../theme/Copyright";

export default function Home() {
  const router = useRouter();
  const { formatMessage } = useIntl();
  const f = (id: string) => formatMessage({ id });
  const login = () => {
    router.push("/dashboard");
  };
  const BringMeHome = () => {
    router.push("/");
  };
  const footers = [
    {
      title: "Company",
      description: ["Team", "History", "Contact us", "Locations"],
    },
    {
      title: "Features",
      description: [
        "Cool stuff",
        "Random feature",
        "Team feature",
        "Developer stuff",
        "Another one",
      ],
    },
    {
      title: "Resources",
      description: [
        "Resource",
        "Resource name",
        "Another resource",
        "Final resource",
      ],
    },
    {
      title: "Legal",
      description: ["Privacy policy", "Terms of use"],
    },
  ];
  const footerWithMenuMode = false;
  const Footer = () =>
    footerWithMenuMode ? (
      <Container
        maxWidth="md"
        component="footer"
        sx={{
          borderTop: () => `1px solid black`,
          mt: 8,
          py: [3, 6],
        }}
      >
        <Grid container spacing={4} justifyContent="space-evenly">
          {footers.map((footer) => (
            <Grid item xs={6} sm={3} key={footer.title}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                {footer.title}
              </Typography>
              <ul>
                {footer.description.map((item) => (
                  <li key={item}>
                    <Link href="#" variant="subtitle1" color="text.secondary">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </Grid>
          ))}
        </Grid>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    ) : (
      <Container
        maxWidth="md"
        component="footer"
        sx={{
          mt: 25,
          py: [3, 6],
        }}
      >
        <Copyright sx={{ mt: 5 }} />
      </Container>
    );

  return (
    <>
      <GlobalStyles
        styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
      />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Button color="inherit" onClick={BringMeHome}>
              {f("homeTitle")}
            </Button>
          </Typography>
          <Button color="inherit" onClick={login}>
            {f("goToDashboard")}
          </Button>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: footerWithMenuMode ? 8 : 20,
            pb: 6,
          }}
        >
          <Container maxWidth="lg">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              {f("hero1")}
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              paragraph
            >
              {f("hero2")}
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              {/* <Button variant="contained">{f("SignUp")}</Button> */}
              <Button variant="outlined" color="primary" onClick={login}>
                {f("goToDashboard")}
              </Button>
            </Stack>
          </Container>
        </Box>
        {/* End hero unit */}
      </main>
      {/* Footer */}
      <Footer />
      {/* End footer */}
    </>
  );
}
