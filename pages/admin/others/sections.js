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
import CreateSectionModal from "../../../constant/components/modals/accounts/section/create_section";
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

export default function Sections() {
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
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");
  useEffect(() => {
    getSchedules();
  }, []);

  async function getSchedules() {
    setScheduleID(await getScheduleIDs());
  }

  function readData(section) {
    const sectionPath = doc(
      firestore_db,
      "sections",
      selectedScheduleID,
      section,
      section
    );
    const unsub = onSnapshot(sectionPath, (doc) => {
      const student = [];
      doc.data()?.students?.map((data) => {
        student.push(data);
      });

      setStudents([...student]);
      //   schedules.map((data) => console.log(data.name, data.grade_level));
      console.log(students);
    });
  }

  function readSection(grade_level) {
    const sectionPath = doc(firestore_db, "sections", grade_level);
    const unsub = onSnapshot(sectionPath, (doc) => {
      const section = [];
      doc.data()?.section?.map((data) => {
        section.push(data.section);
      });

      setSections([...section]);
      //   schedules.map((data) => console.log(data.name, data.grade_level));
      console.log(sections);
    });
  }

  //   function readSection(section) {
  //     const schedulePath = doc(
  //       firestore_db,
  //       "sections",
  //       selectedScheduleID,
  //       section,
  //       section
  //     );
  //     const unsub = onSnapshot(schedulePath, (doc) => {
  //       const schedule = [];
  //       doc.data().subjects.map((data) => {
  //         schedule.push(data);
  //       });

  //       setSchedules([...schedule]);
  //       //   schedules.map((data) => console.log(data.name, data.grade_level));
  //       console.log(schedules);
  //     });
  //   }

  const PageHeader = () => {
    return (
      <VStack alignItems={"flex-start"}>
        <Heading color="title">{"SECTION'S SCHEDULE"}</Heading>
        <Breadcrumb fontWeight="medium" fontSize="sm">
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink isCurrentPage href="/admin/others/sections">
              Sections
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
      <CreateSectionModal
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
                          onClick={() => {
                            readSection(data.id);
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
                ""
              )}
              <Menu>
                <MenuButton
                  width={"35%"}
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                >
                  {selectedSection === "" ? "Select Section" : selectedSection}
                </MenuButton>
                <MenuList>
                  {sections.map((data, index) => {
                    return (
                      <MenuItem
                        key={index}
                        onClick={() => {
                          readData(data);
                          setSelectedSection(data);
                        }}
                      >
                        {data}
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </Menu>
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
                <Text color={"white"}> + Create Section</Text>
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
                      <Th>Section</Th>
                      <Th>Student Name</Th>
                      <Th>Student Email</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {students
                      ? students.map((data, index) => {
                          return (
                            <Tr key={index}>
                              <Td>{data.schedule_id}</Td>
                              <Td>{data.section}</Td>
                              <Td>{data.fullname}</Td>
                              <Td>{data.email}</Td>
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
