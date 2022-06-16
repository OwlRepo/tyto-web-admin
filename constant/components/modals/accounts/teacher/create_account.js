import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  Button,
  Input,
  VStack,
  Box,
  useToast,
} from "@chakra-ui/react";

import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import createTeacherAccount from "../../../../services/accounts/teacher/create_teacher_account";
const CreateAccountModal = ({ isOpen, onClose, scheduleIDS }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [scheduleID, setScheduleID] = useState("");
  const toast = useToast();

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

  const processCreateAccount = async () => {
    const createAccountResult = await createTeacherAccount({
      email: email,
      fullname: fullname,
      password: makeid(7),
      schedule_id: scheduleID,
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
        setPassword("");
        setFullname("");
        setScheduleID("");
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>CREATE TEACHER ACCOUNT</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Kindly fill out the form below to proceed.</Text>
          <VStack paddingY={"10"} spacing={"5"}>
            <Box width={"100%"}>
              <Text>Email</Text>
              <Input
                variant={"filled"}
                placeholder={"sample@email.com"}
                onChange={(event) => setEmail(event.target.value)}
              />
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
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button colorScheme="green" mr={3} onClick={processCreateAccount}>
            SUBMIT
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateAccountModal;
