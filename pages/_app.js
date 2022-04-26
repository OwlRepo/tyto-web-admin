import { ChakraProvider } from "@chakra-ui/react";
import THEME_DATA from "../constant/data/themes/theme_data";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={THEME_DATA}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
