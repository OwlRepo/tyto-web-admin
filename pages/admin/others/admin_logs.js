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
  useToast,
  Button,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { NavigationBar, PageWrapper } from "../../../constant/components";
import AccountInformationTable from "../../../constant/components/containers/teacher/account_information";
import searchAccountInformation from "../../../constant/services/accounts/student/read_information";
import CreateAccountModal from "../../../constant/components/modals/accounts/student/create_account";
import getScheduleIDs from "../../../constant/services/schedules/get_schedule_ids";
import { NextSeo } from "next-seo";
import searchAdminLogs from "../../../constant/services/logs/get_admin_logs";
import LogsInformationTable from "../../../constant/components/containers/logs/logs_information";
export default function AdminLogs() {
  const toast = useToast();
  const [searchedEmail, setSearchedEmail] = useState("");
  const [searchedAccountInfo, setSearchedAccountInfo] = useState(undefined);
  const [scheduleIDS, setScheduleIDs] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const PageHeader = () => {
    return (
      <VStack alignItems={"flex-start"}>
        <Heading color="title">ADMIN LOGS</Heading>
        <Breadcrumb fontWeight="medium" fontSize="sm">
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">admin</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/accounts/admin_logs">
              others
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="/admin/accounts/admin_logs">
              admin_logs
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </VStack>
    );
  };

  const checkEmailInput = async () => {
    if (!searchedEmail) {
      toast({
        title: "Search Failed",
        description: "Empty input",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsSearching(false);
      return;
    }
    setSearchedAccountInfo(undefined);
    setIsSearching(true);
    const searchResult = await searchAdminLogs({
      email: searchedEmail,
    });

    if (searchResult.success) {
      console.log(searchResult.data);
      setSearchedAccountInfo([...searchResult.data]);
      setIsSearching(false);
    } else {
      toast({
        title: "Search Failed",
        description: searchResult.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsSearching(false);
    }
  };

  return (
    <PageWrapper>
      <NextSeo
        title="Admin | Account | Teacher"
        description="Admin dashboard for probex Teacher accounts"
      />
      <CreateAccountModal
        isOpen={isOpen}
        onClose={onClose}
        scheduleIDS={scheduleIDS}
      />
      <HStack>
        <NavigationBar />

        <Box minH={"100vh"} w={"84vw"} p={"2rem"}>
          <PageHeader />

          <VStack
            alignItems={"stretch"}
            spacing={isSearching ? "5" : "20"}
            mt={"2rem"}
          >
            <HStack w={"30%"}>
              <Input
                shadow={"inner"}
                bg={"white"}
                placeholder={"Account Email"}
                onChange={(event) => setSearchedEmail(event.target.value)}
              />
              <IconButton
                bg={"title"}
                colorScheme={"facebook"}
                icon={<SearchIcon color={"white"} />}
                onClick={checkEmailInput}
              />
            </HStack>

            {searchedAccountInfo === undefined ? (
              <Box>
                <Center>
                  <Heading my={"20vh"} color="title">
                    {isSearching
                      ? "Search account..."
                      : "Start searching for email to get started."}
                  </Heading>
                </Center>
              </Box>
            ) : (
              <VStack
                alignSelf={"center"}
                borderRadius={"xl"}
                shadow={"lg"}
                width={"100%"}
                backgroundColor={"white"}
                alignItems={"stretch"}
                padding={"20px"}
              >
                <LogsInformationTable data={searchedAccountInfo} />
              </VStack>
            )}
          </VStack>
        </Box>
      </HStack>
    </PageWrapper>
  );
}
