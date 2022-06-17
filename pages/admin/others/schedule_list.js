import {
  CheckIcon,
  ChevronDownIcon,
  CloseIcon,
  DeleteIcon,
  EditIcon,
  SearchIcon,
  AddIcon,
} from "@chakra-ui/icons";
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
  Stack,
  Image,
  Button,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  ButtonGroup,
  Tooltip,
} from "@chakra-ui/react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Switch,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { NavigationBar, PageWrapper } from "../../../constant/components";
import AccountInformationTable from "../../../constant/components/containers/teacher/account_information";
import searchAccountInformation from "../../../constant/services/accounts/teacher/read_information";
import CreateScheduleModal from "../../../constant/components/modals/accounts/schedule/create_schedule";
import getScheduleIDs from "../../../constant/services/schedules/get_schedule_ids";
import { NextSeo } from "next-seo";
import getEmails from "../../../constant/services/schedules/get_teacher_email";
import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  query,
  collection,
  onSnapshot,
  where,
} from "firebase/firestore";
import firestore_db from "../../../constant/configurations/firebase_init";

export default function ScheduleList() {
  const toast = useToast();
  const [searchedEmail, setSearchedEmail] = useState("");
  const [searchedAccountInfo, setSearchedAccountInfo] = useState(undefined);
  const [scheduleIDS, setScheduleIDs] = useState([]);
  const [scheduleID, setScheduleID] = useState(undefined);
  const [selectedScheduleID, setSelectedScheduleID] = useState();
  const [teacherEmails, setTeacherEmails] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    getSchedules();
  }, []);

  async function getSchedules() {
    setScheduleID(await getScheduleIDs());
  }

  function readData(id) {
    const schedulePath = doc(firestore_db, "schedules", id);
    const unsub = onSnapshot(schedulePath, (doc) => {
      const schedule = [];
      doc.data()?.subjects?.map((data) => {
        schedule.push(data);
      });

      setSchedules([...schedule]);
      //   schedules.map((data) => console.log(data.name, data.grade_level));
      console.log(schedules);
    });
  }

  const PageHeader = () => {
    return (
      <VStack alignItems={"flex-start"}>
        <Heading color="title">SCHEDULE LIST</Heading>
        <Breadcrumb fontWeight="medium" fontSize="sm">
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">admin</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/accounts/teachers">
              teacher
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink isCurrentPage href="/admin/others/schedules">
              schedule list
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </VStack>
    );
  };

  return (
    <PageWrapper>
      <NextSeo
        title="Admin | Account | Schedules"
        description="Admin dashboard for probex Scedules"
      />
      <CreateScheduleModal
        isOpen={isOpen}
        onClose={onClose}
        scheduleIDS={scheduleIDS}
        teacherEmails={teacherEmails}
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
            <HStack w={"50%"}>
              {scheduleID !== undefined ? (
                <Menu>
                  <MenuButton
                    w={"35%"}
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                  >
                    {selectedScheduleID
                      ? selectedScheduleID
                      : "Select Schedule ID"}
                  </MenuButton>
                  <MenuList>
                    {scheduleID.map((data, index) => {
                      return (
                        <MenuItem
                          key={index}
                          onClick={async () => {
                            readData(data.id);
                            setSelectedScheduleID(data.id);
                          }}
                        >
                          {data.id}
                        </MenuItem>
                      );
                    })}
                  </MenuList>
                </Menu>
              ) : (
                "data.schedule_id"
              )}
              <Button
                backgroundColor={"green.500"}
                colorScheme={"green"}
                paddingX={"10"}
                onClick={async () => {
                  setScheduleIDs(await getScheduleIDs()),
                    setTeacherEmails(await getEmails()),
                    onOpen();
                }}
              >
                <Text color={"white"}> + Create Schedule</Text>
              </Button>
            </HStack>
            <Box>
              <Center>
                <Heading>Schedule List Information</Heading>
              </Center>
              <TableContainer maxH={"50vh"} overflowY={"scroll"}>
                <Table variant="striped" colorScheme="facebook">
                  <Thead position={"sticky"}>
                    <Tr>
                      <Th>Grade Level</Th>
                      <Th>Subject</Th>
                      <Th>Time</Th>
                      <Th>Teacher</Th>
                      <Th>Teachers Email</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {schedules
                      ? schedules.map((data, index) => {
                          return (
                            <Tr key={index}>
                              <Td>{data.grade_level}</Td>
                              <Td>{data.name}</Td>
                              <Td>{data.time}</Td>
                              <Td>{data.teacher_name}</Td>
                              <Td>{data.teacher_email}</Td>
                            </Tr>
                          );
                        })
                      : `Start selecting for grade level to get started`}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </VStack>
        </Box>
      </HStack>
    </PageWrapper>
  );
}
