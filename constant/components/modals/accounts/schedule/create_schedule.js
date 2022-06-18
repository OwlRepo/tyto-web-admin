import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Button,
  Input,
  VStack,
  Box,
  useToast,
} from "@chakra-ui/react";
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
import firestore_db from "../../../../configurations/firebase_init";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import createTeacherSchedule from "../../../../services/accounts/teacher_schedule/create_schedule";
import moment from "moment";

const CreateScheduleModal = ({
  isOpen,
  onClose,
  scheduleIDS,
  teacherEmails,
}) => {
  const [fullName, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [roomId, setRoomID] = useState("");
  const [classTime, setClassTime] = useState("");
  const [scheduleID, setScheduleID] = useState("");
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");
  const toast = useToast();

  const ClassTime = [
    "8:00 AM - 8:40 AM",
    "8:40 AM - 9:20 AM",
    "9:40 AM - 10:20 AM",
    "10:20 AM - 11:00 AM",
    "11:00 AM - 11:40 AM",
    "1:00 PM - 1:40 PM",
    "1:40 PM - 2:20 PM",
    "2:20 PM - 3:00 PM",
    "3:00 PM - 3:20 PM",
  ];
  const processCreateSchedule = async () => {
    const createAccountResult = await createTeacherSchedule({
      name: subjectName,
      room_id: roomId,
      teacher_email: email,
      teacher_name: fullName,
      schedule_id: scheduleID,
      section: selectedSection,
      time: classTime,
    });

    if (createAccountResult.success) {
      toast({
        title: "Account Created",
        description: createAccountResult.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } else {
      toast({
        title: "Account Creation Failed",
        description: createAccountResult.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    }
  };

  function getRoomId(section) {
    const dbPath = doc(firestore_db, "sections", scheduleID, section, section);
    const unsub = onSnapshot(dbPath, (doc) => {
      setRoomID(doc.data().room_id);
    });
  }

  function readSection(grade_level) {
    const sectionPath = doc(firestore_db, "sections", grade_level);
    const unsub = onSnapshot(sectionPath, (doc) => {
      const section = [];
      doc.data()?.section.map((data) => {
        section.push(data.section);
      });

      setSections([...section]);
      //   schedules.map((data) => console.log(data.name, data.grade_level));
      console.log(sections);
    });
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setEmail("");
        setRoomID("");
        setSelectedSection("");
        setFullname("");
        setScheduleID("");
        setClassTime("");
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>CREATE TEACHER'S SCHEDULE</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Kindly fill out the form below to proceed.</Text>
          <VStack paddingY={"10"} spacing={"5"}>
            <Box width={"100%"}>
              <Text>Email</Text>
              <Menu>
                <MenuButton
                  width={"100%"}
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                >
                  {email === "" ? "Select Teacher Email" : email}
                </MenuButton>
                <MenuList>
                  {teacherEmails.map((data, index) => {
                    return (
                      <MenuItem
                        key={index}
                        onClick={() => setEmail(data.teacherEmail)}
                      >
                        {data.teacherEmail}
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </Menu>
            </Box>

            <Box width={"100%"}>
              <Text>Full Name</Text>
              <Input
                variant={"filled"}
                placeholder={"Juan Dela Cruz"}
                onChange={(event) => setFullname(event.target.value)}
              />
            </Box>
            <Box width={"100%"}>
              <Text>Subject Name</Text>
              <Input
                variant={"filled"}
                placeholder={"English"}
                onChange={(event) => setSubjectName(event.target.value)}
              />
            </Box>
            <Box width={"100%"}>
              <Text>Schedule ID</Text>
              <Menu>
                <MenuButton
                  width={"100%"}
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                >
                  {scheduleID === "" ? "Select Schedule ID" : scheduleID}
                </MenuButton>
                <MenuList>
                  {scheduleIDS.map((data, index) => {
                    return (
                      <MenuItem
                        key={index}
                        onClick={() => {
                          readSection(data.id);
                          setScheduleID(data.id);
                        }}
                      >
                        {data.id}
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </Menu>
            </Box>
            <Box width={"100%"}>
              <Text>Section</Text>
              <Menu>
                <MenuButton
                  width={"100%"}
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
                          getRoomId(data);
                          setSelectedSection(data);
                        }}
                      >
                        {data}
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </Menu>
            </Box>

            <Box width={"100%"}>
              <Text>Class Time</Text>
              <Menu>
                <MenuButton
                  width={"100%"}
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                >
                  {classTime === "" ? "Select Class Time" : classTime}
                </MenuButton>
                <MenuList>
                  {ClassTime.map((data, index) => {
                    return (
                      <MenuItem key={index} onClick={() => setClassTime(data)}>
                        {data}
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </Menu>
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button colorScheme="green" mr={3} onClick={processCreateSchedule}>
            SUBMIT
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateScheduleModal;
