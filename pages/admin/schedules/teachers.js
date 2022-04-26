import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Heading,
  HStack,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  VStack,
  Input,
  IconButton,
  Center,
} from "@chakra-ui/react";
import { NextSeo } from "next-seo";
import { NavigationBar, PageWrapper } from "../../../constant/components";

export default function Teachers() {
  return (
    <PageWrapper>
      <NextSeo 
      title="Admin | Schedule | Teacher"
      description="Admin dashboard for probex Teacher accounts"
      />
      <HStack>
        <NavigationBar />

        <Box minH={"100vh"} w={"84vw"} p={"2rem"}>
          <VStack alignItems={"flex-start"}>
            <Heading color="title">TEACHER SCHEDULES</Heading>
            <Breadcrumb fontWeight="medium" fontSize="sm">
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin">admin</BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/schedules/professors">
                  schedules
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href="/admin/schedules/professors">
                  teachers
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </VStack>

          <VStack alignItems={"stretch"} mt={"2rem"}>
            <HStack w={"30%"}>
              <Input shadow={"inner"} bg={"white"} placeholder={"Account Email"} />
              <IconButton
                bg={"title"}
                colorScheme={"facebook"}
                icon={<SearchIcon color={"white"} />}
              />
            </HStack>

            <Box>
              <Center>
                <Heading my={"20vh"} color="title">
                  Start searching for email to get started.
                </Heading>
              </Center>
            </Box>
          </VStack>
        </Box>
      </HStack>
    </PageWrapper>
  );
}
