import Head from "next/head";
import Metrics from "../components/Metrics";
import Region from "../components/Region";
import Layout from "../components/Layout";

function HomePage() {
  return (
    <>
      <Head>
        <title>Walking Project</title>
      </Head>
      <Metrics />
      <Region />
    </>
  );
}

// Wrap this page with the Layout
HomePage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default HomePage;
