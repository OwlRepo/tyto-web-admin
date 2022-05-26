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
  VStack,
} from "@chakra-ui/react";
import { NavigationBar, PageWrapper } from "../../constant/components";
import { FaSignOutAlt } from "react-icons/fa";
import Router from "next/router";
import { NextSeo } from "next-seo";
import { useEffect } from "react";

export default function Dashboard() {
  useEffect(() => {
    const checkSession = localStorage.getItem("email");
    const checkAccess = localStorage.getItem("code");
    if (!checkSession && !checkAccess) {
      Router.push({ pathname: "/" });
    }
  }, []);

  return (
    <PageWrapper>
      <NextSeo
        title="Admin | Dasboard"
        description="Admin dashboard for probex"
      />
      <HStack>
        <NavigationBar />
      </HStack>
    </PageWrapper>
  );
}
