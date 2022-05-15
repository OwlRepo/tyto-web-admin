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

import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import createTeacherSchedule from "../../../../services/accounts/teacher_schedule/create_schedule";
const CreateScheduleModal = ({ isOpen, onClose, scheduleIDS, teacherEmails }) => {
  const [fullName, setFullname] = useState("");
  const [email, setEmail] = useState("")
  const [subjectName, setSubjectName] = useState("");
  const [roomId, setRoomID] = useState("");
  const [classTime, setClassTime] = useState("");
  const [scheduleID, setScheduleID] = useState("");
  const toast = useToast();

  const ClassTime = [
    '8:00 AM - 8:40 AM',
    '8:40 AM - 9:20 AM',
    '9:40 AM - 10:20 AM',
    '10:20 AM - 11:00 AM',
    '11:00 AM - 11:40 AM',
    '1:00 PM - 1:40 PM',
    '1:40 PM - 2:20 PM',
  ]
  const processCreateSchedule = async () => {

    var room = '';
    var characters = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890';
    var charactersLength = characters.length;
    for (var i = 0; i < roomId.length * 2; i++) {
      room += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    console.log(roomId + "_" + room)
    const createAccountResult = await createTeacherSchedule({
      name: subjectName,
      room_id: roomId + "_" + room,
      teacher_email: email,
      teacher_name: fullName,
      schedule_id: scheduleID,
      time: classTime
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setEmail("");
        setRoomID("")
        setRoomID("")
        setFullname("");
        setScheduleID("");
        setClassTime("")
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
              <Text>Room ID</Text>
              <Input
                variant={"filled"}
                placeholder={"7English"}
                onChange={(event) => setRoomID(event.target.value)}
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
                        onClick={() => setScheduleID(data.id)}
                      >
                        {data.id}
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
                      <MenuItem
                        key={index}
                        onClick={() => setClassTime(data)}
                      >
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
