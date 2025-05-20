import Head from "next/head";
import Metrics from "../components/Metrics";
import Divisions from "../components/Divisions";
import Layout from "../components/Layout";

function HomePage() {
  return (
    <>
      <Head>
        <title>Ward Dashboard</title>
      </Head>
      <Metrics />
      <Divisions />
    </>
  );
}

// Wrap this page with the Layout
HomePage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default HomePage;
