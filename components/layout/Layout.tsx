import React from "react";
import Dashboard from "components/dashboard";
import { childrenProps } from "shared/models";

const Layout = ({ children }: childrenProps) => (
  <>
    <Dashboard>{children}</Dashboard>
  </>
);
export default Layout;
