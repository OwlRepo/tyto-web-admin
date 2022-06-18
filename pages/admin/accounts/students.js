import {
  CheckIcon,
  ChevronDownIcon,
  CloseIcon,
  DeleteIcon,
  EditIcon,
  SearchIcon,
  AddIcon,
  DownloadIcon,
  ViewIcon,
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
import { motion, useAnimation } from "framer-motion";
import { useState, useCallback, useRef, useEffect } from "react";
import { NavigationBar, PageWrapper } from "../../../constant/components";
import AccountInformationTable from "../../../constant/components/containers/student/account_information";
import searchAccountInformation from "../../../constant/services/accounts/student/read_information";
import CreateAccountModal from "../../../constant/components/modals/accounts/student/create_account";
import { NextSeo } from "next-seo";
import Papa from "papaparse";
import getScheduleIDs from "../../../constant/services/schedules/get_schedule_ids";
import updateAccountInformation from "../../../constant/services/accounts/student/update_information";
import SubjectsModal from "../../../constant/components/modals/accounts/student/student_subjects";
import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  query,
  collection,
  onSnapshot,
  where,
  arrayUnion,
  updateDoc,
} from "firebase/firestore";
import firestore_db from "../../../constant/configurations/firebase_init";
import emailjs from "@emailjs/browser";
import { CSVLink, CSVDownload } from "react-csv";
export default function Students() {
  const [isEditingAccountInfo, setIsEditingAccountInfo] = useState(false);
  const [scheduleID, setScheduleID] = useState(undefined);
  const [selectedScheduleID, setSelectedScheduleID] = useState();
  const [newFullName, setNewFullName] = useState();
  const [newPassword, setNewPassword] = useState();
  const [hidePassword, setHidePassword] = useState(true);
  const [accountEmail, setAccountEmail] = useState("");
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const toast = useToast();
  const [searchedEmail, setSearchedEmail] = useState("");
  const [searchedAccountInfo, setSearchedAccountInfo] = useState(undefined);
  const [scheduleIDS, setScheduleIDs] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [uploading, setUploading] = useState(false);
  const inputRef = useRef();
  const [fileName, setFileName] = useState("");
  const {
    isOpen: isOpenAddAccounts,
    onOpen: onOpenAddAccounts,
    onClose: onCloseAddAccounts,
  } = useDisclosure();

  const {
    isOpen: isOpenStudentSubjects,
    onOpen: onOpenStudentSubjects,
    onClose: onCloseStudentSubjects,
  } = useDisclosure();

  useEffect(() => {
    readData();
  }, []);

  async function readData() {
    const studentPath = collection(firestore_db, "accounts_student");
    const unsub = onSnapshot(studentPath, (studentInfo) => {
      const student = [];
      studentInfo.forEach((docs) => {
        student.push(docs.data());
      });
      setStudents([...student]);
    });
  }

  const PageHeader = () => {
    return (
      <VStack alignItems={"flex-start"}>
        <Heading color="title">STUDENT ACCOUNTS</Heading>
        <Breadcrumb fontWeight="medium" fontSize="sm">
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">admin</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/accounts/students">
              accounts
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="/admin/accounts/students">
              students
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
      setSearchedAccountInfo(undefined);
      return;
    }
    setSearchedAccountInfo(undefined);
    setIsSearching(true);
    const searchResult = await searchAccountInformation({
      email: searchedEmail,
    });

    if (searchResult.success) {
      console.log(searchResult.data);
      setSearchedAccountInfo(searchResult.data);
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
      setSearchedAccountInfo(undefined);
    }
  };

  function makeid(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async function processCreateAccount() {
    setUploading(true);

    const input = inputRef?.current;

    const [file] = input.files;
    const reader = new FileReader();
    reader.onloadend = ({ target }) => {
      const csv = Papa.parse(target.result, { header: true });

      csv.data.map(async (data) => {
        const password = makeid(7);
        if (data.email?.length || data.name?.length) {
          const docRef = doc(firestore_db, "accounts_student", data?.email);
          const sectionRef = doc(
            firestore_db,
            "sections",
            data?.year_level,
            data?.section,
            data?.section
          );
          const docData = await getDoc(docRef);
          const isEmailExisting = docData.exists();
          if (!isEmailExisting) {
            console.log(data);
            await setDoc(docRef, {
              email: data?.email,
              fullname: data?.fullname,
              password: password,
              schedule_id: data?.year_level,
              section: data?.section,
              is_banned: false,
              is_default_password: true,
            });
            await updateDoc(sectionRef, {
              students: arrayUnion({
                email: data?.email,
                fullname: data?.fullname,
                schedule_id: data?.year_level,
                section: data?.section,
              }),
            });
            const tempForm = {
              from_name: "TYTO Service",
              to_name: data?.fullname,
              email: data?.email,
              password: password,
              to_email: data?.email,
            };
            emailjs
              .send("gmail", "student_3wpp5ml", tempForm, "Y6V4R9pex9SHw_tOA")
              .then((result) => {
                console.log("Email Successfully Sent");
              })
              .catch((err) => console.log("Email not sent"));
            toast({
              title: "Account Created",
              description: "Account Created Successfully.",
              status: "success",
              duration: 5000,
              position: "bottom-left",
              isClosable: true,
            });
            setUploading(false);
            onCloseAddAccounts();
          } else {
            toast({
              title: "Account Creation Failed",
              description: "Account is Already Existing.",
              status: "error",
              duration: 5000,
              position: "bottom-left",
              isClosable: true,
            });
            setUploading(false);
            onCloseAddAccounts();
          }
        } else {
          toast({
            title: "Account Creation Failed",
            description: "Account Lack of Fields.",
            status: "error",
            position: "bottom-left",
            duration: 5000,
            isClosable: true,
          });
          setUploading(false);
          onCloseAddAccounts();
        }
      });
    };

    reader.readAsText(file);
  }

  const submitUpdate = async () => {
    const updateResult = await updateAccountInformation({
      email: accountEmail,
      fullname: newFullName,
      schedule_id: selectedScheduleID,
      password: newPassword,
    });

    if (updateResult.success) {
    } else {
      toast({
        title: "Update Failed",
        description: updateResult.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    clearInfos();
  };

  const setInfos = async ({ schedule_id, email, fullname, password }) => {
    setSelectedScheduleID(schedule_id);
    setIsEditingAccountInfo(!isEditingAccountInfo);
    setAccountEmail(email);
    setNewFullName(fullname);
    setNewPassword(password);
  };

  const clearInfos = async () => {
    setSelectedScheduleID("");
    setIsEditingAccountInfo(!isEditingAccountInfo);
    setAccountEmail("");
    setNewFullName("");
    setNewPassword("");
  };

  return (
    <PageWrapper>
      <NextSeo
        title="Admin | Account | Student"
        description="Admin dashboard for probex Student accounts"
      />
      <CreateAccountModal
        isOpen={isOpen}
        onClose={onClose}
        scheduleIDS={scheduleIDS}
      />
      <SubjectsModal
        isOpen={isOpenStudentSubjects}
        onClose={onCloseStudentSubjects}
        subjects={subjects}
      />
      <Modal
        isOpen={isOpenAddAccounts}
        onClose={() => {
          onCloseAddAccounts();
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ADD STUDENT ACCOUNT</ModalHeader>
          <ModalCloseButton onClick={() => setFileName("")} />
          <ModalBody>
            <Box
              borderColor="gray.300"
              borderStyle="dashed"
              borderWidth="2px"
              variant="filled"
              rounded="md"
              shadow="sm"
              role="group"
              transition="all 150ms ease-in-out"
              _hover={{
                shadow: "md",
              }}
              as={motion.div}
              initial="rest"
              animate="rest"
              whileHover="hover"
            >
              <Box position="relative" height="20vh" width="100%">
                <Box
                  position="absolute"
                  top="10"
                  left="0"
                  height="100%"
                  width="100%"
                  display="flex"
                  flexDirection="column"
                  onClick={() => {
                    inputRef.current?.click();
                  }}
                >
                  {fileName === "" ? (
                    <>
                      <Heading textAlign={"center"}>
                        {" "}
                        Please Drop your CSV File Here{" "}
                      </Heading>
                      <AddIcon alignSelf={"center"} w={"5vw"} h={"5vh"} />
                      <Input
                        display={"none"}
                        height="50vh"
                        width="-moz-fit-content"
                        borderWidth={0}
                        onChange={(event) => {
                          console.log(event.target.value);
                        }}
                        ref={inputRef}
                        disabled={uploading}
                        type="file"
                        accept=".csv"
                      />
                    </>
                  ) : (
                    <Heading textAlign={"center"}> {fileName} </Heading>
                  )}
                </Box>
              </Box>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              onClick={() => {
                onCloseAddAccounts();
                setFileName("");
              }}
            >
              Close
            </Button>
            <Button
              colorScheme="green"
              disabled={uploading}
              mr={3}
              onClick={processCreateAccount}
            >
              SUBMIT
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <HStack>
        <Box minH={"100vh"}>
          <NavigationBar height={"100vh"} alignSelf="top" />
        </Box>

        <Box minH={"100vh"} w={"84vw"} p={"2rem"}>
          <PageHeader />

          <VStack
            alignItems={"stretch"}
            spacing={isSearching ? "5" : "20"}
            mt={"2rem"}
          >
            <HStack w={"50%"}>
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
              <Button
                backgroundColor={"green.500"}
                colorScheme={"green"}
                paddingX={"10"}
                onClick={async () => {
                  setScheduleIDs(await getScheduleIDs()), onOpen();
                }}
              >
                <Text color={"white"}>Create Account</Text>
              </Button>
              <Button
                backgroundColor={"green.500"}
                colorScheme={"green"}
                paddingX={"10"}
                leftIcon={<AddIcon />}
                onClick={onOpenAddAccounts}
              >
                <Text color={"white"}>Upload</Text>
              </Button>
              <Button
                backgroundColor={"green.500"}
                colorScheme={"green"}
                paddingX={"10"}
                leftIcon={<DownloadIcon />}
              >
                <CSVLink filename={"students-backup.csv"} data={students}>
                  Backup
                </CSVLink>
              </Button>
            </HStack>

            {searchedAccountInfo === undefined ? (
              <Box>
                {isSearching ? (
                  <Center>
                    <Heading my={"20vh"} color="title">
                      Search account...
                    </Heading>
                  </Center>
                ) : (
                  <>
                    <Center>
                      <Heading>
                        {isEditingAccountInfo
                          ? "Update Information"
                          : "Account Information"}
                      </Heading>
                    </Center>
                    <TableContainer maxH={"50vh"} overflowY={"scroll"}>
                      <Table variant="striped" colorScheme="facebook">
                        <Thead position={"sticky"}>
                          <Tr>
                            <Th>Email</Th>
                            <Th>Password</Th>
                            <Th>Fullname</Th>
                            <Th>Schedule ID</Th>
                            <Th>Action</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {students ? (
                            students.map((data, index) => {
                              return (
                                <Tr key={index}>
                                  <Td>{data?.email}</Td>
                                  <Td>
                                    {isEditingAccountInfo &&
                                    accountEmail === data.email &&
                                    scheduleID !== undefined ? (
                                      <HStack justifyContent={"flex-end"}>
                                        <Input
                                          type={
                                            hidePassword ? "password" : "text"
                                          }
                                          backgroundColor={"white"}
                                          variant={"filled"}
                                          defaultValue={newPassword}
                                          onChange={(event) =>
                                            setNewPassword(event.target.value)
                                          }
                                        />
                                        <Switch
                                          paddingTop={"1"}
                                          colorScheme={"teal"}
                                          size={"md"}
                                          onChange={() =>
                                            setHidePassword(!hidePassword)
                                          }
                                        />
                                      </HStack>
                                    ) : (
                                      `******`
                                    )}
                                  </Td>
                                  <Td>
                                    {isEditingAccountInfo &&
                                    accountEmail === data?.email &&
                                    scheduleID !== undefined ? (
                                      <Input
                                        backgroundColor={"white"}
                                        variant={"filled"}
                                        defaultValue={newFullName}
                                        onChange={(event) =>
                                          setNewFullName(event.target.value)
                                        }
                                      />
                                    ) : (
                                      data.fullname
                                    )}
                                  </Td>
                                  <Td>
                                    {isEditingAccountInfo &&
                                    accountEmail === data?.email &&
                                    scheduleID !== undefined ? (
                                      <Menu>
                                        <MenuButton
                                          as={Button}
                                          rightIcon={<ChevronDownIcon />}
                                        >
                                          {selectedScheduleID}
                                        </MenuButton>
                                        <MenuList>
                                          {scheduleID.map((data, index) => {
                                            return (
                                              <MenuItem
                                                key={index}
                                                onClick={() =>
                                                  setSelectedScheduleID(data.id)
                                                }
                                              >
                                                {data.id}
                                              </MenuItem>
                                            );
                                          })}
                                        </MenuList>
                                      </Menu>
                                    ) : (
                                      data.schedule_id
                                    )}
                                  </Td>
                                  <Td>
                                    {isEditingAccountInfo &&
                                    accountEmail === data?.email &&
                                    scheduleID !== undefined ? (
                                      <ButtonGroup>
                                        <IconButton
                                          backgroundColor={"green.500"}
                                          icon={<CheckIcon color={"white"} />}
                                          onClick={submitUpdate}
                                        />
                                        <IconButton
                                          backgroundColor={"red.500"}
                                          icon={<CloseIcon color={"white"} />}
                                          onClick={clearInfos}
                                        />
                                      </ButtonGroup>
                                    ) : (
                                      <ButtonGroup>
                                        <Tooltip label={"Edit"}>
                                          <IconButton
                                            colorScheme={"facebook"}
                                            icon={<EditIcon />}
                                            onClick={async () => {
                                              setScheduleID(
                                                await getScheduleIDs()
                                              );
                                              setInfos({
                                                schedule_id: data.schedule_id,
                                                email: data.email,
                                                fullname: data.fullname,
                                                password: data.password,
                                              });
                                            }}
                                          />
                                        </Tooltip>
                                        <Tooltip label={"Edit"}>
                                          <IconButton
                                            colorScheme={"facebook"}
                                            icon={<ViewIcon />}
                                            onClick={async () => {
                                              setScheduleID(
                                                await getScheduleIDs()
                                              );
                                              setSubjects(data);
                                              onOpenStudentSubjects();
                                            }}
                                          />
                                        </Tooltip>
                                      </ButtonGroup>
                                    )}
                                  </Td>
                                </Tr>
                              );
                            })
                          ) : (
                            <></>
                          )}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </>
                )}
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
                <AccountInformationTable
                  data={searchedAccountInfo}
                  refreshList={checkEmailInput}
                />
              </VStack>
            )}
          </VStack>
        </Box>
      </HStack>
    </PageWrapper>
  );
}
