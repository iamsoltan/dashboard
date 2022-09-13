import { ReactElement } from "react";
import { NextPage } from "next";
import { EmotionCache } from "@emotion/react";
import { AppProps } from "next/app";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactElement;
  auth?: boolean;
  forAdmin?: boolean;
};

export interface InitialProps {
  cookies: unknown;
}

export interface MyAppProps extends AppProps {
  Component: NextPageWithLayout;
  emotionCache: EmotionCache;
  emotionCacheWithRtl: EmotionCache;
}
export type newLocalesType = {
  [key: string]: any;
};
