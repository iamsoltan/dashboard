import React from "react";
import { GetServerSideProps } from "next";
import Merchants from "./Merchants";

function Index() {
  return <Merchants />;
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (ctx.query.mid) {
    return {
      redirect: {
        destination: "/merchants",
        permanent: false,
      },
    };
  }
  return { props: {} };
};
Index.forAdmin = true;
export default Index;
