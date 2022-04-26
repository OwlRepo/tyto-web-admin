import { Box, Text } from "@chakra-ui/react";

const PagePageWrapper = (props) => {
  return (
    <Box minH={"100vh"} bg={"primary"} {...props}>
      {props.children}
    </Box>
  );
};

export default PagePageWrapper;
