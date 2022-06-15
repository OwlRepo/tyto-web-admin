import {
  Box,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  HStack,
  Spacer,
  Icon,
} from "@chakra-ui/react";
import { FaSignOutAlt } from "react-icons/fa";
import Router from "next/router";
import Link from "next/link";

export default function NavigationBar() {
  return (
    <Box minH={"100vh"} minWidth={"200px"} w={"15vw"} bg="white" shadow={"lg"}>
      {NavHeader()}
      {NavButtons()}
    </Box>
  );

  function NavButtons() {
    return (
      <Box padding={"1rem"}>
        <Accordion allowToggle>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Accounts
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel>
              <Link href={"/admin/accounts/students"} passHref>
                <Box
                  cursor={"pointer"}
                  textAlign="left"
                  pl={"1.5rem"}
                  pb={"1rem"}
                >
                  Students
                </Box>
              </Link>
              <Link href={"/admin/accounts/teachers"} passHref>
                <Box cursor={"pointer"} textAlign="left" pl={"1.5rem"}>
                  Teachers
                </Box>
              </Link>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Others
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel>
              <Link href={"/admin/others/schedules"} passHref>
                <Box
                  cursor={"pointer"}
                  textAlign="left"
                  pl={"1.5rem"}
                  pb={"1rem"}
                >
                  Schedules
                </Box>
              </Link>
              <Link href={"/admin/others/schedule_list"} passHref>
                <Box
                  cursor={"pointer"}
                  textAlign="left"
                  pl={"1.5rem"}
                  pb={"1rem"}
                >
                  Schedules List
                </Box>
              </Link>
              <Link href={"/admin/others/admin_logs"} passHref>
                <Box cursor={"pointer"} textAlign="left" pl={"1.5rem"}>
                  Logs
                </Box>
              </Link>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <Box
          cursor={"pointer"}
          textAlign="left"
          py={"1rem"}
          px={"1rem"}
          mt={"2rem"}
          bg={"title"}
          borderRadius={"md"}
          onClick={() => {
            localStorage.clear(), Router.push({ pathname: "/sign-in" });
          }}
        >
          <HStack alignItems={"center"}>
            <Text fontWeight={"bold"} color={"white"}>
              Logout
            </Text>
            <Spacer />
            <Icon as={FaSignOutAlt} color={"white"} h={5} w={5} />
          </HStack>
        </Box>
      </Box>
    );
  }

  function NavHeader() {
    return (
      <Box padding={"1rem"}>
        <Text fontSize={"2xl"} fontWeight={"bold"} color={"title"}>
          TYTO
        </Text>
        <Text fontSize={"md"} color={"subtitle"}>
          ADMIN PANEL
        </Text>
      </Box>
    );
  }
}
