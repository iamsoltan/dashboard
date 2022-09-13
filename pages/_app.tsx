import React from "react";
import type { AppContext, AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { AppContextType } from "next/dist/next-server/lib/utils";
import { SSRKeycloakProvider, SSRCookies } from "@react-keycloak/ssr";
import type { KeycloakConfig } from "keycloak-js";
import cookie from "cookie";
import { CacheProvider } from "@emotion/react";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import type { IncomingMessage } from "http";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { IntlProvider } from "react-intl";
import { Toaster } from "react-hot-toast";

import Layout from "components/layout";
import Auth from "components/auth";
import {
  NEXT_PUBLIC_KEYCLOAK_URL,
  NEXT_PUBLIC_KEYCLOAK_REALM,
  NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
} from "config";
import * as locales from "shared/content";
import { InitialProps, MyAppProps, newLocalesType } from "shared/models";

import theme from "theme/theme";
import {
  createEmotionCache,
  createEmotionCacheWithRtl,
} from "theme/createEmotionCache";

import "shared/styles/globals.scss";

const queryClient = new QueryClient();

const mykeycloakconfig: KeycloakConfig = {
  url: NEXT_PUBLIC_KEYCLOAK_URL,
  realm: NEXT_PUBLIC_KEYCLOAK_REALM as string,
  clientId: NEXT_PUBLIC_KEYCLOAK_CLIENT_ID as string,
};

const clientSideEmotionCache = createEmotionCache();
const clientSideEmotionCacheWithRtl = createEmotionCacheWithRtl();

function MyApp({
  Component,
  pageProps,
  cookies,
  emotionCache = clientSideEmotionCache,
  emotionCacheWithRtl = clientSideEmotionCacheWithRtl,
}: AppProps & InitialProps & MyAppProps) {
  const router = useRouter();
  const { locale, defaultLocale, pathname } = router;
  const localeCopy = (locales as newLocalesType)[locale as string];
  const { common } = localeCopy;
  const messages = localeCopy[pathname];
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);
  return (
    <>
      <IntlProvider
        locale={locale as string}
        defaultLocale={defaultLocale}
        messages={{ ...messages, ...common }}
      >
        <CacheProvider
          value={locale === "ar" ? emotionCacheWithRtl : emotionCache}
        >
          <Head>
            <title>Groupado Payment</title>
            <meta
              name="viewport"
              content="initial-scale=1, width=device-width"
            />
          </Head>
          <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
              {Component.auth ? (
                <>
                  <Component {...pageProps} />
                </>
              ) : (
                <SSRKeycloakProvider
                  keycloakConfig={mykeycloakconfig}
                  persistor={SSRCookies(cookies)}
                  initOptions={{
                    onLoad: "login-required",
                  }}
                >
                  <Auth forAdmin={Component.forAdmin}>
                    {getLayout(<Component {...pageProps} />)}
                  </Auth>
                </SSRKeycloakProvider>
              )}
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
            <Toaster />
            <CssBaseline />
          </ThemeProvider>
        </CacheProvider>
      </IntlProvider>
    </>
  );
}

async function getPageProps({ Component, ctx }: AppContextType) {
  return Component.getInitialProps ? Component.getInitialProps(ctx) : {};
}

function parseCookies(req?: IncomingMessage) {
  if (!req || !req.headers) {
    return {};
  }
  return cookie.parse(req.headers.cookie || "");
}

MyApp.getInitialProps = async (context: AppContext) => {
  // Extract cookies from AppContext
  const cookies = parseCookies(context?.ctx?.req);
  return {
    pageProps: {
      ...getPageProps(context),
      cookies,
      isAuthenticated: cookies.isAuthenticated,
    },
  };
};
export default MyApp;
