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
import createSection from "../../../../services/schedules/create_section";
const CreateSectionModal = ({
  isOpen,
  onClose,
  scheduleIDS,
  teacherEmails,
}) => {
  const [sectionName, setSectionName] = useState("");
  const [roomId, setRoomID] = useState("");
  const [scheduleID, setScheduleID] = useState("");
  const toast = useToast();

  const processCreateSchedule = async () => {
    var room = "";
    var characters =
      "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
    var charactersLength = characters.length;
    for (var i = 0; i < roomId.length * 2; i++) {
      room += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    console.log(roomId + "_" + room);
    const createSectionResult = await createSection({
      section: sectionName,
      room_id: roomId + "_" + room,
      schedule_id: scheduleID,
    });

    if (createSectionResult.success) {
      toast({
        title: "Account Created",
        description: createSectionResult.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } else {
      toast({
        title: "Account Creation Failed",
        description: createSectionResult.message,
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
        setRoomID("");
        setSectionName("");
        setScheduleID("");
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
              <Text>Grade Level</Text>
              <Menu>
                <MenuButton
                  width={"100%"}
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                >
                  {scheduleID === "" ? "Select Grade Level" : scheduleID}
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
              <Text>Section Name</Text>
              <Input
                variant={"filled"}
                placeholder={"Sapphire"}
                onChange={(event) => setSectionName(event.target.value)}
              />
            </Box>
            <Box width={"100%"}>
              <Text>Room ID</Text>
              <Input
                variant={"filled"}
                placeholder={"7Sapphire"}
                onChange={(event) => setRoomID(event.target.value)}
              />
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

export default CreateSectionModal;
