import "../styles/main.css";

function MyApp({ Component, pageProps }) {
  // Optionally allow pages to disable layout
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(<Component {...pageProps} />);
}

export default MyApp;
