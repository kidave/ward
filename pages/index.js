import Head from "next/head";
import Metrics from "../components/Metrics";
import Region from "../components/Region";
import Layout from "../components/Layout";
import About from "../components/About";
import { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import styles from "../styles/layout/about.module.css";

function HomePage() {
  const [showAbout, setShowAbout] = useState(true);

  return (
    <>
      <Head>
        <title>Walking Project</title>
      </Head>
      <About show={showAbout} onClose={() => setShowAbout(false)} />
      {!showAbout && (
        <button
          className={styles.showAboutBtn}
          onClick={() => setShowAbout(true)}
          aria-label="Show About"
        >
          <FaInfoCircle size={22} />
        </button>
      )}
      <Region />
      <Metrics />
    </>
  );
}

// Wrap this page with the Layout
HomePage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default HomePage;
